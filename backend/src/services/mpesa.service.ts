import axios from "axios";
import moment from "moment";

/**
 * Safaricom PRODUCTION base URL
 */
const MPESA_BASE_URL =
  process.env.MPESA_BASE_URL || "https://api.safaricom.co.ke";

/**
 * Ensure required env variables exist
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
}

/**
 * 🔑 Get Production Access Token
 */
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

/**
 * 🚀 LIVE STK PUSH (BUY GOODS - TILL)
 */
export async function stkPush(
  phone: string,
  amount: number,
  reference: string
) {
  const shortcode = requireEnv("MPESA_SHORTCODE"); // 3703725
  const till = requireEnv("MPESA_TILL");           // 3703823
  const passkey = requireEnv("MPESA_PASSKEY");
  const callbackUrl = requireEnv("MPESA_CALLBACK_URL");

  const token = await getAccessToken();
  const timestamp = moment().format("YYYYMMDDHHmmss");

  const password = Buffer.from(
    `${shortcode}${passkey}${timestamp}`
  ).toString("base64");

  /**
   * Ensure phone format is 2547XXXXXXXX
   */
  const formattedPhone = phone
    .replace(/^0/, "254")
    .replace(/^\+/, "");

  const payload = {
    BusinessShortCode: shortcode,         
    Password: password,
    Timestamp: timestamp,

    TransactionType: "CustomerBuyGoodsOnline", 

    Amount: amount,
    PartyA: formattedPhone,               
    PartyB: till,                         
    PhoneNumber: formattedPhone,

    CallBackURL: callbackUrl,
    AccountReference: `TX-${reference}`,
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
    }
  );

  return response.data;
}