// app/api/pesanan/route.ts

import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

// Fungsi untuk mengambil semua pesanan dari Firestore
export async function GET() {
  try {
    const pesananCollection = collection(db, "pesanan");
    const snapshot = await getDocs(pesananCollection);
    const pesananData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(pesananData); // Mengirimkan data pesanan dalam format JSON
  } catch (error) {
    console.error("Error fetching pesanan:", error);
    return NextResponse.error(); // Mengembalikan error response jika gagal
  }
}

// Fungsi untuk menambah pesanan baru ke Firestore
export async function POST(request: Request) {
  try {
    const data = await request.json(); // Mengambil data dari request body

    // Menambahkan pesanan baru ke koleksi 'pesanan'
    const docRef = await addDoc(collection(db, "pesanan"), data);
    return NextResponse.json({
      message: "Pesanan berhasil ditambahkan",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Error adding pesanan:", error);
    return NextResponse.error(); // Mengembalikan error response jika gagal
  }
}
