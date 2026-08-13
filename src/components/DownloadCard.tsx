/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { Download, Trash2, Lock, Key, Eye, EyeOff, X, ShieldAlert, Check } from "lucide-react";
import React, { ReactNode, memo, useState } from "react";

/**
 * Interfaz para definir la estructura de un archivo descargable.
 */
export interface DownloadItem {
  id?: string;
  name: string;
  desc: string;
  size: string;
  icon: ReactNode;
  link: string;
  imageUrl?: string;
  category?: string;
  extension?: string;
  source?: "drive" | "upload";
  onDelete?: (id: string) => void;
}

/**
 * Propiedades para el componente DownloadCard.
 */
interface DownloadCardProps {
  item: DownloadItem;
  index: number;
}

const REQUIRED_PASSWORD = "grupoandino2405";

export const DownloadCard = memo(({ item, index }: DownloadCardProps) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [showModal, setShowModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Extensión calculada si no viene dada
  const fileExt = item.extension || (item.name.includes(".") ? "." + item.name.split(".").pop() : "");

  const handleDownloadClick = () => {
    // Si ya está autorizado en esta sesión del navegador, se procede directamente
    const isAuthorized = typeof window !== 'undefined' && sessionStorage.getItem('download_auth_granted') === 'true';
    if (isAuthorized) {
      window.open(item.link, '_blank');
    } else {
      setPasswordInput("");
      setPasswordError(null);
      setShowModal(true);
    }
  };

  const handleConfirmPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === REQUIRED_PASSWORD) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('download_auth_granted', 'true');
      }
      setShowModal(false);
      setPasswordError(null);
      window.open(item.link, '_blank');
    } else {
      setPasswordError("Clave incorrecta. Por favor verifica e intenta de nuevo.");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: isMobile ? 0 : (index % 8) * 0.02, 
          duration: 0.2,
          ease: "easeOut"
        }}
        viewport={{ once: true, margin: "100px" }}
        className="relative bg-white border border-slate-100 p-5 rounded-2xl group transition-all duration-200 hover:border-pink-500/40 hover:bg-pink-50/20 overflow-hidden shadow-sm hover:shadow-lg flex flex-col justify-between"
      >
        {/* Indicador de estado técnico (Rosa) */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity z-20" />
        
        <div>
          {/* Header con Icono, Categoría, Extensión y Tamaño */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform border border-pink-100 shrink-0">
                {item.icon}
              </div>
              {item.category && (
                <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                  item.category === 'Windows 10' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                  item.category === 'Windows 7' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                  item.category === 'Herramientas' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                  item.category === 'Atenas' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                  'bg-pink-50 text-pink-600 border-pink-200'
                }`}>
                  {item.category}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {fileExt && (
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {fileExt}
                </span>
              )}
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-pink-500 text-white px-2 py-0.5 rounded border border-pink-400">
                {item.size}
              </span>
            </div>
          </div>

          {/* Contenido de la Card */}
          <div className="mb-4">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="text-base font-black group-hover:text-pink-600 transition-colors line-clamp-2 uppercase tracking-tight italic text-slate-800 leading-snug break-words">
                {item.name}
              </h3>
              {item.source && (
                <span className={`shrink-0 text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                  item.source === 'upload' ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}>
                  {item.source === 'upload' ? 'Subido' : 'Drive'}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-medium">
              {item.desc}
            </p>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="pt-2 flex gap-2">
          <button
            className="flex-1 bg-slate-900 hover:bg-pink-500 text-white py-2.5 px-4 rounded-xl shadow-sm transition-all duration-150 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 group/btn active:scale-95"
            onClick={handleDownloadClick}
            aria-label={`Descargar ${item.name}`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-400 group-hover/btn:text-white transition-colors" />
            <span>Descargar</span>
          </button>

          {item.onDelete && item.id && (
            <button
              onClick={() => item.id && item.onDelete && item.onDelete(item.id)}
              className="px-3 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl border border-red-100 hover:border-red-500 transition-all flex items-center justify-center"
              title="Eliminar archivo local"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Modal de Protección por Clave de Descarga */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden"
            >
              {/* Cierre Modal */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icono de Seguridad */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center border border-pink-500/20 shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-pink-600 block">
                    Acceso Protegido
                  </span>
                  <h3 className="text-lg font-black uppercase italic text-slate-900">
                    Clave de Descarga Requerida
                  </h3>
                </div>
              </div>

              {/* Detalle del archivo a descargar */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 mb-5">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Archivo seleccionado:
                </span>
                <p className="text-xs font-black uppercase text-slate-800 line-clamp-1">
                  {item.name}
                </p>
                <span className="text-[10px] font-mono font-bold text-pink-500">
                  {item.size} • {fileExt || 'Descarga Directa'}
                </span>
              </div>

              {/* Formulario de Clave */}
              <form onSubmit={handleConfirmPassword} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Ingresa la clave corporativa
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        if (passwordError) setPasswordError(null);
                      }}
                      autoFocus
                      placeholder="Ingresa la clave de descarga..."
                      className={`w-full bg-slate-50 border ${
                        passwordError ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-pink-500 focus:ring-pink-500/20'
                      } rounded-xl px-4 py-3 text-sm font-mono text-slate-900 focus:outline-none focus:ring-4 transition-all pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {passwordError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 mt-2 text-red-500 text-xs font-bold"
                    >
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{passwordError}</span>
                    </motion.div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
});

DownloadCard.displayName = "DownloadCard";
