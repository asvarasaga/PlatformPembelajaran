"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [namaGuru, setNamaGuru] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const isGuru = localStorage.getItem("isGuru");
      const nama = localStorage.getItem("namaGuru");

      if (isGuru === "true" && nama) {
        setNamaGuru(nama);
        setLoading(false);
      } else {
        router.replace("/login");
      }
    } catch (e) {
      console.error("Auth check failed:", e);
      router.replace("/login");
    }
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="">
      <nav className="">
        <div className=""> </div>
        <div className="">
        </div>
      </nav>
      <main className="">{children}</main>
    </div>
  );
}
