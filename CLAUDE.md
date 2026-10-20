# Platform Pembelajaran — project notes

Thesis (skripsi) project by Maulana Rizal: *Pengembangan Media Pembelajaran Berbasis Website dengan Sistem Latihan Terkunci di SMK Negeri 3 Yogyakarta*.
The thesis chapters (BAB I–IV .docx) live one folder up, in `skripsijs/`, and are not in this repo.

## What the website is
- Digital labsheet for **Pemrograman Sistem Embedded** (ESP32), for **class XI Teknik Elektronika Industri**, SMK N 3 Yogyakarta.
- Goals from BAB I: access material anytime/anywhere, replace paper labsheets, stop copy-paste habits, practise code before touching hardware (less equipment damage).
- Features that exist: **Teori** (`app/siswa/teori`), **Latihan** (`app/siswa/latihan`), **Tugas** (`app/siswa/tugas`), plus admin (guru) pages under `app/admin`.
- UI text is in Bahasa Indonesia. Colours are `warna1`–`warna7` in `app/globals.css`.

## "Latihan terkunci" = locked example program
In `app/siswa/latihan/page.tsx` the example code shows faded behind a textarea. The student must retype it: only the correct next character is accepted, copy/paste/cut/right-click are blocked, and a timer runs.
It does **not** lock the order of exercises — any exercise can be opened from the sidebar. Don't describe it as level unlocking.

## Stack and setup
- Next.js 15.5 (App Router) + TypeScript + Tailwind v4, deployed on **Vercel** from GitHub `asvarasaga/PlatformPembelajaran` (branch `main`).
- **Firebase Firestore**, read directly from the browser (`lib/firebase.ts`). No Firebase Auth: login checks the `guru` / `murid` collections and stores flags (`isGuru`, `isSiswa`, `namaSiswa`, `nomorSiswa`…) in localStorage.
- Firebase config comes from `NEXT_PUBLIC_FIREBASE_*` variables in `.env.local` (git-ignored). The same six variables must be set in Vercel → Settings → Environment Variables, then redeploy.
- Firestore rules allow read/write only on the collections the app uses: `guru, jawaban, latihan, latihan_murid, murid, topics, tugas`. The old test-mode rule expired on 28 Oct 2025 and caused `permission-denied` (empty pages).
- Don't run `npm run build` while `npm run dev` is running — both write to `.next` and corrupt it. Fix: stop dev, delete `.next`, restart.

## Open items
- The API key was committed in old git history. Restrict or rotate it in Google Cloud Console.
- Thesis text that doesn't match the website:
  - BAB II/III list **simulasi rangkaian berbasis web** as a main feature — the website has none.
  - BAB III says backend uses **REST API + Prisma** — it actually uses Firebase Firestore.
  - BAB III instrument section mentions **"elevator trainer"** (copied from another thesis).
  - BAB II mentions **kuis** — the website has none.
- Professor's feedback done: Home button moved away from Logout, Back button ("← Kembali") added in `components/ui/header.tsx`; Home goes to `/`.
