import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  const posts = db
    .prepare("SELECT * FROM posts ORDER BY created_at DESC LIMIT 50")
    .all();

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const body = await req.json();

  db.prepare(
    "INSERT INTO posts (id, user_address, content) VALUES (?, ?, ?)"
  ).run(body.id, body.user, body.content);

  return NextResponse.json({ success: true });
}
