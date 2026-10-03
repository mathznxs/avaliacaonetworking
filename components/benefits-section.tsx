import { Card, CardContent } from "@/components/ui/card"
import { Building2Icon, LightbulbIcon, NetworkIcon, WalletCardsIcon } from "lucide-react"

export function BenefitsSection() {
  return (
    <section className="py-20 px-4 bg-primary/5">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance text-primary">
          Uma feira feita para aprender fazendo
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="transition-all duration-300 text-center">
            <CardContent className="pt-6">
              <NetworkIcon className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Conexões</h3>
              <p className="text-sm text-muted-foreground">Ideias, pessoas e projetos reunidos no mesmo espaço</p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 text-center">
            <CardContent className="pt-6">
              <Building2Icon className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Empresas estudantis</h3>
              <p className="text-sm text-muted-foreground">17 propostas desenvolvidas por quatro turmas</p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 text-center">
            <CardContent className="pt-6">
              <LightbulbIcon className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Protagonismo</h3>
              <p className="text-sm text-muted-foreground">Experiência prática em criação e apresentação</p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 text-center">
            <CardContent className="pt-6">
              <WalletCardsIcon className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Educação financeira</h3>
              <p className="text-sm text-muted-foreground">Palestra especial com Evandro Mello</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
