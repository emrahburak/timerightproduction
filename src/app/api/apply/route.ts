import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Müşterinin eklemesi gereken API key (şimdilik opsiyonel veya boş geçilebilir ama hata fırlatmaması için dummy ekliyoruz)
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, kvkk } = body;

    // Basit validasyon
    if (!name || !phone || !kvkk) {
      return NextResponse.json(
        { error: 'Ad, Telefon ve KVKK onayı zorunludur.' },
        { status: 400 }
      );
    }

    // Gerçek e-posta gönderimi (API KEY tanımlıysa çalışır)
    if (process.env.RESEND_API_KEY) {
      const { data, error } = await resend.emails.send({
        from: 'Başvuru Sistemi <onboarding@resend.dev>', // resend.dev test domain'i
        to: 'gemrahburak@gmail.com', // Sizin test adresiniz
        subject: `Yeni Kurs Başvurusu: ${name}`,
        html: `
          <h2>Yeni Kurs Başvurusu Alındı</h2>
          <p><strong>Ad Soyad:</strong> ${name}</p>
          <p><strong>Telefon:</strong> ${phone}</p>
          <p><strong>E-posta:</strong> ${email || 'Belirtilmedi'}</p>
          <hr/>
          <p><small>KVKK Metni Onaylandı: Evet</small></p>
        `,
      });

      if (error) {
        console.error('Resend API Hatası:', error);
        return NextResponse.json({ error: 'Mail gönderim hatası' }, { status: 500 });
      }
      
      console.log('Mail başarıyla gönderildi, ID:', data?.id);
    } else {
      console.log('--- TEST MAİL GÖNDERİMİ (API KEY YOK) ---');
      console.log('To: gemrahburak@gmail.com');
      console.log(`Name: ${name}, Phone: ${phone}, Email: ${email}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Form gönderilemedi.' },
      { status: 500 }
    );
  }
}
