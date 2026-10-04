"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Building2Icon,
  CalendarDaysIcon,
  ImageIcon,
  SchoolIcon,
  UsersIcon,
} from "lucide-react";

type Empresa = {
  id: number;
  nome: string;
  grupo: number;
  turma: "2C" | "2D" | "3C" | "3D";
  dia: 1 | 2 | 3;
  banner?: string;
};

const datas = {
  1: "28 de setembro",
  2: "29 de setembro",
  3: "30 de setembro",
} as const;

const empresas: Empresa[] = [
  { id: 1, nome: "Sweet Planet", grupo: 1, turma: "2D", dia: 1 },
  { id: 2, nome: "Casa da Esperança", grupo: 4, turma: "2D", dia: 1 },
  { id: 3, nome: "Padaria Vila Nobre", grupo: 5, turma: "2D", dia: 1, banner: "/banners/Vila_Nobre.jpeg"},
  {
    id: 4,
    nome: "Meta Atleta",
    grupo: 3,
    turma: "2C",
    dia: 1,
    banner: "/banners-2026/meta-atleta.jpg",
  },
  {
    id: 5,
    nome: "Bolos e Mel",
    grupo: 8,
    turma: "3C",
    dia: 2,
    banner: "/banners-2026/bolos-e-mel.jpg",
  },
  { id: 6, nome: "Yelow Blouse", grupo: 2, turma: "2D", dia: 2 },
  { id: 7, nome: "Gigastore Eletronix", grupo: 2, turma: "3D", dia: 2 },
  { id: 8, nome: "Obsidian", grupo: 4, turma: "3D", dia: 2 },
  {
    id: 9,
    nome: "La Vie Beauty",
    grupo: 4,
    turma: "2C",
    dia: 2,
    banner: "/banners-2026/la-vie-beauty.jpg",
  },
  {
    id: 10,
    nome: "Game Shakers",
    grupo: 6,
    turma: "2C",
    dia: 2,
    banner: "/banners-2026/game-shakers.jpg",
  },
  { id: 11, nome: "Nexus", grupo: 3, turma: "2D", dia: 3 },
  { id: 12, nome: "Tênis Relíquia", grupo: 6, turma: "2D", dia: 3 },
  { id: 13, nome: "Confeitaria da Zuzu", grupo: 3, turma: "3D", dia: 3 },
  {
    id: 14,
    nome: "Tech Nova",
    grupo: 1,
    turma: "2C",
    dia: 3,
    banner: "/banners-2026/tech-nova.jpg",
  },
  {
    id: 15,
    nome: "Pizzaria Fome Mutante",
    grupo: 2,
    turma: "2C",
    dia: 3,
    banner: "/banners-2026/pizzaria-fome-mutante.jpg",
  },
  {
    id: 16,
    nome: "KNR",
    grupo: 5,
    turma: "2C",
    dia: 1,
    banner: "/banners-2026/knr.jpg",
  },
  {
    id: 17,
    nome: "Doce Encanto",
    grupo: 7,
    turma: "2C",
    dia: 3,
    banner: "/banners-2026/doce-encanto.jpg",
  },
];

function CompanyVisual({
  empresa,
  compact = false,
}: {
  empresa: Empresa;
  compact?: boolean;
}) {
  if (empresa.banner) {
    return (
      <div
        className={
          compact
            ? "relative h-40 overflow-hidden bg-slate-100"
            : "relative w-full min-h-[360px] md:min-h-[600px] bg-slate-100 rounded-xl overflow-hidden"
        }
      >
        <Image
          src={empresa.banner}
          alt={`Banner da empresa ${empresa.nome}`}
          fill
          sizes={
            compact
              ? "(max-width: 768px) 100vw, 33vw"
              : "(max-width: 768px) 95vw, 700px"
          }
          className={compact ? "object-cover object-top" : "object-contain"}
        />
      </div>
    );
  }

  return (
    <div
      className={`${compact ? "h-40" : "min-h-64 rounded-xl"} flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary/15 via-background to-accent/20 text-center p-6`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-lg">
        {empresa.nome.charAt(0)}
      </div>
      <div>
        <p className="font-semibold text-primary">{empresa.nome}</p>
        <p className="mt-1 text-sm text-muted-foreground">Banner em breve</p>
      </div>
    </div>
  );
}

export function CompaniesSection() {
  return (
    <section id="empresas" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4">
            Projeto Integrador
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-balance text-primary">
            Empresas participantes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Confira quem se apresenta em cada dia. Selecione uma empresa para
            abrir o banner e ver os detalhes da participação.
          </p>
        </div>

        <div className="space-y-16">
          {([1, 2, 3] as const).map((dia) => {
            const empresasDoDia = empresas.filter(
              (empresa) => empresa.dia === dia,
            );

            return (
              <div key={dia}>
                <div className="mb-6 flex flex-col gap-2 border-b border-primary/15 pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                      {dia}º dia
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold text-primary">
                      {datas[dia]} de 2026
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {empresasDoDia.length} empresas na programação
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {empresasDoDia.map((empresa) => (
                    <Dialog key={empresa.id}>
                      <DialogTrigger asChild>
                        <Card className="group h-full cursor-pointer overflow-hidden border-primary/10 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary">
                          <CompanyVisual empresa={empresa} compact />
                          <CardHeader className="pb-3">
                            <div className="mb-2 flex flex-wrap gap-2">
                              <Badge>{empresa.turma}</Badge>
                              <Badge variant="secondary">
                                Grupo {empresa.grupo}
                              </Badge>
                              {empresa.banner && (
                                <Badge variant="outline">
                                  <ImageIcon className="mr-1 h-3 w-3" /> Banner
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-xl text-primary transition-colors group-hover:text-secondary">
                              {empresa.nome}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0 text-sm text-muted-foreground">
                            Ver detalhes da apresentação →
                          </CardContent>
                        </Card>
                      </DialogTrigger>

                      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl text-primary">
                            {empresa.nome}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-5">
                          <CompanyVisual empresa={empresa} />
                          <div className="grid gap-3 rounded-xl border bg-muted/35 p-4 sm:grid-cols-3">
                            <div className="flex items-center gap-2">
                              <SchoolIcon className="h-4 w-4 text-primary" />
                              <span>Turma {empresa.turma}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <UsersIcon className="h-4 w-4 text-primary" />
                              <span>Grupo {empresa.grupo}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CalendarDaysIcon className="h-4 w-4 text-primary" />
                              <span>{datas[empresa.dia]}</span>
                            </div>
                          </div>
                          {!empresa.banner && (
                            <p className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Building2Icon className="h-4 w-4" /> O banner
                              desta empresa será adicionado assim que for
                              enviado.
                            </p>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
