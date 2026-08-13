import React, { useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { driveService, DriveFile } from "../services/driveService";
import { customFilesService, CustomFileItem } from "../services/customFilesService";
import { DownloadCard, DownloadItem } from "./DownloadCard";
import { FileText, FileCode, FileArchive, Globe } from "lucide-react";

interface DriveDownloadsListProps {
  filter?: string | string[];
  defaultIcon: ReactNode;
}

// Tipo combinado para procesar ambos tipos de origen
type UnifiedFile = {
  id: string;
  name: string;
  desc: string;
  size: string;
  mimeType: string;
  link: string;
  source: "drive" | "upload";
  category: "Windows 10" | "Windows 7" | "Herramientas" | "Drive";
  imageUrl: string;
  thumbnailLink?: string;
  extension?: string;
};

/**
 * Componente que lista archivos de Google Drive y subidos, filtrados por una categoría o consulta.
 * Acepta archivos de cualquier extensión y nombre. Los que no pueden categorizarse van a "Drive".
 */
export const DriveDownloadsList: React.FC<DriveDownloadsListProps> = ({ filter, defaultIcon }) => {
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [customFiles, setCustomFiles] = useState<CustomFileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const refreshCustomFiles = useCallback(() => {
    setCustomFiles(customFilesService.getCustomFiles());
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchAllFiles = async () => {
      try {
        const fetchedDriveFiles = await driveService.getFiles();
        if (isMounted) {
          setDriveFiles(fetchedDriveFiles);
          setCustomFiles(customFilesService.getCustomFiles());
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

    fetchAllFiles();
    return () => { isMounted = false; };
  }, []);

  // Unificación de archivos de Drive y subidos
  const unifiedFiles = useMemo<UnifiedFile[]>(() => {
    const list: UnifiedFile[] = [];

    // 1. Archivos de Google Drive
    driveFiles.forEach((f) => {
      if (f.mimeType === "application/vnd.google-apps.folder") return;

      const category = customFilesService.categorizeFile(f.name, f.description || "");
      const imageUrl = customFilesService.getGoogleImageForFile(f.name, f.mimeType, f.thumbnailLink);
      const ext = f.name.includes(".") ? "." + f.name.split(".").pop() : "";

      list.push({
        id: f.id,
        name: f.name,
        desc: f.description || "Archivo del repositorio de Google Drive.",
        size: driveService.formatSize(f.size),
        mimeType: f.mimeType,
        link: f.webContentLink || f.webViewLink || (f.id ? `https://drive.google.com/file/d/${f.id}/view?usp=sharing` : "#"),
        source: "drive",
        category: category,
        imageUrl: imageUrl,
        thumbnailLink: f.thumbnailLink,
        extension: ext,
      });
    });

    // 2. Archivos Subidos por Usuarios/Técnicos
    customFiles.forEach((cf) => {
      const category = cf.category || customFilesService.categorizeFile(cf.name, cf.description);
      const imageUrl = cf.imageUrl || customFilesService.getGoogleImageForFile(cf.name, cf.mimeType);

      list.push({
        id: cf.id,
        name: cf.name,
        desc: cf.description || "Archivo técnico subido al servidor.",
        size: cf.size,
        mimeType: cf.mimeType,
        link: cf.downloadUrl,
        source: "upload",
        category: category,
        imageUrl: imageUrl,
        extension: cf.extension || (cf.name.includes(".") ? "." + cf.name.split(".").pop() : ""),
      });
    });

    return list;
  }, [driveFiles, customFiles]);

  // Filtrado optimizado por categoría y por término de búsqueda
  const filteredFiles = useMemo(() => {
    return unifiedFiles.filter((file) => {
      const fileNameLower = file.name.toLowerCase();
      const descLower = file.desc.toLowerCase();

      // Filtro por categoría especificada en props
      if (filter) {
        const filters = Array.isArray(filter) ? filter : [filter];
        
        // Comprobar si coincide por palabra clave o por nombre exacto de categoría
        const matchesCategory = filters.some((f) => {
          const fLower = f.toLowerCase();
          return (
            fileNameLower.includes(fLower) ||
            descLower.includes(fLower) ||
            file.category.toLowerCase().includes(fLower)
          );
        });

        if (!matchesCategory) return false;
      }

      // Filtro por búsqueda dinámica
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          fileNameLower.includes(term) ||
          descLower.includes(term) ||
          file.category.toLowerCase().includes(term) ||
          (file.extension && file.extension.toLowerCase().includes(term))
        );
      }

      return true;
    });
  }, [unifiedFiles, filter, searchTerm]);

  /**
   * Mapea un UnifiedFile a un DownloadItem para las DownloadCards.
   */
  const mapToDownloadItem = useCallback(
    (file: UnifiedFile): DownloadItem => {
      let icon = defaultIcon;
      const ext = (file.extension || "").toLowerCase();

      if (ext === ".zip" || ext === ".rar" || ext === ".7z" || ext === ".iso" || ext === ".tar") {
        icon = <FileArchive className="w-5 h-5" />;
      } else if (ext === ".exe" || ext === ".msi" || ext === ".bat" || ext === ".apk") {
        icon = <FileCode className="w-5 h-5" />;
      } else if (ext === ".pdf" || ext === ".docx" || ext === ".txt") {
        icon = <FileText className="w-5 h-5" />;
      } else {
        icon = <Globe className="w-5 h-5" />;
      }

      return {
        id: file.id,
        name: file.name,
        desc: file.desc,
        size: file.size,
        icon: icon,
        link: file.link,
        imageUrl: file.imageUrl,
        category: file.category,
        extension: file.extension,
        source: file.source,
        onDelete: file.source === "upload" ? (id) => {
          customFilesService.removeCustomFile(id);
          refreshCustomFiles();
        } : undefined,
      };
    },
    [defaultIcon, refreshCustomFiles]
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-44 bg-white rounded-2xl animate-pulse border border-slate-100 shadow-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Barra de búsqueda y contador de archivos */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md group">
          <div className="absolute -inset-0.5 bg-pink-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <input
            type="text"
            placeholder="Buscar por nombre, extensión (.exe, .pdf, .zip)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="relative w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-pink-500 transition-all placeholder:text-slate-400 font-medium text-slate-700 shadow-sm"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-[10px] font-black uppercase text-pink-500 hover:text-pink-700 transition-colors"
              >
                [Limpiar]
              </button>
            )}
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{filteredFiles.length} ARCHIVO(S) DISPONIBLE(S)</span>
        </div>
      </div>

      {error ? (
        <div className="text-center py-12 bg-red-500/5 rounded-3xl border border-red-500/10">
          <p className="text-red-500 text-sm font-bold">{error}</p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-bold">No se encontraron archivos en este repositorio.</p>
          <p className="text-slate-400 text-xs mt-1">Sube archivos desde el Panel de Carga sin restricciones de extensión.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map((file, index) => (
            <DownloadCard key={file.id} item={mapToDownloadItem(file)} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

