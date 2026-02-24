import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { ok: false, message: "ยังไม่ได้ตั้งค่า ADMIN_PASSWORD ใน .env.local / Vercel" },
        { status: 500 }
      );
    }

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ ok: false, message: "รหัสไม่ถูกต้อง" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });

    res.cookies.set("admin", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ localhost จะเซ็ตคุกกี้ได้
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message ?? "Bad request" }, { status: 400 });
  }
}