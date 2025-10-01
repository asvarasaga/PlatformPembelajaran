"use client"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"

export default function GuruLatihanPage() {
  const [latihanList, setLatihanList] = useState<any[]>([])
  const [selectedLatihan, setSelectedLatihan] = useState<any | null>(null)
  const [muridList, setMuridList] = useState<any[]>([])
  const [selesaiMurid, setSelesaiMurid] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // 🔹 Ambil semua latihan & murid
  useEffect(() => {
    const fetchLatihan = async () => {
      const q = query(collection(db, "latihan"), orderBy("createdAt", "asc"))
      const snap = await getDocs(q)
      setLatihanList(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    }

    const fetchMurid = async () => {
      const snap = await getDocs(collection(db, "murid"))
      setMuridList(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    }

    fetchLatihan()
    fetchMurid()
  }, [])

  // 🔹 Ambil daftar murid yang sudah submit latihan tertentu
  const fetchSelesaiMurid = async (latihanId: string) => {
    setLoading(true)
    try {
      const q = query(
        collection(db, "latihan_murid"),
        where("latihanId", "==", latihanId)
      )
      const snap = await getDocs(q)
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setSelesaiMurid(data)
    } catch (err) {
      console.error("Gagal ambil latihan murid:", err)
    }
    setLoading(false)
  }
  const formatTime = (ms: number) => {
      if (!ms && ms !== 0) return "-"
      const totalSeconds = Math.floor(ms / 1000)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      const milliseconds = ms % 1000
      return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds
        .toString()
        .padStart(3, "0")}`
    }
  return (
    <div className="flex h-screen bg-warna3">
      {/* Sidebar daftar latihan */}
      <aside className="w-72 bg-warna5 p-4 m-4 rounded-xl shadow overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">📘 Daftar Latihan</h2>
        {latihanList.length === 0 ? (
          <p>Belum ada latihan.</p>
        ) : (
          latihanList.map((latihan) => (
            <div
              key={latihan.id}
              onClick={() => {
                setSelectedLatihan(latihan)
                fetchSelesaiMurid(latihan.id)
              }}
              className={`p-3 mb-2 rounded cursor-pointer ${
                selectedLatihan?.id === latihan.id
                  ? "bg-warna4 border-2 border-warna1"
                  : "hover:bg-warna2 bg-warna1"
              }`}
            >
              <h3 className="font-semibold">{latihan.title}</h3>
              <p className="text-sm">{latihan.desc}</p>
            </div>
          ))
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-warna5 m-4 p-6 rounded-xl shadow overflow-y-auto">
        {selectedLatihan ? (
          <>
            <h1 className="text-2xl font-bold mb-4">
              Progress Latihan: {selectedLatihan.title}
            </h1>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div>
                {/* ✅ Sudah Selesai */}
                <div className="mb-6 bg-warna3 p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">✅ Sudah Selesai</h2>
                <div className="overflow-y-auto rounded-lg shadow">
                {selesaiMurid.length > 0 ? (
                  <ul className="list-disc ml-6 mb-4 text-lg inline-block">
                    {selesaiMurid.map((m) => (
                      <li key={m.id}>
                        {m.nama} (Absen {Number(m.noAbsen)})
                        <span className="ml-2 text-sm text-muted-foreground">
                              ⏱️ {formatTime(m.waktu)}
                            </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground mb-4">
                    Belum ada murid yang menyelesaikan.
                  </p>
                )}
                </div>
                </div>

                {/* ❌ Belum Selesai */}
                <div className="bg-warna3 p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2">❌ Belum Selesai</h2>
                <ul className="list-disc ml-6">
                  {muridList
                    .filter(
                      (murid) =>
                        !selesaiMurid.find(
                          (s) => Number(s.noAbsen) === Number(murid.nomor)
                        )
                    )
                    .map((murid) => (
                      <li key={murid.id}>
                        {murid.nama} (Absen {murid.nomor})
                      </li>
                    ))}
                </ul>
                </div>
              </div>
            )}
          </>
        ) : (
          <p>Pilih salah satu latihan untuk melihat progress murid.</p>
        )}
      </main>
    </div>
  )
}
