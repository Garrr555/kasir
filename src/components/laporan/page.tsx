"use client";
import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

// Tipe untuk item yang ada di dalam pesanan
interface Item {
  id: string;
  nama: string;
  harga: number;
}

// Tipe untuk pesanan
interface Order {
  id: string;
  items: Item[];
  tanggal: Date;
}

export default function Pesanan() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null); // Order yang dipilih untuk dihapus
  const [recentOrders, setRecentOrders] = useState<Set<string>>(new Set());


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const ordersList = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          items: doc.data().items || [],
        }));

        const ordersWithDate = ordersList.map((order) => ({
          ...order,
          tanggal: new Date(), // Gunakan tanggal perangkat pengguna
        }));

        

        setOrders(ordersWithDate);
        

        // Tandai semua pesanan baru
        const newOrderIds = ordersWithDate.map((order) => order.id);
        setRecentOrders((prev) => new Set([...prev, ...newOrderIds]));

        // Hapus status "NEW" setelah 5 detik
        setTimeout(() => {
          setRecentOrders((prev) => {
            const updated = new Set(prev);
            newOrderIds.forEach((id) => updated.delete(id));
            return updated;
          });
        }, 10000); // 5 detik
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    fetchOrders();
  }, []);

  const handleDeleteOrder = async () => {
    if (!selectedOrderId) {
      alert("Pesanan tidak ditemukan.");
      return;
    }

    try {
      // Menghapus pesanan dari Firestore berdasarkan ID
      const orderDocRef = doc(db, "orders", selectedOrderId);
      await deleteDoc(orderDocRef);

      // Menghapus pesanan dari state lokal
      setOrders(orders.filter((order) => order.id !== selectedOrderId));

      // Menutup modal setelah menghapus
      setIsModalOpen(false);
      setSelectedOrderId(null); // Reset ID yang dipilih
    } catch (error) {
      console.error("Error deleting order: ", error);
      alert("Terjadi kesalahan saat menghapus pesanan.");
    }
  };

  function totalOrders(orders: Order[]): number {
    return orders.reduce((total, order) => {
      const orderTotal = order.items.reduce((sum, item) => sum + item.harga, 0);
      return total + orderTotal;
    }, 0);
  }

  function calculateOrderTotal(order: Order): number {
    return order.items.reduce((total, item) => total + item.harga, 0);
  }


  return (
    <div className="w-full h-full py-10">
      <h2 className="text-2xl font-semibold text-center">Daftar Pesanan</h2>
      <div className="flex flex-wrap gap-3 justify-center mt-4">
        {orders.map((order, index) => (
          <div key={index} className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between">
                <h3 className="card-title">
                  Pesanan {index + 1}{" "}
                  {recentOrders.has(order.id) && (
                    <span className="badge badge-success ml-2"></span>
                  )}
                </h3>

                <div className="card-actions justify-end">
                  <button
                    className="btn btn-error btn-md text-white"
                    onClick={() => {
                      setSelectedOrderId(order.id); // Set ID pesanan yang dipilih
                      setIsModalOpen(true); // Buka modal konfirmasi
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </div>

              <p className="mb-5">{order.tanggal.toLocaleDateString()}</p>
              <ul className="flex flex-col">
                {order.items.map((item, idx) => (
                  <li key={idx} className="py-2 flex justify-between">
                    <strong>{item.nama}</strong> + Rp. {item.harga}
                  </li>
                ))}
              </ul>
              <div className="overflow-hidden">
                ____________________________________________________________________________________________
              </div>
              <div>
                <div className="font-bold mt-4 flex justify-between">
                  <div>Total Harga: </div>
                  <div className="text-accent">Rp. {calculateOrderTotal(order).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="text-center mt-8">
          <h3 className="text-xl font-bold">
            Total Semua Pesanan: Rp. {totalOrders(orders).toLocaleString()}
          </h3>
        </div>
      </div>

      {/* Overlay Gelap */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 " // Overlay gelap di belakang modal
          onClick={() => setIsModalOpen(false)} // Klik di luar modal untuk menutup
        ></div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {isModalOpen && (
        <dialog id="my_modal_2" className="modal z-20" open>
          <div className="modal-box">
            <h3 className="font-bold text-lg">Konfirmasi Hapus Pesanan</h3>
            <p className="py-4">
              Apakah Anda yakin ingin menghapus pesanan ini?
            </p>
            <div className="modal-action">
              <button
                onClick={handleDeleteOrder} // Fungsi yang menghapus pesanan
                className="btn btn-error text-white"
              >
                Hapus
              </button>
              <button
                onClick={() => setIsModalOpen(false)} // Menutup modal tanpa menghapus
                className="btn"
              >
                Batal
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
