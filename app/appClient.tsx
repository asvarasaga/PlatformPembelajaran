"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function AppClient({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isSiswa") === "true")
  }, [pathname])

  return (
    <div>
      {children}
    </div>
  )
}
