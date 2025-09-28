"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";

interface Question {
  question: string;
  answer: string; // jawaban kunci guru
}

interface Tugas {
  id: string;
  title: string;
  questions: Question[];
}

export default function MuridTugasPage() {
  const [tugasList, setTugasList] = useState<Tugas[]>([]);
  const [selected, setSelected] = useState<Tugas | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [namaSiswa, setNamaSiswa] = useState<string>("");
  const [nomorSiswa, setNomorSiswa] = useState<string>("");
  const [isGuru, setIsGuru] = useState<boolean>(false); // untuk proteksi tombol
  // 🔹 simpan jawaban siswa (idTugas -> array jawaban)
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [jawabanId, setJawabanId] = useState<string | null>(null);

  useEffect(() => {
    const nama = localStorage.getItem("namaSiswa") || "";
    const nomor = localStorage.getItem("nomorSiswa") || "";
    const state = localStorage.getItem("isGuru") === "true";
    setNamaSiswa(nama);
    setNomorSiswa(nomor);
    setIsGuru(state);
  }, []);

  // 🔹 Ambil data tugas dari Firestore
  useEffect(() => {
  const fetchTugas = async () => {
    try {
      // urutkan berdasarkan createdAt paling lama
      const q = query(collection(db, "tugas"), orderBy("createdAt", "asc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Tugas[];
      
      setTugasList(data);
      if (data.length > 0) setSelected(data[0]);
    } catch (err) {
      console.error("Gagal ambil tugas:", err);
    }
  };

  fetchTugas();
}, []);

  // 🔹 Cek apakah siswa sudah pernah mengisi jawaban
  useEffect(() => {
  const fetchJawabanSiswa = async () => {
    if (!selected || !namaSiswa || !nomorSiswa) return;

    try {
      const q = query(
        collection(db, "jawaban"),
        where("tugasId", "==", selected.id),
        where("namaSiswa", "==", namaSiswa),
        where("nomorSiswa", "==", nomorSiswa)
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        const docRef = snap.docs[0];
        const docData = docRef.data();

        // ✅ pastikan struktur sesuai { [tugasId]: string[] }
        setAnswers({
          [selected.id]: docData.answers[selected.id] || [],
        });

        setJawabanId(docRef.id);
        setIsSubmitted(true);
      } else {
        setAnswers({
          [selected.id]: new Array(selected.questions.length).fill(""),
        });
        setJawabanId(null);
        setIsSubmitted(false);
      }
    } catch (err) {
      console.error("Gagal cek jawaban siswa:", err);
    }
  };

  fetchJawabanSiswa();
}, [selected, namaSiswa, nomorSiswa]);


  const handleAnswerChange = (index: number, value: string) => {
    if (!selected) return;
    setAnswers((prev) => {
      const current = prev[selected.id] || [];
      const newAnswers = [...current];
      newAnswers[index] = value;
      return { ...prev, [selected.id]: newAnswers };
    });
  };

  // 🔹 Submit jawaban ke Firestore
  const handleSubmit = async () => {
    if (!selected) return;

    try {
      if (jawabanId) {
        // update dokumen lama
        await updateDoc(doc(db, "jawaban", jawabanId), {
          answers,
          updatedAt: new Date(),
        });
      } else {
        // buat dokumen baru
        const ref = await addDoc(collection(db, "jawaban"), {
          tugasId: selected.id,
          namaSiswa,
          nomorSiswa,
          answers,
          createdAt: new Date(),
        });
        setJawabanId(ref.id);
      }

      alert("Jawaban berhasil disimpan!");
      setIsSubmitted(true);
    } catch (err) {
      console.error("Gagal simpan jawaban:", err);
      alert("Terjadi kesalahan saat menyimpan jawaban.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-6">
        {/* Sidebar daftar tugas */}
        <div className="w-64 bg-warna5 p-4 rounded-lg shadow">
          <ul className="space-y-2">
            <h1 className="text-2xl font-bold mb-4">Daftar Tugas</h1>
            {tugasList.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada tugas. Silakan hubungi guru.
              </p>
            ) : (
              tugasList.map((t) => (
                <li
                  key={t.id}
                  className={`p-2 rounded cursor-pointer ${
                    selected?.id === t.id
                      ? "bg-warna4 text-background font-bold text-lg border-2 border-warna1"
                      : "bg-warna1 hover:bg-warna2 text-lg"
                  }`}
                  onClick={() => setSelected(t)}
                >
                  {t.title}
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Detail tugas */}
        <div className="flex-1 bg-warna5 p-4 rounded-lg shadow">
          {selected ? (
            <>
              <h2 className="text-xl font-bold mb-3">{selected.title}</h2>
              <ol className="list-decimal pl-6 space-y-4">
                {selected.questions.map((q, i) => (
                  <li key={i}>
                    <p className="mb-1">{q.question}</p>
                    {isSubmitted ? (
                      <p className="p-2 border rounded bg-background">
                        {answers[selected.id]?.[i] || "-"}
                      </p>
                    ) : (
                      <textarea
                        className="w-full border rounded p-2 bg-background"
                        value={answers[selected.id]?.[i] || ""}
                        onChange={(e) =>
                          handleAnswerChange(i, e.target.value)
                        }
                      />
                    )}
                  </li>
                ))}
              </ol>

              {/* tampilkan tombol hanya jika bukan guru */}
          {!isGuru && (
            isSubmitted ? (
              <Button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 bg-warna6 text-background hover:bg-warna1"
              >
                Edit Jawaban
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="mt-4 bg-warna6 text-background hover:bg-warna1"
              >
                Kirim Jawaban
              </Button>
            )
          )}

            </>
          ) : (
            <p>Pilih salah satu tugas untuk melihat pertanyaan.</p>
          )}
        </div>
      </div>
    </div>
  );
}
