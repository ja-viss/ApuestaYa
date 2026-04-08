/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Monitor } from "lucide-react";
import { DriveDownloadsList } from "./DriveDownloadsList";

/**
 * Página dedicada a las descargas técnicas de Windows 10.
 * 
 * Características:
 * - Carga dinámica desde Google Drive.
 * - Filtrado por nombre 'win10'.
 * - Diseño de cuadrícula responsivo.
 */
export default function Windows10Page() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Encabezado de la página */}
      <div className="flex items-center gap-4 mb-12">
        <div className="bg-pink-500 p-3 rounded-2xl text-white shadow-lg shadow-pink-500/20">
          <Monitor className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-5xl font-black uppercase italic leading-none text-slate-900">Windows 10 & Drivers</h1>
          <p className="text-pink-600/60 font-bold tracking-widest text-xs uppercase mt-1">Soporte para equipos modernos</p>
        </div>
      </div>

      {/* Lista de descargas desde Google Drive */}
      <DriveDownloadsList filter={["windows10", "win10", "windows 10", "multios"]} defaultIcon={<Monitor />} />
    </div>
  );
}
