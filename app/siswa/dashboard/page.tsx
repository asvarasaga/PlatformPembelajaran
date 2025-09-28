"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function DashboardSiswaPage() {
  const [topicsCount, setTopicsCount] = useState(0);
  const [praktikCount, setPraktikCount] = useState(0);
  const [tugasCount, setTugasCount] = useState(0);
  const [namaSiswa, setNamaSiswa] = useState("");
  const [isGuru, setIsGuru] = useState<boolean>(false); // untuk proteksi tombol

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const topicsSnap = await getDocs(collection(db, "topics"));
        setTopicsCount(topicsSnap.size);

        const praktikSnap = await getDocs(collection(db, "latihan"));
        setPraktikCount(praktikSnap.size);

        const tugasSnap = await getDocs(collection(db, "tugas"));
        setTugasCount(tugasSnap.size);
      } catch (err) {
        console.error("Error ambil data Firestore:", err);
      }
    };

    fetchCounts();

    // nama siswa tetap dari localStorage (saat login disimpan)
    const savedNama = localStorage.getItem("namaSiswa");
    const state = localStorage.getItem("isGuru") === "true";
    setIsGuru(state);

    if (savedNama) setNamaSiswa(savedNama);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isSiswa");
    localStorage.removeItem("namaSiswa");
    localStorage.removeItem("nomorSiswa");
    localStorage.removeItem("lastActivity");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-warna3">
      {/* Sidebar */}
      <aside className="w-64 bg-warna2 p-4 flex flex-col justify-between shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-background mb-6">Dashboard</h2>
          <nav className="flex flex-col gap-3">
            <Link
              href="/siswa/teori"
              className="bg-warna1 text-background px-3 py-2 rounded hover:bg-warna4"
            >
              Lihat Teori
            </Link>
            <Link
              href="/siswa/latihan"
              className="bg-warna1 text-background px-3 py-2 rounded hover:bg-warna4"
            >
              Latihan Praktik
            </Link>
            <Link
              href="/siswa/tugas"
              className="bg-warna1 text-background px-3 py-2 rounded hover:bg-warna4"
            >
              Lembar Tugas
            </Link>
            <Link
              href="https://wokwi.com/projects/new/arduino-uno"
              className="bg-warna1 text-background px-3 py-2 rounded hover:bg-warna4"
            >
              Latihan Simulasi Rangkaian
            </Link>
            {!isGuru && (
            <Link
              href="/siswa/pengaturan"
              className="bg-warna1 text-background px-3 py-2 rounded hover:bg-warna4"
            >
              Pengaturan
            </Link>
          )}

          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="bg-warna6 text-background px-3 py-2 mt-6 hover:bg-warna7 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Selamat Datang, {namaSiswa}!</h1>

        {/* Cards Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Jumlah Topik Teori</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{topicsCount}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Jumlah Latihan Praktik</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{praktikCount}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Jumlah Lembar Tugas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{tugasCount}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
