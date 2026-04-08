import React, { useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { driveService, DriveFile } from "../services/driveService";
import { DownloadCard, DownloadItem } from "./DownloadCard";
import { FileText, FileCode, FileArchive } from "lucide-react";

interface DriveDownloadsListProps {
  filter?: string | string[];
  defaultIcon: ReactNode;
}

/**
 * Componente que lista archivos de Google Drive filtrados por una cadena o lista de cadenas opcional.
 * Optimizado para rendimiento con useMemo y useCallback.
 */
export const DriveDownloadsList: React.FC<DriveDownloadsListProps> = ({ filter, defaultIcon }) => {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchFiles = async () => {
      try {
        const driveFiles = await driveService.getFiles();
        if (isMounted) {
          setFiles(driveFiles);
        }
      } catch (err) {
        if (isMounted) {
          setError("No se pudieron cargar los archivos de Drive.");
        }
        console.error(err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchFiles();
    return () => { isMounted = false; };
  }, []);

  // Filtrado optimizado con useMemo
  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const isNotFolder = file.mimeType !== "application/vnd.google-apps.folder";
      if (!isNotFolder) return false;

      const fileNameLower = file.name.toLowerCase();
      
      // Filtro por categoría (prop)
      if (filter) {
        const filters = Array.isArray(filter) ? filter : [filter];
        const matchesCategory = filters.some(f => fileNameLower.includes(f.toLowerCase()));
        if (!matchesCategory) return false;
      }

      // Filtro por búsqueda (state)
      if (searchTerm) {
        return fileNameLower.includes(searchTerm.toLowerCase());
      }

      return true;
    });
  }, [files, filter, searchTerm]);

  /**
   * Mapea un DriveFile a un DownloadItem.
   */
  const mapToDownloadItem = useCallback((file: DriveFile): DownloadItem => {
    let icon = defaultIcon;
    const fileNameLower = file.name.toLowerCase();

    if (fileNameLower.endsWith(".zip") || fileNameLower.endsWith(".rar") || fileNameLower.endsWith(".7z")) {
      icon = <FileArchive className="w-5 h-5" />;
    } else if (fileNameLower.endsWith(".exe") || fileNameLower.endsWith(".msi")) {
      icon = <FileCode className="w-5 h-5" />;
    } else if (fileNameLower.endsWith(".pdf")) {
      icon = <FileText className="w-5 h-5" />;
    }

    return {
      name: file.name,
      desc: file.description || "Archivo técnico disponible para descarga.",
      size: driveService.formatSize(file.size),
      icon: icon,
      link: file.webContentLink || file.webViewLink || "#",
    };
  }, [defaultIcon]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-white rounded-xl animate-pulse border border-slate-100 shadow-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Barra de búsqueda dinámica con estilo técnico Light */}
      <div className="relative max-w-md group">
        <div className="absolute -inset-0.5 bg-pink-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <input 
          type="text"
          placeholder="Buscar_Archivos_System..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="relative w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-pink-500/50 transition-all placeholder:text-slate-300 font-mono text-slate-700 shadow-sm"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="text-[9px] font-black uppercase text-pink-500 hover:text-pink-700 transition-colors"
            >
              [Clear]
            </button>
          )}
          <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse" />
        </div>
      </div>

      {error ? (
        <div className="text-center py-12 bg-red-500/5 rounded-3xl border border-red-500/10">
          <p className="text-red-300 text-sm font-bold">{error}</p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
          <p className="text-purple-300 text-sm">No se encontraron archivos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFiles.map((file, index) => (
            <DownloadCard key={file.id} item={mapToDownloadItem(file)} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};
