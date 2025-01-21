"use client";

import { useState } from "react";
import Card from "../card/page";
import { menu } from "../data/page";
import { addDoc, collection} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface MenuItem {
  id: number;
  nama: string;
  imageUrl: string;
  harga: number;
}

export default function Kasir() {
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);

  const handleSelectItem = (item: MenuItem) => {
    // Menambahkan item ke daftar pesanan
    setSelectedItems((prevItems) => [...prevItems, item]);
  };

  /**
   * Menyimpan pesanan ke database Firestore
   * @return {Promise<void>}
   */
  const saveOrderToDatabase = async () => {
    try {
      const docRef = await addDoc(collection(db, "orders"), {
        items: selectedItems,
        timestamp: new Date().toISOString(),
      });
      console.log("Pesanan berhasil disimpan dengan ID: ", docRef.id); // Log ID dokumen
      const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
      if (modal) {
        modal.querySelector("h3")!.innerHTML = "Pesanan Berhasil Disimpan!";
        modal.querySelector("p")!.innerHTML =
          "Pesanan Anda telah berhasil disimpan di laporan.";
        modal.showModal(); // Menampilkan modal
      }
      setSelectedItems([]); // Reset daftar pesanan setelah disimpan
    } catch (error) {
      console.error("Error saving order: ", error);
      // Menampilkan modal dengan pesan gagal
      const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
      if (modal) {
        modal.querySelector("h3")!.innerHTML = "Terjadi Kesalahan!";
        modal.querySelector("p")!.innerHTML =
          "Terjadi kesalahan saat menyimpan pesanan. Silakan coba lagi.";
        modal.showModal(); // Menampilkan modal
      }
    }
  };

  // Fungsi untuk menghitung jumlah item yang dipilih
  const getItemQuantity = (itemId: number) => {
    return selectedItems.filter((item) => item.id === itemId).length;
  };

  // Fungsi untuk mengurangi jumlah item yang dipilih
  const decreaseItemQuantity = (item: MenuItem) => {
    setSelectedItems((prevItems) => {
      const updatedItems = [...prevItems];
      const index = updatedItems.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        updatedItems.splice(index, 1); // Menghapus satu item dari daftar
      }
      return updatedItems;
    });
  };

  return (
    <div className="w-full h-full my-4">
      <div className="flex flex-wrap gap-3 justify-center">
        {menu.map((item) => (
          <div key={item.id} className="relative">
            <Card
              name={item.nama}
              image={item.imageUrl}
              price={item.harga}
              onSelect={() => handleSelectItem(item)} // Menambahkan fungsi untuk memilih item
              onDelete={() => decreaseItemQuantity(item)}
              onItem={getItemQuantity(item.nama)}
            />
            {/* Tampilan jumlah item yang dipilih */}
            <div className="absolute top-0 right-0 bg-white p-2 rounded-full shadow-lg flex items-center justify-center">
              <span className="text-black font-bold">
                {getItemQuantity(item.id)} x
              </span>
            </div>
          </div>
        ))}
      </div>
      <button onClick={saveOrderToDatabase} className="btn btn-accent mt-4">
        Simpan Pesanan
      </button>

      {/* Modal */}
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg"></h3>
          <p className="py-4"></p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button></button>
        </form>
      </dialog>
    </div>
  );
}
