import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getExistingRecords, appendRow } from "@/lib/google-sheets";

const resend = new Resend(process.env.RESEND_API_KEY);
const resendConfigured = !!(process.env.RESEND_API_KEY && process.env.ADMIN_NOTIFICATION_EMAIL);

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

    // Rate limit
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: "Çok fazla istek, lütfen 1 dakika bekleyiniz." },
        { status: 429 },
      );
    }

    // Honeypot: website doluysa bot, sessizce başarılı dön
    if (body.website && body.website.length > 0) {
      return NextResponse.json({ success: true });
    }

    const timestamp = new Date().toLocaleString("tr-TR");

    // Google Sheets'te mükerrer kayıt kontrolü (aynı email + aynı kurs)
    try {
      const existing = await getExistingRecords();
      const isDuplicate = existing.some(
        (row) => row.email === body.userEmail && row.kursId === body.courseId,
      );

      if (isDuplicate) {
        console.log("Mükerrer kayıt engellendi:", body.userEmail, body.courseId);
        return NextResponse.json(
          { error: "Bu kurs için zaten kaydınız bulunmaktadır." },
          { status: 409 },
        );
      }
    } catch (sheetErr) {
      console.error("Sheet okuma hatası (mükerrer kontrol):", sheetErr);
      // Sheet okunamazsa bile kayda devam et (sadece logla)
    }

    // Yeni kaydı Google Sheets'e ekle
    const sheetRow = {
      kayitTarihi: timestamp,
      kursId: body.courseId,
      kursAdi: body.courseName,
      yer: body.location,
      kursBaslangic: body.startDate,
      programDetay: body.fullSchedule,
      adSoyad: body.userName,
      email: body.userEmail,
      telefon: body.userPhone,
    };

    try {
      await appendRow(sheetRow);
      console.log("Google Sheets'e kayıt başarılı");
    } catch (sheetErr) {
      console.error("Google Sheets append hatası:", sheetErr);
      return NextResponse.json(
        { error: "Kayıt işlemi başarısız, lütfen sonra deneyiniz." },
        { status: 500 },
      );
    }

    // Admin email bildirimi (Resend)
    if (resendConfigured) {
      try {
        await resend.emails.send({
          from: "Başvuru Sistemi <info@timerightproduction.org>",
          to: process.env.ADMIN_NOTIFICATION_EMAIL!,
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
      } catch (emailErr) {
        console.error("Email gönderme hatası:", emailErr);
        // Email hatası kaydı etkilemesin
      }
    } else {
      console.warn("Resend config missing, skipping admin email");
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("İşlem Hatası:", error.message);
    return NextResponse.json(
      { error: "Kayıt işlemi başarısız, lütfen sonra deneyiniz." },
      { status: 500 },
    );
  }
}