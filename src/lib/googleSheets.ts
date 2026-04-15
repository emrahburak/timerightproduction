import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

// Environment değişkenlerinin varlığını kontrol etmek için güvenli bir tip tanımlaması
// @ts-ignore
interface SheetEnv {
  GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
  GOOGLE_SHEET_ID: string;
}

export const getSheetEnv = (): SheetEnv => {
  const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } = process.env;

  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
    throw new Error("Google Sheets ortam değişkenleri (EMAIL, PRIVATE_KEY, SHEET_ID) eksik. Lütfen .env.local dosyanızı kontrol edin.");
  }

  return {
    GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_PRIVATE_KEY,
    GOOGLE_SHEET_ID,
  };
};