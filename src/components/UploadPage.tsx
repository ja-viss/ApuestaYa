/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from "react";
import { FileText, LogOut, Upload, CheckCircle2, AlertCircle, ExternalLink, Plus, FolderUp, Globe, FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { customFilesService, CustomFileItem } from "../services/customFilesService";

/**
 * Componente de la página de carga de archivos para el personal técnico.
 * Permite subir archivos de cualquier extensión y nombre.
 */
export const UploadPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados del formulario
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [description, setDescription] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [category, setCategory] = useState<"Windows 10" | "Windows 7" | "Herramientas" | "Drive">("Drive");
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [customFiles, setCustomFiles] = useState<CustomFileItem[]>([]);

  useEffect(() => {
    const isAuth = localStorage.getItem("isTechnicalAuthenticated");
    if (!isAuth) {
      navigate("/login");
    } else {
      setCustomFiles(customFilesService.getCustomFiles());
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isTechnicalAuthenticated");
    navigate("/");
  };

  // Cuando se selecciona un archivo local
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
      // Auto categorizar según el nombre
      const autoCat = customFilesService.categorizeFile(file.name, "");
      setCategory(autoCat);
    }
  };

  // Manejar el submit de la carga
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    setIsUploading(true);

    let downloadUrl = "#";
    let sizeStr = "N/A";
    let mimeType = "application/octet-stream";
    let ext = "";

    if (uploadMode === "file" && selectedFile) {
      // Crear ObjectURL para descarga directa
      downloadUrl = URL.createObjectURL(selectedFile);
      sizeStr = customFilesService.getGoogleImageForFile
        ? (selectedFile.size / (1024 * 1024) > 1 
            ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` 
            : `${(selectedFile.size / 1024).toFixed(1)} KB`)
        : "Descarga Directa";
      mimeType = selectedFile.type || "application/octet-stream";
      ext = selectedFile.name.includes(".") ? "." + selectedFile.name.split(".").pop() : "";
    } else if (uploadMode === "url" && externalUrl.trim()) {
      downloadUrl = externalUrl.trim();
      ext = fileName.includes(".") ? "." + fileName.split(".").pop() : "";
      sizeStr = "Enlace Externo";
    }

    // Auto categorizar si no se seleccionó explícitamente o si es uncategorized
    const finalCat = category || customFilesService.categorizeFile(fileName, description);
    const imageUrl = customFilesService.getGoogleImageForFile(fileName, mimeType);

    customFilesService.addCustomFile({
      name: fileName.trim(),
      description: description.trim() || `Archivo ${ext.toUpperCase() || 'técnico'} subido sin restricciones.`,
      size: sizeStr,
      mimeType: mimeType,
      downloadUrl: downloadUrl,
      category: finalCat,
      extension: ext,
      imageUrl: imageUrl,
    });

    setIsUploading(false);
    setIsSuccess(true);
    setCustomFiles(customFilesService.getCustomFiles());

    // Resetear formulario
    setSelectedFile(null);
    setFileName("");
    setDescription("");
    setExternalUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";

    setTimeout(() => {
      setIsSuccess(false);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 min-h-screen flex flex-col gap-8">
      {/* Encabezado del Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/20 shrink-0">
            <Upload size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 uppercase italic tracking-tighter">Panel de Carga Universal</h1>
            <p className="text-pink-600/60 text-sm font-bold tracking-widest uppercase opacity-80">Sube cualquier archivo sin restricción de formato</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/drive")}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest shadow-sm"
          >
            <Globe size={16} />
            <span>Ver Repositorio</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest shadow-sm"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Grid Principal: Formulario de Subida Directa + Formulario Google */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulario de Carga Directa (2 columnas en escritorio) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <FolderUp className="w-6 h-6 text-pink-500" />
                <h2 className="text-xl font-black uppercase italic text-slate-900">Subir Archivo al Sistema</h2>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full uppercase">
                Acepta cualquier extensión
              </span>
            </div>

            {/* Mensaje de éxito */}
            {isSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-700 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold">¡Archivo registrado exitosamente!</p>
                  <p className="text-xs">
                    Ya está disponible en el Repositorio Drive y categorizado correctamente.
                  </p>
                </div>
              </div>
            )}

            {/* Selector de modo: Archivo Local o URL Externa */}
            <div className="flex gap-2 mb-6 p-1 bg-slate-50 rounded-xl border border-slate-100">
              <button
                type="button"
                onClick={() => setUploadMode("file")}
                className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  uploadMode === "file"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                1. Archivo Local (PC / Móvil)
              </button>
              <button
                type="button"
                onClick={() => setUploadMode("url")}
                className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  uploadMode === "url"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                2. Enlace / URL de Descarga
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {uploadMode === "file" ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Selecciona cualquier archivo (.exe, .zip, .pdf, .apk, .iso, .docx, .png, etc.)
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-pink-200 hover:border-pink-500 bg-pink-50/20 hover:bg-pink-50/50 p-8 rounded-2xl text-center cursor-pointer transition-all group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Upload className="w-10 h-10 text-pink-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    {selectedFile ? (
                      <div>
                        <p className="text-sm font-black text-slate-800 break-all">{selectedFile.name}</p>
                        <p className="text-xs text-pink-600 font-mono mt-1">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || "Formulario de tipo binario"}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-bold text-slate-700">Haz clic o arrastra un archivo aquí</p>
                        <p className="text-xs text-slate-400 mt-1">Formatos soportados: TODOS (.zip, .exe, .rar, .pdf, .apk, .bin, etc.)</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    URL Directa de Descarga o Enlace de Google Drive / Servidor
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://drive.google.com/file/d/..."
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500 font-mono text-slate-800"
                  />
                </div>
              )}

              {/* Nombre del archivo */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Nombre del Archivo en el Repositorio
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Win10_Realtek_Audio_Driver_v2.exe"
                  value={fileName}
                  onChange={(e) => {
                    setFileName(e.target.value);
                    setCategory(customFilesService.categorizeFile(e.target.value, description));
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500 font-bold text-slate-800"
                />
              </div>

              {/* Categoría y Descripción */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Categoría del Sistema
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500 font-bold text-slate-800"
                  >
                    <option value="Windows 10">Windows 10</option>
                    <option value="Windows 7">Windows 7</option>
                    <option value="Herramientas">Herramientas</option>
                    <option value="Drive">Drive (General / Sin Categoría)</option>
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">
                    * Si no se categoriza explícitamente, se colocará en Drive (Repositorio General).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Descripción Corta
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Controlador oficial para placa base x64"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500 text-slate-700"
                  />
                </div>
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={isUploading || (!selectedFile && !externalUrl && uploadMode === 'file')}
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-black uppercase text-xs tracking-widest py-4 rounded-xl shadow-lg shadow-pink-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar y Publicar Archivo</span>
              </button>
            </form>
          </div>
        </div>

        {/* Panel lateral: Google Form alternativo e instrucciones */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl" />
            <h3 className="text-lg font-black uppercase italic mb-3 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-pink-400" />
              <span>Formulario Google</span>
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed mb-6">
              ¿Prefieres subir mediante el formulario oficial externo de Google Forms? También puedes enviar la solicitud directamente.
            </p>
            <button
              onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLScRilfRjdnhRykod69C1St2mLa9vqfVPfH6FGH73VXJyvsv2Q/viewform?usp=sf_link", "_blank")}
              className="w-full bg-white text-slate-900 hover:bg-pink-50 py-3.5 px-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <ExternalLink className="w-4 h-4 text-pink-500" />
              <span>Abrir Google Form</span>
            </button>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3">
              ¿Cómo funciona la categorización?
            </h4>
            <ul className="text-xs text-slate-500 space-y-2.5 font-medium">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span><strong>Windows 10 / 7:</strong> Archivos con las palabras 'win10', 'win7' en el nombre o seleccionados manualmente.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong>Herramientas:</strong> Utilidades técnicas, diagnósticos y programas de reparación.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                <span><strong>Drive (Repositorio General):</strong> Cualquier archivo que no corresponda a una categoría específica. En `/drive` se muestran <strong>TODOS</strong> los archivos subidos.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* Lista de Archivos Subidos Recientemente */}
      {customFiles.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black uppercase italic text-slate-900">
              Archivos Registrados Localmente ({customFiles.length})
            </h3>
            <button
              onClick={() => navigate("/drive")}
              className="text-xs font-black text-pink-500 hover:underline uppercase"
            >
              Ver todos en Repositorio →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customFiles.map((f) => (
              <div key={f.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 truncate">{f.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {f.size} • {f.category}
                  </p>
                </div>
                <button
                  onClick={() => {
                    customFilesService.removeCustomFile(f.id);
                    setCustomFiles(customFilesService.getCustomFiles());
                  }}
                  className="text-[10px] text-red-500 hover:bg-red-50 px-2 py-1 rounded border border-red-100 font-bold"
                >
                  Borrar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pie de página */}
      <div className="text-center shrink-0">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
          Sistema de Gestión de Archivos sin Restricciones • Apuesta Ya Tech
        </p>
      </div>
    </div>
  );
};

