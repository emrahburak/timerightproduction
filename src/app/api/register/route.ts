import { NextResponse } from "next/server";
import { google } from "googleapis";
import { Resend } from "resend";
import dns from 'node:dns';

// Force IPv4 priority to prevent ETIMEDOUT in Docker/Coolify environments
dns.setDefaultResultOrder('ipv4first');

const resend = new Resend(process.env.RESEND_API_KEY);

interface RegistrationData {
  userName: string;
  userPhone: string;
  userEmail: string;
  courseId: string;
  courseName: string;
  location: string;
  startDate: string;
  fullSchedule: string;
}

export async function POST(request: Request) {
  try {
    // DNS Lookup Debug: Check which IP google.com and oauth2.googleapis.com resolve to
    console.log("=== DNS DEBUG START ===");
    try {
      const googleLookup = await new Promise((resolve, reject) => {
        dns.lookup('google.com', (err, addresses) => {
          if (err) reject(err);
          else resolve(addresses);
        });
      });
      console.log("google.com resolved to:", googleLookup);
    } catch (e) {
      console.error("google.com DNS lookup failed:", e);
    }

    try {
      const oauthLookup = await new Promise((resolve, reject) => {
        dns.lookup('oauth2.googleapis.com', (err, addresses) => {
          if (err) reject(err);
          else resolve(addresses);
        });
      });
      console.log("oauth2.googleapis.com resolved to:", oauthLookup);
    } catch (e) {
      console.error("oauth2.googleapis.com DNS lookup failed:", e);
    }
    console.log("=== DNS DEBUG END ===");

    const body: RegistrationData = await request.json();
    const timestamp = new Date().toLocaleString("tr-TR");
    const sheetId = process.env.GOOGLE_SHEET_ID;

    // 1. Google Sheets Hazırlık (Base64 decode)
    console.log("=== GOOGLE AUTH START ===");
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: Buffer.from(process.env.GOOGLE_PRIVATE_KEY || '', 'base64').toString('utf8').replace(/\\n/g, '\n'),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    console.log("GoogleAuth created");

    const sheets = google.sheets({ version: "v4", auth: auth as any });
    console.log("=== GOOGLE AUTH END ===");

    // 2. SABİT DİZİ: Google Sheet'e Yazma (8 SÜTUN: A:H)
    console.log("=== SHEET WRITE START ===");
    // Sıra: Kayıt Tarihi, Kurs Başlangıç, Program Detayı, Kurs ID, Kurs Adı, Ad Soyad, E-posta, Telefon
    const valuesToAppend = [
      timestamp,                    // A: Kayıt Tarihi
      body.startDate || '',        // B: Kurs Başlangıç
      body.fullSchedule || '',     // C: Program Detayı
      body.courseId,               // D: Kurs ID
      body.courseName,            // E: Kurs Adı
      body.userName,              // F: Ad Soyad
      body.userEmail || '',       // G: E-posta
      body.userPhone,             // H: Telefon
    ];

    // Set timeout for the API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error("REQUEST TIMEOUT: 15 seconds elapsed, aborting...");
      controller.abort();
    }, 15000);

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: "'timeright-01'!A:H",
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: [valuesToAppend] }
      }, { signal: controller.signal });
      clearTimeout(timeoutId);
      console.log("=== SHEET WRITE END (SUCCESS) ===");
    } catch (sheetError: any) {
      clearTimeout(timeoutId);
      console.error("SHEET WRITE ERROR DETAILS:", sheetError.code, sheetError.message);
      if (sheetError.code === 'ETIMEDOUT') {
        console.error("TIMEOUT at: socket/connection phase");
      }
      throw sheetError;
    }

    const sheetLink = `https://docs.google.com/spreadsheets/d/${sheetId}/edit#gid=0`;

    // 3. AYNI OBJEDEN Mail Gönderme (SADECE SHEET BAŞARILIYSA ÇALIŞIR)
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (!adminEmail) {
      throw new Error("ADMIN_NOTIFICATION_EMAIL environment variable is not set");
    }
    
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "Başvuru Sistemi <onboarding@resend.dev>",
          to: adminEmail,
          subject: `Yeni Başvuru: ${body.courseName} - ${body.location} - ${body.userName}`,
          html: `
            <h2>Yeni Kurs Başvurusu Kaydı Alındı</h2>
            <p><strong>Kurs:</strong> ${body.courseName}</p>
            <p><strong>Yer:</strong> ${body.location}</p>
            <p><strong>Kurs ID:</strong> ${body.courseId}</p>
            <p><strong>Başlangıç Tarihi:</strong> ${body.startDate}</p>
            <p><strong>Program Detayı:</strong> ${body.fullSchedule}</p>
            <p><strong>Kayıt Tarihi:</strong> ${timestamp}</p>
            <p><strong>Ad Soyad:</strong> ${body.userName}</p>
            <p><strong>E-posta:</strong> ${body.userEmail}</p>
            <p><strong>Telefon:</strong> ${body.userPhone}</p>
            <hr/>
            <p><strong>Google Sheet Kaydı:</strong> <a href="${sheetLink}">Buraya Tıklayarak Sayfayı Aç</a></p>
          `,
        });
        console.log("Bildirim maili gönderildi.");
      } catch (mailError) {
        console.error("Mail gönderilemedi ama kayıt yapıldı:", mailError);
      }
    }

    return NextResponse.json(
      {
        message: "Kayıt başarıyla tamamlandı.",
        sheetLink: sheetLink,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("İşlem Hatası (Full Details):", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: "Sistem şu an meşgul, lütfen sonra deneyiniz." },
      { status: 500 },
    );
  }
}