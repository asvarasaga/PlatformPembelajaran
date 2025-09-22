import "./globals.css"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-warna3">
        {/* Header */}
        <header className="border-b border-border bg-warna1">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/LOGO UNY.png" alt="Logo" className="h-16 w-16" />
              <div>
                <h1 className="text-2xl font-bold text-background">ESP32 Learning Platform</h1>
                <p className="text-background text-sm">SMK N 3 Yogyakarta - Kelas 11 Teknik Elektronika</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button className="text-background bg-transparent hover:bg-warna2">Beranda</Button>
              </Link>
              <Badge variant="secondary" className="text-sm">Versi 1.0.0</Badge>
            </div>
          </div>
        </header>

        {/* Halaman utama */}
        <main className="min-h-[calc(100vh-150px)]">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-warna2 mt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center text-background">
              <p>© 2025 SMK N 3 Yogyakarta - Platform Pembelajaran ESP32</p>
              <p className="text-sm mt-1">Dikembangkan untuk melatih kemampuan Antarmuka dan Komunikasi Data siswa Teknik Elektronika</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
