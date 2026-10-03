import { NextResponse } from "next/server"
import { createAuthorizedClient } from "@/lib/supabase/server"

async function isAdmin(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (!token) return false
  const { data, error } = await createAuthorizedClient().auth.getUser(token)
  return !error && data.user?.app_metadata?.role === "admin"
}

export async function GET(request: Request) {
  if (!(await isAdmin(request))) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  const { data, error } = await createAuthorizedClient(token).from("company_reviews").select("id,company_id,reviewer_name,comment,rating,reaction,created_at").order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: "Não foi possível carregar os comentários." }, { status: 500 })
  return NextResponse.json({ reviews: data ?? [] }, { headers: { "Cache-Control": "no-store" } })
}

export async function DELETE(request: Request) {
  if (!(await isAdmin(request))) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  const id = new URL(request.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Comentário inválido." }, { status: 400 })
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  const { error } = await createAuthorizedClient(token).from("company_reviews").delete().eq("id", id)
  if (error) return NextResponse.json({ error: "Não foi possível excluir." }, { status: 500 })
  return NextResponse.json({ ok: true })
}
