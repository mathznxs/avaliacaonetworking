import { createServiceClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest) {
  try {
    const { id, presente } = await request.json()

    if (!id || typeof presente !== "boolean") {
      return NextResponse.json({ error: "ID e status de presença são obrigatórios" }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data, error } = await supabase.from("registrations").update({ presente }).eq("id", id).select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Erro ao atualizar presença" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      registration: data[0],
    })
  } catch (error) {
    console.error("Error updating attendance:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
