"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  AwardIcon,
  BarChart3Icon,
  CalendarIcon,
  CheckSquare2Icon,
  CheckSquareIcon,
  ClockIcon,
  MailIcon,
  PhoneIcon,
  PrinterIcon,
  SaveIcon,
  SchoolIcon,
  SettingsIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react"

interface Registration {
  id: string
  nome_completo: string
  email: string
  telefone?: string
  escola: string
  dia: string
  oficina: string
  oficina_option?: string
  presente?: boolean | null
  created_at: string
}

interface WorkshopLimit {
  id: string
  workshop_name: string
  workshop_option: string | null
  day: string
  max_capacity: number
  current_registrations: number
  is_active: boolean
}

export function RegistrationsDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [workshopLimits, setWorkshopLimits] = useState<WorkshopLimit[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [updatingAttendance, setUpdatingAttendance] = useState<string | null>(null)
  const [updatingLimits, setUpdatingLimits] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchRegistrations()
    fetchWorkshopLimits()
  }, [])

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/registrations")
      const data = await response.json()
      setRegistrations(data.registrations || [])
    } catch (error) {
      console.error("Error fetching registrations:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWorkshopLimits = async () => {
    try {
      const response = await fetch("/api/workshops-limits")
      if (response.ok) {
        const limits = await response.json()
        setWorkshopLimits(limits)
      }
    } catch (error) {
      console.error("Error fetching workshop limits:", error)
    }
  }

  const updateWorkshopLimit = async (id: string, maxCapacity: number) => {
    setUpdatingLimits(id)
    try {
      const response = await fetch("/api/workshops-limits", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, max_capacity: maxCapacity }),
      })

      if (response.ok) {
        const updatedLimit = await response.json()
        setWorkshopLimits((prev) =>
          prev.map((limit) => (limit.id === id ? { ...limit, max_capacity: maxCapacity } : limit)),
        )
        toast({
          title: "Limite atualizado",
          description: "O limite de vagas foi atualizado com sucesso.",
        })
      } else {
        throw new Error("Erro ao atualizar limite")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o limite de vagas.",
        variant: "destructive",
      })
    } finally {
      setUpdatingLimits(null)
    }
  }

  const deleteRegistration = async (id: string) => {
    setDeleting(id)
    try {
      const response = await fetch(`/api/registrations?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setRegistrations((prev) => prev.filter((reg) => reg.id !== id))
        // Refresh workshop limits to update current registrations count
        fetchWorkshopLimits()
      } else {
        console.error("Error deleting registration")
      }
    } catch (error) {
      console.error("Error deleting registration:", error)
    } finally {
      setDeleting(null)
    }
  }

  const updateAttendance = async (id: string, presente: boolean) => {
    setUpdatingAttendance(id)
    try {
      const response = await fetch("/api/registrations/attendance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, presente }),
      })

      if (response.ok) {
        setRegistrations((prev) => prev.map((reg) => (reg.id === id ? { ...reg, presente } : reg)))
      } else {
        console.error("Error updating attendance")
      }
    } catch (error) {
      console.error("Error updating attendance:", error)
    } finally {
      setUpdatingAttendance(null)
    }
  }

  const printRegistrations = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const registrationsByDay = registrations.reduce(
      (acc, reg) => {
        const day = reg.dia || "Sem dia definido"
        if (!acc[day]) {
          acc[day] = []
        }
        acc[day].push(reg)
        return acc
      },
      {} as Record<string, Registration[]>,
    )

    const sortedDays = Object.keys(registrationsByDay).sort((a, b) => {
      if (a.includes("Dia 1")) return -1
      if (b.includes("Dia 1")) return 1
      if (a.includes("Dia 2")) return -1
      if (b.includes("Dia 2")) return 1
      if (a.includes("Dia 3")) return -1
      if (b.includes("Dia 3")) return 1
      return a.localeCompare(b)
    })

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lista de Inscrições - Feira de Empreendedorismo 2026</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; margin-bottom: 10px; }
            h2 { color: #333; text-align: center; margin-bottom: 30px; }
            .day-section { margin-bottom: 40px; page-break-inside: avoid; }
            .day-header { 
              background-color: #f8f9fa; 
              padding: 15px; 
              border-left: 4px solid #007bff; 
              margin-bottom: 20px;
              border-radius: 4px;
            }
            .day-title { 
              font-size: 20px; 
              font-weight: bold; 
              color: #007bff; 
              margin: 0;
            }
            .day-count { 
              font-size: 14px; 
              color: #666; 
              margin: 5px 0 0 0;
            }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 11px; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { text-align: center; margin-bottom: 30px; }
            .stats { margin-bottom: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 4px; }
            .checkbox { width: 20px; height: 20px; border: 2px solid #333; display: inline-block; }
            @media print { 
              body { margin: 0; } 
              .day-section { page-break-after: auto; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Lista de Inscrições - Folha de Chamada</h1>
            <h2>1ª Feira de Empreendedorismo e Networking</h2>
            <p><strong>Data do Evento:</strong> 28/09/2026 - 30/09/2026</p>
          </div>
          
          <div class="stats">
            <p><strong>Total Geral de Inscrições:</strong> ${registrations.length}</p>
            <p><strong>Data de Impressão:</strong> ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}</p>
          </div>

          ${sortedDays
            .map((day) => {
              const dayRegistrations = registrationsByDay[day]
              return `
              <div class="day-section">
                <div class="day-header">
                  <h3 class="day-title">${day}</h3>
                  <p class="day-count">${dayRegistrations.length} inscrições confirmadas</p>
                </div>
                
                <table>
                  <thead>
                    <tr>
                      <th style="width: 18%;">Nome Completo</th>
                      <th style="width: 16%;">Email</th>
                      <th style="width: 12%;">Telefone</th>
                      <th style="width: 16%;">Escola</th>
                      <th style="width: 18%;">Atividade</th>
                      <th style="width: 12%;">Opção</th>
                      <th style="width: 8%;">Presente</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${dayRegistrations
                      .sort((a, b) => a.nome_completo.localeCompare(b.nome_completo))
                      .map(
                        (reg, index) => `
                        <tr>
                          <td>${reg.nome_completo}</td>
                          <td>${reg.email}</td>
                          <td>${reg.telefone || "N/A"}</td>
                          <td>${reg.escola}</td>
                          <td>${reg.oficina}</td>
                          <td>${reg.oficina_option || "N/A"}</td>
                          <td>${reg.presente === true ? "✓" : reg.presente === false ? "✗" : "N/A"}</td>
                        </tr>
                      `,
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
            `
            })
            .join("")}
          
          <div style="margin-top: 40px; padding: 20px; border-top: 2px solid #ddd;">
            <p><strong>Instruções:</strong></p>
            <ul>
              <li>Marque um ✓ na coluna "Presente" para cada participante que comparecer</li>
              <li>Esta lista está organizada por dia do evento para facilitar o controle</li>
              <li>Os nomes estão em ordem alfabética dentro de cada dia</li>
              <li>Mantenha esta folha para controle de presença durante o evento</li>
            </ul>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  const getOficinaStats = () => {
    const stats: Record<string, number> = {}
    registrations.forEach((reg) => {
      const key = reg.oficina_option ? `${reg.oficina} - ${reg.oficina_option}` : reg.oficina
      stats[key] = (stats[key] || 0) + 1
    })
    return Object.entries(stats).sort(([, a], [, b]) => b - a)
  }

  const getEscolaStats = () => {
    const stats: Record<string, number> = {}
    registrations.forEach((reg) => {
      stats[reg.escola] = (stats[reg.escola] || 0) + 1
    })
    return Object.entries(stats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
  }

  const getDayStats = () => {
    const stats: Record<string, number> = {}
    registrations.forEach((reg) => {
      if (reg.dia) {
        stats[reg.dia] = (stats[reg.dia] || 0) + 1
      }
    })
    return Object.entries(stats).sort(([, a], [, b]) => b - a)
  }

  const getAttendanceStats = () => {
    const present = registrations.filter((reg) => reg.presente === true).length
    const absent = registrations.filter((reg) => reg.presente === false).length
    const notRecorded = registrations.filter((reg) => reg.presente === null || reg.presente === undefined).length

    return { present, absent, notRecorded, total: registrations.length }
  }

  const getRegistrationsByDay = () => {
    const stats: Record<string, number> = {}
    registrations.forEach((reg) => {
      const date = new Date(reg.created_at).toLocaleDateString("pt-BR")
      stats[date] = (stats[date] || 0) + 1
    })
    return Object.entries(stats)
      .sort(
        ([a], [b]) =>
          new Date(a.split("/").reverse().join("-")).getTime() - new Date(b.split("/").reverse().join("-")).getTime(),
      )
      .slice(-7)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Carregando inscrições...</p>
      </div>
    )
  }

  const attendanceStats = getAttendanceStats()

  return (
    <div className="space-y-8 max-w-full overflow-hidden">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-emerald-800">Total de Inscrições</CardTitle>
            <UsersIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-3xl font-bold text-emerald-900">{registrations.length}</div>
            <p className="text-xs text-emerald-600 mt-1">Participantes confirmados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-blue-800">Atividades oferecidas</CardTitle>
            <AwardIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-3xl font-bold text-blue-900">{getOficinaStats().length}</div>
            <p className="text-xs text-blue-600 mt-1">Opções disponíveis</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-purple-800">Escolas Participantes</CardTitle>
            <SchoolIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-3xl font-bold text-purple-900">{getEscolaStats().length}</div>
            <p className="text-xs text-purple-600 mt-1">Instituições envolvidas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-orange-800">Presentes</CardTitle>
            <CheckSquareIcon className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-3xl font-bold text-orange-900">{attendanceStats.present}</div>
            <p className="text-xs text-orange-600 mt-1">de {attendanceStats.total} inscritos</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-6 min-w-[600px]">
            <TabsTrigger value="overview" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <BarChart3Icon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Visão Geral</span>
              <span className="sm:hidden">Geral</span>
            </TabsTrigger>
            <TabsTrigger value="workshops" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <AwardIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              Atividades
            </TabsTrigger>
            <TabsTrigger value="schools" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <SchoolIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              Escolas
            </TabsTrigger>
            <TabsTrigger value="limits" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <SettingsIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Limites</span>
              <span className="sm:hidden">Config</span>
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <CheckSquare2Icon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Presença</span>
              <span className="sm:hidden">Lista</span>
            </TabsTrigger>
            <TabsTrigger value="registrations" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <UsersIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Inscrições</span>
              <span className="sm:hidden">Todas</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="limits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Gerenciar Limites de Vagas</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Ajuste os limites de capacidade para cada atividade por dia. Atividades que atingirem o limite serão
                automaticamente desabilitadas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workshopLimits.map((limit) => (
                  <div
                    key={limit.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">
                          {limit.workshop_name}
                          {limit.workshop_option && ` - ${limit.workshop_option}`}
                        </p>
                        <p className="text-xs text-muted-foreground">{limit.day}</p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={limit.current_registrations >= limit.max_capacity ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {limit.current_registrations}/{limit.max_capacity} vagas
                          </Badge>
                          {limit.current_registrations >= limit.max_capacity && (
                            <Badge variant="destructive" className="text-xs">
                              Esgotado
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`limit-${limit.id}`} className="text-sm whitespace-nowrap">
                          Limite:
                        </Label>
                        <Input
                          id={`limit-${limit.id}`}
                          type="number"
                          min="1"
                          max="100"
                          value={limit.max_capacity}
                          onChange={(e) => {
                            const newCapacity = Number.parseInt(e.target.value)
                            if (newCapacity > 0) {
                              setWorkshopLimits((prev) =>
                                prev.map((l) => (l.id === limit.id ? { ...l, max_capacity: newCapacity } : l)),
                              )
                            }
                          }}
                          className="w-20 h-8 text-sm"
                          disabled={updatingLimits === limit.id}
                        />
                      </div>
                      <Button
                        size="sm"
                        onClick={() => updateWorkshopLimit(limit.id, limit.max_capacity)}
                        disabled={updatingLimits === limit.id}
                        className="flex items-center gap-1"
                      >
                        <SaveIcon className="h-3 w-3" />
                        <span className="hidden sm:inline">Salvar</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Registrations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  Inscrições por Dia
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Últimos 7 dias de atividade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getRegistrationsByDay().map(([date, count]) => (
                    <div key={date} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium text-sm">{date}</span>
                      <Badge variant="secondary" className="text-xs">
                        {count} inscrições
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Day Distribution Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  Distribuição por Dia do Evento
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Inscrições por dia do evento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getDayStats().map(([dia, count]) => (
                    <div key={dia} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium text-sm">{dia}</span>
                      <Badge variant="secondary" className="text-xs">
                        {count} inscrições
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workshops" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Distribuição por atividades</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Todas as atividades e número de inscrições</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getOficinaStats().map(([oficina, count]) => (
                  <div
                    key={oficina}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors min-w-0"
                  >
                    <span className="font-medium text-sm truncate pr-2 flex-1">{oficina}</span>
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      {count} inscrições
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Escolas Participantes</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Distribuição de inscrições por escola</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getEscolaStats().map(([escola, count]) => (
                  <div
                    key={escola}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors min-w-0"
                  >
                    <span className="font-medium text-sm truncate pr-2 flex-1">{escola}</span>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {count} inscrições
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button onClick={printRegistrations} className="flex items-center gap-2">
              <PrinterIcon className="h-4 w-4" />
              Imprimir Lista
            </Button>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Presentes: {attendanceStats.present}</span>
              <span>Ausentes: {attendanceStats.absent}</span>
              <span>Não registrado: {attendanceStats.notRecorded}</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Controle de Presença</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Marque os participantes presentes no evento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {registrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="space-y-2">
                        <p className="font-medium text-sm sm:text-base truncate">{registration.nome_completo}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1 min-w-0">
                            <MailIcon className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{registration.email}</span>
                          </div>
                          {registration.telefone && (
                            <div className="flex items-center gap-1 min-w-0">
                              <PhoneIcon className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{registration.telefone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 min-w-0">
                            <SchoolIcon className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{registration.escola}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {registration.dia}
                          </Badge>
                          <Badge className="text-xs">
                            {registration.oficina}
                            {registration.oficina_option && ` - ${registration.oficina_option}`}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`presente-${registration.id}`}
                          checked={registration.presente === true}
                          disabled={updatingAttendance === registration.id}
                          onCheckedChange={(checked) => updateAttendance(registration.id, checked as boolean)}
                        />
                        <label
                          htmlFor={`presente-${registration.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Presente
                        </label>
                      </div>
                      {registration.presente !== null && registration.presente !== undefined && (
                        <Badge variant={registration.presente ? "default" : "destructive"} className="text-xs">
                          {registration.presente ? "Presente" : "Ausente"}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Todas as Inscrições</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Lista completa com opção de exclusão para testes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {registrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="space-y-2">
                        <p className="font-medium text-sm sm:text-base truncate">{registration.nome_completo}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1 min-w-0">
                            <MailIcon className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{registration.email}</span>
                          </div>
                          {registration.telefone && (
                            <div className="flex items-center gap-1 min-w-0">
                              <PhoneIcon className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{registration.telefone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 min-w-0">
                            <SchoolIcon className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{registration.escola}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="text-left sm:text-right">
                        <div className="mb-1">
                          <Badge className="text-xs max-w-full truncate">
                            {registration.oficina}
                            {registration.oficina_option && ` - ${registration.oficina_option}`}
                            <span>   -   </span>              
                            {registration.dia}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(registration.created_at).toLocaleDateString("pt-BR")} às{" "}
                          {new Date(registration.created_at).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent flex-shrink-0"
                            disabled={deleting === registration.id}
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-sm sm:text-base">Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription className="text-xs sm:text-sm">
                              Tem certeza que deseja excluir a inscrição de{" "}
                              <strong className="break-words">{registration.nome_completo}</strong>? Esta ação não pode
                              ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                            <AlertDialogCancel className="text-xs sm:text-sm">Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteRegistration(registration.id)}
                              className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
