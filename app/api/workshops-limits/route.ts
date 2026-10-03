import { type NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServiceClient()

    const { data: limits, error } = await supabase
      .from("workshop_limits")
      .select("*")
      .eq("is_active", true)
      .order("workshop_name", { ascending: true })
      .order("day", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching workshop limits:", error)
      throw error
    }

    return NextResponse.json(limits)
  } catch (error: any) {
    console.error("[v0] Workshop limits API error:", error)
    return NextResponse.json({ error: "Erro ao buscar limites das oficinas" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, max_capacity } = await request.json()

    if (!id || max_capacity === undefined) {
      return NextResponse.json({ error: "ID e capacidade máxima são obrigatórios" }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from("workshop_limits")
      .update({
        max_capacity: Number.parseInt(max_capacity),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("[v0] Error updating workshop limit:", error)
      return NextResponse.json({ error: "Erro ao atualizar limite da oficina" }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Oficina não encontrada" }, { status: 404 })
    }

    return NextResponse.json(data[0])
  } catch (error: any) {
    console.error("[v0] Workshop limits update API error:", error)
    return NextResponse.json({ error: "Erro ao atualizar limite da oficina" }, { status: 500 })
  }
}
