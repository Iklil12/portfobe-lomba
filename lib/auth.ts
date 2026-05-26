// lib/auth.ts
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import jwt from "jsonwebtoken";
import { Resend } from 'resend';

import GithubProvider from "next-auth/providers/github";

// Inisialisasi Resend
const resend = new Resend(process.env.RESEND_API_KEY);

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      profession: string;
      bio: string;
      avatar: string;
      image: string;
      subdomain: string;
      isLive: boolean;
      isOAuthLinked: boolean;
      isStrictlyGoogle: boolean;
      isEmailVerified: boolean;
    };
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        impersonateToken: { label: "Impersonate Token", type: "text" }
      },
      async authorize(credentials, req) {
        // 1. FLOW IMPERSONATION (Jika menggunakan impersonateToken)
        if (credentials?.impersonateToken) {
          try {
            const decoded = jwt.verify(credentials.impersonateToken, process.env.NEXTAUTH_SECRET as string) as {
              targetUserId: string;
              isAdminImpersonating: boolean;
            };

            if (decoded.isAdminImpersonating && decoded.targetUserId) {
              const targetUser = await prisma.user.findUnique({
                where: { id: decoded.targetUserId },
                include: { profile: true, siteAppearance: true, accounts: true }
              });

              if (!targetUser) throw new Error("Target user tidak ditemukan.");

              const userData = targetUser as any;
              return {
                id: userData.id,
                name: targetUser.profile?.fullName || userData.name || "User",
                email: userData.email,
                image: targetUser.profile?.avatarUrl || userData.avatar || userData.image,
                avatar: userData.avatar,
                profession: targetUser.profile?.profession,
                bio: targetUser.profile?.bio,
                subdomain: targetUser.profile?.subdomain,
                isLive: userData.isLive,
                isEmailVerified: userData.emailVerified !== null,
                isOAuthLinked: userData.accounts && userData.accounts.length > 0,
                isStrictlyGoogle: userData.password === "GOOGLE_LOGIN_NO_PASSWORD"
              };
            }
          } catch (error) {
            console.error("Impersonation failed:", error);
            throw new Error("Token impersonasi tidak valid atau sudah kedaluwarsa.");
          }
        }

        // 2. FLOW LOGIN NORMAL (Email + Password)
        if (!credentials?.email || !credentials?.password) return null;

        // --- Pengecekan Awal (Rate Limiting) ---
        // Catatan: Menggunakan field 'count' dan 'updatedAt' sesuai skema LoginAttempt saat ini
        
        // Mencegah IP Spoofing dan memastikan IP tersedia
        const forwardedFor = req?.headers?.["x-forwarded-for"];
        const realIp = req?.headers?.["x-real-ip"];
        let ip = "unknown";
        if (realIp) {
          ip = Array.isArray(realIp) ? realIp[0] : realIp;
        } else if (forwardedFor) {
          const ips = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor).split(",").map((i: string) => i.trim());
          ip = ips[ips.length - 1];
        }

        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const attemptRecord = await prisma.loginAttempt.findFirst({
          where: { email: credentials.email, ip: ip },
          orderBy: { updatedAt: 'desc' }
        });

        if (attemptRecord && attemptRecord.count >= 5 && attemptRecord.updatedAt >= fifteenMinutesAgo) {
          throw new Error('Terlalu banyak percobaan gagal. Silakan coba lagi dalam 15 menit.');
        }
        // ----------------------------------------

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { profile: true, siteAppearance: true, accounts: true }
        });

        if (!user || !user.password || user.password === "GOOGLE_LOGIN_NO_PASSWORD") {
          throw new Error("Email tidak ditemukan atau gunakan Login Google.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          // --- Pencatatan Gagal ---
          if (attemptRecord) {
            // Jika sudah lewat 15 menit, reset hitungan jadi 1, jika belum tambahkan 1
            const newCount = attemptRecord.updatedAt < fifteenMinutesAgo ? 1 : attemptRecord.count + 1;
            await prisma.loginAttempt.update({
              where: { id: attemptRecord.id },
              data: { count: newCount, updatedAt: new Date() }
            });
          } else {
            await prisma.loginAttempt.create({
              data: {
                email: credentials.email,
                ip: ip,
                count: 1
              }
            });
          }
          throw new Error("Password salah.");
        }

        // --- Pencatatan Sukses (Reset Hitungan) ---
        await prisma.loginAttempt.deleteMany({
          where: { email: credentials.email }
        });

        const userData = user as any;

        return {
          id: userData.id,
          name: user.profile?.fullName || userData.name || "User",
          email: userData.email,
          image: user.profile?.avatarUrl || userData.avatar || userData.image,
          avatar: userData.avatar,
          profession: user.profile?.profession,
          bio: user.profile?.bio,
          subdomain: user.profile?.subdomain,
          isLive: userData.isLive,
          isEmailVerified: userData.emailVerified !== null,
          isOAuthLinked: userData.accounts && userData.accounts.length > 0,
          isStrictlyGoogle: userData.password === "GOOGLE_LOGIN_NO_PASSWORD"
        };
      }
    })
  ],

  callbacks: {
    // 0. REDIRECT CALLBACK
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl + "/dashboard";
    },

    // 1. SIGN IN CALLBACK: Auto-Register Google & Pengisian Tabel Account
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "github") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            return "/login?error=Silakan login dengan Email atau Google terlebih dahulu untuk menghubungkan GitHub.";
          }

          const githubUsername = profile?.login;

          if (githubUsername) {
            await prisma.integration.upsert({
              where: {
                userId_provider: {
                  userId: existingUser.id,
                  provider: "GITHUB",
                }
              },
              update: {
                providerId: githubUsername,
              },
              create: {
                userId: existingUser.id,
                provider: "GITHUB",
                providerId: githubUsername,
              }
            });
          }
          return true;
        } catch (error) {
          console.error("Gagal menghubungkan GitHub:", error);
          return false;
        }
      }

      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { profile: true, siteAppearance: true }
          });

          if (!existingUser) {
            // USER BARU DIBUAT
            await prisma.user.create({
              data: {
                email: user.email,
                password: "GOOGLE_LOGIN_NO_PASSWORD",
                avatar: user.image || "",
                emailVerified: new Date(),

                profile: {
                  create: {
                    fullName: user.name || "Pengguna Baru",
                    avatarUrl: user.image || "",
                  }
                },
                siteAppearance: {
                  create: {}
                },

                accounts: {
                  create: {
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token,
                    id_token: account.id_token,
                  }
                }
              },
            });

            // ==============================================================
            // EKSEKUSI WELCOME EMAIL KE USER BARU
            // ==============================================================
            resend.emails.send({
              from: 'Portfobe <hellocreator@mail.ritions.com>',
              to: user.email,
              replyTo: 'ikliluluyun@ritions.com',
              subject: 'Welcome to Portfobe!',
              html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #334155; line-height: 1.6;">
                <p style="font-size: 16px;">Hey,</p>
                <p style="font-size: 16px;">My name is <strong>IKLIL</strong> — I'm the founder and CEO of <strong>portfobe</strong>.</p>
                <p style="font-size: 16px;">Saya ingin mengucapkan terima kasih secara personal karena kamu telah memilih portfobe sebagai tempat untuk memamerkan karya terbaikmu. Kami membangun platform ini dengan satu misi: membantu kreator seperti kamu memiliki 'rumah digital' yang profesional, elegan, dan selesai dalam hitungan menit.</p>
                <p style="font-size: 16px;">Saya sangat tidak sabar melihat portofolio yang akan kamu bangun. Jika kamu punya masukan, ide fitur, atau sekadar ingin menyapa, jangan ragu untuk membalas email ini. Saya membaca semua pesan yang masuk.</p>
                <p style="font-size: 16px;">Selamat berkarya dan selamat membangun <em>brand</em> personalmu!</p>
                <br />
                <p style="font-size: 16px; margin-bottom: 5px;">Best,</p>
                <p style="font-size: 16px; font-weight: bold; margin-top: 0; margin-bottom: 2px;">IKLIL</p>
                <p style="font-size: 14px; color: #64748b; margin-top: 0;">Founder, portfobe</p>
              </div>
              `,
            }).catch(err => console.error("Gagal kirim Welcome Email:", err));
            // ==============================================================

          } else {
            // USER LAMA LOGIN

            // --- AUTO VERIFY GOOGLE OAUTH ---
            // Jika user sebelumnya mendaftar manual dan belum terverifikasi, Google yang akan memverifikasinya
            if (!existingUser.emailVerified) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  emailVerified: new Date()
                }
              });
            }

            if (!existingUser.profile) {
              await prisma.profile.create({
                data: {
                  userId: existingUser.id,
                  fullName: user.name || "Pengguna Setia",
                  avatarUrl: user.image || "",
                }
              });
            }

            const existingAccount = await prisma.account.findFirst({
              where: { provider: account.provider, providerAccountId: account.providerAccountId }
            });

            if (!existingAccount) {
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  id_token: account.id_token,
                }
              });
            }
          }
          return true;
        } catch (error) {
          console.error("Gagal Auto-Register Google:", error);
          return false;
        }
      }
      return true;
    },

    // 2. JWT CALLBACK: Sinkronisasi Akurat Tanpa Spam Database
    async jwt({ token, user, trigger, session, account }: any) {
      // Jika ada trigger update dari client (misal ubah profile), langsung perbarui tokennya
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }

      // HANYA JALAN SEKALI SAAT AWAL LOGIN
      if (user) {
        // Jika login pakai Email/Password, oper langsung datanya (hemat 1 query!)
        if (account?.provider === "credentials") {
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
          token.profession = user.profession;
          token.bio = user.bio;
          token.avatar = user.avatar;
          token.picture = user.image;
          token.subdomain = user.subdomain;
          token.isLive = user.isLive;
          token.isEmailVerified = user.isEmailVerified;
          token.isOAuthLinked = (user as any).isOAuthLinked || false;
          token.isStrictlyGoogle = (user as any).isStrictlyGoogle || false;
          return token;
        }

        // Jika login via OAuth (Google, GitHub, dll), tarik datanya pakai SELECT agar sangat ringan
        if (account?.provider && account.provider !== "credentials") {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: {
              id: true,
              email: true,
              avatar: true,
              password: true,
              isLive: true,
              emailVerified: true,
              profile: { select: { fullName: true, profession: true, bio: true, avatarUrl: true, subdomain: true } },
              accounts: { select: { id: true } }
            }
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.name = dbUser.profile?.fullName || user.name || "User";
            token.email = dbUser.email;
            token.profession = dbUser.profile?.profession;
            token.bio = dbUser.profile?.bio;
            token.avatar = dbUser.avatar;
            token.picture = dbUser.profile?.avatarUrl || dbUser.avatar || user.image;
            token.subdomain = dbUser.profile?.subdomain;
            token.isLive = dbUser.isLive;
            token.isEmailVerified = dbUser.emailVerified !== null;
            token.isOAuthLinked = dbUser.accounts.length > 0;
            token.isStrictlyGoogle = dbUser.password === "GOOGLE_LOGIN_NO_PASSWORD";
          }
        }
      }



      return token;
    },

    // 3. SESSION CALLBACK: Oper status ke Frontend dengan instan
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.profession = token.profession as string;
        session.user.bio = token.bio as string;
        session.user.avatar = token.avatar as string;
        session.user.image = token.picture as string;
        session.user.subdomain = token.subdomain as string;
        session.user.isLive = token.isLive as boolean;
        session.user.isEmailVerified = token.isEmailVerified as boolean;
        session.user.isOAuthLinked = token.isOAuthLinked as boolean;
        session.user.isStrictlyGoogle = token.isStrictlyGoogle as boolean;
      }
      return session;
    }
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login"
  }
};