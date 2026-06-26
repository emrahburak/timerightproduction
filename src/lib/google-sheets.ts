import { JWT } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function getSheetConfig() {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const tabName = process.env.GOOGLE_SHEET_TAB_NAME || 'Sheet1';
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;

  if (!sheetId || !email || !key) {
    throw new Error(
      'Google Sheets config missing: GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY',
    );
  }

  return { sheetId, tabName, email, key };
}

async function getAccessToken(): Promise<string> {
  const { email, key } = getSheetConfig();

  const jwt = new JWT({ email, key, scopes: SCOPES });
  const result = await jwt.getAccessToken();

  if (!result?.token) {
    throw new Error('Failed to obtain Google Sheets access token');
  }

  return result.token;
}

const RANGE = 'A:I';

export interface SheetRow {
  kayitTarihi: string;
  kursId: string;
  kursAdi: string;
  yer: string;
  kursBaslangic: string;
  programDetay: string;
  adSoyad: string;
  email: string;
  telefon: string;
}

/**
 * Mevcut tüm kayıtları Google Sheets'ten okur.
 * İlk satırı (header) atlar.
 */
export async function getExistingRecords(): Promise<SheetRow[]> {
  const { sheetId, tabName } = getSheetConfig();
  const token = await getAccessToken();

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${tabName}!${RANGE}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sheet okuma hatası (${res.status}): ${body}`);
  }

  const data = await res.json();
  const rows: string[][] = data.values || [];

  // İlk satır header, onu atla
  return rows.slice(1).map((row) => ({
    kayitTarihi: row[0] ?? '',
    kursId: row[1] ?? '',
    kursAdi: row[2] ?? '',
    yer: row[3] ?? '',
    kursBaslangic: row[4] ?? '',
    programDetay: row[5] ?? '',
    adSoyad: row[6] ?? '',
    email: row[7] ?? '',
    telefon: row[8] ?? '',
  }));
}

/**
 * Yeni bir kaydı Google Sheets'e ekler.
 */
export async function appendRow(data: SheetRow): Promise<void> {
  const { sheetId, tabName } = getSheetConfig();
  const token = await getAccessToken();

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${tabName}!${RANGE}:append?valueInputOption=USER_ENTERED`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [
        [
          data.kayitTarihi,
          data.kursId,
          data.kursAdi,
          data.yer,
          data.kursBaslangic,
          data.programDetay,
          data.adSoyad,
          data.email,
          data.telefon,
        ],
      ],
    }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sheet append hatası (${res.status}): ${body}`);
  }
}
