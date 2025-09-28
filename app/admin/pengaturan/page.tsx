"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function AdminPengaturanPage() {
  const [namaGuru, setNamaGuru] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedNama = localStorage.getItem("namaGuru");
    if (storedNama) setNamaGuru(storedNama);
  }, []);

    const handleChangePassword = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage("");

  if (!oldPassword || !newPassword || !confirmPassword) {
    setMessage("Semua field wajib diisi");
    return;
  }

  if (newPassword !== confirmPassword) {
    setMessage("Password baru dan konfirmasi tidak cocok");
    return;
  }

    const q = query(collection(db, "guru"), where("nama", "==", namaGuru));
    const snap = await getDocs(q);
    if (snap.empty) {
  setMessage("Data guru tidak ditemukan");
  return;
    }
    const guruDoc = snap.docs[0];
if (guruDoc.data().password !== oldPassword) {
  setMessage("Password lama salah");
  return;
}
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage("Semua field wajib diisi");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Password baru dan konfirmasi tidak cocok");
      return;
    }

    try {
    // 🔹 kalau superadmin (hardcode)
    if (namaGuru === "superadmin") {
      const saved = localStorage.getItem("superadminPassword") || "123456";
      if (oldPassword !== saved) {
        setMessage("Password lama salah");
        return;
      }
      localStorage.setItem("superadminPassword", newPassword);
      setMessage("Password superadmin berhasil diganti!");
      return;
    }

    // 🔹 untuk guru di Firestore (PAKAI QUERY HASIL)
    const q = query(collection(db, "guru"), where("nama", "==", namaGuru));
    const snap = await getDocs(q);

    if (snap.empty) {
      setMessage("Data guru tidak ditemukan");
      return;
    }

    const guruDoc = snap.docs[0]; // ambil dokumen pertama
    const data = guruDoc.data() as any;

    if (data.password !== oldPassword) {
      setMessage("Password lama salah");
      return;
    }

    await updateDoc(doc(db, "guru", guruDoc.id), { password: newPassword });
    setMessage("Password berhasil diperbarui!");
  } catch (err) {
    console.error("Gagal update password:", err);
    setMessage("Terjadi kesalahan saat ganti password");
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-warna3">
      <div className="bg-warna5 p-6 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Pengaturan Password Admin
        </h1>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Password Lama"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="border p-2 rounded bg-background"
          />
          <input
            type="password"
            placeholder="Password Baru"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border p-2 rounded bg-background"
          />
          <input
            type="password"
            placeholder="Konfirmasi Password Baru"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-2 rounded bg-background"
          />

          <Button type="submit" className="bg-warna1 text-background shadow">
            Ganti Password
          </Button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-foreground">{message}</p>
        )}
      </div>
    </div>
  );
}
