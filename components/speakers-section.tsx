import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AwardIcon, BuildingIcon, CalendarDaysIcon, ClockIcon, MapPinIcon, WalletCardsIcon } from "lucide-react"

export function SpeakersSection() {
  return (
    <section id="palestras" className="py-20 px-4 bg-muted/35">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Palestra confirmada</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-primary">Educação Financeira na Escola</h2>
          <p className="mt-4 text-lg text-muted-foreground">Conhecimento para transformar escolhas em possibilidades.</p>
        </div>

        <Card className="overflow-hidden border-primary/15 shadow-xl">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-[0.8fr_1.4fr]">
              <div className="flex min-h-80 flex-col items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent p-10 text-center text-white">
                <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/35 bg-white/15 text-4xl font-bold shadow-xl">EM</div>
                <Badge className="mb-4 bg-white text-primary hover:bg-white">Palestrante</Badge>
                <h3 className="text-3xl font-bold">Evandro Mello</h3>
                <p className="mt-2 text-white/85">CEO e fundador da Multiplicando Sonhos</p>
              </div>

              <div className="p-6 md:p-10">
                <div className="mb-7 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-3">
                    <CalendarDaysIcon className="mt-0.5 h-5 w-5 text-primary" />
                    <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Data</p><p className="font-semibold">29 de setembro de 2026</p></div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-3">
                    <ClockIcon className="mt-0.5 h-5 w-5 text-primary" />
                    <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Horário</p><p className="font-semibold">10h</p></div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-3 sm:col-span-2">
                    <MapPinIcon className="mt-0.5 h-5 w-5 text-primary" />
                    <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Local</p><p className="font-semibold">E.E. Professora Zuleika de Barros Martins Ferreira</p><p className="text-sm text-muted-foreground">Rua Padre Chico, 420 - Pompeia, São Paulo - SP</p></div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-primary"><AwardIcon className="h-5 w-5" /> Mini bio</h4>
                    <p className="leading-relaxed text-muted-foreground">
                      Evandro Mello é CEO e fundador da Multiplicando Sonhos, associação sem fins lucrativos que transforma a vida de jovens de escolas públicas por meio da Educação Financeira. Estudou em escola pública, é graduando em Administração com ênfase em Comércio Exterior pela Universidade Presbiteriana Mackenzie e estuda Psicologia Econômica e Tomada de Decisão.
                    </p>
                    <p className="mt-3 leading-relaxed text-muted-foreground">
                      É colunista do E-Investidor, do jornal Estadão, e idealizador da CNEF - Corrida Nacional de Educação Financeira. Seu propósito é criar pontes entre o conhecimento e as pessoas para que possam realizar sonhos.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary"><BuildingIcon className="mr-1 h-3.5 w-3.5" /> Multiplicando Sonhos</Badge>
                    <Badge variant="outline"><WalletCardsIcon className="mr-1 h-3.5 w-3.5" /> Educação Financeira</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
