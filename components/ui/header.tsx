"use client";

import Link from "next/link";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [role, setRole] = useState<"admin" | "siswa" | null>(null);

  const checkRole = () => {
    const isGuru = localStorage.getItem("isGuru") === "true";
    const isSiswa = localStorage.getItem("isSiswa") === "true";

    if (isGuru) setRole("admin");
    else if (isSiswa) setRole("siswa");
    else setRole(null);
  };

  useEffect(() => {
    checkRole();
    window.addEventListener("loginChange", checkRole);
    return () => window.removeEventListener("loginChange", checkRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isGuru");
    localStorage.removeItem("isSiswa");
    localStorage.removeItem("username");
    localStorage.removeItem("namaGuru");
    localStorage.removeItem("namaSiswa");
    localStorage.removeItem("nomorSiswa");
    localStorage.removeItem("lastActivity");
    window.dispatchEvent(new Event("loginChange"));
    router.push("/");
  };

  return (
    <header className="border-b border-border bg-warna1 flex p-4 justify-between items-center">
      <div className="flex items-center gap-4">
        <img src="/LOGO_UNY.png" alt="logo" className="h-16 w-16" />
      </div>

      <div className="flex gap-3">
        {role === "admin" && (
          <Link href="/admin/dashboard">
            <img src="/home.png" alt="home" className="h-6 w-6" />
          </Link>
        )}
        {role === "siswa" && (
          <Link href="/siswa/dashboard">
            <img src="/home.png" alt="home" className="h-6 w-6" />
          </Link>
        )}
        {role ? (
          <Button onClick={handleLogout} className="flex gap-3">
            Logout
          </Button>
        ) : (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
