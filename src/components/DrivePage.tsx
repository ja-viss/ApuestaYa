import { Globe } from "lucide-react";
import { DriveDownloadsList } from "./DriveDownloadsList";

/**
 * Página que muestra todos los archivos disponibles en la carpeta de Google Drive.
 */
export default function DrivePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Encabezado de la página */}
      <div className="flex items-center gap-4 mb-12">
        <div className="bg-pink-500 p-3 rounded-2xl text-white shadow-lg shadow-pink-500/20">
          <Globe className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-5xl font-black uppercase italic leading-none text-slate-900">Repositorio Drive</h1>
          <p className="text-pink-600/60 font-bold tracking-widest text-xs uppercase mt-1">Todos los archivos técnicos disponibles</p>
        </div>
      </div>

      {/* Lista completa de descargas desde Google Drive */}
      <DriveDownloadsList defaultIcon={<Globe />} />
    </div>
  );
}
