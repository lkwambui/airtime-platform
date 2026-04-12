import { Pool, PoolConfig } from "pg";
import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import https from "https";

/**
 * Custom fetch using Node's native https module.
 * Required because Node.js undici (built-in fetch) has IPv6 happy-eyeballs
 * issues that cause ETIMEDOUT when the Neon host is only reachable via IPv4.
 */
function nativeFetch(url: string, init?: RequestInit): Promise<Response> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const body = init?.body as string | Buffer | undefined;
    const bodyBuffer = body ? Buffer.from(body) : undefined;

    const options: https.RequestOptions = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: (init?.method ?? "GET").toUpperCase(),
      headers: {
        ...(init?.headers as Record<string, string> | undefined),
        ...(bodyBuffer ? { "Content-Length": String(bodyBuffer.length) } : {}),
      },
      family: 4, // force IPv4
    };

    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        const buffer = Buffer.concat(chunks);
        resolve(
          new Response(buffer, {
            status: res.statusCode ?? 200,
            headers: res.headers as Record<string, string>,
          }),
        );
      });
    });

    req.on("error", reject);
    if (bodyBuffer) req.write(bodyBuffer);
    req.end();
  });
}

let db: Pool;

if (process.env.DATABASE_URL) {
  // Force IPv4 for both WebSocket and HTTP — undici / ws default to IPv6 happy eyeballs
  // which times out when the Neon host is only reachable via IPv4 on this machine.
  const WsIPv4 = class extends ws {
    constructor(url: string, protocols?: any, wsOptions?: any) {
      super(url, protocols, { ...(wsOptions ?? {}), family: 4 });
    }
  };
  neonConfig.webSocketConstructor = WsIPv4;
  neonConfig.fetchFunction = nativeFetch as typeof fetch;
  db = new NeonPool({ connectionString: process.env.DATABASE_URL }) as unknown as Pool;
} else {
  const poolConfig: PoolConfig = {
    max: 10,
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  };
  db = new Pool(poolConfig);
}

export { db };
