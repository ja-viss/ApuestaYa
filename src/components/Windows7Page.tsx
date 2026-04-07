/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Smartphone } from "lucide-react";
import { DriveDownloadsList } from "./DriveDownloadsList";

/**
 * Página dedicada a las descargas técnicas de Windows 7 (Legacy).
 * 
 * Características:
 * - Carga dinámica desde Google Drive.
 * - Filtrado por nombre 'win7'.
 * - Diseño de cuadrícula responsivo.
 */
export default function Windows7Page() {
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

      {/* Lista de descargas desde Google Drive */}
      <DriveDownloadsList filter={["windows7", "win7", "windows 7", "multios"]} defaultIcon={<Smartphone />} />
    </div>
  );
}
