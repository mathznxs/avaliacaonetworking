import { Card, CardContent } from "@/components/ui/card"
import { Building2Icon, CalendarDaysIcon, SchoolIcon } from "lucide-react"

export function AboutSection() {
  return (
    <section id="sobre" className="py-20 px-4 bg-muted/50">
      <div className="max-w-4xl mx-auto text-center fade-in">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-balance text-primary">Sobre o Evento</h2>
        <p className="text-lg text-muted-foreground mb-8 text-pretty leading-relaxed">
          A Feira de Empreendedorismo e Networking transforma a escola em um espaço de criação, apresentação e troca.
          Estudantes das turmas 2C, 2D, 3C e 3D desenvolvem empresas, compartilham suas propostas com a comunidade e
          exercitam colaboração, comunicação e visão de futuro.
        </p>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-primary/20">
              <CardContent className="pt-6 text-center">
                <Building2Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">17 empresas</h3>
                <p className="text-muted-foreground">Projetos criados pelos estudantes</p>
              </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-secondary/20">
              <CardContent className="pt-6 text-center">
                <SchoolIcon className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">4 turmas</h3>
                <p className="text-muted-foreground">2C, 2D, 3C e 3D</p>
              </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-accent/20">
              <CardContent className="pt-6 text-center">
                <CalendarDaysIcon className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">3 dias</h3>
                <p className="text-muted-foreground">28, 29 e 30 de setembro</p>
              </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
