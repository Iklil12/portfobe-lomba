import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || "re_123456789_dummy_doang");

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    await resend.emails.send({
      from: 'Portfobe <hellocreator@mail.ritions.com>',
      to: email,
      replyTo: 'ikliluluyun@ritions.com', // User bisa balas langsung ke Anda
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
    });
  } catch (error) {
    console.error("Gagal mengirim welcome email:", error);
  }
};

export const sendSupportEmail = async (name: string, email: string, message: string) => {
  try {
    await resend.emails.send({
      from: 'Portfobe Support <support@mail.ritions.com>',
      to: 'ikliluluyun@ritions.com',
      replyTo: email,
      subject: `[SUPPORT] Pesan Baru dari ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0f172a;">Pesan Dukungan Baru</h2>
          <p><strong>Dari:</strong> ${name} (${email})</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Gagal mengirim email support:", error);
    return { success: false, error };
  }
};