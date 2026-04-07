/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Smartphone, Cpu, HardDrive, ShieldCheck } from "lucide-react";
import { DownloadCard, DownloadItem } from "./DownloadCard";

/**
 * Página dedicada a las descargas técnicas de Windows 7 (Legacy).
 * 
 * Características:
 * - Carga dinámica desde Firestore.
 * - Filtrado por categoría 'win7'.
 * - Diseño de cuadrícula responsivo.
 */
export default function Windows7Page() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const q = query(
          collection(db, "downloads"),
          where("category", "==", "win7"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedDownloads = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          icon: <Smartphone />
        })) as unknown as DownloadItem[];
        setDownloads(fetchedDownloads);
      } catch (error) {
        console.error("Error fetching downloads:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDownloads();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Encabezado de la página */}
      <div className="flex items-center gap-4 mb-12">
        <div className="bg-cyan-400 p-3 rounded-2xl text-black shadow-lg shadow-cyan-400/20">
          <Smartphone className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-5xl font-black uppercase italic leading-none">Windows 7 Legacy</h1>
          <p className="text-purple-200 font-bold tracking-widest text-xs uppercase mt-1">Equipos antiguos y terminales</p>
        </div>
      </div>

      {/* Grid de descargas: Responsivo (1 col móvil, 2 col tablet, 3 col desktop) */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      ) : downloads.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {downloads.map((item, index) => (
            <DownloadCard key={index} item={item} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
          <p className="text-purple-300">No hay archivos disponibles en esta categoría.</p>
        </div>
      )}
    </div>
  );
}
