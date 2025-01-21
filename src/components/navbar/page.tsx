'use client'

import Link from "next/link"
import { useEffect, useState } from "react";

export default function Navbar() {

  const [active, setActive] = useState<string>(" ")

  function handleClick(menu: string){
    setActive(menu)
  }

  useEffect(() => {
    // Memastikan state default tetap "kasir" saat pertama kali halaman dibuka
    setActive(" ");
  }, []);

    return (
      <div>
        {" "}
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <Link href="/">
              <p className="btn btn-ghost text-xl">Dkriuk</p>
            </Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1 ">
              <li onClick={() => handleClick("kasir")}>
                <Link href="/view/kasir">
                  <button
                    className={`btn ${
                      active === "kasir" ? "" : "btn-outline"
                    } btn-accent text-white`}
                  >
                    Kasir
                  </button>
                </Link>
              </li>
              <li onClick={() => handleClick("laporan")}>
                <Link href="/view/laporan">
                  <button
                    className={`btn ${
                      active === "laporan" ? "" : "btn-outline"
                    } btn-accent text-white`}
                  >
                    Laporan
                  </button>
                </Link>
              </li>
              <li onClick={() => handleClick("stok")}>
                <Link href="/view/stok">
                  <button
                    className={`btn ${
                      active === "stok" ? "" : "btn-outline"
                    } btn-accent text-white`}
                  >
                    Stok
                  </button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
}