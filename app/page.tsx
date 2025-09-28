// app/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Home() {
  const [role, setRole] = useState<"guru" | "siswa" | null>(null);

  useEffect(() => {
    const isGuru = localStorage.getItem("isGuru");
    const isSiswa = localStorage.getItem("isSiswa");

    if (isGuru === "true") {
      setRole("guru");
    } else if (isSiswa === "true") {
      setRole("siswa");
    } else {
      setRole(null);
    }
  }, []);

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
          <p className="text-foreground">
            Silakan login untuk memulai pembelajaran!
          </p>

          {/* Tombol */}
          <div>
            {role === "guru" ? (
              <Link href={"/admin/dashboard"}>
                <Button className="bg-warna1 text-background font-semibold px-6 py-3 rounded-xl shadow hover:bg-warna2 transition w-full">
                  Dashboard
                </Button>
              </Link>
            ) : role === "siswa" ? (
              <Link href={"/siswa/dashboard"}>
                <Button className="bg-warna1 text-background font-semibold px-6 py-3 rounded-xl shadow hover:bg-warna2 transition w-full">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href={"/login"}>
                <Button className="bg-warna1 text-background font-semibold px-6 py-3 rounded-xl shadow hover:bg-warna2 transition w-full">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Kanan: Ilustrasi */}
        <div className="flex justify-center">
          <img
            src="/homepage.png"
            alt="Ilustrasi Belajar"
            className="w-100 md:w-116"
          />
        </div>
      </main>
    </div>
  );
}
