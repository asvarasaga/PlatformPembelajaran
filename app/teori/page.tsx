"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TheoryPage() {
  const topics = [
    { 
        id: 1, 
        title: "ESP32", 
        desc: "Mikrokontroler dengan WiFi & Bluetooth.",
        teori: "ESP32 adalah mikrokontroler buatan Espressif yang dilengkapi dengan modul WiFi dan Bluetooth. Sangat populer digunakan untuk proyek IoT karena hemat daya, murah, dan mudah diprogram.",
        img: "/esp32_board.png"
    },
    { 
        id: 2, 
        title: "Arduino", 
        desc: "Platform open-source untuk prototyping.",
        teori: "Arduino adalah platform open-source yang terdiri dari papan mikrokontroler dan lingkungan pengembangan perangkat lunak (IDE). Memudahkan pembuatan prototipe elektronik interaktif.",
        img: "/arduino_board.png"
    },
    { 
        id: 3, 
        title: "Konsep IoT", 
        desc: "Internet of Things menghubungkan perangkat ke internet.",
        teori: "Internet of Things (IoT) adalah konsep menghubungkan perangkat fisik ke internet untuk mengirim dan menerima data. Contohnya termasuk smart home, wearable devices, dan sistem monitoring industri.",
        img: "/iot_concept.png"
    },
    { 
        id: 4, 
        title: "Perbedaan ESP32 & Arduino", 
        desc: "ESP32 lebih powerful dibanding Arduino UNO.",
        teori: "ESP32 memiliki prosesor dual-core, WiFi, dan Bluetooth bawaan, sedangkan Arduino UNO menggunakan prosesor single-core tanpa konektivitas nirkabel. ESP32 lebih cocok untuk aplikasi IoT yang kompleks.",
        img: "/esp32_vs_arduino.png"
    },
  ];

  const [currentTopic, setCurrentTopic] = useState(topics[0]);

  return (
    <div className="h-screen flex flex-col bg-warna3">
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
              <Button className="text-background bg-transparent hover:bg-warna2">Kembali</Button>
            </Link>
            <Badge variant="secondary" className="text-sm">Versi 1.0.0</Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-[#ffe1bd] p-4 m-4 rounded-xl shadow-lg overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Pilih Topik</h2>
          {topics.map(topic => (
            <div
              key={topic.id}
              onClick={() => setCurrentTopic(topic)}
              className={`p-4 rounded-lg border cursor-pointer group 
                ${currentTopic.id === topic.id ? "bg-warna4" : "hover:bg-warna4 bg-warna3"}`}
            >
              <p className="text-base font-bold">{topic.title.split("|").map((part, i) => {
                        // warna default per bagian (saat tidak aktif)
                        const colors = [
                          "text-foreground group-hover:text-background"]

                        let base = "cursor-pointer transition-colors duration-300 "

                        if (currentTopic.id === topic.id) {
                          // kalau card ini aktif
                          if (i === 0) {
                            base += "text-background font-bold"
                          } else {
                            base += "text-warna2"
                          }
                        } else {
                          // kalau card ini tidak aktif → pakai warna sesuai index
                          base += colors[i] || "text-foreground group-hover:text-background"
                        }

                        return (
                          <span key={i} className={base}>
                            {part.trim()}{" "}
                          </span>
                        )
                      })}
                      </p>
              <span className="">{topic.desc.split("|").map((part, i) => {
                        // warna default per bagian (saat tidak aktif)
                        const colors = [
                          "text-xs text-muted-foreground group-hover:text-background"]

                        let base = "cursor-pointer transition-colors duration-300 "

                        if (currentTopic.id === topic.id) {
                          // kalau card ini aktif
                          if (i === 0) {
                            base += "text-xs text-background font-semibold"
                          } else {
                            base += "text-xs text-warna2"
                          }
                        } else {
                          // kalau card ini tidak aktif → pakai warna sesuai index
                          base += colors[i] || "text-xs text-foreground group-hover:text-background"
                        }

                        return (
                          <span key={i} className={base}>
                            {part.trim()}{" "}
                          </span>
                        )
                      })}
                        </span>
                      </div>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 bg-warna5 m-4 p-6 rounded-xl shadow-lg overflow-y-auto">
          <h1 className="text-2xl font-bold text-warna1 mb-4">{currentTopic.title}</h1>
          <p className="text-lg leading-relaxed text-muted-foreground mb-4">{currentTopic.teori}</p>
          <Image
            src={currentTopic.img}
            alt={currentTopic.title}
            width={350}
            height={200}
            className="rounded-lg shadow-md mb-4"
          />
        </main>
      </div>
      <footer className="border-t border-border bg-warna2 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-background">
            <p>© 2025 SMK N 3 Yogyakarta - Platform Pembelajaran ESP32</p>
            <p className="text-sm mt-1">Dikembangkan untuk melatih kemampuan Antarmuka dan Komunikasi Data siswa Teknik Elektronika</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
