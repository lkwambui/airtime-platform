import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../database/db";

export async function authenticateAdmin(username: string, password: string) {
  const result = await db.query(
    "SELECT id, password_hash FROM admins WHERE username = $1",
    [username],
  );

  const admin = result.rows[0];
  if (!admin) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const match = await bcrypt.compare(password, admin.password_hash);
  if (!match) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = jwt.sign(
    { adminId: admin.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "2h" },
  );

  return {
    adminId: admin.id,
    token,
  };
}
