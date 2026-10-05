import { BarChart3, Building2, FileText, MessageSquareText, Printer, Star } from "lucide-react"
import { reactionOptions, getReactionLabel } from "@/lib/reactions"
import { Button } from "@/components/ui/button"

type ReportReview = {
  id: string
  reviewer_name: string
  comment: string
  rating: number
  reaction: string | null
  created_at: string
}

type ReportCompany = {
  id: string
  name: string
  className: string
  day: number
  category: string
  reviews: ReportReview[]
  average: number
}

export function PrintableEvaluationReport({ companies }: { companies: ReportCompany[] }) {
  const totalReviews = companies.reduce((total, company) => total + company.reviews.length, 0)
  const overallAverage = totalReviews
    ? companies.reduce((total, company) => total + company.reviews.reduce((sum, review) => sum + review.rating, 0), 0) / totalReviews
    : 0

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-[#101b43] p-6 text-white print:hidden sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-black">Relatório completo das avaliações</p>
          <p className="mt-1 max-w-2xl text-sm text-blue-100">A impressão inclui somente empresas avaliadas, com notas, reações, nomes e comentários. Na janela de impressão, escolha “Salvar como PDF” para baixar e enviar o documento.</p>
        </div>
        <Button onClick={() => window.print()} disabled={!totalReviews} className="h-11 shrink-0 bg-[#f4bd24] font-black text-[#101b43] hover:bg-[#ffd45a]">
          <Printer className="mr-2 h-4 w-4" /> Imprimir ou salvar PDF
        </Button>
      </div>

      <article className="print-report rounded-3xl bg-white p-6 shadow-sm print:rounded-none print:p-0 print:shadow-none sm:p-9">
        <header className="border-b-2 border-[#101b43] pb-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-black uppercase tracking-[.18em] text-[#247ba0]">Voz da Feira</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#101b43]">Relatório de avaliações das empresas</h2>
              <p className="mt-2 text-sm text-slate-600">2ª Feira de Empreendedorismo e Networking · E.E. Profa. Zuleika de Barros Martins Ferreira</p>
            </div>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#f4bd24] font-black text-[#101b43]">VF</span>
          </div>
          <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-900">Documento confidencial: contém nomes e comentários dos participantes e deve ser compartilhado somente com a organização e equipe pedagógica.</p>
        </header>

        <section className="my-7 grid grid-cols-3 gap-3" aria-label="Resumo geral">
          <ReportMetric icon={<MessageSquareText />} label="Avaliações" value={totalReviews.toString()} />
          <ReportMetric icon={<Star />} label="Média geral" value={totalReviews ? overallAverage.toFixed(1) : "—"} />
          <ReportMetric icon={<Building2 />} label="Empresas avaliadas" value={companies.length.toString()} />
        </section>

        <div className="space-y-8">
          {companies.map((company, index) => {
            const reactionCounts = reactionOptions.map((option) => ({
              ...option,
              count: company.reviews.filter((review) => review.reaction === option.emoji).length,
            })).filter((option) => option.count > 0)
            const withoutReaction = company.reviews.filter((review) => !review.reaction).length

            return (
              <section key={company.id} className="print-company border-t border-slate-200 pt-6 first:border-t-0 first:pt-0">
                <div className="break-after-avoid flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-[#247ba0]">{String(index + 1).padStart(2, "0")} · {company.className} · {company.day}º dia · {company.category}</p>
                    <h3 className="mt-1 text-2xl font-black text-[#101b43]">{company.name}</h3>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <span className="rounded-lg bg-amber-50 px-3 py-2 font-black text-amber-800">★ {company.average.toFixed(1)}</span>
                    <span className="rounded-lg bg-cyan-50 px-3 py-2 font-black text-[#247ba0]">{company.reviews.length} {company.reviews.length === 1 ? "avaliação" : "avaliações"}</span>
                  </div>
                </div>

                <div className="mt-4 break-inside-avoid rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500">Distribuição das reações</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {reactionCounts.map(({ emoji, label, count }) => <span key={emoji} className="rounded-full border bg-white px-3 py-1.5 text-sm"><span aria-hidden="true">{emoji}</span> <strong>{label}</strong>: {count}</span>)}
                    {withoutReaction > 0 && <span className="rounded-full border bg-white px-3 py-1.5 text-sm"><strong>Sem reação:</strong> {withoutReaction}</span>}
                    {!reactionCounts.length && !withoutReaction && <span className="text-sm text-slate-500">Nenhuma reação registrada.</span>}
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <h4 className="break-after-avoid flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-600"><FileText className="h-4 w-4" /> Comentários</h4>
                  {company.reviews.map((review, reviewIndex) => (
                    <div key={review.id} className="break-inside-avoid rounded-2xl border border-slate-200 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-black text-slate-900">{reviewIndex + 1}. {review.reviewer_name}</p>
                          <p className="mt-0.5 text-xs text-slate-500">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(review.created_at))}</p>
                        </div>
                        <div className="flex gap-2 text-sm">
                          <span className="rounded-md bg-amber-50 px-2 py-1 font-black text-amber-800">★ {review.rating}</span>
                          <span className="rounded-md bg-slate-100 px-2 py-1 font-semibold">{review.reaction ?? "—"} {getReactionLabel(review.reaction)}</span>
                        </div>
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        {!companies.length && <div className="py-16 text-center text-slate-500"><BarChart3 className="mx-auto h-10 w-10 text-slate-300" /><p className="mt-3 font-semibold">Ainda não há empresas avaliadas para incluir no relatório.</p></div>}
        <footer className="mt-10 border-t pt-4 text-center text-xs text-slate-500">Relatório gerado pelo painel administrativo Voz da Feira.</footer>
      </article>
    </div>
  )
}

function ReportMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4"><span className="text-[#247ba0] [&>svg]:h-5 [&>svg]:w-5">{icon}</span><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p><p className="text-2xl font-black text-[#101b43]">{value}</p></div></div>
}
