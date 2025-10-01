"use client";
import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  where,
  getDoc
} from "firebase/firestore";

export default function AdminMuridPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [number, setNumber] = useState(""); // string untuk input, nanti diubah ke number
  const [editId, setEditId] = useState<string | null>(null);

  const LOCAL_KEY = "murid";

  const saveToLocal = (data: any[]) => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Gagal menyimpan ke localStorage:", e);
    }
  };

  const loadFromLocal = (): any[] => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("Gagal baca localStorage:", e);
      return [];
    }
  };

  // real-time listener ke koleksi "murid" di Firestore
  useEffect(() => {
    const q = query(collection(db, "murid"), orderBy("nama"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setStudents(data);
        saveToLocal(data);
      },
      (error) => {
        console.error("Gagal listen koleksi murid:", error);
        const local = loadFromLocal();
        setStudents(local);
      }
    );
    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setName("");
    setNumber("");
    setEditId(null);
  };

  const addStudent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !number.trim()) {
      alert("Harap isi semua field!");
      return;
    }

    const nomorNum = Number(number); // ubah ke number sekali

    try {
      if (editId) {
        // update existing doc
        await setDoc(
          doc(db, "murid", editId),
          {
            nama: name.trim(),
            nomor: nomorNum, // ✅ disimpan sebagai number
          },
          { merge: true }
        );
      } else {
        // add new doc
        await addDoc(collection(db, "murid"), {
          nama: name.trim(),
          nomor: nomorNum, // ✅ number
          password: number.trim(), // ✅ password tetap string
          createdAt: Date.now(),
        });
      }

      // update UI lokal
      const updated = editId
        ? students.map((s) =>
            s.id === editId
              ? { ...s, nama: name.trim(), nomor: nomorNum }
              : s
          )
        : [
            ...students,
            {
              id: Date.now().toString(),
              nama: name.trim(),
              nomor: nomorNum,
              password: number.trim(),
              createdAt: Date.now(),
            },
          ];
      setStudents(updated);
      saveToLocal(updated);
      resetForm();
    } catch (error) {
      console.error("Gagal menyimpan murid:", error);
      alert("Gagal menyimpan murid, lihat console untuk detail.");
    }
  };

  const handleDelete = async (id: string) => {
  if (!id) return;
  if (!confirm("Yakin ingin menghapus murid ini beserta semua data latihannya?")) return;

  try {
    // 🔹 ambil nama murid dulu
    const muridRef = doc(db, "murid", id);
    const muridSnap = await getDoc(muridRef);
    if (!muridSnap.exists()) {
      console.warn("Murid tidak ditemukan.");
      return;
    }

    const muridData = muridSnap.data();
    const muridNama = muridData?.nama;

    // 🔹 hapus latihan_murid berdasarkan nama
    const latihanQuery = query(
      collection(db, "latihan_murid"),
      where("nama", "==", muridNama)
    );
    const latihanSnap = await getDocs(latihanQuery);
    for (const latihan of latihanSnap.docs) {
      await deleteDoc(doc(db, "latihan_murid", latihan.id));
    }

    // 🔹 hapus jawaban berdasarkan namaSiswa
    const jawabanQuery = query(
      collection(db, "jawaban"),
      where("namaSiswa", "==", muridNama)
    );
    const jawabanSnap = await getDocs(jawabanQuery);
    for (const jawab of jawabanSnap.docs) {
      await deleteDoc(doc(db, "jawaban", jawab.id));
    }

    // 🔹 terakhir hapus murid
    await deleteDoc(muridRef);

    // update UI lokal
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    saveToLocal(updated);
    if (editId === id) resetForm();

  } catch (error) {
    console.error("Gagal hapus murid dan data terkait:", error);
    alert("Terjadi error saat hapus murid, cek console.");
  }
};

  const startEdit = (student: any) => {
    setEditId(student.id);
    setName(student.nama || "");
    setNumber(String(student.nomor || "")); // pastikan balik ke string agar input number tidak error
  };

  return (
    <div className="flex h-screen bg-warna3 p-6 gap-6">
      {/* List */}
      <div className="w-72 bg-warna5 p-4 rounded-xl shadow-lg overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Daftar Murid</h1>
        <ul className="space-y-3">
          {students.map((item) => (
            <li
              key={item.id}
              className={`p-4 rounded-lg shadow cursor-pointer transition-colors group ${
                editId === item.id
                  ? "bg-warna4 border-2 border-warna1"
                  : "bg-warna1 hover:bg-warna2"
              }`}
              onClick={() => startEdit(item)}
            >
              <div>
                <h3 className="rounded-md font-semibold">
                  {item.nama}
                </h3>
                <p className="text-sm">Nomor: {item.nomor}</p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="bg-warna6 text-background hover:bg-warna1"
                >
                  Hapus
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Form */}
      <div className="flex-1 bg-warna5 p-6 rounded-xl shadow-lg overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {editId !== null ? "Edit Murid" : "Tambah Murid"}
        </h2>

        <form onSubmit={addStudent} className="flex flex-col gap-3 mb-6 w-full">
          <input
            type="text"
            placeholder="Nama Murid"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded bg-background shadow"
          />
          <input
            type="number"
            placeholder="Nomor Absen / Nomor Siswa"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="border p-2 rounded bg-background shadow"
          />

          <div className="flex gap-3">
            <Button type="submit" className="bg-warna6 hover:bg-warna1 shadow">
              {editId !== null ? "Simpan Perubahan" : "Tambah Murid"}
            </Button>
            {editId !== null && (
              <Button
                type="button"
                onClick={resetForm}
                className="bg-foreground"
              >
                Batal
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
