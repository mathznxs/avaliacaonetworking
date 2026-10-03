import { type NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  console.log("[v0] Starting registration API call")

  try {
    const body = await request.json()
    console.log("[v0] Request body received:", { ...body, email: body.email ? "***@***.***" : undefined })

    const { nomeCompleto, email, telefone, escola, dia, oficina, oficinaOption } = body

    // Validate required fields
    if (!nomeCompleto || !email || !telefone || !escola || !dia || !oficina) {
      console.log("[v0] Validation failed - missing fields")
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    console.log("[v0] Creating Supabase client")
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[v0] Missing environment variables:", {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      })
      return NextResponse.json({ error: "Configuração do servidor incorreta" }, { status: 500 })
    }

    const supabase = createServiceClient()

    console.log("[v0] Checking for existing registration")
    let existingQuery = supabase
      .from("registrations")
      .select("id")
      .eq("email", email)
      .eq("dia", dia)
      .eq("oficina", oficina)

    if (oficinaOption) {
      existingQuery = existingQuery.eq("oficina_option", oficinaOption)
    } else {
      existingQuery = existingQuery.is("oficina_option", null)
    }

    const { data: existingRegistration, error: checkError } = await existingQuery.single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("[v0] Error checking existing registration:", checkError)
      return NextResponse.json({ error: "Erro ao verificar inscrição existente" }, { status: 500 })
    }

    if (existingRegistration) {
      console.log("[v0] Registration already exists")
      return NextResponse.json(
        {
          error: "Este email já está inscrito nesta atividade para este dia.",
        },
        { status: 409 },
      )
    }

    console.log("[v0] Checking workshop capacity")
    const dayKey = dia.split(" - ")[0]
    const workshopName = oficina

    const { data: limitData, error: limitError } = await supabase
      .from("workshop_limits")
      .select("max_capacity, current_registrations")
      .eq("workshop_name", workshopName)
      .eq("day", dayKey)
      .eq("workshop_option", oficinaOption || null)
      .eq("is_active", true)
      .single()

    if (limitError && limitError.code !== "PGRST116") {
      console.error("[v0] Error checking workshop limits:", limitError)
      return NextResponse.json({ error: "Erro ao verificar capacidade da oficina" }, { status: 500 })
    }

    if (limitData && limitData.current_registrations >= limitData.max_capacity) {
      console.log("[v0] Workshop capacity reached")
      return NextResponse.json(
        {
          error: "Esta oficina já atingiu o limite de vagas para este dia.",
        },
        { status: 409 },
      )
    }

    console.log("[v0] Inserting new registration")
    const insertData: any = {
      nome_completo: nomeCompleto,
      email,
      telefone,
      escola,
      dia,
      oficina,
    }

    if (oficinaOption) {
      insertData.oficina_option = oficinaOption
    }

    // Insert registration
    const { data, error } = await supabase.from("registrations").insert(insertData).select().single()

    if (error) {
      console.error("[v0] Supabase insert error:", error)
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error: "Este email já está inscrito. Cada email pode se inscrever apenas uma vez por atividade.",
          },
          { status: 409 },
        )
      }
      return NextResponse.json({ error: "Erro ao salvar inscrição" }, { status: 500 })
    }

    if (limitData) {
      const { error: updateError } = await supabase
        .from("workshop_limits")
        .update({
          current_registrations: limitData.current_registrations + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("workshop_name", workshopName)
        .eq("day", dayKey)
        .eq("workshop_option", oficinaOption || null)

      if (updateError) {
        console.error("[v0] Error updating workshop limits counter:", updateError)
        // Don't fail the registration, just log the error
      }
    }

    console.log("[v0] Registration successful:", data?.id)
    return NextResponse.json({
      success: true,
      id: data.id,
      message: "Inscrição realizada com sucesso!",
    })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient()

    // Get all registrations
    const { data, error } = await supabase.from("registrations").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Erro ao buscar inscrições" }, { status: 500 })
    }

    return NextResponse.json({ registrations: data })
  } catch (error) {
    console.error("Get registrations error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID da inscrição é obrigatório" }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data: registrationData, error: fetchError } = await supabase
      .from("registrations")
      .select("oficina, oficina_option, dia")
      .eq("id", id)
      .single()

    if (fetchError) {
      console.error("Error fetching registration:", fetchError)
      return NextResponse.json({ error: "Inscrição não encontrada" }, { status: 404 })
    }

    // Delete registration
    const { error } = await supabase.from("registrations").delete().eq("id", id)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Erro ao excluir inscrição" }, { status: 500 })
    }

    const dayKey = registrationData.dia.split(" - ")[0]
    const workshopName = registrationData.oficina

    // Get current count first
    const { data: currentLimit, error: getLimitError } = await supabase
      .from("workshop_limits")
      .select("current_registrations")
      .eq("workshop_name", workshopName)
      .eq("day", dayKey)
      .eq("workshop_option", registrationData.oficina_option || null)
      .single()

    if (!getLimitError && currentLimit) {
      // Update with decremented value
      const { error: updateError } = await supabase
        .from("workshop_limits")
        .update({
          current_registrations: Math.max(0, currentLimit.current_registrations - 1),
          updated_at: new Date().toISOString(),
        })
        .eq("workshop_name", workshopName)
        .eq("day", dayKey)
        .eq("workshop_option", registrationData.oficina_option || null)

      if (updateError) {
        console.error("Error updating workshop limits counter:", updateError)
        // Don't fail the deletion, just log the error
      }
    }

    return NextResponse.json({
      success: true,
      message: "Inscrição excluída com sucesso!",
    })
  } catch (error) {
    console.error("Delete registration error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
