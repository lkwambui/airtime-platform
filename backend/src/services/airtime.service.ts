import axios from "axios";
import { logInfo, logError } from "../utils/logger";

const BASE_URL =
  process.env.AUTOBUNDLES_BASE_URL?.replace(/\/$/, "") ||
  "https://api.autobundles.co.ke";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing env var: ${key}`);
  }
  return value;
}

function formatPhone(phone: string): string {
  return phone
    .replace(/\s+/g, "")
    .replace(/^0/, "254")
    .replace(/^\+/, "");
}

async function getAccessToken(): Promise<string> {
  try {
    const clientId = requireEnv("AUTOBUNDLES_CLIENT_ID");
    const clientSecret = requireEnv("AUTOBUNDLES_CLIENT_SECRET");

    const response = await axios.post(
      `${BASE_URL}/oauth/token`,
      {
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      },
      {
        timeout: 15000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const token = response.data?.access_token;

    if (!token) {
      throw new Error("AutoBundles did not return access token");
    }

    return token;
  } catch (error: any) {
    logError("AutoBundles token error", error?.response?.data || error.message);
    throw error;
  }
}

export async function sendAirtime(recipientPhone: string, amount: number) {
  try {
    const token = await getAccessToken();

    const formattedPhone = formatPhone(recipientPhone);
    const airtimeAmount = Math.round(amount);

    logInfo("Sending airtime", {
      phone: formattedPhone,
      amount: airtimeAmount,
    });

    const response = await axios.post(
      `${BASE_URL}/api/v1/orders`,
      {
        recipient_phone: formattedPhone,
        amount: airtimeAmount,
      },
      {
        timeout: 20000,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    logInfo("Airtime sent successfully", response.data);

    return response.data;
  } catch (error: any) {
    logError("Airtime sending failed", error?.response?.data || error.message);
    throw error;
  }
}
