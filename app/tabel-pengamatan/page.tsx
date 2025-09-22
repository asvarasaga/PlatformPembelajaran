// app/page.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
     <div className="min-h-screen flex flex-col bg-warna3">
      
      {/* Bagian Utama */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 items-center max-w-6xl mx-auto px-6 gap-10">
        
        {/* Kiri: Text */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-warna2 leading-tight">
            This Page are Under Construction
          <p className="text-muted-foreground text-lg">
            Mohon maaf, halaman ini sedang dalam tahap pengembangan. Silakan kembali nanti.
          </p>
          </h1>
          </div>
          </main>
    </div>
  )
}