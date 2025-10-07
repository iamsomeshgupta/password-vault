import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongo";
import VaultItem from "@/models/VaultItem";

interface JwtPayload { userId: string }

async function getUserIdFromReq(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const token = auth?.split(" ")[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  await connectDB();
  const userId = await getUserIdFromReq(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await VaultItem.find({ userId });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const userId = await getUserIdFromReq(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { ciphertext, iv, tag } = body || {};
  if (!ciphertext) return NextResponse.json({ error: "ciphertext required" }, { status: 400 });
  const item = await VaultItem.create({ userId, ciphertext, iv, tag });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const userId = await getUserIdFromReq(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await VaultItem.deleteOne({ _id: id, userId });
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const userId = await getUserIdFromReq(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, ciphertext, iv, tag } = await req.json();
  if (!id || !ciphertext) return NextResponse.json({ error: "id and ciphertext required" }, { status: 400 });
  await VaultItem.updateOne({ _id: id, userId }, { $set: { ciphertext, iv, tag } });
  return NextResponse.json({ ok: true });
}


