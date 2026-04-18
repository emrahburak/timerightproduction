import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

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

    const webhookData = {
      kayitTarihi: timestamp,
      kursId: body.courseId,
      kursAdi: body.courseName,
      yer: body.location,
      kursBaslangic: body.startDate,
      programDetay: body.fullSchedule,
      adSoyad: body.userName,
      email: body.userEmail,
      telefon: body.userPhone
    };

    // KONTROL 1: n8n Webhook'a veri gönder
    console.log("=== N8N WEBHOOK START ===");
    console.log("Sending to:", N8N_WEBHOOK_URL);

    const fetchOptions: RequestInit = {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(webhookData),
    };

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, fetchOptions);
    const n8nResult = await n8nResponse.json();

    if (!n8nResponse.ok) {
      console.error("N8N failed:", n8nResponse.status, n8nResult);
      throw new Error(`N8N webhook failed: ${n8nResponse.status}`);
    }

    console.log("N8N OK:", n8nResult);

    // KONTROL 2: Resend ile mail gönder
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (!adminEmail || !process.env.RESEND_API_KEY) {
      console.warn("Email config missing, skipping notification");
    } else {
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
        `,
      });
      console.log("Email sent OK");
    }

    // FİNAL: Her iki adım da başarılı
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("İşlem Hatası:", error.message);
    return NextResponse.json(
      { error: "Kayıt işlemi başarısız, lütfen sonra deneyiniz." },
      { status: 500 }
    );
  }
}