/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Layers } from "lucide-react";
import { DriveDownloadsList } from "./DriveDownloadsList";

/**
 * Página dedicada a los archivos del Sistema Atenas.
 */
export default function AtenasPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Encabezado de la página */}
      <div className="flex items-center gap-4 mb-12">
        <div className="bg-amber-500 p-3 rounded-2xl text-white shadow-lg shadow-amber-500/20">
          <Layers className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-5xl font-black uppercase italic leading-none text-slate-900">Sistemas Atenas</h1>
          <p className="text-amber-600/60 font-bold tracking-widest text-xs uppercase mt-1">
            Módulos, instaladores y actualizaciones de Atenas
          </p>
        </div>
      </div>

      {/* Lista de descargas filtrada por Atenas */}
      <DriveDownloadsList filter={["atenas"]} defaultIcon={<Layers />} />
    </div>
  );
}
