"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Head from "next/head";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";


export default function TheoryPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [currentTopic, setCurrentTopic] = useState<any | null>(null);

  // 🔹 Load data dari Firestore
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        // ambil data urut berdasarkan createdAt (paling lama dulu)
        const q = query(collection(db, "topics"), orderBy("createdAt", "asc"));
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTopics(data);
        if (data.length > 0) setCurrentTopic(data[0]);
      } catch (err) {
        console.error("Gagal ambil topik:", err);
        setTopics([]);
        setCurrentTopic(null);
      }
    };
    fetchTopics();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-warna3">
      <Head>
        <title>Teori - Platform Pembelajaran</title>
        <meta name="description" content="Halaman utama platform pembelajaran" />
      </Head>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-warna5 p-4 m-4 rounded-xl shadow-lg overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Daftar Topik</h2>
          {topics.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada topik. Silakan hubungi guru.
            </p>
          ) : (
            topics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => setCurrentTopic(topic)}
                className={`p-4 rounded-lg border cursor-pointer group ${
                  currentTopic.id === topic.id
                    ? "bg-warna4 border-2 border-warna1"
                    : "hover:bg-warna2 bg-warna1"
                }`}
              >
                <h3 className=" rounded-md font-semibold">
                  {String(topic.title || "").split("|").map((part: string, i: number) => {
                    // warna default per bagian (saat tidak aktif)
                    const colors = ["text-foreground text-lg group-hover:text-background"]

                    let base = "cursor-pointer transition-colors duration-300 "

                    if (currentTopic.id === topic.id) {
                      // kalau card ini aktif
                      if (i === 0) {
                        base += "text-background text-xl font-bold"
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
                </h3>
                <p className="text-sm">
                  {String(topic.desc || "").split("|").map((part: string, i: number) => {
                    // warna default per bagian (saat tidak aktif)
                    const colors = ["text-foreground group-hover:text-background"]

                    let base = "cursor-pointer transition-colors duration-300 "

                    if (currentTopic.id === topic.id) {
                      // kalau card ini aktif
                      if (i === 0) {
                        base += "text-background"
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
              </div>
            ))
          )}
        </aside>

        {/* Content */}
        <main className="flex-1 bg-warna5 m-4 p-6 rounded-xl shadow-lg overflow-y-auto">
          {currentTopic ? (
            <>
              <h1 className="text-2xl font-bold text-warna1 mb-4">
                {currentTopic.title}
              </h1>

              {currentTopic.img && (
                <div>
                  <Image
                    src={currentTopic.img}
                    alt={currentTopic.title}
                    width={350}
                    height={350}
                    className="float-right mr-4 mb-2 rounded-lg shadow-md object-contain"
                  />
                </div>
              )}

              <p className="text-lg leading-relaxed text-muted-foreground">
                {currentTopic.teori}
              </p>
            </>
          ) : (
            <p className="text-muted-foreground">Tidak ada topik yang dipilih.</p>
          )}
        </main>
      </div>
    </div>
  );
}
