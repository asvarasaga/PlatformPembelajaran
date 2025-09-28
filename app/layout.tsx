import "./globals.css"
import { ReactNode } from "react"
import { Courier_Prime, Geist, Geist_Mono, Roboto } from "next/font/google"
import Header from "@/components/ui/header"
import Providers from "./provider"
import AppClient from "./appClient"

const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-courier-prime",
})
const geist = Geist({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-geist-sans",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-geist-mono",
})
const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-roboto",
})

export const metadata = {
  title: "Platform Belajar",
  description: "Default description",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body
        className={`${courierPrime.variable} ${geist.variable} ${geistMono.variable} ${roboto.variable} bg-warna3 antialiased`}
      >
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-150px)]">{children}</main>
          <footer className="border-t border-border bg-warna2 mt-16">
            <div className="container mx-auto px-4 py-6">
              <div className="text-center text-background">
                <p>© 2025 SMK N 3 Yogyakarta - Platform Pembelajaran ESP32</p>
                <p className="text-sm mt-1">
                  Dikembangkan untuk melatih kemampuan Antarmuka dan Komunikasi Data siswa Teknik Elektronika
                </p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
