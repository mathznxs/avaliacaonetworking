import { NextResponse } from "next/server"
import { companyIds, companies } from "@/lib/companies"
import { allowedReactionEmojis } from "@/lib/reactions"
import { createAuthorizedClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

type ReviewRow = { company_id: string; rating: number; reaction: string | null; votes: number }

function summarize(rows: ReviewRow[]) {
  const buckets = new Map<string, { total: number; count: number; reactions: Record<string, number> }>()
  for (const company of companies) buckets.set(company.id, { total: 0, count: 0, reactions: {} })
  for (const row of rows) {
    const bucket = buckets.get(row.company_id)
    if (!bucket) continue
    const votes = Number(row.votes)
    bucket.total += row.rating * votes
    bucket.count += votes
    if (row.reaction) bucket.reactions[row.reaction] = (bucket.reactions[row.reaction] ?? 0) + votes
  }
  return Array.from(buckets, ([companyId, value]) => ({ companyId, count: value.count, average: value.count ? Number((value.total / value.count).toFixed(2)) : 0, reactions: value.reactions }))
}

export async function GET() {
  const { data, error } = await createAuthorizedClient().rpc("get_company_review_totals")
  if (error) {
    console.error("[reviews:get] Supabase RPC failed", { code: error.code, message: error.message })
    return NextResponse.json({ error: "Não foi possível carregar os resultados." }, { status: 500 })
  }
  return NextResponse.json({ summaries: summarize((data ?? []) as ReviewRow[]) }, { headers: { "Cache-Control": "no-store" } })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { companyId?: string; name?: string; comment?: string; rating?: number; reaction?: string | null } | null
  const companyId = body?.companyId?.trim() ?? ""
  const name = body?.name?.trim() ?? ""
  const comment = body?.comment?.trim() ?? ""
  const rating = Number(body?.rating)
  const reaction = body?.reaction || null
  if (!companyIds.has(companyId) || name.length < 2 || name.length > 80 || comment.length < 3 || comment.length > 1000 || !Number.isInteger(rating) || rating < 1 || rating > 5 || (reaction && !allowedReactionEmojis.has(reaction))) {
    return NextResponse.json({ error: "Confira os dados da avaliação." }, { status: 400 })
  }
  const { error } = await createAuthorizedClient().from("company_reviews").insert({ company_id: companyId, reviewer_name: name, comment, rating, reaction })
  if (error) {
    console.error("[reviews:post] Supabase insert failed", { companyId, code: error.code, message: error.message })
    return NextResponse.json({ error: "Não foi possível salvar a avaliação." }, { status: 500 })
  }
  return NextResponse.json({ ok: true }, { status: 201 })
}
