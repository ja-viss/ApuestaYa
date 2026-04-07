/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Wrench } from "lucide-react";
import { DriveDownloadsList } from "./DriveDownloadsList";

/**
 * Página dedicada a las herramientas técnicas y utilidades.
 * 
 * Características:
 * - Carga dinámica desde Google Drive.
 * - Filtrado por nombre 'herramienta' o 'herramientas'.
 * - Diseño de cuadrícula responsivo.
 */
export default function ToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Encabezado de la página */}
      <div className="flex items-center gap-4 mb-12">
        <div className="bg-cyan-400 p-3 rounded-2xl text-black shadow-lg shadow-cyan-400/20">
          <Wrench className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-5xl font-black uppercase italic leading-none">Herramientas</h1>
          <p className="text-purple-200 font-bold tracking-widest text-xs uppercase mt-1">Utilidades y software técnico</p>
        </div>
      </div>

      {/* Lista de descargas desde Google Drive */}
      <DriveDownloadsList filter={["herramienta", "herramientas"]} defaultIcon={<Wrench />} />
    </div>
  );
}
