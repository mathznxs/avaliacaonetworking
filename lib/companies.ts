export type Company = {
  id: string
  name: string
  className: "2C" | "2D" | "3C" | "3D"
  day: 1 | 2 | 3
  category: string
  image: string
}

export const companies: Company[] = [
  { id: "sweet-planet", name: "Sweet Planet", className: "2D", day: 1, category: "Doces", image: "/banners/Sweet_Planet.png" },
  { id: "yellow-blouse", name: "Yellow Blouse", className: "2D", day: 2, category: "Moda", image: "/banners/Yellow_Blouse.png" },
  { id: "nexa", name: "Nexa", className: "2D", day: 3, category: "Streetwear", image: "/banners/Nexa.png" },
  { id: "casa-esperanca", name: "Casa Esperança", className: "2D", day: 1, category: "Impacto social", image: "/banners/Casa_Esperanca.png" },
  { id: "vila-nobre", name: "Vila Nobre", className: "2D", day: 1, category: "Alimentação", image: "/banners/Vila_Nobre.png" },
  { id: "tr-reliquia", name: "TR Relíquia", className: "2D", day: 3, category: "Calçados", image: "/banners/TR_Reliquia.png" },
  { id: "gigastore", name: "GigaStore", className: "3D", day: 2, category: "Eletrônicos", image: "/banners/GigaStore.png" },
  { id: "confeitaria-zuzu", name: "Confeitaria da Zuzu", className: "3D", day: 3, category: "Confeitaria", image: "/banners/Confeitaria_Da_Zuzu.png" },
  { id: "obsidian", name: "Obsidian", className: "3D", day: 2, category: "Moda", image: "/banners/Obsidian.png" },
  { id: "tech-nova", name: "Tech Nova", className: "2C", day: 3, category: "Tecnologia", image: "/banners/Tech_Nova.png" },
  { id: "fome-mutante", name: "Pizzaria Fome Mutante", className: "2C", day: 3, category: "Alimentação", image: "/banners/Pizzaria_Fome_Mutante.png" },
  { id: "meta-atleta", name: "Meta Atleta", className: "2C", day: 1, category: "Esportes", image: "/banners/Meta_Atleta.png" },
  { id: "la-vie-beauty", name: "La Vie Beauty", className: "2C", day: 2, category: "Beleza", image: "/banners/La_Vie_Beauty.png" },
  { id: "knr", name: "KNR", className: "2C", day: 1, category: "Moda", image: "/banners/knr.png" },
  { id: "game-shakers", name: "Game Shakers", className: "2C", day: 2, category: "Entretenimento", image: "/banners/Game_Shakers.png" },
  { id: "doce-encanto", name: "Doce Encanto", className: "2C", day: 3, category: "Doces", image: "/banners/Doce_Encanto.png" },
  { id: "bolos-e-mel", name: "Bolos e Mel", className: "3C", day: 2, category: "Confeitaria", image: "/banners/Bolos_e_Mel.png" },
]

export const companyIds = new Set(companies.map((company) => company.id))
