"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { BarChart3, CheckCircle2, MessageCircle, Search, ShieldCheck, Star } from "lucide-react"
import { companies, type Company } from "@/lib/companies"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Summary = { companyId: string; count: number; average: number; reactions: Record<string, number> }
const classOrder = ["2C", "2D", "3C", "3D"] as const
const reactionOptions = [
  { emoji: "👏", label: "Muito bem!", description: "Boa apresentação e trabalho bem feito." },
  { emoji: "💡", label: "Ideia criativa", description: "Uma proposta inteligente ou inovadora." },
  { emoji: "😍", label: "Encantou", description: "A empresa causou uma ótima impressão." },
  { emoji: "🚀", label: "Tem potencial", description: "A ideia pode crescer e ir ainda mais longe." },
  { emoji: "🔥", label: "Foi destaque", description: "A empresa chamou bastante atenção na feira." },
] as const

export function EvaluationSite() {
  const [selected, setSelected] = useState<Company | null>(null)
  const [summaries, setSummaries] = useState<Record<string, Summary>>({})
  const [query, setQuery] = useState("")
  const [day, setDay] = useState<number | "all">("all")

  const loadSummaries = useCallback(async () => {
    const response = await fetch("/api/reviews", { cache: "no-store" })
    if (!response.ok) return
    const data = (await response.json()) as { summaries: Summary[] }
    setSummaries(Object.fromEntries(data.summaries.map((item) => [item.companyId, item])))
  }, [])

  useEffect(() => {
    loadSummaries()
    const interval = window.setInterval(loadSummaries, 8000)
    return () => window.clearInterval(interval)
  }, [loadSummaries])

  const filtered = useMemo(() => companies.filter((company) => {
    const matchesQuery = `${company.name} ${company.category} ${company.className}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (day === "all" || company.day === day)
  }), [query, day])

  const groupedCompanies = useMemo(() => classOrder.map((className) => ({
    className,
    companies: filtered.filter((company) => company.className === className),
  })).filter((group) => group.companies.length > 0), [filtered])

  const total = Object.values(summaries).reduce((sum, item) => sum + item.count, 0)

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#101b43]/95 text-white backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3 font-black tracking-tight">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#f4bd24] text-[#101b43]">VF</span>
            <span>Voz da Feira</span>
          </Link>
          <div className="flex items-center gap-3 text-sm text-blue-100">
            <span>{total} avaliações registradas</span>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#101b43] px-4 pb-16 pt-14 text-white sm:px-6 sm:pt-20">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,#49c6e5_0,transparent_25%),radial-gradient(circle_at_80%_70%,#f4bd24_0,transparent_22%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <Badge className="mb-5 border-0 bg-[#f4bd24] px-4 py-2 text-[#101b43] hover:bg-[#f4bd24]">FEIRA 2026 · AVALIAÇÃO OFICIAL</Badge>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.03] tracking-[-.04em] sm:text-6xl">Sua percepção também faz parte da feira.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-blue-100">Conheça as empresas criadas pelos estudantes, dê sua nota e registre uma reação. Seu comentário fica visível somente para a organização.</p>
            <div className="mt-7 flex flex-wrap gap-4 text-sm font-semibold text-blue-100">
              <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#49c6e5]" /> Comentários privados</span>
              <span className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-[#f4bd24]" /> Resultados atualizados</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[companies[9], companies[1], companies[11], companies[14]].map((company, index) => (
              <div key={company.id} className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 ${index % 2 ? "translate-y-6" : ""}`}>
                <Image src={company.image} alt={`Banner da ${company.name}`} width={520} height={300} className="aspect-[4/3] h-full w-full object-cover" priority={index < 2} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16" id="empresas">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-bold uppercase tracking-[.18em] text-[#247ba0]">17 projetos estudantis</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Escolha uma empresa para avaliar</h2>
            <p className="mt-2 text-slate-500">Empresas organizadas por turma: 2C, 2D, 3C e 3D.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative"><span className="sr-only">Buscar empresa</span><Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar empresa" className="h-11 w-full bg-white pl-10 sm:w-64" /></label>
            <div className="flex rounded-xl border bg-white p-1">
              {(["all", 1, 2, 3] as const).map((value) => <button key={value} onClick={() => setDay(value)} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${day === value ? "bg-[#101b43] text-white" : "text-slate-500 hover:bg-slate-100"}`}>{value === "all" ? "Todos" : `${value}º dia`}</button>)}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {groupedCompanies.map((group) => (
            <section key={group.className} aria-labelledby={`turma-${group.className}`}>
              <div className="mb-5 flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#101b43] text-lg font-black text-white">{group.className}</div>
                <div>
                  <h3 id={`turma-${group.className}`} className="text-2xl font-black tracking-tight">Empresas da turma {group.className}</h3>
                  <p className="text-sm text-slate-500">{group.companies.length} {group.companies.length === 1 ? "empresa disponível" : "empresas disponíveis"}</p>
                </div>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {group.companies.map((company) => {
                  const summary = summaries[company.id]
                  return (
                    <Card key={company.id} className="group overflow-hidden border-0 bg-white shadow-[0_14px_45px_rgba(16,27,67,.08)] transition hover:-translate-y-1">
                      <div className="relative overflow-hidden bg-slate-200">
                        <Image src={company.image} alt={`Banner da empresa ${company.name}`} width={900} height={520} className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                        <div className="absolute left-3 top-3 flex gap-2"><Badge className="bg-white text-[#101b43] hover:bg-white">{company.className}</Badge><Badge className="bg-[#49c6e5] text-[#101b43] hover:bg-[#49c6e5]">{company.day}º dia</Badge></div>
                      </div>
                      <CardContent className="p-5">
                        <p className="text-sm font-bold text-[#247ba0]">{company.category}</p>
                        <h4 className="mt-1 text-2xl font-black tracking-tight">{company.name}</h4>
                        <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3">
                          <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Nota</p><p className="mt-1 flex items-center gap-1 text-lg font-black"><Star className="h-4 w-4 fill-[#f4bd24] text-[#f4bd24]" /> {summary?.count ? summary.average.toFixed(1) : "—"}</p></div>
                          <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Avaliações</p><p className="mt-1 flex items-center gap-1 text-lg font-black"><MessageCircle className="h-4 w-4 text-[#49c6e5]" /> {summary?.count ?? 0}</p></div>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="flex -space-x-1 text-xl" aria-label="Reações positivas mais usadas">
                            {reactionOptions.filter(({ emoji }) => (summary?.reactions[emoji] ?? 0) > 0).slice(0, 3).map(({ emoji, label }) => (
                              <span key={emoji} title={label} aria-label={label} className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-slate-100">{emoji}</span>
                            ))}
                          </div>
                          <Button onClick={() => setSelected(company)} className="rounded-xl bg-[#101b43] font-bold hover:bg-[#18295f]">Avaliar empresa</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </section>
          ))}
          {!groupedCompanies.length && <div className="rounded-3xl border border-dashed bg-white px-6 py-12 text-center text-slate-500">Nenhuma empresa encontrada com esses filtros.</div>}
        </div>
      </section>

      <footer className="border-t bg-white px-4 py-8 text-center text-sm text-slate-500"><p className="font-semibold text-slate-700">2ª Feira de Empreendedorismo e Networking · E.E. Profa. Zuleika de Barros Martins Ferreira</p><p className="mt-1">Os comentários são confidenciais e usados pela organização para fins pedagógicos.</p></footer>
      <ReviewDialog company={selected} onClose={() => setSelected(null)} onSubmitted={loadSummaries} />
    </main>
  )
}

function ReviewDialog({ company, onClose, onSubmitted }: { company: Company | null; onClose: () => void; onSubmitted: () => Promise<void> }) {
  const [name, setName] = useState("")
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(0)
  const [reaction, setReaction] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!company || rating === 0) return
    setStatus("sending")
    try {
      const response = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ companyId: company.id, name, comment, rating, reaction: reaction || null }) })
      if (!response.ok) return setStatus("error")
      setStatus("done")
      await onSubmitted()
    } catch {
      setStatus("error")
    }
  }
  const close = () => { setName(""); setComment(""); setRating(0); setReaction(""); setStatus("idle"); onClose() }
  return (
    <Dialog open={Boolean(company)} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-h-[94vh] overflow-y-auto rounded-3xl sm:max-w-xl">
        {status === "done" ? <div className="py-10 text-center"><CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" /><h2 className="mt-4 text-2xl font-black">Avaliação registrada!</h2><p className="mt-2 text-slate-500">Obrigado por contribuir com a evolução da {company?.name}.</p><Button onClick={close} className="mt-6 bg-[#101b43]">Concluir</Button></div> : <>
          <DialogHeader><DialogTitle className="text-2xl font-black">Avaliar {company?.name}</DialogTitle><DialogDescription>Seu comentário será visto apenas pela organização. A nota e a reação entram no resultado público.</DialogDescription></DialogHeader>
          <form onSubmit={submit} className="mt-2 space-y-5">
            <div><label className="mb-2 block text-sm font-bold" htmlFor="reviewer-name">Seu nome</label><Input id="reviewer-name" value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={80} required placeholder="Nome e sobrenome" /></div>
            <fieldset><legend className="mb-2 text-sm font-bold">Sua nota</legend><div className="flex gap-2">{[1,2,3,4,5].map((value) => <button type="button" key={value} onClick={() => setRating(value)} aria-label={`${value} estrelas`} className="rounded-xl p-2 hover:bg-amber-50"><Star className={`h-8 w-8 ${value <= rating ? "fill-[#f4bd24] text-[#f4bd24]" : "text-slate-300"}`} /></button>)}</div></fieldset>
            <fieldset>
              <legend className="text-sm font-bold">Escolha uma reação positiva <span className="font-normal text-slate-400">(opcional)</span></legend>
              <p className="mb-3 mt-1 text-sm text-slate-500">Os símbolos já vêm acompanhados de seu significado para evitar dúvidas ou interpretações inadequadas.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {reactionOptions.map(({ emoji, label, description }) => {
                  const isSelected = reaction === emoji
                  return (
                    <button type="button" key={emoji} onClick={() => setReaction(isSelected ? "" : emoji)} aria-pressed={isSelected} aria-label={`${label}: ${description}`} className={`flex min-h-20 items-center gap-3 rounded-2xl border p-3 text-left transition ${isSelected ? "border-[#247ba0] bg-cyan-50 ring-2 ring-[#247ba0]/15" : "bg-white hover:border-slate-300 hover:bg-slate-50"}`}>
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-2xl shadow-sm" aria-hidden="true">{emoji}</span>
                      <span><strong className="block text-sm text-slate-900">{label}</strong><span className="mt-0.5 block text-xs leading-snug text-slate-500">{description}</span></span>
                    </button>
                  )
                })}
              </div>
            </fieldset>
            <div><label className="mb-2 block text-sm font-bold" htmlFor="review-comment">Comentário</label><Textarea id="review-comment" value={comment} onChange={(event) => setComment(event.target.value)} minLength={3} maxLength={1000} required rows={5} placeholder="O que chamou sua atenção? O que pode melhorar?" /></div>
            {status === "error" && <p className="text-sm font-semibold text-red-600">Não foi possível enviar agora. Tente novamente.</p>}
            <Button type="submit" disabled={status === "sending" || rating === 0} className="h-12 w-full rounded-xl bg-[#101b43] text-base font-bold">{status === "sending" ? "Enviando…" : "Enviar avaliação"}</Button>
          </form>
        </>}
      </DialogContent>
    </Dialog>
  )
}
