const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8809744235:AAFeNBENA6PY69fa8t7yCULymCFYd1EDUPU";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "1776632273";
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function sendTelegramNotification(message: string) {
  try {
    const resp = await fetch(`${API_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: "HTML" }),
    });
    const data = await resp.json();
    if (!data.ok) {
      console.error("Telegram API error:", data.description);
    }
    return data.ok;
  } catch (err) {
    console.error("Telegram notification failed:", err);
    return false;
  }
}

export async function sendTelegramPhoto(photoUrl: string, caption: string) {
  try {
    const resp = await fetch(`${API_URL}/sendPhoto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, photo: photoUrl, caption, parse_mode: "HTML" }),
    });
    const data = await resp.json();
    if (!data.ok) {
      console.error("Telegram sendPhoto failed, trying sendMessage fallback:", data.description);
      return sendTelegramNotification(`<b>Axi Financial Trading Platform</b>\n\n${caption}`);
    }
    return data.ok;
  } catch (err) {
    console.error("Telegram photo notification error:", err);
    return sendTelegramNotification(`<b>Axi Financial Trading Platform</b>\n\n${caption}`);
  }
}

export async function sendTelegramConfirmation() {
  const logoUrl = "https://raw.githubusercontent.com/axi-corp/assets/main/logo.png";
  const confirmationText = 
    `<b>🔴 Axi Trading Platform - Bot System Active</b>\n\n` +
    `<b>Bot Username:</b> @Axi_CustomerSupport_bot\n` +
    `<b>Status:</b> ✅ ONLINE & READY\n` +
    `<b>Gateway:</b> Bank Wire, Chime & Crypto TRC20\n` +
    `<b>Notification Service:</b> Operational\n\n` +
    `<i>This is an automated confirmation message from Axi Trading Platform requesting confirmation that the Telegram notification bot is ready to send live deposit, withdrawal, and trade notifications.</i>\n\n` +
    `<b>Time:</b> ${new Date().toUTCString()}`;

  return sendTelegramPhoto(logoUrl, confirmationText);
}

export async function notifyNewRegistration(name: string, email: string) {
  return sendTelegramNotification(
    `<b>New Registration</b>\n\nName: ${name}\nEmail: ${email}\nTime: ${new Date().toISOString()}`
  );
}

export async function notifyNewDeposit(user: string, amount: string, method: string) {
  return sendTelegramNotification(
    `<b>New Deposit</b>\n\nUser: ${user}\nAmount: ${amount}\nMethod: ${method}\nTime: ${new Date().toISOString()}`
  );
}

export async function notifyNewWithdrawal(user: string, amount: string, method: string) {
  return sendTelegramNotification(
    `<b>New Withdrawal Request</b>\n\nUser: ${user}\nAmount: ${amount}\nMethod: ${method}\nTime: ${new Date().toISOString()}`
  );
}

export async function notifyNewTrade(user: string, symbol: string, direction: string, volume: string) {
  return sendTelegramNotification(
    `<b>New Trade</b>\n\nUser: ${user}\nSymbol: ${symbol}\nDirection: ${direction.toUpperCase()}\nVolume: ${volume}\nTime: ${new Date().toISOString()}`
  );
}

export async function notifyKycSubmission(details: {
  userEmail: string;
  fullName: string;
  idType: string;
  idNumber: string;
  country: string;
}) {
  const typeFormatted = details.idType.toUpperCase().replace("_", " ");
  return sendTelegramNotification(
    `<b>🆔 NEW MANUAL KYC VERIFICATION SUBMISSION</b>\n\n` +
    `<b>User Email:</b> ${details.userEmail}\n` +
    `<b>Full Name:</b> ${details.fullName}\n` +
    `<b>Document Type:</b> ${typeFormatted}\n` +
    `<b>ID Number:</b> ${details.idNumber}\n` +
    `<b>Country:</b> ${details.country}\n` +
    `<b>Review Window:</b> ⏳ 15 to 30 Minutes\n\n` +
    `<i>Axi Compliance Notification: Review uploaded Driver's License/Passport photos in the Admin Portal to approve or reject.</i>\n\n` +
    `<b>Time:</b> ${new Date().toUTCString()}`
  );
}

export async function notifyKycStatusUpdate(userEmail: string, status: "approved" | "rejected", reason?: string) {
  const icon = status === "approved" ? "✅" : "❌";
  return sendTelegramNotification(
    `<b>${icon} KYC VERIFICATION ${status.toUpperCase()}</b>\n\n` +
    `<b>User Email:</b> ${userEmail}\n` +
    `<b>Status:</b> ${status.toUpperCase()}\n` +
    (reason ? `<b>Reason:</b> ${reason}\n` : "") +
    `\n<b>Time:</b> ${new Date().toUTCString()}`
  );
}