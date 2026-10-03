"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react"

export function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const scrollToEmpresas = () => {
    const section = document.getElementById("empresas")
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    const eventDate = new Date("2026-09-28T08:00:00-03:00").getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = eventDate - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <Badge className="mb-6 text-sm px-4 py-2 bg-primary text-primary-foreground border-0">EDIÇÃO 2026</Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          1ª Feira de Empreendedorismo e Networking
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-4 text-balance">
          E.E. Profa. Zuleika de Barros Martins Ferreira
        </p>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
          Ideias que saem da sala de aula para ganhar forma, público e propósito. Conheça as 17 empresas criadas pelos
          estudantes e participe de três dias de conexões e aprendizado.
        </p>

        <div className="mb-8 p-6 bg-white/50 backdrop-blur-sm rounded-lg border border-primary/20 max-w-2xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold text-primary">Data</p>
                <p className="text-sm text-muted-foreground">28, 29 e 30 de setembro</p>
                <p className="text-xs text-muted-foreground">2026</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ClockIcon className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold text-primary">Horário</p>
                <p className="text-sm text-muted-foreground">Programação escolar</p>
                <p className="text-xs text-muted-foreground">Palestra dia 29, às 10h</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MapPinIcon className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold text-primary">Local</p>
                <p className="text-sm text-muted-foreground">Rua Padre Chico, 420</p>
                <p className="text-xs text-muted-foreground">Pompeia - São Paulo</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-4">Faltam apenas:</p>
          <div className="flex justify-center gap-4 mb-8">
            <div className="countdown-digit">
              <div className="text-2xl font-bold">{timeLeft.days}</div>
              <div className="text-xs opacity-90 font-medium">DIAS</div>
            </div>
            <div className="countdown-digit">
              <div className="text-2xl font-bold">{timeLeft.hours}</div>
              <div className="text-xs opacity-90 font-medium">HORAS</div>
            </div>
            <div className="countdown-digit">
              <div className="text-2xl font-bold">{timeLeft.minutes}</div>
              <div className="text-xs opacity-90 font-medium">MIN</div>
            </div>
            <div className="countdown-digit">
              <div className="text-2xl font-bold">{timeLeft.seconds}</div>
              <div className="text-xs opacity-90 font-medium">SEG</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/inscricao">
            <Button size="lg" className="text-lg px-8 py-6 transition-all duration-300 hover:scale-105">
              Inscreva-se
            </Button>
          </Link>
          <Link href="#empresas">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 transition-all duration-300 hover:scale-105 bg-transparent"
              onClick={scrollToEmpresas}
            >
              Conheça as empresas
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
