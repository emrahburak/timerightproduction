import { NextResponse } from "next/server";
import { google } from "googleapis";
import { Resend } from "resend";

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
    const body: RegistrationData = await request.json();
    const timestamp = new Date().toLocaleString("tr-TR");
    const sheetId = process.env.GOOGLE_SHEET_ID;

    // 1. Google Sheets Hazırlık (Base64 decode)
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: Buffer.from(process.env.GOOGLE_PRIVATE_KEY || '', 'base64').toString('utf8').replace(/\\n/g, '\n'),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth: auth });

    // 2. SABİT DİZİ: Google Sheet'e Yazma (8 SÜTUN: A:H)
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

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "'timeright-01'!A:H",
      valueInputOption: "RAW", // RAW kullanarak Sheet'in veriyi yorumlamasını engelle
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [valuesToAppend] },
    });

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
    console.error("İşlem Hatası:", error);
    return NextResponse.json(
      { error: "Sistem şu an meşgul, lütfen sonra deneyiniz." },
      { status: 500 },
    );
  }
}