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
const emojis = ["👏", "💡", "😍", "🚀", "🔥"]

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
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative"><span className="sr-only">Buscar empresa</span><Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar empresa" className="h-11 w-full bg-white pl-10 sm:w-64" /></label>
            <div className="flex rounded-xl border bg-white p-1">
              {(["all", 1, 2, 3] as const).map((value) => <button key={value} onClick={() => setDay(value)} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${day === value ? "bg-[#101b43] text-white" : "text-slate-500 hover:bg-slate-100"}`}>{value === "all" ? "Todos" : `${value}º dia`}</button>)}
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((company) => {
            const summary = summaries[company.id]
            return (
              <Card key={company.id} className="group overflow-hidden border-0 bg-white shadow-[0_14px_45px_rgba(16,27,67,.08)] transition hover:-translate-y-1">
                <div className="relative overflow-hidden bg-slate-200">
                  <Image src={company.image} alt={`Banner da empresa ${company.name}`} width={900} height={520} className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                  <div className="absolute left-3 top-3 flex gap-2"><Badge className="bg-white text-[#101b43] hover:bg-white">{company.className}</Badge><Badge className="bg-[#49c6e5] text-[#101b43] hover:bg-[#49c6e5]">{company.day}º dia</Badge></div>
                </div>
                <CardContent className="p-5">
                  <p className="text-sm font-bold text-[#247ba0]">{company.category}</p>
                  <h3 className="mt-1 text-2xl font-black tracking-tight">{company.name}</h3>
                  <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3">
                    <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Nota</p><p className="mt-1 flex items-center gap-1 text-lg font-black"><Star className="h-4 w-4 fill-[#f4bd24] text-[#f4bd24]" /> {summary?.count ? summary.average.toFixed(1) : "—"}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Avaliações</p><p className="mt-1 flex items-center gap-1 text-lg font-black"><MessageCircle className="h-4 w-4 text-[#49c6e5]" /> {summary?.count ?? 0}</p></div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex -space-x-1 text-xl" aria-label="Reações mais usadas">{emojis.filter((emoji) => (summary?.reactions[emoji] ?? 0) > 0).slice(0, 3).map((emoji) => <span key={emoji} className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-slate-100">{emoji}</span>)}</div>
                    <Button onClick={() => setSelected(company)} className="rounded-xl bg-[#101b43] font-bold hover:bg-[#18295f]">Avaliar empresa</Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <footer className="border-t bg-white px-4 py-8 text-center text-sm text-slate-500"><p className="font-semibold text-slate-700">1ª Feira de Empreendedorismo e Networking · E.E. Profa. Zuleika de Barros Martins Ferreira</p><p className="mt-1">Os comentários são confidenciais e usados pela organização para fins pedagógicos.</p></footer>
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
            <fieldset><legend className="mb-2 text-sm font-bold">Uma reação <span className="font-normal text-slate-400">(opcional)</span></legend><div className="flex gap-2">{emojis.map((emoji) => <button type="button" key={emoji} onClick={() => setReaction(reaction === emoji ? "" : emoji)} className={`grid h-12 w-12 place-items-center rounded-xl border text-2xl ${reaction === emoji ? "border-[#247ba0] bg-cyan-50" : "bg-white"}`}>{emoji}</button>)}</div></fieldset>
            <div><label className="mb-2 block text-sm font-bold" htmlFor="review-comment">Comentário</label><Textarea id="review-comment" value={comment} onChange={(event) => setComment(event.target.value)} minLength={3} maxLength={1000} required rows={5} placeholder="O que chamou sua atenção? O que pode melhorar?" /></div>
            {status === "error" && <p className="text-sm font-semibold text-red-600">Não foi possível enviar agora. Tente novamente.</p>}
            <Button type="submit" disabled={status === "sending" || rating === 0} className="h-12 w-full rounded-xl bg-[#101b43] text-base font-bold">{status === "sending" ? "Enviando…" : "Enviar avaliação"}</Button>
          </form>
        </>}
      </DialogContent>
    </Dialog>
  )
}
