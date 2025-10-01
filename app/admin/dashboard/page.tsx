"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";


export default function DashboardPage() {
  const [topicsCount, setTopicsCount] = useState(0);
  const [siswaCount, setSiswaCount] = useState(0);
  const [praktikCount, setPraktikCount] = useState(0);
  const [tugasCount, setTugasCount] = useState(0);
  const [namaGuru, setNamaGuru] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const topicsSnap = await getDocs(collection(db, "topics"));
        setTopicsCount(topicsSnap.size);

        const siswaSnap = await getDocs(collection(db, "murid"));
        setSiswaCount(siswaSnap.size);

        const praktikSnap = await getDocs(collection(db, "latihan"));
        setPraktikCount(praktikSnap.size);

        const tugasSnap = await getDocs(collection(db, "tugas"));
        setTugasCount(tugasSnap.size);
      } catch (err) {
        console.error("Error fetching counts from Firestore:", err);
      }
    };

    fetchCounts();

    
    setNamaGuru(localStorage.getItem("namaGuru"));

    // Tentukan apakah user superadmin berdasarkan beberapa kemungkinan key di localStorage
    const role = localStorage.getItem("role");
    const isSuper =
      role === "superadmin" ||
      localStorage.getItem("isSuperAdmin") === "true" ||
      localStorage.getItem("namaGuru") === "superadmin";
    setIsSuperAdmin(Boolean(isSuper));
    
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isGuru");
    localStorage.removeItem("lastActivity")
    localStorage.removeItem("namaGuru");
    window.location.href = "/login"; // redirect ke login
  };

  return (
    <div className="flex h-screen bg-warna3">
      {/* Sidebar */}
      <aside className="w-64 bg-warna2 p-4 flex flex-col justify-between shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-background mb-6">Dashboard</h2>
          <nav className="flex flex-col gap-3">
            <Link
              href="/admin/teori"
              className="bg-warna1 text-background px-3 py-2 rounded hover:bg-warna4"
            >
              Kelola Teori
            </Link>
            <Link
              href="/admin/latihan"
              className="bg-warna1 text-background px-3 py-2 rounded hover:bg-warna4"
            >
              Kelola Praktik
            </Link>
            <Link
              href="/admin/tugas"
              className="bg-warna1 text-background px-3 py-2 rounded hover:bg-warna4"
            >
            
              Kelola Tugas
            </Link>
            <Link
              href="/admin/murid"
              className="bg-warna1 text-background px-3 py-2 rounded hover:bg-warna4"
            >
            
              Kelola Murid
            </Link>
            
            <Link
              href="/admin/jawaban"
              className="bg-warna1 text-background px-3 py-2 rounded hover:bg-warna4"
            >
              Pengumpulan Tugas
            </Link>
            

            <Link
              href="/admin/progress"
              className="bg-warna1 text-background px-3 py-2 rounded hover:bg-warna4"
            >
            
              Progress Latihan
            </Link>

            <Link
              href="/siswa/dashboard"
              className="bg-warna1 text-background px-3 py-2 rounded hover:bg-warna4"
            >
            
              Ke dashboard murid
            </Link>
            
            <Link
              href="/admin/pengaturan"
              className="bg-warna1 text-background px-3 py-2 rounded hover:bg-warna4"
            >
            
              Pengaturan
            </Link>
            
            {isSuperAdmin && (
              <Link
                href="/admin/akun"
                className="bg-warna1 text-background px-3 py-2 rounded hover:bg-warna4"
              >
                Kelola akun Guru
              </Link>
            )  
            
            }
          </nav>
        </div>

        <Button
          onClick={handleLogout}
          className="bg-warna6 text-background px-3 py-2 mt-6 hover:bg-warna7"
        >
          Logout
        </Button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Selamat Datang, {namaGuru}!</h1>

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
              <CardTitle>Jumlah topik latihan</CardTitle>
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

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Jumlah siswa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{siswaCount}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
