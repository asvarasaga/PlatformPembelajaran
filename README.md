# 📘 Interactive Learning Platform

An **interactive learning platform** built with **Next.js** and **Firebase**, designed to help teachers manage students, exercises, and real-time submissions easily.

This app allows teachers to create, edit, and delete students, assign exercises, monitor student progress, and automatically remove related data when a student is deleted.

---
🧩Key Features

👩‍🏫 Student Management — Add, edit, and delete student data in real time.

🧠 Exercise Module — Teachers can create and manage exercises for students.

💬 Answer Tracking — Student answers are stored automatically in Firestore.

🔁 Firebase Integration — Data is synchronized instantly across all clients.

💾 Local Session Storage — Keeps user sessions persistent locally.

🧹 Cascade Delete — When a student is deleted, their related data in latihan_murid and jawaban is also removed.

⚙️ Environment Setup

Create a [.env.local] file in your project root and add your Firebase configuration:

[NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id]


Replace each value with your actual Firebase project credentials.

📦 Deployment

You can deploy this project using Vercel or Firebase Hosting.

▶️ Deploy with Firebase
npm run build
firebase deploy

▶️ Deploy with Vercel

Go to Vercel Deployment Page

and link your GitHub repository.

📚 Resources

Next.js Documentation

Firebase Firestore Docs

Tailwind CSS Guide

👨‍💻 Developer

Developed by Maulana Rizal
