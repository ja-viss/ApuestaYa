/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, FileText, CheckCircle, AlertCircle, Trash2, LogOut, Package, HardDrive, Trophy, Monitor, Link as LinkIcon, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

/**
 * @interface UploadStatus
 * Define el estado de la operación de carga.
 */
interface UploadStatus {
  type: "success" | "error";
  message: string;
}

/**
 * Componente de la página de carga de archivos para el personal técnico.
 * 
 * Funcionalidades:
 * - Autenticación técnica local.
 * - Carga de archivos físicos a Firebase Storage.
 * - Registro de enlaces directos (Google Drive, Mega, etc.).
 * - Almacenamiento de metadatos en Firestore.
 * - Diseño responsivo y animaciones fluidas.
 */
export const UploadPage = () => {
  // Estados del formulario
  const [uploadType, setUploadType] = useState<"file" | "link" | "form">("file");
  const [file, setFile] = useState<File | null>(null);
  const [directLink, setDirectLink] = useState("");
  const [fileSize, setFileSize] = useState(""); // Para cuando es link directo
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("win10");
  
  // Estados de control
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<UploadStatus | null>(null);
  const navigate = useNavigate();

  /**
   * Hook para proteger la ruta. 
   * Redirige al login si no hay sesión técnica activa.
   */
  useEffect(() => {
    const isAuth = localStorage.getItem("isTechnicalAuthenticated");
    if (!isAuth) {
      navigate("/login");
    }
  }, [navigate]);

  /**
   * Cierra la sesión técnica eliminando el flag de localStorage.
   */
  const handleLogout = () => {
    localStorage.removeItem("isTechnicalAuthenticated");
    navigate("/");
  };

  /**
   * Procesa la carga de datos a Firebase.
   * Maneja tanto archivos físicos como enlaces externos.
   */
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones iniciales
    if (uploadType === "file" && !file) {
      setStatus({ type: "error", message: "Por favor, seleccione un archivo para subir." });
      return;
    }
    if (uploadType === "link" && !directLink) {
      setStatus({ type: "error", message: "Por favor, ingrese el enlace directo." });
      return;
    }

    setIsUploading(true);
    setStatus(null);

    try {
      let finalLink = directLink;
      let finalSize = fileSize || "N/A";

      // Caso 1: Subida de archivo físico a Firebase Storage
      if (uploadType === "file" && file) {
        const storageRef = ref(storage, `downloads/${category}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        finalLink = await getDownloadURL(snapshot.ref);
        finalSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      }

      // Caso 2: Registro en Firestore (común para ambos tipos)
      await addDoc(collection(db, "downloads"), {
        name,
        desc,
        size: finalSize,
        category,
        link: finalLink,
        type: uploadType,
        createdAt: serverTimestamp(),
      });

      setStatus({ type: "success", message: uploadType === "file" ? "¡Archivo subido exitosamente!" : "¡Enlace registrado exitosamente!" });
      
      // Limpiar formulario tras éxito
      setFile(null);
      setDirectLink("");
      setFileSize("");
      setName("");
      setDesc("");
    } catch (error) {
      console.error("Error en operación de carga:", error);
      setStatus({ type: "error", message: "Error al procesar la solicitud. Verifique su conexión." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Encabezado del Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-400/20 shrink-0">
            <Upload size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Panel de Administración</h1>
            <p className="text-purple-200 text-sm">Gestión de recursos y descargas técnicas</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-red-500/20 text-purple-200 hover:text-red-200 border border-white/10 hover:border-red-500/30 rounded-2xl transition-all font-bold text-sm"
        >
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Principal: Formulario */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl"
          >
            {/* Selector de Tipo de Carga */}
            <div className="flex p-1 bg-black/40 rounded-2xl mb-8 border border-white/5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setUploadType("file")}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${uploadType === "file" ? "bg-cyan-400 text-black shadow-lg" : "text-purple-300 hover:text-white"}`}
              >
                <Upload size={16} />
                <span>Archivo</span>
              </button>
              <button
                onClick={() => setUploadType("link")}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${uploadType === "link" ? "bg-cyan-400 text-black shadow-lg" : "text-purple-300 hover:text-white"}`}
              >
                <Globe size={16} />
                <span>Enlace</span>
              </button>
              <button
                onClick={() => setUploadType("form")}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${uploadType === "form" ? "bg-cyan-400 text-black shadow-lg" : "text-purple-300 hover:text-white"}`}
              >
                <FileText size={16} />
                <span>Google Form</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {uploadType === "form" ? (
                <motion.div
                  key="google-form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full aspect-[4/5] md:aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black/20"
                >
                  <iframe
                    src="https://docs.google.com/forms/d/e/1FAIpQLScRilfRjdnhRykod69C1St2mLa9vqfVPfH6FGH73VXJyvsv2Q/viewform?embedded=true"
                    className="w-full h-full"
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                  >
                    Cargando…
                  </iframe>
                </motion.div>
              ) : (
                <form onSubmit={handleUpload} className="space-y-6">
                  {/* Información Básica */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-purple-300 ml-1">Nombre Público</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-purple-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all"
                        placeholder="Ej: Driver Lexmark v2.0"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-purple-300 ml-1">Categoría de Destino</label>
                      <div className="relative">
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="block w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all appearance-none cursor-pointer"
                        >
                          <option value="win10" className="bg-[#06040a]">Windows 10</option>
                          <option value="win7" className="bg-[#06040a]">Windows 7</option>
                          <option value="lottery" className="bg-[#06040a]">Lotería</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-purple-400">
                          <Package size={18} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-purple-300 ml-1">Descripción Técnica</label>
                    <textarea
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      className="block w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-purple-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all min-h-[120px] resize-none"
                      placeholder="Detalles sobre la versión, compatibilidad o instrucciones especiales..."
                      required
                    />
                  </div>

                  {/* Área Dinámica: Archivo o Link */}
                  <AnimatePresence mode="wait">
                    {uploadType === "file" ? (
                      <motion.div
                        key="file-upload"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-2"
                      >
                        <label className="block text-xs font-black uppercase tracking-widest text-purple-300 ml-1">Archivo Local</label>
                        <div className="relative group">
                          <input
                            type="file"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className={`w-full py-12 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all ${file ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/10 hover:border-cyan-400/40 hover:bg-white/5'}`}>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${file ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/30' : 'bg-white/5 text-purple-400'}`}>
                              {file ? <CheckCircle size={28} /> : <Upload size={28} />}
                            </div>
                            <div className="text-center px-4">
                              <p className="text-white font-bold truncate max-w-[250px]">{file ? file.name : 'Arrastre o seleccione archivo'}</p>
                              <p className="text-purple-400 text-xs mt-1 font-medium">{file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Soporte para .zip, .exe, .rar, .pdf'}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="link-upload"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                      >
                        <div className="space-y-2">
                          <label className="block text-xs font-black uppercase tracking-widest text-purple-300 ml-1">Enlace Directo (Drive/Mega/etc)</label>
                          <div className="relative">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-purple-400">
                              <LinkIcon size={18} />
                            </div>
                            <input
                              type="url"
                              value={directLink}
                              onChange={(e) => setDirectLink(e.target.value)}
                              className="block w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-purple-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all"
                              placeholder="https://drive.google.com/file/d/..."
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-black uppercase tracking-widest text-purple-300 ml-1">Tamaño Estimado (Opcional)</label>
                          <input
                            type="text"
                            value={fileSize}
                            onChange={(e) => setFileSize(e.target.value)}
                            className="block w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-purple-300/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all"
                            placeholder="Ej: 450 MB o 1.2 GB"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Mensajes de Estado */}
                  {status && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`flex items-center gap-4 p-5 border rounded-[1.5rem] text-sm font-bold ${status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}
                    >
                      <div className={`p-2 rounded-lg ${status.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                      </div>
                      <p>{status.message}</p>
                    </motion.div>
                  )}

                  {/* Botón de Acción */}
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full py-5 bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-widest rounded-[1.5rem] shadow-xl shadow-cyan-400/20 flex items-center justify-center gap-3 transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isUploading ? (
                      <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <Upload size={20} className="group-hover:-translate-y-1 transition-transform" />
                        <span>{uploadType === "file" ? "Subir a Servidor" : "Registrar Enlace"}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Columna Lateral: Información y Guía */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-xl"
          >
            <h3 className="text-white font-black uppercase tracking-tighter text-lg mb-6 flex items-center gap-3">
              <Package size={22} className="text-cyan-400" />
              Protocolo Técnico
            </h3>
            <ul className="space-y-6">
              {[
                { id: 1, text: "Verifique que el archivo no contenga virus antes de subirlo." },
                { id: 2, text: "Para enlaces de Drive, asegúrese de que el acceso sea público o para cualquier persona con el enlace." },
                { id: 3, text: "Use nombres descriptivos: 'Driver_Lexmark_Win10_v2.exe' es mejor que 'archivo1.exe'." }
              ].map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="w-6 h-6 rounded-lg bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 flex items-center justify-center shrink-0 text-xs font-black">
                    {item.id}
                  </div>
                  <p className="text-sm text-purple-200 leading-relaxed font-medium">{item.text}</p>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-cyan-400/5 backdrop-blur-xl border border-cyan-400/10 rounded-[2rem] p-8 shadow-xl"
          >
            <h3 className="text-cyan-400 font-black uppercase tracking-tighter text-lg mb-4">Estado del Sistema</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 uppercase">Storage</span>
                <span className="text-xs font-black text-green-400 uppercase">Activo</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[65%] h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              </div>
              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Capacidad utilizada: 65%</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
