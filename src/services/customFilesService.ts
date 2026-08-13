/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";

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
 * Sincronizado en tiempo real mediante Firebase Firestore para que todos los usuarios
 * vean los archivos subidos por cualquier persona desde cualquier dispositivo.
 */
export const customFilesService = {
  /**
   * Obtiene la lista de archivos personalizados guardados localmente (cache rápido).
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
   * Guarda localmente en el almacenamiento del navegador.
   */
  saveLocalFiles(files: CustomFileItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    } catch (e) {
      console.error("Error al guardar cache local:", e);
    }
  },

  /**
   * Se suscribe a los cambios en Firestore para recibir los archivos en tiempo real.
   * Permite que lo subido por una persona aparezca instantáneamente a todos los usuarios.
   */
  subscribeCustomFiles(callback: (files: CustomFileItem[]) => void): () => void {
    try {
      const customCollection = collection(db, "custom_files");
      const q = query(customCollection, orderBy("createdAt", "desc"));

      return onSnapshot(
        q,
        (snapshot) => {
          const files: CustomFileItem[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              name: data.name || "Archivo sin nombre",
              size: data.size || "N/A",
              mimeType: data.mimeType || "application/octet-stream",
              description: data.description || "",
              downloadUrl: data.downloadUrl || "#",
              category: data.category || "Drive",
              extension: data.extension || "",
              imageUrl: data.imageUrl || "",
              createdAt: data.createdAt || Date.now(),
            } as CustomFileItem;
          });

          // Guardar en cache local y notificar al suscriptor
          this.saveLocalFiles(files);
          callback(files);
        },
        (error) => {
          console.warn("Firestore error (se usará cache local):", error);
          // Notificar con el cache local si falla la red
          callback(this.getCustomFiles());
        }
      );
    } catch (e) {
      console.error("Error al suscribirse a Firestore:", e);
      callback(this.getCustomFiles());
      return () => {};
    }
  },

  /**
   * Guarda un nuevo archivo de cualquier formato en la nube (Firestore) y localmente.
   */
  async addCustomFile(file: Omit<CustomFileItem, "id" | "createdAt">): Promise<CustomFileItem> {
    const createdAt = Date.now();
    const tempId = "custom_" + createdAt + "_" + Math.random().toString(36).substring(2, 7);

    const newFile: CustomFileItem = {
      ...file,
      id: tempId,
      createdAt,
    };

    // Actualizar cache local inmediatamente para respuesta instantánea en UI
    const currentLocal = this.getCustomFiles();
    currentLocal.unshift(newFile);
    this.saveLocalFiles(currentLocal);

    // Guardar en Firestore para que se comparta con todos los usuarios
    try {
      const docRef = await addDoc(collection(db, "custom_files"), {
        name: file.name,
        description: file.description,
        size: file.size,
        mimeType: file.mimeType,
        downloadUrl: file.downloadUrl,
        category: file.category,
        extension: file.extension,
        imageUrl: file.imageUrl || "",
        createdAt: createdAt,
      });

      newFile.id = docRef.id;
    } catch (e) {
      console.error("No se pudo guardar en la nube Firestore:", e);
    }

    return newFile;
  },

  /**
   * Elimina un archivo personalizado por ID en Firestore y localmente.
   */
  async removeCustomFile(id: string): Promise<void> {
    const updated = this.getCustomFiles().filter((f) => f.id !== id);
    this.saveLocalFiles(updated);

    try {
      if (!id.startsWith("custom_")) {
        await deleteDoc(doc(db, "custom_files", id));
      } else {
        // En caso de id temporal, buscar por ID o borrar local
        const snapshot = await getDocs(collection(db, "custom_files"));
        snapshot.forEach((docSnap) => {
          if (docSnap.id === id) {
            deleteDoc(doc(db, "custom_files", docSnap.id)).catch(() => {});
          }
        });
      }
    } catch (e) {
      console.error("Error al eliminar archivo de Firestore:", e);
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

