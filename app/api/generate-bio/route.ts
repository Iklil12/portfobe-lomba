import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // 1. Verifikasi Session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Ambil prompt dari request body
    const body = await req.json();
    const { prompt, profession } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // 3. Inisialisasi Gemini
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not defined in environment variables");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Gunakan gemini-2.5-flash untuk respon teks cepat
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: "Kamu adalah asisten copywriter profesional untuk platform Portfo.be. Tugasmu adalah mengubah kata kunci singkat dari user menjadi bio profil profesional (2-3 kalimat) dan gelar profesi singkat/jabatan (1-3 kata). Kembalikan respons dalam format JSON murni dengan struktur: {\"profession\": \"...\", \"bio\": \"...\"}. Gunakan bahasa Indonesia.",
      generationConfig: { responseMimeType: "application/json" }
    });

    // Gabungkan profesi dengan prompt jika ada
    let finalPrompt = prompt;
    if (profession && typeof profession === 'string') {
      finalPrompt = `Profesi saya: ${profession}. Kata kunci: ${prompt}`;
    }

    // 4. Generate Content
    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();
    const resultJson = JSON.parse(text);

    // 5. Return JSON
    return NextResponse.json({ 
      bio: resultJson.bio?.trim() || "", 
      profession: resultJson.profession?.trim() || "" 
    });

  } catch (error: any) {
    console.error("Generate Bio API Error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal menghasilkan bio dengan AI." }, 
      { status: 500 }
    );
  }
}
