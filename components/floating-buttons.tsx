"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowUpIcon } from "lucide-react"

export function FloatingButtons() {
  const [showFloatingBtn, setShowFloatingBtn] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingBtn(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!showFloatingBtn) return null

  return (
    <>
      <Link href="/inscricao">
        <Button size="lg" className="floating-btn mr-10">
          Inscreva-se
        </Button>
      </Link>

      <Button
        className="fixed bottom-2 right-2 z-30 rounded-full mb-5 mr-2 w-12 h-12 p-0 bg-transparent"
        variant="outline"
        onClick={scrollToTop}
      >
        <ArrowUpIcon className="w-4 h-4" />
      </Button>
    </>
  )
}
