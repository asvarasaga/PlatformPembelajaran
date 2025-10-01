"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/firebase"
import { collection, 
  getDocs, 
  addDoc,
  orderBy,
  doc,
  setDoc,
  query,

} from "firebase/firestore"

export default function LatihanPage() {
  const [latihanList, setLatihanList] = useState<any[]>([])
  const [currentLatihan, setCurrentLatihan] = useState<any | null>(null)
  const [userCode, setUserCode] = useState("")
  const [nama, setNama] = useState("")
  const [noAbsen, setNoAbsen] = useState("")
  const [selesaiList, setSelesaiList] = useState<string[]>([]) // 🔹 list latihan yang sudah submit
  const [isSiswa, setIsSiswa] = useState<Boolean>(false) // 🔹 apakah ini siswa (bukan guru)
  const [isGuru, setIsGuru] = useState<Boolean>(false) // 🔹 apakah ini guru (bukan siswa)
  const [timer, setTimer] = useState(0) // detik
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef <NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  // 🔹 Reset kode
  const resetUserCode = () => {
    setUserCode("")
    setTimer(0)
    setIsRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
    localStorage.removeItem("userCode")
  }
  // Format waktu jadi mm:ss
    const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  const millis = Math.floor(ms % 1000)

  if (minutes > 0) {
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${millis.toString().padStart(3, "0")}`
  }

  return `${seconds.toString().padStart(2, "0")}.${millis
    .toString()
    .padStart(3, "0")}`
}
  // 🔹 Selesaikan kode (langsung isi semua)
  const completeUserCode = () => {
    if (currentLatihan) {
      setUserCode(currentLatihan.code)
      localStorage.setItem("userCode", currentLatihan.code)
      stopTimer()
    }
  }
  const startTimer = () => {
  if (!isRunning) {
    setIsRunning(true)
    startTimeRef.current = Date.now() - timer // resume dari posisi terakhir
    intervalRef.current = setInterval(() => {
      setTimer(Date.now() - (startTimeRef.current || 0))
    }, 10) // update setiap 10ms
  }
}
  const stopTimer = () => {
  setIsRunning(false)
  if (intervalRef.current) clearInterval(intervalRef.current)
}

const resetTimer = () => {
  setIsRunning(false)
  if (intervalRef.current) clearInterval(intervalRef.current)
  setTimer(0)
  startTimeRef.current = null // ✅ reset base time juga
}
  // 🔹 Ambil data latihan & identitas siswa
  useEffect(() => {
  const fetchLatihan = async () => {
    try {
      // urutkan latihan berdasarkan createdAt (paling lama dulu)
      const q = query(collection(db, "latihan"), orderBy("createdAt", "asc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setLatihanList(data);
      if (data.length > 0) {
        setCurrentLatihan(data[0]);
        resetUserCode();
      }
    } catch (err) {
      console.error("Gagal ambil latihan:", err);
    }
  };

  fetchLatihan();

  // Ambil data dari localStorage
  const savedUserCode = localStorage.getItem("userCode");
  if (savedUserCode) setUserCode(savedUserCode);
  setNama(localStorage.getItem("namaSiswa") || "");
  setNoAbsen(localStorage.getItem("nomorSiswa") || "");
}, []);


  useEffect(() => {
  const checkSiswa = async () => {
    const savedNama = localStorage.getItem("namaSiswa") || ""
    const savedAbsen = localStorage.getItem("nomorSiswa") || ""
    const Savedstate = localStorage.getItem("isGuru") === "true"
    setIsGuru(Savedstate)
    setNama(savedNama)
    setNoAbsen(savedAbsen)

    if (!savedNama) {
      setIsSiswa(false)
      return
    }

    try {
      const snap = await getDocs(collection(db, "latihan_murid"))
      const data = snap.docs.map((doc) => doc.data())

      // 🔹 Cari apakah nama ada di database
      const muridData = data.filter(
        (item: any) => item.nama === savedNama && item.noAbsen === savedAbsen
      )

      if (muridData.length > 0) {
        setIsSiswa(true)
        // 🔹 tandai latihan yang sudah selesai
        setSelesaiList(muridData.map((item: any) => item.latihanId))
      } else {
        setIsSiswa(false)
      }
    } catch (err) {
      console.error("Gagal cek siswa:", err)
      setIsSiswa(false)
    }
  }

  checkSiswa()
}, [])

  // 🔹 Simpan kode tiap kali berubah
  useEffect(() => {
    localStorage.setItem("userCode", userCode)
  }, [userCode])

  const isComplete = currentLatihan && userCode === currentLatihan.code
  const sudahSubmit = currentLatihan && selesaiList.includes(currentLatihan.id)
  const siswasubmit = isSiswa === true

  useEffect(() => {
    if (isComplete) {
      stopTimer()
    }
  }, [isComplete])

  // 🔹 Submit jawaban ke Firestore
  const submitLatihan = async () => {
    if (!nama || !noAbsen) {
      alert("Identitas siswa tidak ditemukan. Silakan login ulang.")
      return
    }
    if (!currentLatihan) return

    try {
      const docId = `${currentLatihan.id}_${noAbsen}`

      await setDoc(doc(db, "latihan_murid", docId), {
         nama,
        noAbsen,
        latihanId: currentLatihan.id,
        status: "selesai",
        waktu: timer, // simpan timer ke firestore
        timestamp: new Date(),
      })

      setSelesaiList((prev) => [...prev, currentLatihan.id]) // ✅ tandai latihan selesai
      alert("Jawaban berhasil disubmit!")
    } catch (err) {
      console.error("Gagal submit jawaban:", err)
      alert("Terjadi kesalahan saat submit.")
    }
  }
  return (
    <div className="flex h-screen bg-warna3">
      {/* Sidebar */}
      <aside className="w-72 bg-warna5 p-4 m-4 rounded-xl shadow overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Daftar Latihan</h2>
        {latihanList.length === 0 ? (
          <p>Belum ada latihan. Silakan hubungi guru.</p>
        ) : (
          latihanList.map((latihan) => (
            <div
              key={latihan.id}
              onClick={() => {
                setCurrentLatihan(latihan)
                resetUserCode()
              }}
              className={`p-4 mb-2 rounded cursor-pointer group ${
                currentLatihan?.id === latihan.id
                  ? "bg-warna4 border-2 border-warna1"
                  : "hover:bg-warna2 bg-warna1"
              }`}
            >
              <h3 className=" rounded-md font-semibold">
                  {String(latihan.title || "").split("|").map((part: string, i: number) => {
                    // warna default per bagian (saat tidak aktif)
                    const colors = ["text-foreground text-lg group-hover:text-background"]

                    let base = "cursor-pointer transition-colors duration-300 "

                    if (currentLatihan.id === latihan.id) {
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
                  {String(latihan.desc || "").split("|").map((part: string, i: number) => {
                    // warna default per bagian (saat tidak aktif)
                    const colors = ["text-foreground group-hover:text-background"]

                    let base = "cursor-pointer transition-colors duration-300 "

                    if (currentLatihan.id === latihan.id) {
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
              {selesaiList.includes(latihan.id) && (
                <span className="text-green-600 text-xs">✅ Selesai</span>
              )}
            </div>
          ))
        )}
      </aside>

      {/* Content */}
      <main className="flex-1 bg-warna5 m-4 p-6 rounded-xl shadow overflow-y-auto">
        {currentLatihan ? (
          <>
            <h1 className="text-2xl font-bold mb-4"><h2 className="flex justify-between">{currentLatihan.title}
              {isGuru === true &&(<Button className="p-2 rounded inclined-block" onClick={() => {
                completeUserCode()
              }
            }   > Complete Code
              </Button>)}
              </h2>
            </h1>
            <p className="flex justify-between text-muted-foreground mb-1">{currentLatihan.desc} <div className="text-lg font-mono p-2 rounded">
                          ⏱ Timer: {formatTime(timer)}
                        </div></p>
            
            <div className="relative w-full h-64 mb-4">
              <pre className="absolute inset-0 bg-black text-muted-foreground p-4 rounded-lg overflow-x-auto opacity-40 pointer-events-none font-mono">
                {currentLatihan.code}
              </pre>

              <textarea
  value={userCode}
  onChange={(e) => {
    const input = e.target.value
    const nextCharIndex = userCode.length
    const targetCode = currentLatihan.code

    // 🔹 mulai timer kalau belum jalan
    if (!isRunning) startTimer()

    if (input.length < userCode.length) {
      setUserCode(input)
      return
    }

    const nextChar = input[input.length - 1]
    if (targetCode[nextCharIndex] === nextChar) {
      setUserCode(input)
    }
  }}
  className="absolute inset-0 w-full h-full p-4 bg-transparent font-mono text-foreground overflow-x-auto rounded-lg resize-none"
  onCopy={(e) => e.preventDefault()}
  onPaste={(e) => e.preventDefault()}
  onCut={(e) => e.preventDefault()}
  onContextMenu={(e) => e.preventDefault()}
  onKeyDown={(e) => {
    if ((e.ctrlKey || e.metaKey) && ["v", "c", "x"].includes(e.key.toLowerCase())) {
      e.preventDefault()
    } 
  }}
/>
            </div>

            <div className="flex mb-4 ">
              {/* Logika tombol */}
                <Button
                  onClick={() => {
                    resetUserCode()
                    resetTimer()
                  }}
                  className="bg-foreground text-background px-4 py-2 rounded hover:bg-warna6 hover:text-foreground"
                >
                  Reset Kode
                </Button>
                <div className="ml-4">
              { isComplete && (
                <div className="flex gap-4 "><Button
                    onClick={() => {
                      navigator.clipboard.writeText(userCode)
                      alert("Kode berhasil disalin ke clipboard!")
                    }}
                    className="bg-warna1 text-background px-4 py-2 rounded hover:bg-warna2"
                  >
                    Copy Kode
                  </Button>
                  <Button
                    onClick={() =>
                      window.open(currentLatihan.link || "https://wokwi.com", "_blank")
                    }
                    className="bg-warna1 text-background px-4 py-2 rounded hover:bg-warna2"
                  >
                    Jalankan Simulasi
                  </Button></div>
              )}
              </div>
              
              <div className="ml-auto">
                {!isGuru && (
            <div className="ml-auto">
              {(isComplete && !sudahSubmit) || (!isComplete && sudahSubmit) ? (
                <Button
                  onClick={isComplete && !sudahSubmit ? submitLatihan : completeUserCode}
                  className="bg-warna2 text-background px-4 py-2 rounded hover:bg-warna4"
                >
                  {isComplete && !sudahSubmit ? "Submit Latihan" : "Selesaikan Kode"}
                </Button>
              ) : null}
            </div>
          )}
              </div>
            </div>
          </>
        ) : (
          <p>Tidak ada latihan dipilih.</p>
        )}
      </main>
    </div>
  )
}
