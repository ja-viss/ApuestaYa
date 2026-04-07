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
}

/**
 * Servicio para interactuar con la API de Google Drive v3.
 */
export const driveService = {
  /**
   * Obtiene la lista de archivos de la carpeta configurada.
   */
  async getFiles(): Promise<DriveFile[]> {
    const { API_KEY, FOLDER_ID } = DRIVE_CONFIG;
    const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents&key=${API_KEY}&fields=files(id,name,mimeType,size,description,webContentLink,webViewLink,iconLink)&orderBy=name`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching Drive files:", errorData);
        throw new Error(errorData.error?.message || "Error al obtener archivos de Drive");
      }
      const data = await response.json();
      return data.files || [];
    } catch (error) {
      console.error("Drive Service Error:", error);
      return [];
    }
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
