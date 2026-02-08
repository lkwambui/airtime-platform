import axios from "axios";
import moment from "moment";

const MPESA_BASE_URL =
  process.env.MPESA_BASE_URL || "https://api.safaricom.co.ke";

const MPESA_TRANSACTION_TYPE =
  process.env.MPESA_TRANSACTION_TYPE || "CustomerBuyGoodsOnline";

const REQUEST_TIMEOUT_MS = Number(process.env.MPESA_TIMEOUT_MS || 15000);

/**
 * Ensure required env variables exist
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("254") && digits.length === 12) {
    return digits;
  }

  if (digits.startsWith("0") && digits.length === 10) {
    return `254${digits.slice(1)}`;
  }

  if ((digits.startsWith("7") || digits.startsWith("1")) && digits.length === 9) {
    return `254${digits}`;
  }

  throw new Error("Invalid phone format. Use 2547XXXXXXXX or 07XXXXXXXX.");
}

// 🔑 Get production access token
export async function getAccessToken(): Promise<string> {
  const consumerKey = requireEnv("MPESA_CONSUMER_KEY");
  const consumerSecret = requireEnv("MPESA_CONSUMER_SECRET");

  const auth = Buffer.from(
    `${consumerKey}:${consumerSecret}`
  ).toString("base64");

  const response = await axios.get(
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      timeout: REQUEST_TIMEOUT_MS,
    }
  );

  return response.data.access_token;
}

// 🧪 PRODUCTION STK PUSH
export async function stkPush(
  phone: string,
  amount: number,
  reference: string
) {
  const shortcode = requireEnv("MPESA_SHORTCODE");
  const passkey = requireEnv("MPESA_PASSKEY");
  const callbackUrl = requireEnv("MPESA_CALLBACK_URL");

  const token = await getAccessToken();
  const timestamp = moment().format("YYYYMMDDHHmmss");

  const password = Buffer.from(
    `${shortcode}${passkey}${timestamp}`
  ).toString("base64");

  if (!Number.isFinite(amount) || amount <= 0 || !Number.isInteger(amount)) {
    throw new Error("Amount must be a positive whole number");
  }

  const formattedPhone = normalizePhone(phone);

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,

    TransactionType: MPESA_TRANSACTION_TYPE,

    Amount: amount,
    PartyA: formattedPhone, // customer phone
    PartyB: shortcode,
    PhoneNumber: formattedPhone,

    CallBackURL: callbackUrl,
    AccountReference: reference,
    TransactionDesc: "Production Transaction",
  };

  try {
    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: REQUEST_TIMEOUT_MS,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      throw new Error(
        `M-Pesa STK Push failed${status ? ` (status ${status})` : ""}: ${
          data ? JSON.stringify(data) : error.message
        }`
      );
    }

    throw error;
  }
}