import React, { useState, useEffect, ReactNode } from "react";
import { driveService, DriveFile } from "../services/driveService";
import { DownloadCard, DownloadItem } from "./DownloadCard";
import { FileText, Folder, FileCode, FileArchive, File as FileIcon } from "lucide-react";

interface DriveDownloadsListProps {
  filter?: string | string[];
  defaultIcon: ReactNode;
}

/**
 * Componente que lista archivos de Google Drive filtrados por una cadena o lista de cadenas opcional.
 */
export const DriveDownloadsList: React.FC<DriveDownloadsListProps> = ({ filter, defaultIcon }) => {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const driveFiles = await driveService.getFiles();
        
        // Filtrar archivos (excluir carpetas y aplicar filtro de nombre si existe)
        const filteredFiles = driveFiles.filter(file => {
          const isNotFolder = file.mimeType !== "application/vnd.google-apps.folder";
          
          if (!filter) return isNotFolder;

          const fileNameLower = file.name.toLowerCase();
          const filters = Array.isArray(filter) ? filter : [filter];
          
          const matchesFilter = filters.some(f => fileNameLower.includes(f.toLowerCase()));
          
          return isNotFolder && matchesFilter;
        });

        setFiles(filteredFiles);
      } catch (err) {
        setError("No se pudieron cargar los archivos de Drive.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [filter]);

  /**
   * Mapea un DriveFile a un DownloadItem.
   */
  const mapToDownloadItem = (file: DriveFile): DownloadItem => {
    // Determinar icono basado en extensión o mimeType
    let icon = defaultIcon;
    if (file.name.endsWith(".zip") || file.name.endsWith(".rar") || file.name.endsWith(".7z")) {
      icon = <FileArchive />;
    } else if (file.name.endsWith(".exe") || file.name.endsWith(".msi")) {
      icon = <FileCode />;
    } else if (file.name.endsWith(".pdf")) {
      icon = <FileText />;
    }

    return {
      name: file.name,
      desc: file.description || "Archivo técnico disponible para descarga directa desde Google Drive.",
      size: driveService.formatSize(file.size),
      icon: icon,
      link: file.webContentLink || file.webViewLink || "#",
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-red-500/10 rounded-3xl border border-red-500/20">
        <p className="text-red-300 font-bold">{error}</p>
        <p className="text-xs text-red-300/60 mt-2">Verifique la configuración de la API y los permisos de la carpeta.</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
        <p className="text-purple-300">No hay archivos disponibles en esta categoría.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {files.map((file, index) => (
        <DownloadCard key={file.id} item={mapToDownloadItem(file)} index={index} />
      ))}
    </div>
  );
};
