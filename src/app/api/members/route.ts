import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase-server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role"); // founder|leader|member
  const q = searchParams.get("q");

  let query = supabaseAdmin
    .from("members")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (role) query = query.eq("role", role);
  if (q) query = query.ilike("name", `%${q}%`);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, data });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const role = String(body?.role ?? "").trim();

    if (!name) return NextResponse.json({ ok: false, message: "name is required" }, { status: 400 });
    if (!["founder", "leader", "member"].includes(role))
      return NextResponse.json({ ok: false, message: "role must be founder/leader/member" }, { status: 400 });

    const payload = {
      name,
      role,
      facebook_url: body?.facebook_url ? String(body.facebook_url).trim() : null,
      avatar_url: body?.avatar_url ? String(body.avatar_url).trim() : null,
      sort_order: Number.isFinite(Number(body?.sort_order)) ? Number(body.sort_order) : 0,
      is_active: true,
    };

    const { data, error } = await supabaseAdmin.from("members").insert([payload]).select("*").single();

    if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message ?? "Bad Request" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, message: "id is required" }, { status: 400 });

  const { error } = await supabaseAdmin.from("members").update({ is_active: false }).eq("id", id);

  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}