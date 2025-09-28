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
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";

export default function AdminMuridPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
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
        const data = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        setStudents(data);
        saveToLocal(data);
      },
      (error) => {
        console.error("Gagal listen koleksi murid:", error);
        // fallback ke localStorage agar halaman read-only tetap bisa akses data
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

  try {
    if (editId) {
      // update existing doc
      await setDoc(
        doc(db, "murid", editId),
        { 
          nama: name.trim(), 
          nomor: Number(number) 
          // password tidak diubah saat edit kecuali kamu mau tambahin manual
        },
        { merge: true }
      );
    } else {
      // add new doc
      await addDoc(collection(db, "murid"), {
        nama: name.trim(),
        nomor: Number(number),  // simpan sebagai number
        password: number.trim(), // ✅ password default sama dengan nomor absen
        createdAt: Date.now(),
      });
    }

    // update UI secara lokal
    const updated = editId
      ? students.map((s) => (s.id === editId ? { ...s, nama: name.trim(), nomor: Number(number) } : s))
      : [...students, { id: Date.now().toString(), nama: name.trim(), nomor: Number(number), password: number.trim(), createdAt: Date.now() }];
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
    if (!confirm("Yakin ingin menghapus murid ini?")) return;

    const docRef = doc(db, "murid", id);

    try {
      // check existence first to give clearer feedback / fallback
      try {
        const snap = await getDoc(docRef);
        if (!snap.exists()) {
          // if document does not exist in Firestore, just remove locally
          const updated = students.filter((s) => s.id !== id);
          setStudents(updated);
          saveToLocal(updated);
          if (editId === id) resetForm();
          console.warn("Dokumen tidak ditemukan di Firestore, dihapus secara lokal.");
          return;
        }
      } catch (checkErr) {
        // if check fails, continue to attempt delete and handle errors below
        console.warn("Gagal cek dokumen sebelum hapus:", checkErr);
      }

      await deleteDoc(docRef);
      const updated = students.filter((s) => s.id !== id);
      setStudents(updated);
      saveToLocal(updated);
      if (editId === id) resetForm();
    } catch (error: any) {
      console.error("Gagal hapus murid:", error);

      // handle common permission error explicitly
      if (error?.code === "permission-denied") {
        alert("Tidak punya izin menghapus data di Firestore. Periksa aturan security atau pastikan pengguna sudah login.");
        return;
      }

      // fallback: remove locally to keep UI consistent
      const updated = students.filter((s) => s.id !== id);
      setStudents(updated);
      saveToLocal(updated);
      if (editId === id) resetForm();

      alert("Gagal menghapus murid di Firestore, item dihapus secara lokal. Lihat console untuk detail.");
    }
  };

  const startEdit = (student: any) => {
    setEditId(student.id);
    setName(student.nama || "");
    setNumber(student.nomor || "");
  };

  return (
    <div className="flex h-screen bg-warna3 p-6 gap-6">
      {/* List */}
      <div className="w-72 bg-warna5 p-4 rounded-xl shadow-lg overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Daftar Murid</h1>
        <ul className="space-y-3 ">
          {students.map((item) => (
            <li
              key={item.id}
              className={`p-4 rounded-lg shadow cursor-pointer transition-colors group ${
                editId === item.id ? "bg-warna4 border-2 border-warna1" : "bg-warna1 hover:bg-warna2"
              }`}
              onClick={() => startEdit(item)}
            >
              <div>
                <h3 className=" rounded-md font-semibold">
                  {String(item.nama || "").split("|").map((part: string, i: number) => {
                    const colors = ["text-foreground text-lg group-hover:text-background"];
                    let base = "cursor-pointer transition-colors duration-300 ";
                    if (editId === item.id) {
                      if (i === 0) {
                        base += "text-background text-xl font-bold";
                      } else {
                        base += "text-warna2";
                      }
                    } else {
                      base += colors[i] || "text-foreground group-hover:text-background";
                    }
                    return (
                      <span key={i} className={base}>
                        {part.trim()}{" "}
                      </span>
                    );
                  })}
                </h3>

                <p className="text-sm">
                  {String(item.nomor || "").split("|").map((part: string, i: number) => {
                    const colors = ["text-foreground group-hover:text-background"];
                    let base = "cursor-pointer transition-colors duration-300 ";
                    if (editId === item.id) {
                      if (i === 0) {
                        base += "text-background";
                      } else {
                        base += "text-warna2";
                      }
                    } else {
                      base += colors[i] || "text-foreground group-hover:text-background";
                    }
                    return (
                      <span key={i} className={base}>
                        {part.trim()}{" "}
                      </span>
                    );
                  })}
                </p>
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
        <h2 className="text-2xl font-bold mb-4">{editId !== null ? "Edit Murid" : "Tambah Murid"}</h2>

        <form onSubmit={addStudent} className="flex flex-col gap-3 mb-6 w-full ">
          <input
            type="text"
            placeholder="Nama Murid"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded bg-background shadow"
          />
          <input
            type="number"   // ✅ ubah ke number
            placeholder="Nomor Absen / Nomor Siswa"
            value={number}
            onChange={(e) => setNumber(e.target.value)} // tetap string di state
            className="border p-2 rounded bg-background shadow"
          />


          <div className="flex gap-3">
            <Button type="submit" className="bg-warna6 hover:bg-warna1 shadow">
              {editId !== null ? "Simpan Perubahan" : "Tambah Murid"}
            </Button>
            {editId !== null && (
              <Button type="button" onClick={resetForm} className="bg-foreground">
                Batal
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
