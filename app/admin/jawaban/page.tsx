"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

interface Question {
  question: string;
  answer: string;
}

interface Tugas {
  id: string;
  title: string;
  questions: Question[];
}

interface JawabanSiswa {
  id: string;
  tugasId: string;
  namaSiswa: string;
  nomorSiswa: string; // masih string
  answers: Record<string, string[]>;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function JawabanMuridPage() {
  const [tugasList, setTugasList] = useState<Tugas[]>([]);
  const [selected, setSelected] = useState<Tugas | null>(null);
  const [jawabanList, setJawabanList] = useState<JawabanSiswa[]>([]);
  const [selectedJawaban, setSelectedJawaban] = useState<JawabanSiswa | null>(null);

  // 🔹 ambil daftar tugas
  useEffect(() => {
    const fetchTugas = async () => {
      const snap = await getDocs(collection(db, "tugas"));
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Tugas[];
      setTugasList(data);
    };
    fetchTugas();
  }, []);

  // 🔹 ambil jawaban siswa untuk tugas terpilih
  useEffect(() => {
    const fetchJawaban = async () => {
      if (!selected) return;
      const q = query(collection(db, "jawaban"), where("tugasId", "==", selected.id));
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as JawabanSiswa[];

      // sort manual berdasarkan nomor (parse ke number)
      data.sort((a, b) => Number(a.nomorSiswa) - Number(b.nomorSiswa));

      setJawabanList(data);
      setSelectedJawaban(null);
    };
    fetchJawaban();
  }, [selected]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Jawaban Murid</h1>

      <div className="flex gap-6">
        {/* Sidebar daftar tugas */}
        <div className="w-64 bg-warna5 p-4 rounded-lg shadow">
          <h2 className="font-bold mb-2">Daftar Tugas</h2>
          {tugasList.length === 0 && <a href="/admin/tugas" className="text-warna6">
          Belum ada tugas, silahkan isi di sini!</a>}
          <ul className="space-y-2">
            {tugasList.map((t) => (
              <li
                key={t.id}
                className={`p-2 rounded cursor-pointer ${
                  selected?.id === t.id
                    ? "bg-warna4 border-warna1 border-2 text-background font-bold"
                    : "bg-warna1 hover:bg-warna2"
                }`}
                onClick={() => setSelected(t)}
              >
                {t.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Jawaban siswa */}
        <div className="flex-1 bg-warna5 p-4 rounded-lg shadow">
          {selected ? (
            <>
              <h2 className="text-xl font-bold mb-4">
                Jawaban untuk: {selected.title}
              </h2>

              {!selectedJawaban ? (
                <ul className="space-y-2">
                  {jawabanList.length === 0 && <p className="">Belum ada yang menyelesaikan tugas ini!</p>}
                  {jawabanList.map((j) => (
                    <li
                      key={j.id}
                      className="p-3 bg-warna1 rounded cursor-pointer hover:bg-warna2"
                      onClick={() => setSelectedJawaban(j)}
                    >
                      <p className="font-semibold">
                        {j.namaSiswa} ({j.nomorSiswa})
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>
                  <Button
                    className="mb-4 bg-warna6 text-white"
                    onClick={() => setSelectedJawaban(null)}
                  >
                    ← Kembali
                  </Button>

                  <h3 className="text-lg font-bold mb-3">
                    {selectedJawaban.namaSiswa} ({selectedJawaban.nomorSiswa})
                  </h3>

                  <ol className="list-decimal pl-6 space-y-4">
                    {selected.questions.map((q, i) => {
                      const jawabanMurid =
                        selectedJawaban.answers[selected.id]?.[i] || "-";
                      const benar =
                        jawabanMurid.trim().toLowerCase() ===
                        q.answer.trim().toLowerCase();

                      return (
                        <li key={i} className="bg-warna3 w-full rounded">
                          <p className="font-semibold ml-2">{q.question}</p>
                          <p
                            className={`p-2 border rounded inline-block ml-2 ${
                              benar ? "bg-background border-mudah border-2 rounded-lg gap-2" : "bg-background border-sulit border-2 rounded-lg gap-2"
                            }`}
                          >
                            {jawabanMurid}
                          </p>
                          <p className="text-sm text-muted-foreground ml-2">
                            Kunci: {q.answer}
                          </p>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}
            </>
          ) : (
            <p>Pilih tugas untuk melihat jawaban siswa.</p>
          )}
        </div>
      </div>
    </div>
  );
}
