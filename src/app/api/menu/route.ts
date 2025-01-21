// app/api/menu/route.ts

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

// Fungsi untuk mengambil data menu dari Firestore
export async function GET() {
  try {
    const menuCollection = collection(db, "menu");
    const snapshot = await getDocs(menuCollection);
    const menuData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(menuData); // Mengirimkan data menu dalam format JSON
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    return NextResponse.error(); // Mengembalikan error response jika gagal
  }
}
