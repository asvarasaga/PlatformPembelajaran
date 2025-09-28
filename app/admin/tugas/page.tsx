"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Question {
  question: string;
  answer: string;
}
interface Tugas {
  id: string;
  title: string;
  questions: Question[];
}

export default function AdminTugasPage() {
  const [tugasList, setTugasList] = useState<Tugas[]>([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editQuestionIndex, setEditQuestionIndex] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  // untuk pertanyaan
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  useEffect(() => {
    const q = query(collection(db, "tugas"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => {
        const docData = d.data() as any;
        return {
          id: d.id,
          title: docData.title || "",
          questions: docData.questions || [],
        } as Tugas;
      });
      setTugasList(data);
    });
    return unsub;
  }, []);

  const handleAdd = async () => {
    if (!title.trim()) return alert("Judul tugas tidak boleh kosong!");
    try {
      if (editId) {
        await updateDoc(doc(db, "tugas", editId), { title: title.trim() });
      } else {
        await addDoc(collection(db, "tugas"), {
          title: title.trim(),
          questions: [],
          createdAt: serverTimestamp(),
        });
      }
      setTitle("");
      setEditId(null);
    } catch (err) {
      console.error("Error menyimpan tugas:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus tugas ini?")) return;
    try {
      await deleteDoc(doc(db, "tugas", id));
    } catch (err) {
      console.error("Error menghapus tugas:", err);
    }
  };

  const handleAddQuestion = async (id: string) => {
  if (!newQuestion.trim() || !newAnswer.trim()) return;
  try {
    await updateDoc(doc(db, "tugas", id), {
      questions: arrayUnion({
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
      }),
    });
    setNewQuestion("");
    setNewAnswer("");
  } catch (err) {
    console.error("Error menambah pertanyaan:", err);
  }
};
  
const handleUpdateQuestion = async (id: string) => {
  if (editQuestionIndex === null) return;

  try {
    const tugas = tugasList.find((t) => t.id === id);
    if (!tugas) return;

    const newQuestions = [...tugas.questions];
    newQuestions[editQuestionIndex] = {
      question: editQuestion.trim(),
      answer: editAnswer.trim(),
    };

    await updateDoc(doc(db, "tugas", id), { questions: newQuestions });

    setEditQuestionIndex(null);
    setEditQuestion("");
    setEditAnswer("");
  } catch (err) {
    console.error("Error update pertanyaan:", err);
  }
};

const handleDeleteQuestion = async (id: string, index: number) => {
  try {
    const tugas = tugasList.find((t) => t.id === id);
    if (!tugas) return;

    const newQuestions = tugas.questions.filter((_, i) => i !== index);

    await updateDoc(doc(db, "tugas", id), { questions: newQuestions });

    // kalau sedang edit pertanyaan yang dihapus → reset state
    if (editQuestionIndex === index) {
      setEditQuestionIndex(null);
      setEditQuestion("");
      setEditAnswer("");
    }
  } catch (err) {
    console.error("Error menghapus pertanyaan:", err);
  }
};

  return (
    <div className="flex h-screen bg-warna3">
      {/* Sidebar daftar tugas */}
      <div className="w-72 bg-warna5 p-4 rounded-xl shadow-lg overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Daftar Tugas</h1>
        {tugasList.length === 0 && <p>Belum ada tugas. Silahkan tambah tugas baru!</p>}
        <ul className="space-y-3">
          {tugasList.map((item) => (
            <li
              key={item.id}
              className={`p-4 rounded-lg shadow cursor-pointer transition-colors group ${
                editId === item.id
                  ? "bg-warna4 border-2 border-warna1"
                  : "bg-warna1 hover:bg-warna2"
              }`}
              onClick={() => {
                setEditId(item.id);
                setTitle(item.title);
              }}
            >
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
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                  setEditId(null);
                  setTitle("");

                }}
                className="bg-warna6 text-background hover:bg-warna1 mt-2"
              >
                Hapus
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* Form kanan */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="bg-warna5 p-6 rounded-xl shadow-lg w-full">
          <h1 className="text-2xl font-bold mb-4">
            {editId ? "Edit Tugas" : "Tambah Tugas Baru"}
          </h1>

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul tugas..."
            className="mb-4 bg-background"
          />

          <div className="flex gap-2 mb-4">
            <Button onClick={handleAdd} className="bg-warna1 text-background">
              {editId ? "Update Judul" : "Tambah Tugas"}
            </Button>
            {editId && (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditId(null);
                  setTitle("");
                  setEditQuestionIndex(null);
                  setEditQuestion("");
                  setEditAnswer("");
                }}
              >
                Batal
              </Button>
            )}
          </div>

          {/* Form pertanyaan */}
          <ul className="list-disc mb-3 space-y-3 pt-2 pb-2">
  {editId &&
    tugasList.find((t) => t.id === editId)?.questions?.map((q, i) => {
      const isActive = i === editQuestionIndex;
      return (
        <li key={i} className="flex justify-between items-start gap-2">
          <div
            className={`cursor-pointer flex-1 p-2 rounded transition-colors 
              ${isActive 
                ? "bg-warna4 text-background border border-warna1 font-bold text-lg" 
                : "bg-warna1 text-background hover:bg-warna2"}`}
            onClick={() => {
              setEditQuestionIndex(i);
              setEditQuestion(q.question);
              setEditAnswer(q.answer);
            }}
          >
            <span>{q.question}</span>
            <div className="text-sm">Jawaban: {q.answer}</div>
          </div>
          <div className="items-center border-l pl-2 border-foreground">
            <Button
              size="sm"
              variant="destructive"
              className="text-background h-12 bg-warna6"
              onClick={() => handleDeleteQuestion(editId!, i)}
            >
              Hapus
            </Button>
          </div>
        </li>
      );
    })}
</ul>
                  {editId && (
  editQuestionIndex !== null ? (
    <div className="mt-4 p-4 border rounded-lg bg-warna3">
      <h3 className="font-bold mb-2">Edit Pertanyaan</h3>
      <Input
        value={editQuestion}
        onChange={(e) => setEditQuestion(e.target.value)}
        placeholder="Edit pertanyaan..."
        className="mb-2 bg-background rounded h-10"
      />
      <Input
        value={editAnswer}
        onChange={(e) => setEditAnswer(e.target.value)}
        placeholder="Edit jawaban..."
        className="mb-2 bg-background rounded h-10"
      />
      <div className="flex gap-2">
        <Button onClick={() => handleUpdateQuestion(editId!)}>Update</Button>
        <Button
          variant="secondary"
          onClick={() => {
            setEditQuestionIndex(null);
            setEditQuestion("");
            setEditAnswer("");
          }}
        >
          Batal
        </Button>
      </div>
    </div>
  ) : (
    <div className="mt-4 p-4 border rounded-lg bg-warna3">
      <h3 className="font-bold mb-2">Tambah Pertanyaan Baru</h3>
      <Input
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        placeholder="Pertanyaan baru..."
        className="mb-2 bg-background rounded h-10"
      />
      <Input
        value={newAnswer}
        onChange={(e) => setNewAnswer(e.target.value)}
        placeholder="Jawaban baru..."
        className="mb-2 bg-background rounded h-10"
      />
      <Button onClick={() => handleAddQuestion(editId!)}>Tambah</Button>
    </div>
  )
)}
        </div> 
      </main>
    </div>
  );
}
