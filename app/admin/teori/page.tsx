"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

/**
 * NOTE:
 * - lib/firebase.ts initializes Firebase and exports `db`
 */

export default function AdminTeoriPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [teori, setTeori] = useState("");
  const [img, setImg] = useState("");

  // use string IDs from Firestore
  const [editId, setEditId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // load topics from Firestore (realtime)
  useEffect(() => {
    const q = query(collection(db, "topics"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        setTopics(data);
        setInitialized(true);
      },
      (err) => {
        console.error("Gagal listen topics:", err);
      }
    );
    return () => unsub();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDesc("");
    setTeori("");
    setImg("");
    setEditId(null);
  };

  const formatImgPath = (name: string) => {
    if (!name.trim()) return "";
    if (name.startsWith("http") || name.startsWith("/")) return name;
    return `/${name}`;
  };

  const addTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim() || !teori.trim()) {
      alert("Harap isi semua field!");
      return;
    }

    try {
      const payload = {
        title: title.trim(),
        desc: desc.trim(),
        teori: teori.trim(),
        img: formatImgPath(img),
        createdAt: serverTimestamp(),
      };

      if (editId !== null) {
        // update existing doc - merge to avoid overwriting other fields
        await setDoc(doc(db, "topics", editId), payload, { merge: true });
      } else {
        // add new doc
        await addDoc(collection(db, "topics"), payload);
      }
      resetForm();
    } catch (err) {
      console.error("Gagal menyimpan topik:", err);
      alert("Terjadi kesalahan saat menyimpan topik.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus topik ini?")) return;
    try {
      await deleteDoc(doc(db, "topics", id));
      if (editId === id) resetForm();
    } catch (err) {
      console.error("Gagal hapus topik:", err);
      alert("Gagal menghapus topik.");
    }
  };

  const startEdit = (topic: any) => {
    setEditId(topic.id);
    setTitle(topic.title || "");
    setDesc(topic.desc || "");
    setTeori(topic.teori || "");
    setImg(topic.img || "");
  };

  return (
    <div className="p-6 flex gap-6 bg-warna3 min-h-screen">
      {/* List */}
      <div className="w-72 bg-warna5 p-4 rounded-xl shadow-lg overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Daftar Topik</h1>
          {topics.length === 0 && initialized && <p>Belum ada topik. Silahkan isi form Tambah topik!</p>}
        <ul className="space-y-3 ">
          {topics.map((item) => (
            <li
              key={item.id}
              className={`p-4 rounded-lg shadow cursor-pointer transition-colors group ${
                editId === item.id ? "bg-warna4 border-2 border-warna1" : "bg-warna1 hover:bg-warna2"
              }`}
              onClick={() => startEdit(item)}
            >
              <div>
                <h3 className=" rounded-md font-semibold">
                  {String(item.title || "")
                    .split("|")
                    .map((part: string, i: number) => {
                      // warna default per bagian (saat tidak aktif)
                      const colors = ["text-foreground text-lg group-hover:text-background"];

                      let base = "cursor-pointer transition-colors duration-300 ";

                      if (editId === item.id) {
                        // kalau card ini aktif
                        if (i === 0) {
                          base += "text-background text-xl font-bold";
                        } else {
                          base += "text-warna2";
                        }
                      } else {
                        // kalau card ini tidak aktif → pakai warna sesuai index
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
                  {String(item.desc || "")
                    .split("|")
                    .map((part: string, i: number) => {
                      // warna default per bagian (saat tidak aktif)
                      const colors = ["text-foreground group-hover:text-background"];

                      let base = "cursor-pointer transition-colors duration-300 ";

                      if (editId === item.id) {
                        // kalau card ini aktif
                        if (i === 0) {
                          base += "text-background";
                        } else {
                          base += "text-warna2";
                        }
                      } else {
                        // kalau card ini tidak aktif → pakai warna sesuai index
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
      <div className="flex-1 bg-warna5 p-6 rounded-xl shadow-lg overflow-y-auto ml-6">
        <h3 className="text-2xl font-bold pb-3">{editId !== null ? "Perbarui Topik" : "Tambah Topik"}</h3>
        <form onSubmit={addTopic} className="flex flex-col gap-3 mb-6">
          <input
            type="text"
            placeholder="Judul"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded bg-background shadow"
          />
          <input
            type="text"
            placeholder="Deskripsi"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="border p-2 rounded bg-background shadow"
          />
          <textarea
            placeholder="Isi teori"
            value={teori}
            onChange={(e) => setTeori(e.target.value)}
            className="border p-2 rounded min-h-[100px] bg-background shadow"
          />
          <input
            type="text"
            placeholder="URL Gambar"
            value={img}
            onChange={(e) => setImg(e.target.value)}
            className="border p-2 rounded bg-background shadow"
          />

          <div className="flex gap-3">
            <Button type="submit" className="bg-warna1 hover:bg-warna1">
              {editId !== null ? "Simpan Perubahan" : "Tambah Topik"}
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
