import axios from "axios";
import moment from "moment";

/**
 * Safaricom production base URL
 */
const MPESA_BASE_URL =
  process.env.MPESA_BASE_URL || "https://sandbox.safaricom.co.ke";

/**
 * Ensure required env variables exist
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
}

// 🔑 Get sandbox access token
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
    }
  );

  return response.data.access_token;
}

// 🧪 SANDBOX STK PUSH
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

  /**
   * 🔴 VERY IMPORTANT
   * Phone must be in format: 2547XXXXXXXX
   */
  const formattedPhone = phone
    .replace(/^0/, "254")
    .replace(/^\+/, "");

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,

    TransactionType: "CustomerPayBillOnline", // SANDBOX ONLY

    Amount: amount,
    PartyA: formattedPhone, // customer phone
    PartyB: shortcode,       // your till number
    PhoneNumber: formattedPhone,

    CallBackURL: callbackUrl,
    AccountReference: reference,
    TransactionDesc: "Sandbox Test",
  };

  const response = await axios.post(
    `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}