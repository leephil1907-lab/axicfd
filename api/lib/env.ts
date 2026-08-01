import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    console.warn(`[WARNING] Missing required environment variable: ${name}. Using a fallback.`);
    if (name === "DATABASE_URL") {
      return "";
    }
    return `placeholder-${name.toLowerCase()}`;
  }
  return value ?? "";
}

export const env = {
  appId: required("APP_ID"),
  appSecret: required("APP_SECRET"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: required("DATABASE_URL"),
  kimiAuthUrl: process.env.KIMI_AUTH_URL ?? "",
  kimiOpenUrl: process.env.KIMI_OPEN_URL ?? "",
  ownerUnionId: process.env.OWNER_UNION_ID ?? "",
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ?? "",
  telegramChatId: process.env.TELEGRAM_CHAT_ID ?? "",
  whatsappNumber: process.env.WHATSAPP_NUMBER ?? "",
  adminEmail: process.env.ADMIN_EMAIL ?? "",
};
