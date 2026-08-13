/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Download, Trash2, Tag, Layers } from "lucide-react";
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

/**
 * Componente reutilizable para mostrar una tarjeta de descarga con animaciones.
 * Optimizado con memo para evitar re-renders innecesarios.
 */
export const DownloadCard = memo(({ item, index }: DownloadCardProps) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Extensión calculada si no viene dada
  const fileExt = item.extension || (item.name.includes(".") ? "." + item.name.split(".").pop() : "");

  return (
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
        {/* Header con Icono, Categoría, Extensión y Tamaño (Sin imágenes) */}
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
          onClick={() => window.open(item.link, '_blank')}
          aria-label={`Descargar ${item.name}`}
        >
          <Download className="w-3.5 h-3.5 group-hover/btn:translate-y-0.5 transition-transform" />
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
  );
});

DownloadCard.displayName = "DownloadCard";
