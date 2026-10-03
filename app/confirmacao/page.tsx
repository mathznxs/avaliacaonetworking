import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarIcon, CheckCircle2Icon, ClockIcon, MapPinIcon } from "lucide-react"

export default function ConfirmacaoPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CheckCircle2Icon className="h-16 w-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl md:text-3xl">Inscrição Confirmada!</CardTitle>
            <CardDescription className="text-lg">Parabéns! Sua inscrição foi realizada com sucesso.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary/5 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Detalhes do Evento:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <span>28 a 30 de setembro de 2026</span>
                </div>
                <div className="flex items-center gap-3">
                  <ClockIcon className="h-5 w-5 text-primary" />
                  <span>Consulte a programação da atividade escolhida</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPinIcon className="h-5 w-5 text-primary" />
                  <span>E.E. Profa. Zuleika de Barros Martins Ferreira</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border-b-emerald-800 p-4 rounded-lg">
              <h4 className="font-semibold text-green-600">Importante:</h4>
              <ul className="text-sm text-emerald-500 space-y-1">
                <li>• A feira acontece em 28, 29 e 30 de setembro</li>
                <li>• A palestra de Evandro Mello será no dia 29, às 10h</li>
                <li>• Cada email pode se inscrever uma vez por atividade e dia</li>
              </ul>
            </div>

            <div className="text-center space-y-4">
              <p className="text-muted-foreground">Sua inscrição foi registrada. Guarde as informações da atividade escolhida.</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/">Voltar ao Início</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/inscricao">Nova Inscrição</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
