/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DriveFile } from "./driveService";

export interface CustomFileItem {
  id: string;
  name: string;
  size: string;
  mimeType: string;
  description: string;
  downloadUrl: string;
  category: "Windows 10" | "Windows 7" | "Herramientas" | "Atenas" | "Drive";
  extension: string;
  imageUrl?: string;
  createdAt: number;
}

const STORAGE_KEY = "apuestaya_custom_uploaded_files";

/**
 * Servicio para gestionar archivos subidos directamente en la plataforma.
 * Soporta cualquier extensión y cualquier nombre de archivo.
 */
export const customFilesService = {
  /**
   * Obtiene la lista de archivos personalizados guardados localmente.
   */
  getCustomFiles(): CustomFileItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as CustomFileItem[];
    } catch (e) {
      console.error("Error al leer archivos locales:", e);
      return [];
    }
  },

  /**
   * Guarda un nuevo archivo de cualquier formato.
   */
  addCustomFile(file: Omit<CustomFileItem, "id" | "createdAt">): CustomFileItem {
    const customFiles = this.getCustomFiles();
    const newFile: CustomFileItem = {
      ...file,
      id: "custom_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
    };

    customFiles.unshift(newFile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customFiles));
    } catch (e) {
      console.error("Error al guardar en localStorage:", e);
    }
    return newFile;
  },

  /**
   * Elimina un archivo personalizado por ID.
   */
  removeCustomFile(id: string): void {
    const customFiles = this.getCustomFiles().filter((f) => f.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customFiles));
    } catch (e) {
      console.error("Error al eliminar archivo local:", e);
    }
  },

  /**
   * Determina la categoría basada en el nombre o descripción.
   * Si no coincide con nada, asigna "Drive" (Uncategorized / Repositorio General).
   */
  categorizeFile(fileName: string, description: string = ""): "Windows 10" | "Windows 7" | "Herramientas" | "Atenas" | "Drive" {
    const text = (fileName + " " + description).toLowerCase();

    if (text.includes("atenas")) {
      return "Atenas";
    }
    if (text.includes("win10") || text.includes("windows 10") || text.includes("windows10")) {
      return "Windows 10";
    }
    if (text.includes("win7") || text.includes("windows 7") || text.includes("windows7")) {
      return "Windows 7";
    }
    if (
      text.includes("herramienta") ||
      text.includes("tool") ||
      text.includes("utility") ||
      text.includes("utilidad") ||
      text.includes("diag") ||
      text.includes("fix") ||
      text.includes("anydesk") ||
      text.includes("systemcare") ||
      text.includes("3dp")
    ) {
      return "Herramientas";
    }

    // Si no se puede categorizar, se asigna a "Drive" (Repositorio General)
    return "Drive";
  },

  /**
   * Genera una URL de imagen de Google / Vista previa para cualquier tipo de archivo.
   */
  getGoogleImageForFile(fileName: string, mimeType?: string, driveThumbnailUrl?: string): string {
    // Si viene un thumbnailLink de Google Drive válido, usárlo con mayor resolución
    if (driveThumbnailUrl && driveThumbnailUrl.length > 5) {
      return driveThumbnailUrl.replace(/=s\d+/, "=s600");
    }

    const lower = fileName.toLowerCase();
    const ext = lower.split(".").pop() || "";

    // Mapeo inteligente de nombres e imágenes representativas de alta definición
    if (lower.includes("win10") || lower.includes("windows 10")) {
      return "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80"; // Windows 10 / Microsoft UI
    }
    if (lower.includes("win7") || lower.includes("windows 7")) {
      return "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80"; // Circuit board / Tech legacy
    }
    if (lower.includes("driver") || lower.includes("realtek") || lower.includes("epson") || lower.includes("printer")) {
      return "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80"; // Hardware / Tech setup
    }

    // Por extensiones
    switch (ext) {
      case "exe":
      case "msi":
      case "bat":
      case "cmd":
        return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80"; // Software Code / Executable
      case "zip":
      case "rar":
      case "7z":
      case "iso":
      case "tar":
      case "gz":
        return "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80"; // Storage / Compressed archive
      case "pdf":
        return "https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=80"; // Document / PDF
      case "apk":
        return "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=600&auto=format&fit=crop&q=80"; // Android / Mobile App
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "webp":
      case "svg":
        return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"; // Visual Image
      case "doc":
      case "docx":
      case "txt":
        return "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80"; // Text / Office Document
      case "xls":
      case "xlsx":
      case "csv":
        return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80"; // Data / Spreadsheet
      default:
        // Imagen técnica genérica de alta calidad de Google Drive / Servidor
        return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80";
    }
  },
};
