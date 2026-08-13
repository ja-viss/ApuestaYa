import { DRIVE_CONFIG } from "../config/driveConfig";

/**
 * Interfaz para los archivos de Google Drive.
 */
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  description?: string;
  webContentLink?: string;
  webViewLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
}

// Cache simple para evitar peticiones redundantes
let filesCache: DriveFile[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Archivos garantizados con banderita (flagged) o especiales de Drive para respaldo
const FLAGGED_DRIVE_FILES: DriveFile[] = [
  {
    id: "flagged_3dp_net",
    name: "3dp-net-21-01 - Windows 7.zip",
    mimeType: "application/zip",
    size: "125611520", // 119.8 MB
    description: "Driver de red offline para Windows 7 (Instalador completo)",
    webContentLink: "https://drive.google.com/uc?export=download&id=149qGrJMfbr9aNzlfer7GCQURIKWfsjuvfTir6yyG",
    webViewLink: "https://drive.google.com/file/d/149qGrJMfbr9aNzlfer7GCQURIKWfsjuvfTir6yyG/view?usp=sharing"
  },
  {
    id: "flagged_systemcare",
    name: "Advanced SystemCare Pro 13.4.0.246-HERRAMIENTA.zip",
    mimeType: "application/zip",
    size: "265216", // 259 KB
    description: "Herramienta de optimización, mantenimiento y aceleración de sistema",
    webContentLink: "https://drive.google.com/uc?export=download&id=149qGrJMfbr9aNzlfer7GCQURIKWfsjuvfTir6yyG",
    webViewLink: "https://drive.google.com/file/d/149qGrJMfbr9aNzlfer7GCQURIKWfsjuvfTir6yyG/view?usp=sharing"
  },
  {
    id: "flagged_anydesk",
    name: "AnyDesk.5.5.3-HERRAMIENTA.zip",
    mimeType: "application/zip",
    size: "265216", // 259 KB
    description: "Software de soporte y control remoto ligero para mantenimiento",
    webContentLink: "https://drive.google.com/uc?export=download&id=149qGrJMfbr9aNzlfer7GCQURIKWfsjuvfTir6yyG",
    webViewLink: "https://drive.google.com/file/d/149qGrJMfbr9aNzlfer7GCQURIKWfsjuvfTir6yyG/view?usp=sharing"
  },
  {
    id: "flagged_atenas14",
    name: "Atenas14 - GRUPO ANDINO.1 - Windows 7",
    mimeType: "application/octet-stream",
    size: "16357785", // 15.6 MB
    description: "Sistema de gestión Atenas 14 versión Grupo Andino para Windows 7",
    webContentLink: "https://drive.google.com/uc?export=download&id=149qGrJMfbr9aNzlfer7GCQURIKWfsjuvfTir6yyG",
    webViewLink: "https://drive.google.com/file/d/149qGrJMfbr9aNzlfer7GCQURIKWfsjuvfTir6yyG/view?usp=sharing"
  },
  {
    id: "flagged_atenastinstala_w10",
    name: "AtenasTinstala - Windows10.zip",
    mimeType: "application/zip",
    size: "10590617", // 10.1 MB
    description: "Instalador automatizado del sistema Atenas para Windows 10",
    webContentLink: "https://drive.google.com/uc?export=download&id=149qGrJMfbr9aNzlfer7GCQURIKWfsjuvfTir6yyG",
    webViewLink: "https://drive.google.com/file/d/149qGrJMfbr9aNzlfer7GCQURIKWfsjuvfTir6yyG/view?usp=sharing"
  },
  {
    id: "flagged_atenas_w7_andino",
    name: "AtenasTinstala 1.14 - Windows 7 - GRUPO ANDINO.rar",
    mimeType: "application/x-rar-compressed",
    size: "16357785", // 15.6 MB
    description: "Paquete de instalación Atenas v1.14 Grupo Andino para Windows 7",
    webContentLink: "https://drive.google.com/uc?export=download&id=149qGrJMfbr9aNzlfer7GCQURIKWfsjuvfTir6yyG",
    webViewLink: "https://drive.google.com/file/d/149qGrJMfbr9aNzlfer7GCQURIKWfsjuvfTir6yyG/view?usp=sharing"
  }
];

const DRIVE_CACHE_KEY = "apuestaya_drive_files_cache_v2";

/**
 * Servicio para interactuar con la API de Google Drive v3 con aceleración de carga.
 */
export const driveService = {
  /**
   * Obtiene la URL optimizada de descarga directa acelerada.
   */
  getFastDownloadUrl(fileId: string, webContentLink?: string): string {
    if (webContentLink && webContentLink.includes("export=download")) {
      return webContentLink;
    }
    if (fileId && !fileId.startsWith("flagged_") && !fileId.startsWith("custom_")) {
      return `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
    }
    return webContentLink || "#";
  },

  /**
   * Obtiene la lista de archivos con carga ultra rápida usando caché persistente en disco (localStorage).
   */
  async getFiles(): Promise<DriveFile[]> {
    const now = Date.now();

    // 1. Intentar cargar desde el caché de memoria o disco para respuesta INSTANTÁNEA (0ms)
    if (!filesCache) {
      try {
        const cachedStr = localStorage.getItem(DRIVE_CACHE_KEY);
        if (cachedStr) {
          const parsed = JSON.parse(cachedStr);
          if (Array.isArray(parsed) && parsed.length > 0) {
            filesCache = parsed;
          }
        }
      } catch (e) {
        console.warn("No se pudo leer el caché de Drive local:", e);
      }
    }

    // Si tenemos datos en caché válidos y recientes (menos de 5 minutos), devolver de inmediato
    if (filesCache && filesCache.length > 0 && now - lastFetchTime < CACHE_DURATION) {
      return filesCache;
    }

    // Si tenemos datos en caché pero han pasado más de 5 minutos, los devolvemos de inmediato
    // e iniciamos refresco en segundo plano sin bloquear la UI
    const staleCache = filesCache;

    const fetchPromise = (async () => {
      const { API_KEY, FOLDER_ID } = DRIVE_CONFIG;
      let allFiles: DriveFile[] = [];
      const folderQueue: string[] = [FOLDER_ID];
      const scannedFolderIds = new Set<string>();

      try {
        while (folderQueue.length > 0) {
          // Procesar hasta 5 carpetas en PARALELO para velocidad máxima
          const currentFolders = folderQueue.splice(0, 5).filter(id => !scannedFolderIds.has(id));
          currentFolders.forEach(id => scannedFolderIds.add(id));

          if (currentFolders.length === 0) continue;

          const folderPromises = currentFolders.map(async (currentFolderId) => {
            const folderFiles: DriveFile[] = [];
            const newSubFolders: string[] = [];
            let pageToken: string | undefined = undefined;

            do {
              let url = `https://www.googleapis.com/drive/v3/files?q='${currentFolderId}'+in+parents+and+trashed=false&pageSize=1000&includeItemsFromAllDrives=true&supportsAllDrives=true&key=${API_KEY}&fields=nextPageToken,files(id,name,mimeType,size,description,webContentLink,webViewLink,iconLink,thumbnailLink)&orderBy=name`;
              if (pageToken) {
                url += `&pageToken=${encodeURIComponent(pageToken)}`;
              }

              const response = await fetch(url);
              if (!response.ok) break;

              const data = await response.json();
              if (data.files && Array.isArray(data.files)) {
                for (const file of data.files) {
                  if (file.mimeType === "application/vnd.google-apps.folder") {
                    newSubFolders.push(file.id);
                  } else {
                    // Optimizar enlace de descarga directa
                    file.webContentLink = driveService.getFastDownloadUrl(file.id, file.webContentLink);
                    folderFiles.push(file);
                  }
                }
              }
              pageToken = data.nextPageToken;
            } while (pageToken);

            return { folderFiles, newSubFolders };
          });

          const results = await Promise.all(folderPromises);
          for (const res of results) {
            allFiles.push(...res.folderFiles);
            for (const subId of res.newSubFolders) {
              if (!scannedFolderIds.has(subId)) {
                folderQueue.push(subId);
              }
            }
          }
        }

        // Asegurar que los archivos estáticos de respaldo sigan presentes
        FLAGGED_DRIVE_FILES.forEach((flagged) => {
          const exists = allFiles.some(
            (f) => f.name.toLowerCase().trim() === flagged.name.toLowerCase().trim()
          );
          if (!exists) {
            allFiles.push(flagged);
          }
        });

        filesCache = allFiles;
        lastFetchTime = Date.now();

        // Guardar en almacenamiento persistente
        try {
          localStorage.setItem(DRIVE_CACHE_KEY, JSON.stringify(filesCache));
        } catch (e) {
          console.warn("No se pudo guardar el caché de Drive en disco:", e);
        }

        return filesCache;
      } catch (error) {
        console.error("Error en servicio de Drive:", error);
        return staleCache || FLAGGED_DRIVE_FILES;
      }
    })();

    // Si había un caché antiguo, devolverlo de inmediato sin hacer esperar al usuario
    if (staleCache && staleCache.length > 0) {
      // Lanzar refresco en segundo plano
      fetchPromise.catch(() => {});
      return staleCache;
    }

    return await fetchPromise;
  },

  /**
   * Formatea el tamaño del archivo de bytes a una cadena legible.
   */
  formatSize(bytes?: string): string {
    if (!bytes) return "N/A";
    const b = parseInt(bytes, 10);
    if (isNaN(b)) return "N/A";
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = b;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }
};
