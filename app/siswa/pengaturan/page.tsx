"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function PengaturanMuridPage() {
  const [nama, setNama] = useState("")
  const [nomor, setNomor] = useState("")
  const [docId, setDocId] = useState<string | null>(null)
  const [passwordLama, setPasswordLama] = useState("")
  const [passwordBaru, setPasswordBaru] = useState("")
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Ambil data murid dari localStorage + cari dokumen Firestore
  useEffect(() => {
    const namaSiswa = localStorage.getItem("namaSiswa")
    const nomorSiswaStr = localStorage.getItem("nomorSiswa")

    if (namaSiswa && nomorSiswaStr) {
      setNama(namaSiswa)
      setNomor(nomorSiswaStr)

      const nomorSiswa = Number(nomorSiswaStr) // ✅ ubah ke number

      const fetchDoc = async () => {
        try {
          const q = query(collection(db, "murid"), where("nomor", "==", nomorSiswa))
          const snapshot = await getDocs(q)

          if (!snapshot.empty) {
            const docSnap = snapshot.docs[0]
            setDocId(docSnap.id) // ✅ simpan docId
          } else {
            setError("Akun murid tidak ditemukan.")
          }
        } catch (err) {
          console.error(err)
          setError("Gagal memuat data murid.")
        }
      }

      fetchDoc()
    } else {
      setError("Data login tidak ditemukan di localStorage.")
    }
  }, [])

  async function handleGantiPassword(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!docId) {
      setError("Dokumen murid belum siap.")
      return
    }

    try {
      // Ambil dokumen murid untuk cek password lama
      const q = query(collection(db, "murid"), where("nomor", "==", Number(nomor)))
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        setError("Akun murid tidak ditemukan.")
        return
      }

      const muridData = snapshot.docs[0].data()

      // ✅ cek password lama
      if (String(muridData.password) !== String(passwordLama)) {
        setError("Password lama salah.")
        return
      }

      // ✅ cek konfirmasi
      if (passwordBaru !== konfirmasiPassword) {
        setError("Konfirmasi password tidak sama.")
        return
      }

      // ✅ update password baru
      await updateDoc(doc(db, "murid", docId), {
        password: passwordBaru,
        updatedAt: Date.now(),
      })

      setSuccess("Password berhasil diperbarui.")
      setPasswordLama("")
      setPasswordBaru("")
      setKonfirmasiPassword("")
    } catch (err) {
      console.error(err)
      setError("Terjadi kesalahan saat update password.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-warna3">
      <div className="w-full max-w-md bg-warna5 p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Pengaturan Akun</h1>
        <p className="mb-6">Akun : <span className="font-semibold text-lg">{nama}</span></p>

        <form onSubmit={handleGantiPassword} className="flex flex-col gap-4">
          <Input
            type="password"
            placeholder="Password Lama"
            value={passwordLama}
            onChange={(e) => setPasswordLama(e.target.value)}
            required
            className="bg-background"
          />
          <Input
            type="password"
            placeholder="Password Baru"
            value={passwordBaru}
            onChange={(e) => setPasswordBaru(e.target.value)}
            required
            className="bg-background"
          />
          <Input
            type="password"
            placeholder="Konfirmasi Password Baru"
            value={konfirmasiPassword}
            onChange={(e) => setKonfirmasiPassword(e.target.value)}
            required
            className="bg-background"
          />

          <Button type="submit" className="bg-warna2 hover:bg-warna4 text-white">
            Simpan Perubahan
          </Button>
        </form>

        {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
        {success && <p className="mt-3 text-green-600 text-sm">{success}</p>}
      </div>
    </div>
  )
}
