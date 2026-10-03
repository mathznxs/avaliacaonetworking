import { InstagramIcon, MapPinIcon, PhoneIcon } from "lucide-react"

export function FooterSection() {
  return (
    <footer className="bg-secondary py-12 px-4 text-secondary-foreground">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-4">E.E. Profª Zuleika de Barros Martins Ferreira</h3>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 opacity-90">
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5" />
            <span>Rua Padre Chico, 420 - Pompeia, São Paulo - SP</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneIcon className="w-5 h-5" />
            <span>(11) 3673-2765</span>
          </div>
          <div className="flex items-center gap-2">
            <InstagramIcon className="w-5 h-5" />
            <span>zuleika_oficial</span>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-secondary-foreground/20">
          <p className="text-sm opacity-75">
            © 2026 E.E. Profª Zuleika de Barros Martins Ferreira. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
