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
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-cyan-400/10 border-t-cyan-400 rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-cyan-400 animate-pulse">Sincronizando Drive...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Barra de búsqueda dinámica */}
      <div className="relative max-w-md">
        <input 
          type="text"
          placeholder="Buscar archivos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400/50 transition-all placeholder:text-white/20"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-white/40 hover:text-white"
          >
            Limpiar
          </button>
        )}
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
