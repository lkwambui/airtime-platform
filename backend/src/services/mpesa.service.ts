import axios from "axios";
import moment from "moment";

/**
 * Base URL
 * Production: https://api.safaricom.co.ke
 * Sandbox:    https://sandbox.safaricom.co.ke
 */
const MPESA_BASE_URL =
  process.env.MPESA_BASE_URL || "https://api.safaricom.co.ke";

/**
 * Ensure required env variables exist
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing required env var: ${key}`);
  }
  return value;
}

/**
 * Get OAuth access token
 */
export async function getAccessToken(): Promise<string> {
  const consumerKey = requireEnv("MPESA_CONSUMER_KEY");
  const consumerSecret = requireEnv("MPESA_CONSUMER_SECRET");

  const auth = Buffer.from(
    `${consumerKey}:${consumerSecret}`,
  ).toString("base64");

  const response = await axios.get(
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    },
  );

  if (!response.data?.access_token) {
    throw new Error("❌ Failed to obtain MPESA access token");
  }

  return response.data.access_token;
}

/**
 * Initiate STK Push (BUY GOODS / TILL NUMBER)
 */
export async function stkPush(
  phone: string,
  amount: number,
  reference: string,
) {
  const shortcode =
    process.env.MPESA_STORE_NUMBER || requireEnv("MPESA_TILL_NUMBER");
  const passkey = requireEnv("MPESA_PASSKEY");
  const callbackUrl = requireEnv("MPESA_CALLBACK_URL");

  const token = await getAccessToken();
  const timestamp = moment().format("YYYYMMDDHHmmss");

  const password = Buffer.from(
    `${shortcode}${passkey}${timestamp}`,
  ).toString("base64");

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,

    // ✅ BUY GOODS (NOT PayBill)
    TransactionType: "CustomerBuyGoodsOnline",

    Amount: amount,
    PartyA: phone,      // Customer phone
    PartyB: shortcode,  // Till Number
    PhoneNumber: phone,

    CallBackURL: callbackUrl,

    // MUST be present (used in callback)
    AccountReference: reference,
    TransactionDesc: "Airtime purchase",
  };

  const response = await axios.post(
    `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
}