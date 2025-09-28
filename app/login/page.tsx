"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

interface Siswa {
  id: string;
  nama: string;
  nomor: string;
  password?: string;
}

interface Guru {
  id: string;
  nama: string;
  password: string;
}

const DEFAULT_ADMIN = {
  nama: "superadmin",
  password: "123456",
};

export default function LoginPage() {
  const router = useRouter();
  const [loginType, setLoginType] = useState<"guru" | "siswa">("guru");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedSiswa, setSelectedSiswa] = useState<string>("");
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [error, setError] = useState("");

  // 🔒 Cegah akses login kalau sudah login
  useEffect(() => {
    const isGuru = localStorage.getItem("isGuru");
    const isSiswa = localStorage.getItem("isSiswa");

    if (isGuru === "true") {
      router.replace("/admin/dashboard");
    } else if (isSiswa === "true") {
      router.replace("/siswa/dashboard");
    }
  }, [router]);

  // 🔹 Load daftar siswa
  useEffect(() => {
    const loadSiswa = async () => {
      try {
        const q = collection(db, "murid");
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => {
          const doc = d.data() as any;
          return {
            id: d.id,
            nama: doc.nama || "",
            nomor: doc.nomor || "",
            password: doc.password || "",
          } as Siswa;
        });
        data.sort((a, b) => Number(a.nomor) - Number(b.nomor));
        setSiswaList(data);
        if (data.length > 0) setSelectedSiswa(data[0].id);
        localStorage.setItem("siswaList", JSON.stringify(data));
      } catch (err) {
        console.error("Failed to load siswa:", err);
        setError("Gagal memuat daftar siswa");
      }
    };
    loadSiswa();
  }, []);

  // 🔹 Fungsi login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (loginType === "guru") {
      if (username === DEFAULT_ADMIN.nama && password === DEFAULT_ADMIN.password) {
        localStorage.setItem("isGuru", "true");
        localStorage.setItem("namaGuru", DEFAULT_ADMIN.nama);
        localStorage.setItem("lastActivity", Date.now().toString());
        window.dispatchEvent(new Event("loginChange"));
        router.push("/admin/dashboard");
        return;
      }

      try {
        const q = query(
          collection(db, "guru"),
          where("nama", "==", username),
          where("password", "==", password)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const guru = snap.docs[0].data() as Guru;
          localStorage.setItem("isGuru", "true");
          localStorage.setItem("namaGuru", guru.nama);
          localStorage.setItem("lastActivity", Date.now().toString());
          window.dispatchEvent(new Event("loginChange"));
          router.push("/admin/dashboard");
        } else {
          setError("Nama atau password salah");
        }
      } catch (err) {
        console.error("Guru login failed:", err);
        setError("Gagal login guru");
      }
    } else {
      const siswa = siswaList.find((s) => s.id === selectedSiswa);
      if (!siswa) {
        setError("Siswa tidak ditemukan");
        return;
      }

      if (siswa.password !== password) {
        setError("Password salah");
        return;
      }

      localStorage.setItem("isSiswa", "true");
      localStorage.setItem("namaSiswa", siswa.nama);
      localStorage.setItem("nomorSiswa", siswa.nomor);
      localStorage.setItem("lastActivity", Date.now().toString());
      window.dispatchEvent(new Event("loginChange"));
      router.push("/siswa/dashboard");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-80 px-6 py-2 bg-warna1 border flex flex-col border-muted-foreground">
        <h1 className="text-2xl font-bold text-background mb-4">Login</h1>

        {/* Toggle Login */}
        <div className="flex gap-2">
          <button
            className={`flex-1 py-2 rounded px-4 ${
              loginType === "guru" ? "bg-warna4 text-background" : "bg-warna2"
            }`}
            onClick={() => setLoginType("guru")}
            type="button"
          >
            Guru
          </button>
          <button
            className={`flex-1 py-2 rounded px-4 ${
              loginType === "siswa" ? "bg-warna4 text-background" : "bg-warna2"
            }`}
            onClick={() => setLoginType("siswa")}
            type="button"
          >
            Siswa
          </button>
        </div>

        {/* Form */}
        <div className="p-6 flex flex-col gap-4 bg-warna1">
          <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
            {loginType === "guru" ? (
              <>
                <input
                  type="text"
                  placeholder="Nama guru"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border p-2 rounded text-foreground bg-background"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-2 rounded text-foreground bg-background"
                  required
                />
              </>
            ) : (
              <>
                <select
                  value={selectedSiswa}
                  onChange={(e) => setSelectedSiswa(e.target.value)}
                  className="border p-2 rounded text-foreground bg-background"
                  required
                >
                  <option value="">-- Pilih Siswa --</option>
                  {siswaList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nomor} - {s.nama}
                    </option>
                  ))}
                </select>
                <input
                  type="password"
                  placeholder="Password siswa"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-2 rounded text-foreground bg-background"
                  required
                />
              </>
            )}

            <button
              type="submit"
              className="bg-warna2 text-white py-2 rounded hover:bg-warna4"
            >
              Login
            </button>
            {error && (
              <p className="bg-background text-warna6 px-4 text-sm">{error}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
