import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { getSheetEnv } from '@/lib/googleSheets'; 

// Beklenen veri yapısı (buraya taşındı)
interface RegistrationData {
    name: string;
    phone: string;
    email: string;
    courseId: string;
    courseTitle: string;
}

// Environment değişkenlerinin varlığını kontrol etmek için güvenli bir tip tanımlaması
interface SheetEnv {
  GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
  GOOGLE_SHEET_ID: string;
}

// API Rotası İşleyicisi (Sunucu Tarafı)
export async function POST(request: Request) {
  // sheetsInstance'ı doğru şekilde tipledik
  let sheetsInstance: ReturnType<typeof google.sheets> | null = null;
  
  const getSheetsInstance = () => {
      if (!sheetsInstance) {
          const env = getSheetEnv();
          
          // Hatanın çıktığı yere göre, ortam değişkenindeki \\n'leri gerçek yeni satırlara dönüştürüyoruz.
          const privateKey = env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'); 

          const auth = new GoogleAuth({
              clientOptions: {
                  credentials: {
                      client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                      private_key: privateKey,
                  },
                  keyId: '',
              },
              scopes: ['https://www.googleapis.com/auth/spreadsheets'],
          });

          sheetsInstance = google.sheets({ version: 'v4', auth: auth });
      }
      return sheetsInstance;
  }
  
  try {
    const body: RegistrationData = await request.json();
    
    // 1. Veri Toplama (timestamp ekleniyor)
    const timestamp = new Date().toISOString();
    const valuesToAppend: string[] = [
      timestamp,
      body.courseId,
      body.courseTitle,
      body.name,
      body.email,
      body.phone,
    ];
    
    const sheets = getSheetsInstance();
    const env = getSheetEnv(); 
      
    // 2. Google Sheet'e Yazma
    await sheets.spreadsheets.values.append({
        spreadsheetId: env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A:Z', 
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: [valuesToAppend],
        },
    });
    
    // 3. Sheet Linkini Oluşturma
    const sheetLink = "https://docs.google.com/spreadsheets/d/" + env.GOOGLE_SHEET_ID + "/edit#gid=0";
    console.log("Successfully appended to Sheet ID: " + env.GOOGLE_SHEET_ID);
    
    // 3. Başarılı Yanıt + Sheet Linki
    return NextResponse.json({ 
        message: 'Kayıt başarıyla Google Sheets\'e eklendi.',
        sheetLink: sheetLink
    }, { status: 200 });

  } catch (error) {
    console.error("Registration API Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir sunucu hatası oluştu.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}