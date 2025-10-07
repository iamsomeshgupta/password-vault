import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongo";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    return NextResponse.json({ token, vaultSalt: user.vaultSalt });
  } catch (err: unknown) {
    console.error("Login error:", err);
    const message = err instanceof Error ? err.message : "Internal Server Error";
    const expose = process.env.NODE_ENV !== "production";
    return NextResponse.json({ error: expose ? message : "Internal Server Error" }, { status: 500 });
  }
}


