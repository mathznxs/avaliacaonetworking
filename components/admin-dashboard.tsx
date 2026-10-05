"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ArrowLeft, BarChart3, LogOut, MessageSquareText, Star, Trash2 } from "lucide-react"
import { companies } from "@/lib/companies"
import { getReactionLabel } from "@/lib/reactions"
import { createClient } from "@/lib/supabase/client"
import { PrintableEvaluationReport } from "@/components/printable-evaluation-report"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Review = { id: string; company_id: string; reviewer_name: string; comment: string; rating: number; reaction: string | null; created_at: string }

export function AdminDashboard() {
  const [token, setToken] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [reviews, setReviews] = useState<Review[]>([])
  const [status, setStatus] = useState<"idle" | "loading" | "error">("loading")
  const supabase = useMemo(() => createClient(), [])

  const loadReviews = useCallback(async (accessToken: string) => {
    setStatus("loading")
    const response = await fetch("/api/admin/reviews", { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" })
    if (!response.ok) {
      if (response.status === 401) {
        await supabase.auth.signOut()
        setToken(null)
        setReviews([])
      }
      setStatus("error")
      return false
    }
    const data = await response.json() as { reviews: Review[] }
    setReviews(data.reviews)
    setStatus("idle")
    return true
  }, [supabase])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const accessToken = data.session?.access_token ?? null
      if (accessToken) loadReviews(accessToken).then((authorized) => authorized && setToken(accessToken))
      else setStatus("idle")
    })
  }, [loadReviews, supabase])

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus("loading")
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data.session) { setStatus("error"); return }
    const authorized = await loadReviews(data.session.access_token)
    if (authorized) setToken(data.session.access_token)
  }

  const signOut = async () => { await supabase.auth.signOut(); setToken(null); setReviews([]) }
  const remove = async (id: string) => {
    if (!token) return
    const response = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
    if (response.ok) setReviews((current) => current.filter((review) => review.id !== id))
  }

  if (!token) return (
    <main className="grid min-h-screen place-items-center bg-[#101b43] px-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardContent className="p-7 sm:p-9">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f4bd24] font-black text-[#101b43]">VF</span>
          <h1 className="mt-6 text-3xl font-black tracking-tight">Acesso da organização</h1>
          <p className="mt-2 text-slate-500">Entre para gerenciar comentários e acompanhar as notas.</p>
          <form onSubmit={signIn} className="mt-7 space-y-4">
            <div><label className="mb-2 block text-sm font-bold" htmlFor="email">E-mail</label><Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
            <div><label className="mb-2 block text-sm font-bold" htmlFor="password">Senha</label><Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
            {status === "error" && <p className="text-sm font-semibold text-red-600">Acesso não autorizado. Confira e-mail e senha.</p>}
            <Button type="submit" disabled={status === "loading"} className="h-12 w-full bg-[#101b43] font-bold">{status === "loading" ? "Entrando…" : "Entrar"}</Button>
          </form>
          <Link href="/" className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> Voltar ao site</Link>
        </CardContent>
      </Card>
    </main>
  )

  const reports = companies.map((company) => {
    const companyReviews = reviews.filter((review) => review.company_id === company.id)
    const average = companyReviews.length ? companyReviews.reduce((sum, review) => sum + review.rating, 0) / companyReviews.length : 0
    return { ...company, reviews: companyReviews, average }
  }).sort((a, b) => b.average - a.average || b.reviews.length - a.reviews.length)
  const evaluatedReports = reports.filter((company) => company.reviews.length > 0)

  return (
    <main className="min-h-screen bg-[#f6f7fb] print:bg-white">
      <header className="border-b bg-[#101b43] text-white print:hidden"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6"><div><p className="text-sm font-bold text-[#49c6e5]">VOZ DA FEIRA</p><h1 className="text-xl font-black">Painel de avaliações</h1></div><div className="flex gap-2"><Link href="/"><Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"><ArrowLeft className="mr-2 h-4 w-4" /> Site</Button></Link><Button variant="outline" onClick={signOut} className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"><LogOut className="mr-2 h-4 w-4" /> Sair</Button></div></div></header>
      <div className="mx-auto max-w-7xl px-4 py-8 print:max-w-none print:p-0 sm:px-6">
        <div className="mb-8 grid gap-4 print:hidden sm:grid-cols-3">
          <Metric label="Avaliações" value={reviews.length.toString()} icon={<MessageSquareText />} />
          <Metric label="Média geral" value={reviews.length ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : "—"} icon={<Star />} />
          <Metric label="Empresas avaliadas" value={new Set(reviews.map((review) => review.company_id)).size.toString()} icon={<BarChart3 />} />
        </div>
        <Tabs defaultValue="report">
          <TabsList className="mb-6 bg-white print:hidden"><TabsTrigger value="report">Relatório de notas</TabsTrigger><TabsTrigger value="comments">Comentários</TabsTrigger><TabsTrigger value="print">Imprimir relatório</TabsTrigger></TabsList>
          <TabsContent value="report" className="space-y-3">
            {evaluatedReports.map((company, index) => <Card key={company.id} className="border-0 shadow-sm"><CardContent className="grid gap-4 p-5 sm:grid-cols-[40px_1fr_180px_100px] sm:items-center"><span className="text-xl font-black text-slate-300">{String(index + 1).padStart(2, "0")}</span><div><p className="font-black">{company.name}</p><p className="text-sm text-slate-500">{company.className} · {company.reviews.length} avaliações</p></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#49c6e5]" style={{ width: `${company.average * 20}%` }} /></div><p className="flex items-center justify-end gap-1 text-xl font-black"><Star className="h-5 w-5 fill-[#f4bd24] text-[#f4bd24]" /> {company.average.toFixed(1)}</p></CardContent></Card>)}
            {!evaluatedReports.length && <div className="rounded-3xl bg-white p-12 text-center text-slate-500">Ainda não há empresas avaliadas.</div>}
          </TabsContent>
          <TabsContent value="comments" className="space-y-7">
            {evaluatedReports.map((company) => <section key={company.id}><div className="mb-3 flex items-end justify-between"><div><h2 className="text-xl font-black">{company.name}</h2><p className="text-sm text-slate-500">{company.reviews.length} comentários</p></div></div><div className="grid gap-3 lg:grid-cols-2">{company.reviews.map((review) => <Card key={review.id} className="border-0 shadow-sm"><CardContent className="p-5"><div className="flex items-start justify-between gap-4"><div><p className="font-black">{review.reviewer_name}</p><p className="mt-1 text-sm text-slate-500">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(review.created_at))}</p></div><div className="flex items-center gap-2"><span className="rounded-lg bg-amber-50 px-2 py-1 font-black text-amber-700">★ {review.rating}</span>{review.reaction && <span className="text-xl" title={getReactionLabel(review.reaction)}>{review.reaction}</span>}</div></div><p className="mt-4 leading-relaxed text-slate-700">{review.comment}</p><div className="mt-4 flex justify-end"><AlertDialog><AlertDialogTrigger asChild><Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700"><Trash2 className="mr-2 h-4 w-4" /> Excluir</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Excluir este comentário?</AlertDialogTitle><AlertDialogDescription>Esta ação é permanente e também atualizará as notas públicas da empresa.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => remove(review.id)} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></CardContent></Card>)}</div></section>)}
            {!reviews.length && <div className="rounded-3xl bg-white p-12 text-center text-slate-500">Ainda não há comentários.</div>}
          </TabsContent>
          <TabsContent value="print" className="print:mt-0"><PrintableEvaluationReport companies={evaluatedReports} /></TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function Metric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <Card className="border-0 shadow-sm"><CardContent className="flex items-center gap-4 p-5"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-50 text-[#247ba0] [&>svg]:h-5 [&>svg]:w-5">{icon}</span><div><p className="text-sm font-semibold text-slate-500">{label}</p><p className="text-2xl font-black">{value}</p></div></CardContent></Card>
}
