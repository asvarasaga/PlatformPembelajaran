"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GuruPage() {
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [guruList, setGuruList] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ambil data
  async function fetchGuru() {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "guru"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setGuruList(data);
    setLoading(false);
  }

  // tambah guru
  async function handleTambahGuru(e: React.FormEvent) {
    e.preventDefault();
    if (!nama || !password) return;

    if (editId) {
      // update
      await updateDoc(doc(db, "guru", editId), { nama, password });
      setEditId(null);
    } else {
      // tambah baru
      await addDoc(collection(db, "guru"), {
        nama,
        password,
        createdAt: new Date(),
      });
    }

    setNama("");
    setPassword("");
    fetchGuru();
  }

  // hapus guru
  async function handleHapusGuru(id: string) {
    await deleteDoc(doc(db, "guru", id));
    fetchGuru();
  }

  // set form edit
  function startEdit(guru: any) {
    setEditId(guru.id);
    setNama(guru.nama);
    setPassword(guru.password);
  }

  // reset form
  function resetForm() {
    setEditId(null);
    setNama("");
    setPassword("");
  }

  useEffect(() => {
    fetchGuru();
  }, []);

  return (
    <div className="flex h-screen bg-warna3 p-6 gap-6">
      {/* Sidebar kiri (List Guru) */}
      <div className="w-72 bg-warna5 p-4 rounded-xl shadow-lg overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Daftar Akun Guru</h1>
        <ul className="space-y-3">
          {loading ? (
            <p className="text-sm">Loading...</p>
          ) : guruList.length === 0 ? (
            <p className="text-sm">
              Belum ada akun guru, silahkan isi form tambah!
            </p>
          ) : (
            guruList.map((guru) => (
              <li
                key={guru.id}
                className={`p-4 rounded-lg shadow cursor-pointer transition-colors group ${
                  editId === guru.id
                    ? "bg-warna4 border-2 border-warna1"
                    : "bg-warna1 hover:bg-warna2"
                }`}
                onClick={() => startEdit(guru)}
              >
                <div>
                  <h3
                    className={`font-semibold ${
                      editId === guru.id
                        ? "text-background text-lg"
                        : "text-foreground group-hover:text-background"
                    }`}
                  >
                    {guru.nama}
                  </h3>
                  <p
                    className={`text-sm ${
                      editId === guru.id
                        ? "text-warna2"
                        : "text-foreground group-hover:text-background"
                    }`}
                  >
                    Password: {guru.password}
                  </p>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHapusGuru(guru.id);
                    }}
                    className="bg-warna6 text-background hover:bg-warna1"
                  >
                    Hapus
                  </Button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Form kanan */}
      <div className="flex-1 bg-warna5 p-6 rounded-xl shadow-lg overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">
          {editId !== null ? "Edit Akun Guru" : "Tambah Akun Guru"}
        </h1>
        <form onSubmit={handleTambahGuru} className="flex flex-col gap-3">
          <Input
            type="text"
            placeholder="Nama Guru"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="border p-2 rounded bg-background shadow-sm"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded bg-background shadow-sm"
            required
          />
          <div className="flex gap-3">
            <Button type="submit" className="bg-warna6 text-background">
              {editId !== null ? "Simpan Perubahan" : "Tambah Guru"}
            </Button>
            {editId !== null && (
              <Button
                type="button"
                onClick={resetForm}
                className="bg-muted-foreground text-background"
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
