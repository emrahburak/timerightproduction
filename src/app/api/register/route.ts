import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 3;
const rateLimitMap = new Map<string, number[]>();

interface RegistrationData {
  userName: string;
  userPhone: string;
  userEmail: string;
  courseId: string;
  courseName: string;
  location: string;
  startDate: string;
  fullSchedule: string;
  website?: string;
}

function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
  
  if (validTimestamps.length >= RATE_LIMIT_MAX) {
    return false;
  }
  
  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return true;
}

export async function POST(request: Request) {
  try {
    const body: RegistrationData = await request.json();
    const clientIP = getClientIP(request);

    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: "Çok fazla istek, lütfen 1 dakika bekleyiniz." },
        { status: 429 }
      );
    }

    if (body.website && body.website.length > 0) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

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

    console.log("=== N8N WEBHOOK START ===");
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

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("İşlem Hatası:", error.message);
    return NextResponse.json(
      { error: "Kayıt işlemi başarısız, lütfen sonra deneyiniz." },
      { status: 500 }
    );
  }
}