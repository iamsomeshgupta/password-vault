import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { connectDB } from "@/lib/mongo";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "User exists" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const vaultSalt = crypto.randomBytes(16).toString("base64");

    await User.create({ email, passwordHash, vaultSalt });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("Signup error:", err);
    const message = err instanceof Error ? err.message : "Internal Server Error";
    const expose = process.env.NODE_ENV !== "production";
    return NextResponse.json({ error: expose ? message : "Internal Server Error" }, { status: 500 });
  }
}


