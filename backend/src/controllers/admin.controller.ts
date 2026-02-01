import { Request, Response } from "express";
import { authenticateAdmin } from "../services/auth.service";

export async function adminLogin(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password required",
    });
  }

  try {
    const { token } = await authenticateAdmin(username, password);

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error: any) {
    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(500).json({ message: "Admin login failed" });
  }
}
