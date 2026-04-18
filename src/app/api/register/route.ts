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

    // Prepare data for n8n
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

    console.log("=== N8N WEBHOOK START ===");
    console.log("Sending data to:", N8N_WEBHOOK_URL);
    console.log("Webhook data:", JSON.stringify(webhookData));

    // Send to n8n Webhook - Force POST with cache disabled
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
    console.log("N8N Response:", n8nResult);
    console.log("=== N8N WEBHOOK END ===");

    // Handle n8n response
    if (!n8nResponse.ok) {
      console.error("N8N Webhook failed with status:", n8nResponse.status);
      return NextResponse.json(
        { error: "Kayıt işlemi şu an başarısız, lütfen sonra deneyiniz." },
        { status: 502 }
      );
    }

    // n8n başarılı → Şimdi mail gönder
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    let emailSent = false;

    if (adminEmail && process.env.RESEND_API_KEY) {
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
          `,
        });
        emailSent = true;
        console.log("Bildirim maili gönderildi.");
      } catch (mailError) {
        console.error("Mail gönderilemedi:", mailError);
        return NextResponse.json(
          { error: "Kayıt alındı ancak bildirim gönderilemedi." },
          { status: 500 }
        );
      }
    }

    // Her şey başarılı
    return NextResponse.json(
      {
        message: "Kayıt başarıyla tamamlandı.",
        emailSent: emailSent
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("İşlem Hatası (Full Details):", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: "Sistem şu an meşgul, lütfen sonra deneyiniz." },
      { status: 500 }
    );
  }
}