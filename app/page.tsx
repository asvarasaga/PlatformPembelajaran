// app/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Ban,
  CircleCheck,
  ClipboardList,
  Cpu,
  FileText,
  Keyboard,
  Lock,
  ShieldCheck,
  Smartphone,
  Timer,
} from "lucide-react";

const fitur = [
  {
    icon: BookOpen,
    judul: "Materi Teori",
    isi: "Pelajari dasar mikrokontroler ESP32, sensor, aktuator, dan langkah-langkah pemrogramannya.",
    warna: "bg-warna2",
  },
  {
    icon: Lock,
    judul: "Latihan Praktik",
    isi: "Ketik ulang contoh program yang terkunci untuk melatih logika dan keterampilan pemrograman.",
    warna: "bg-warna1",
  },
  {
    icon: ClipboardList,
    judul: "Lembar Tugas",
    isi: "Kerjakan tugas dari guru dan kumpulkan langsung lewat website.",
    warna: "bg-warna4",
  },
];

const manfaat = [
  {
    icon: Smartphone,
    judul: "Belajar kapan saja",
    isi: "Materi bisa dibuka di mana saja, tidak hanya saat jam pelajaran.",
  },
  {
    icon: FileText,
    judul: "Labsheet digital",
    isi: "Pengganti labsheet kertas yang tidak akan rusak atau hilang.",
  },
  {
    icon: ShieldCheck,
    judul: "Latihan dulu, baru praktik",
    isi: "Kuasai kodenya sebelum praktik dengan hardware agar alat lebih awet.",
  },
];

const aturanTerkunci = [
  { icon: Ban, teks: "Copy-paste dimatikan, jadi kamu harus mengetik sendiri." },
  { icon: Keyboard, teks: "Hanya huruf yang benar yang diterima, salah ketik langsung ketahuan." },
  { icon: Timer, teks: "Timer mencatat berapa lama kamu menyelesaikan kodenya." },
];

// Contoh kode untuk ilustrasi "contoh program terkunci"
const contohKode = `void setup() {
  pinMode(2, OUTPUT);
}

void loop() {
  digitalWrite(2, HIGH);
  delay(1000);
}`;
const sudahDiketik = 48;

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

  const tujuan = role === "guru" ? "/admin/dashboard" : role === "siswa" ? "/siswa/dashboard" : "/login";
  const labelTombol = role ? "Ke Dashboard" : "Mulai Belajar";

  return (
    <div className="bg-warna3 overflow-hidden">
      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 pt-12 pb-16 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        {/* Hiasan latar */}
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-warna1/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-warna2/20 blur-3xl" />

        {/* Kiri: Text */}
        <div className="relative space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-warna4 text-warna5 px-4 py-1.5 text-sm font-semibold">
            <Cpu className="h-4 w-4" /> Kelas XI · Teknik Elektronika Industri
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold text-warna4 leading-tight">
            Labsheet Digital{" "}
            <span className="text-warna1">Pemrograman Sistem Embedded</span>
          </h1>

          <p className="text-warna4/80 text-lg">
            Belajar memprogram mikrokontroler ESP32 lewat website. Baca materi, latih kode dengan
            contoh program terkunci, dan kumpulkan tugas. Dibuat untuk siswa Teknik Elektronika
            Industri SMK N 3 Yogyakarta.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={tujuan} className="sm:w-auto w-full">
              <Button className="w-full bg-warna1 text-white font-semibold text-base h-12 px-8 rounded-xl shadow-lg shadow-warna1/30 hover:bg-warna2 hover:-translate-y-0.5 transition">
                {labelTombol} <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {!role && (
            <p className="text-sm text-warna4/70">
              Belum punya akun? Minta akun ke guru kamu, lalu login untuk mulai.
            </p>
          )}
        </div>

        {/* Kanan: Ilustrasi + kartu kode */}
        <div className="relative flex justify-center">
          <img
            src="/homepage.png"
            alt="Ilustrasi Belajar"
            className="relative w-80 md:w-[26rem] animate-float-slow"
          />

          {/* Kartu kode */}
          <div className="absolute -bottom-6 -left-2 md:left-0 w-60 rounded-xl bg-warna4 shadow-2xl p-4 font-mono text-xs text-warna5 animate-float">
            <div className="flex gap-1.5 mb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-warna7" />
              <span className="h-2.5 w-2.5 rounded-full bg-menengah" />
              <span className="h-2.5 w-2.5 rounded-full bg-mudah" />
            </div>
            <p><span className="text-warna1">void</span> loop() {"{"}</p>
            <p className="pl-4">digitalWrite(<span className="text-menengah">2</span>, HIGH);</p>
            <p className="pl-4">delay(<span className="text-mudah">1000</span>);</p>
            <p>
              {"}"}<span className="animate-caret">▌</span>
            </p>
          </div>

          {/* Lencana */}
          <div className="absolute top-4 right-2 md:right-6 flex items-center gap-2 rounded-xl bg-white shadow-lg px-3 py-2 animate-float">
            <Cpu className="h-5 w-5 text-warna1" />
            <span className="text-sm font-semibold text-warna4">ESP32</span>
          </div>
        </div>
      </section>

      {/* Fitur */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-extrabold text-warna4 text-center">Apa saja yang ada di sini?</h2>
        <p className="text-center text-warna4/70 mt-2">Semua isi labsheet, sekarang dalam satu website.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {fitur.map(({ icon: Icon, judul, isi, warna }) => (
            <div
              key={judul}
              className="group rounded-2xl bg-warna5 p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition"
            >
              <div className={`${warna} inline-flex h-12 w-12 items-center justify-center rounded-xl text-white group-hover:scale-110 transition`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-warna4">{judul}</h3>
              <p className="mt-2 text-warna4/75">{isi}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contoh program terkunci */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="rounded-3xl bg-warna2 p-8 md:p-10 text-white shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 text-warna5">
              <Lock className="h-5 w-5" />
              <span className="font-semibold uppercase tracking-wide text-sm">Contoh Program Terkunci</span>
            </div>
            <h2 className="mt-2 text-2xl md:text-3xl font-extrabold">Ketik sendiri, pahami logikanya.</h2>
            <p className="mt-2 text-white/80">
              Contoh program tampil samar di belakang kotak ketik. Tulis ulang kodenya huruf demi
              huruf supaya kamu benar-benar paham, bukan sekadar copy-paste.
            </p>

            <ul className="mt-6 space-y-3">
              {aturanTerkunci.map(({ icon: Icon, teks }) => (
                <li key={teks} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warna5 text-warna4">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-white/90">{teks}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ilustrasi kotak ketik */}
          <div className="rounded-2xl bg-warna4 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3 text-xs text-warna5/80 font-mono">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" /> latihan_led.ino
              </span>
              <span className="flex items-center gap-1.5">
                <Timer className="h-3.5 w-3.5" /> 00:42.318
              </span>
            </div>
            <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-x-auto">
              <span className="text-warna5">{contohKode.slice(0, sudahDiketik)}</span>
              <span className="animate-caret text-warna1">▌</span>
              <span className="text-warna5/30">{contohKode.slice(sudahDiketik)}</span>
            </pre>
            <div className="mt-4 flex items-center gap-2 text-xs text-mudah">
              <CircleCheck className="h-4 w-4" /> Semua huruf yang diketik sudah benar
            </div>
          </div>
        </div>
      </section>

      {/* Manfaat */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-extrabold text-warna4 text-center">Kenapa belajar di sini?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {manfaat.map(({ icon: Icon, judul, isi }) => (
            <div key={judul} className="flex items-start gap-4 rounded-2xl border-2 border-warna2/30 p-5">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-warna1/15 text-warna1">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-warna4">{judul}</h3>
                <p className="text-sm text-warna4/75 mt-1">{isi}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
