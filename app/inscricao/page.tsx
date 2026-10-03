"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import InputMask from "react-input-mask"
import { useToast } from "@/hooks/use-toast"
import { AlertCircleIcon, ArrowLeftIcon, InstagramIcon, Loader2Icon, MailIcon, PhoneIcon } from "lucide-react"

export default function InscricaoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCustomSchool, setShowCustomSchool] = useState(false)
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    telefone: "",
    escola: "",
    dia: "",
    oficina: "",
    oficinaOption: "",
  })

  const router = useRouter()
  const { toast } = useToast()

  const atividades = [
    { titulo: "Visitação à Feira de Empreendedorismo e Networking 2026", descricao: "Conheça as empresas estudantis do dia escolhido" },
    { titulo: "Educação Financeira na Escola", descricao: "Palestra com Evandro Mello - 29/09, às 10h" },
  ]

  const escolas = ["E.E. Profª Zuleika de Barros Martins Ferreira", "Outro"]
  const dias = ["Dia 1 - 28/09/2026", "Dia 2 - 29/09/2026", "Dia 3 - 30/09/2026"]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao processar inscrição")
      }

      const result = await response.json()

      toast({
        title: "Inscrição realizada com sucesso!",
        description: "Sua participação foi registrada.",
      })

      router.push(`/confirmacao?id=${result.id}`)
    } catch (error: any) {
      toast({
        title: "Erro na inscrição",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSchoolChange = (value: string) => {
    if (value === "Outro") {
      setShowCustomSchool(true)
      setFormData((prev) => ({ ...prev, escola: "" }))
    } else {
      setShowCustomSchool(false)
      setFormData((prev) => ({ ...prev, escola: value }))
    }
  }

  const handleWorkshopChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      oficina: value,
      oficinaOption: "",
      dia: value === "Educação Financeira na Escola" ? "Dia 2 - 29/09/2026" : prev.dia,
    }))
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 text-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded-md px-2 py-1"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Voltar ao site
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primary leading-tight">
            Inscrição para a Feira 2026
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Escolha a data e a atividade que deseja acompanhar entre 28 e 30 de setembro.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-2">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl md:text-3xl text-primary flex items-center gap-3">
                  <AlertCircleIcon className="w-6 h-6" />
                  Dados da Inscrição
                </CardTitle>
                <p className="text-muted-foreground text-base">Todos os campos marcados com * são obrigatórios</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <Label
                      htmlFor="nomeCompleto"
                      className="text-base font-semibold text-foreground flex items-center gap-2"
                    >
                      Nome Completo *
                    </Label>
                    <Input
                      id="nomeCompleto"
                      type="text"
                      placeholder="Digite seu nome completo"
                      required
                      value={formData.nomeCompleto}
                      onChange={(e) => handleInputChange("nomeCompleto", e.target.value)}
                      className="h-12 text-base border-2 focus:border-primary transition-colors"
                      disabled={isSubmitting}
                      aria-describedby="nome-help"
                    />
                    <p id="nome-help" className="text-sm text-muted-foreground">
                      Informe seu nome completo como aparece nos documentos
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-semibold text-foreground flex items-center gap-2">
                      <MailIcon className="w-4 h-4" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu.email@exemplo.com"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="h-12 text-base border-2 focus:border-primary transition-colors"
                      disabled={isSubmitting}
                      aria-describedby="email-help"
                    />
                    <p id="email-help" className="text-sm text-muted-foreground">
                      Utilizaremos este email para enviar confirmações e informações importantes
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="telefone"
                      className="text-base font-semibold text-foreground flex items-center gap-2"
                    >
                      <PhoneIcon className="w-4 h-4" />
                      Telefone *
                    </Label>
                    <InputMask
                      mask="(99) 99999-9999"
                      value={formData.telefone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("telefone", e.target.value)
                      }
                      disabled={isSubmitting}
                    >
                      {(inputProps: any) => (
                        <Input
                          {...inputProps}
                          id="telefone"
                          type="tel"
                          placeholder="(11) 99999-9999"
                          required
                          className="h-12 text-base border-2 focus:border-primary transition-colors"
                          aria-describedby="telefone-help"
                        />
                      )}
                    </InputMask>
                    <p id="telefone-help" className="text-sm text-muted-foreground">
                      Número para contato em caso de necessidade
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="escola" className="text-base font-semibold text-foreground">
                      Escola *
                    </Label>
                    <Select onValueChange={handleSchoolChange} disabled={isSubmitting}>
                      <SelectTrigger className="h-12 text-base" aria-describedby="escola-help">
                        <SelectValue placeholder="Selecione sua escola ou instituição" />
                      </SelectTrigger>
                      <SelectContent>
                        {escolas.map((escola) => (
                          <SelectItem key={escola} value={escola} className="text-base py-3">
                            {escola}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p id="escola-help" className="text-sm text-muted-foreground">
                      Selecione sua instituição de ensino
                    </p>

                    {showCustomSchool && (
                      <div className="mt-3">
                        <Input
                          id="escolaCustom"
                          type="text"
                          value={formData.escola}
                          onChange={(e) => handleInputChange("escola", e.target.value)}
                          required
                          placeholder="Digite o nome da sua escola ou instituição"
                          className="h-12 text-base border-2 focus:border-primary transition-colors"
                          disabled={isSubmitting}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="dia" className="text-base font-semibold text-foreground">
                      Escolha um dos dias para a visita *
                    </Label>
                    <Select required value={formData.dia} onValueChange={(value) => handleInputChange("dia", value)} disabled={isSubmitting}>
                      <SelectTrigger className="h-12 text-base" aria-describedby="dia-help">
                        <SelectValue placeholder="Selecione um dos dias" />
                      </SelectTrigger>
                      <SelectContent>
                        {dias.map((dia, index) => (
                          <SelectItem key={index} value={dia} className="text-base py-3" disabled={formData.oficina === "Educação Financeira na Escola" && index !== 1}>
                            {dia}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p id="dia-help" className="text-sm text-muted-foreground">
                      Escolha o dia que melhor se adequa à sua agenda
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="oficina" className="text-base font-semibold text-foreground">
                      Qual atividade deseja acompanhar? *
                    </Label>
                    <Select required value={formData.oficina} onValueChange={handleWorkshopChange} disabled={isSubmitting}>
                      <SelectTrigger className="h-12 text-base" aria-describedby="oficina-help">
                        <SelectValue placeholder="Selecione uma atividade" />
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        {atividades.map((atividade, index) => (
                          <SelectItem key={index} value={atividade.titulo} className="py-4">
                            <div className="flex flex-col gap-1 text-left w-full">
                              <span className="font-medium text-base leading-tight">{atividade.titulo}</span>
                              {atividade.descricao && (
                                <span className="text-sm text-muted-foreground leading-relaxed">
                                  {atividade.descricao}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p id="oficina-help" className="text-sm text-muted-foreground">
                      Selecione a visitação ou a palestra de seu interesse
                    </p>
                  </div>

                  <div className="pt-6">
                    <Button
                      type="submit"
                      className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                      disabled={
                        isSubmitting ||
                        !formData.nomeCompleto ||
                        !formData.email ||
                        !formData.telefone ||
                        !formData.escola ||
                        !formData.dia ||
                        !formData.oficina
                      }
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2Icon className="w-5 h-5 mr-3 animate-spin" />
                          Enviando inscrição...
                        </>
                      ) : (
                        "Confirmar Inscrição"
                      )}
                    </Button>

                    <p className="text-sm text-muted-foreground text-center mt-4 leading-relaxed">
                      Ao se inscrever, você concorda com nossos termos de uso e política de privacidade.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg border-2 border-accent/20 bg-accent/5">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center gap-2">
                  <AlertCircleIcon className="w-5 h-5" />
                  Informações Importantes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border/50">
                  <div className="w-3 h-3 rounded-full bg-green-500 mt-1 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-base mb-2">Três dias de evento</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A feira acontece em 28, 29 e 30 de setembro de 2026.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border/50">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-base mb-2">Email Único</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Cada email pode se inscrever uma vez por atividade e dia.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border/50">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mt-1 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-base mb-2">Palestra especial</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Evandro Mello fala sobre Educação Financeira em 29 de setembro, às 10h.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-primary text-primary-foreground border-2 border-primary">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <PhoneIcon className="w-5 h-5" />
                  Precisa de Ajuda?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-6 opacity-90 leading-relaxed">
                  Entre em contato conosco se tiver dúvidas sobre a inscrição.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm p-3 bg-primary-foreground/10 rounded-lg">
                    <InstagramIcon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">@zuleika_oficial</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm p-3 bg-primary-foreground/10 rounded-lg">
                    <PhoneIcon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">Telefone: (11) 3673-2765</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
