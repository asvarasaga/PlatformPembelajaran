"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/firebase"
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"

export default function AdminLatihanPage() {
  const [latihanList, setLatihanList] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [code, setCode] = useState("")
  const [link, setLink] = useState("")
  const [editId, setEditId] = useState<string | null>(null)

  // Load any cached data from localStorage first so read-only page can access it
  useEffect(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("latihanList") : null
      if (saved) {
        setLatihanList(JSON.parse(saved))
      }
    } catch (err) {
      console.error("Gagal membaca localStorage:", err)
    }
  }, [])

  // 🔹 Load data dari Firestore (real-time) and keep localStorage in sync
  useEffect(() => {
    try {
      const q = query(collection(db, "latihan"), orderBy("createdAt", "asc"))
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          setLatihanList(data as any[])
          try {
            if (typeof window !== "undefined") {
              localStorage.setItem("latihanList", JSON.stringify(data))
            }
          } catch (err) {
            console.error("Gagal menyimpan ke localStorage:", err)
          }
        },
        (err) => {
          console.error("Gagal baca Firestore:", err)
        }
      )
      return () => unsub()
    } catch (err) {
      console.error("Gagal inisialisasi Firestore:", err)
    }
  }, [])

  const resetForm = () => {
    setTitle("")
    setDesc("")
    setDifficulty("")
    setCode("")
    setLink("")
    setEditId(null)
  }

  const addLatihan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !desc.trim() || !code.trim()) {
      alert("Harap isi semua field!")
      return
    }

    try {
      if (editId !== null) {
        // update latihan di Firestore
        const ref = doc(db, "latihan", editId)
        await updateDoc(ref, { title, desc, difficulty, code, link })
      } else {
        // tambah baru ke Firestore
        await addDoc(collection(db, "latihan"), {
          title,
          desc,
          difficulty,
          code,
          link,
          createdAt: serverTimestamp(),
        })
      }
      resetForm()
    } catch (err) {
      console.error("Gagal menyimpan ke Firestore:", err)
      alert("Gagal menyimpan data.")
    }
  }

  const deleteLatihan = async (id: string) => {
    if (confirm("Yakin ingin menghapus latihan ini?")) {
      try {
        await deleteDoc(doc(db, "latihan", id))
        if (editId === id) resetForm()
      } catch (err) {
        console.error("Gagal hapus di Firestore:", err)
        alert("Gagal menghapus data.")
      }
    }
  }

  const startEdit = (item: any) => {
    setEditId(item.id)
    setTitle(item.title || "")
    setDesc(item.desc || "")
    setDifficulty(item.difficulty || "")
    setCode(item.code || "")
    setLink(item.link || "")
  }

  return (
    <div className="flex h-screen bg-warna3 p-6 gap-6">
      {/* Sidebar kiri (List Latihan) */}
      <div className="w-72 bg-warna5 p-4 rounded-xl shadow-lg overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Daftar Latihan</h1>
      <ul className="space-y-3 ">
        {latihanList.length === 0 ? (
          <p className="text-sm">Belum ada latihan, silahkan isi form tambah latihan!</p>
        ) : (
          latihanList.map((item: any) => (
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
                <h3 className=" rounded-md font-semibold">
                  {String(item.title || "").split("|").map((part: string, i: number) => {
                    // warna default per bagian (saat tidak aktif)
                    const colors = ["text-foreground text-lg group-hover:text-background"]

                    let base = "cursor-pointer transition-colors duration-300 "

                    if (editId === item.id) {
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
                  {String(item.desc || "").split("|").map((part: string, i: number) => {
                    // warna default per bagian (saat tidak aktif)
                    const colors = ["text-foreground group-hover:text-background"]

                    let base = "cursor-pointer transition-colors duration-300 "

                    if (editId === item.id) {
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
                <Badge
                  className={`
    text-xs px-2 py-1 rounded
    ${
      item.difficulty === "Mudah"
        ? "bg-mudah text-foreground"
        : item.difficulty === "Menengah"
        ? "bg-menengah text-background"
        : item.difficulty === "Sulit"
        ? "bg-sulit text-background"
        : "bg-gray-400 text-background"
    }
  `}
                >
                  {item.difficulty}
                </Badge>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteLatihan(item.id)
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
          {editId !== null ? "Edit Latihan" : "Tambah Latihan Baru"}
        </h1>
        <form onSubmit={addLatihan} className="flex flex-col gap-3">
          <Input
            type="text"
            placeholder="Judul"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
            className="border p-2 rounded bg-background shadow-sm"
          />
          <Input
            type="text"
            placeholder="Deskripsi"
            value={desc}
            onChange={(e: any) => setDesc(e.target.value)}
            className="border p-2 rounded bg-background shadow-sm"
          />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border p-2 rounded bg-background shadow-sm"
          >
            <option value="">-- Pilih Tingkat Kesulitan --</option>
            <option value="Mudah">Mudah</option>
            <option value="Menengah">Menengah</option>
            <option value="Sulit">Sulit</option>
          </select>

          <Textarea
            placeholder="Kode Program"
            value={code}
            onChange={(e: any) => setCode(e.target.value)}
            className="border p-2 rounded min-h-[100px] bg-background shadow-sm"
          />
          <Input
            type="text"
            placeholder="Link Wokwi (opsional)"
            value={link}
            onChange={(e: any) => setLink(e.target.value)}
            className="border p-2 rounded bg-background shadow-sm"
          />

          <div className="flex gap-3">
            <Button type="submit" className="bg-warna6 text-background">
              {editId !== null ? "Simpan Perubahan" : "Tambah Latihan"}
            </Button>
            {editId !== null && (
              <Button type="button" onClick={resetForm} className="bg-muted-foreground text-background">
                Batal
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
