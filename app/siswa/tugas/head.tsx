"use client"
import AppClient from "@/app/appClient"
import { use } from "react"

export const metadata = {
  title: "Halaman Tugas",
  description: "Lembar Tugas Siswa",
}

export default function Page() {
  return (
    <AppClient>
      <div>
        <h1>Lembar Tugas - Platform Pembelajaran</h1>
      </div>
    </AppClient>
  )
}
