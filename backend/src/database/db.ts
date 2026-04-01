import { Pool, PoolConfig } from "pg";

const poolConfig: PoolConfig = {
  max: 10,
};

if (process.env.DATABASE_URL) {
  poolConfig.connectionString = process.env.DATABASE_URL;
  poolConfig.ssl = { rejectUnauthorized: false };
} else {
  poolConfig.host = process.env.DB_HOST || "localhost";
  poolConfig.port = Number(process.env.DB_PORT) || 5432;
  poolConfig.user = process.env.DB_USER;
  poolConfig.password = process.env.DB_PASSWORD;
  poolConfig.database = process.env.DB_NAME;
  poolConfig.ssl = process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false;
}

export const db = new Pool(poolConfig);
