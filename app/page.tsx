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
            Selamat Datang di <br /> Platform Belajar
          </h1>
          <p className="text-muted-foreground text-lg">
            Website ini dibuat untuk melatih kemampuan Pemrograman Sistem Embedded
            <br />Teknik Elektronika Indstri SMK N 3 Yogyakarta.
          </p>

          {/* Tombol */}
          <div className="grid grid-cols-2 flex flex-wrap gap-4 max-w-md">
            <Link href={"/teori"}>
            <Button className="bg-warna1 text-background font-semibold px-6 py-3 rounded-xl shadow hover:bg-warna2 transition w-full">
              Teori
            </Button>
            </Link>

            <Link href={"/latihan-pemrograman"}>
            <Button className="bg-warna1 text-background font-semibold px-6 py-3 rounded-xl shadow hover:bg-warna2 transition w-full">
              Latihan Pemrograman
            </Button>
            </Link>

            <a href="https://wokwi.com/projects/new/arduino-uno"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full">
            <Button className="bg-warna1 text-background font-semibold px-6 py-3 rounded-xl shadow hover:bg-warna2 transition w-full">
              Latihan Rangkaian
            </Button>
            </a>
            
            <Link href={"/tabel-pengamatan"}>
            <Button className="bg-warna1 text-background font-semibold px-6 py-3 rounded-xl shadow hover:bg-warna2 transition w-full">
              Tabel Pengamatan
            </Button>
            </Link>
          </div>
        </div>

        {/* Kanan: Ilustrasi */}
        <div className="flex justify-center">
          <img
            src="/homepage.png" // ganti dengan gambar ilustrasi kamu
            alt="Ilustrasi Belajar"
            className="w-100 md:w-116"
          />
        </div>
      </main>

      {/* Footer */}
      
    </div>
  )
}