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

  useEffect(() => {
    let isMounted = true;
    const fetchFiles = async () => {
      setIsLoading(true);
      setError(null);
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
      if (!filter) return isNotFolder;

      const fileNameLower = file.name.toLowerCase();
      const filters = Array.isArray(filter) ? filter : [filter];
      const matchesFilter = filters.some(f => fileNameLower.includes(f.toLowerCase()));
      
      return isNotFolder && matchesFilter;
    });
  }, [files, filter]);

  /**
   * Mapea un DriveFile a un DownloadItem.
   * Memorizado con useCallback.
   */
  const mapToDownloadItem = useCallback((file: DriveFile): DownloadItem => {
    let icon = defaultIcon;
    const fileNameLower = file.name.toLowerCase();

    if (fileNameLower.endsWith(".zip") || fileNameLower.endsWith(".rar") || fileNameLower.endsWith(".7z")) {
      icon = <FileArchive className="w-6 h-6" />;
    } else if (fileNameLower.endsWith(".exe") || fileNameLower.endsWith(".msi")) {
      icon = <FileCode className="w-6 h-6" />;
    } else if (fileNameLower.endsWith(".pdf")) {
      icon = <FileText className="w-6 h-6" />;
    }

    return {
      name: file.name,
      desc: file.description || "Archivo técnico disponible para descarga directa.",
      size: driveService.formatSize(file.size),
      icon: icon,
      link: file.webContentLink || file.webViewLink || "#",
    };
  }, [defaultIcon]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-500/5 rounded-3xl border border-red-500/10">
        <p className="text-red-300 text-sm font-bold">{error}</p>
      </div>
    );
  }

  if (filteredFiles.length === 0) {
    return (
      <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
        <p className="text-purple-300 text-sm">No hay archivos disponibles en esta categoría.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredFiles.map((file, index) => (
        <DownloadCard key={file.id} item={mapToDownloadItem(file)} index={index} />
      ))}
    </div>
  );
};
