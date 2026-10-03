import { AdminDashboard } from "@/components/admin-dashboard"

export const metadata = {
  title: "Painel | Voz da Feira",
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return <AdminDashboard />
}
