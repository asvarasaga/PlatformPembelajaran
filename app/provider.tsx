"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const LOGOUT_TIMEOUT = 60 * 60 * 1000 // 1 jam

export default function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [initialized, setInitialized] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(localStorage.getItem("isAdmin") === "true")
    }
    checkLogin()
    setInitialized(true)

    window.addEventListener("loginChange", checkLogin)
    return () => window.removeEventListener("loginChange", checkLogin)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const lastActivity = Number(localStorage.getItem("lastActivity") || 0)
      if (!lastActivity) return

      if (Date.now() - lastActivity > LOGOUT_TIMEOUT) {
        localStorage.clear()
        window.dispatchEvent(new Event("loginChange"))
        alert("Sesi Anda habis, silakan login kembali.")
        router.replace("/login")
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [router])

  return <>{children}</>
}
