import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      promptSource, // 'manual' | 'existing_profile'
      prompt, 
      updateProfession, 
      updateBio, 
      updateTheme,
      updateContent // Menggantikan updateProjects
    } = body;

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true, siteAppearance: true }
    });

    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    let finalPrompt = prompt;

    if (promptSource === 'existing_profile') {
      const existingProf = dbUser.profile?.profession || "(Belum ada profesi)";
      const existingBio = dbUser.profile?.bio || "(Belum ada bio)";
      finalPrompt = `Profesi saat ini: ${existingProf}. Bio saat ini: ${existingBio}. Tolong buatkan ulang agar lebih menarik.`;
    }

    if (!finalPrompt || !finalPrompt.trim()) {
      return NextResponse.json({ error: "Prompt tidak boleh kosong." }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: `Kamu adalah asisten desainer web Portfo.be. Kembalikan HANYA JSON murni dengan struktur persis ini:
{
  "profession": "Gelar profesi 1-3 kata",
  "bio": "Bio 2-3 kalimat menarik",
  "theme": "pilih salah satu: spatial, aura-kinetic, editorial, minimalist, monolith, absolute-noir, cinematic, acid, bentogrid, brutalism",
  "themeColor": "kode warna hex",
  "fontFamily": "pilih: Inter, Space Mono, Playfair Display, Outfit",
  "cardStyle": "pilih: brutalism, flat, soft",
  "buttonShape": "pilih: square, rounded, pill",
  "splashScreen": true/false,
  "dummyProjects": [{"title":"", "description":"", "tags":["",""], "projectType":"pilih: image, video, atau 3d. Jika punya banyak skill (misal foto & video), kombinasikan tipenya!", "mediaUrl":"lihat aturan"}],
  "dummyTestimonials": [{"clientName":"", "company":"", "content":"", "rating":5, "avatarUrl":"https://ui-avatars.com/api/?name=nama&background=random"}],
  "dummyLinks": [{"platform":"", "url":""}],
  "dummyCertificates": [{"title":"", "issuer":"", "year":"2023", "description":""}]
}
Aturan mediaUrl untuk dummyProjects:
- Jika projectType "image": https://picsum.photos/seed/[keyword]/800/600
- Jika projectType "video": https://www.w3schools.com/html/mov_bbb.mp4
- Jika projectType "3d": https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb
Wajib isi semua dummy (masing-masing 3 item proyek, dan 2 item untuk yang lain). Gunakan Bahasa Indonesia.`,
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent(finalPrompt);
    const text = (await result.response).text();
    const resultJson = JSON.parse(text);

    // Update DB
    const updateProfileData: any = {};
    if (updateProfession && resultJson.profession) updateProfileData.profession = resultJson.profession;
    if (updateBio && resultJson.bio) updateProfileData.bio = resultJson.bio;

    if (Object.keys(updateProfileData).length > 0) {
      // Pastikan profile exists
      if (dbUser.profile) {
        await prisma.profile.update({
          where: { userId: dbUser.id },
          data: updateProfileData
        });
      }
    }

    if (updateTheme && resultJson) {
      const validThemes = ['spatial', 'aura-kinetic', 'editorial', 'minimalist', 'monolith', 'absolute-noir', 'cinematic', 'acid', 'bentogrid', 'brutalism'];
      let themeToSave = resultJson.theme?.toLowerCase() || 'minimalist';
      if (!validThemes.includes(themeToSave)) {
         themeToSave = 'minimalist'; // fallback
      }
      
      const updateAppearanceData: any = { themeTemplate: themeToSave };
      if (resultJson.themeColor) updateAppearanceData.themeColor = resultJson.themeColor;
      if (resultJson.fontFamily) {
         updateAppearanceData.fontHeading = resultJson.fontFamily;
         updateAppearanceData.fontBody = resultJson.fontFamily;
      }
      if (resultJson.cardStyle) updateAppearanceData.cardStyle = resultJson.cardStyle;
      if (resultJson.buttonShape) updateAppearanceData.buttonShape = resultJson.buttonShape;
      if (typeof resultJson.splashScreen === 'boolean') updateAppearanceData.splashScreen = resultJson.splashScreen;

      if (dbUser.siteAppearance) {
        await prisma.siteAppearance.update({
          where: { userId: dbUser.id },
          data: updateAppearanceData
        });
      }
    }

    if (updateContent) {
      // 1. Injeksi Proyek
      if (resultJson.dummyProjects && Array.isArray(resultJson.dummyProjects)) {
        for (const proj of resultJson.dummyProjects) {
          await prisma.project.create({
            data: {
              title: proj.title || "Proyek Tanpa Judul",
              description: proj.description || "",
              mediaUrl: proj.mediaUrl || "https://picsum.photos/seed/random/800/600",
              tags: JSON.stringify(proj.tags || []),
              projectType: proj.projectType || "image",
              userId: dbUser.id
            }
          });
        }
      }
      
      // 2. Injeksi Testimoni
      if (resultJson.dummyTestimonials && Array.isArray(resultJson.dummyTestimonials)) {
        for (const t of resultJson.dummyTestimonials) {
          await prisma.testimonial.create({
            data: {
              clientName: t.clientName || "Klien Anonim",
              company: t.company || "",
              content: t.content || "Kerja yang luar biasa!",
              rating: t.rating || 5,
              avatarUrl: t.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.clientName || "A")}&background=random`,
              userId: dbUser.id
            }
          });
        }
      }

      // 3. Injeksi Links
      if (resultJson.dummyLinks && Array.isArray(resultJson.dummyLinks)) {
        for (const l of resultJson.dummyLinks) {
          await prisma.link.create({
            data: {
              platform: l.platform || "Website",
              url: l.url || "https://example.com",
              userId: dbUser.id
            }
          });
        }
      }

      // 4. Injeksi Sertifikat
      if (resultJson.dummyCertificates && Array.isArray(resultJson.dummyCertificates)) {
        for (const cert of resultJson.dummyCertificates) {
          await prisma.certificate.create({
            data: {
              title: cert.title || "Sertifikat Keahlian",
              issuer: cert.issuer || "Institusi Resmi",
              year: cert.year ? String(cert.year) : new Date().getFullYear().toString(),
              description: cert.description || "",
              status: "VERIFIED",
              userId: dbUser.id
            }
          });
        }
      }
    }

    // Sisipkan subdomain agar UI bisa membuat link "Lihat Web"
    resultJson.subdomain = dbUser.profile?.subdomain || "";

    // Bersihkan resultJson agar hanya mengembalikan data yang benar-benar diminta user (checkbox)
    if (!updateProfession) delete resultJson.profession;
    if (!updateBio) delete resultJson.bio;
    if (!updateTheme) {
      delete resultJson.theme;
      delete resultJson.themeColor;
      delete resultJson.fontFamily;
      delete resultJson.cardStyle;
      delete resultJson.buttonShape;
      delete resultJson.splashScreen;
    }
    if (!updateContent) {
      delete resultJson.dummyProjects;
      delete resultJson.dummyTestimonials;
      delete resultJson.dummyLinks;
      delete resultJson.dummyCertificates;
    }

    return NextResponse.json({ 
      success: true,
      data: resultJson
    });

  } catch (error: any) {
    console.error("Build with AI Error:", error);
    return NextResponse.json({ error: error.message || "Gagal membangun dengan AI" }, { status: 500 });
  }
}
