/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Download } from "lucide-react";
import React, { ReactNode, memo } from "react";

/**
 * Interfaz para definir la estructura de un archivo descargable.
 */
export interface DownloadItem {
  name: string;
  desc: string;
  size: string;
  icon: ReactNode;
  link: string;
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
  // Detectar si es móvil para simplificar animaciones
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

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
      className="relative bg-white border border-slate-100 p-5 rounded-xl group transition-all duration-150 hover:border-pink-500/40 hover:bg-pink-50/30 overflow-hidden shadow-sm hover:shadow-md"
    >
      {/* Indicador de estado técnico (Rosa) */}
      <div className="absolute top-0 left-0 w-1 h-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10">
        {/* Header de la Card */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 rounded bg-pink-50 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform border border-pink-100">
            {item.icon}
          </div>
          <span className="text-[8px] font-mono uppercase tracking-widest text-pink-600/60 bg-pink-500/5 px-2 py-0.5 rounded border border-pink-500/10">
            {item.size}
          </span>
        </div>
        
        {/* Cuerpo de la Card */}
        <h3 className="text-base font-black mb-1 group-hover:text-pink-600 transition-colors line-clamp-1 uppercase tracking-tight italic text-slate-800">
          {item.name}
        </h3>
        <p className="text-[11px] text-slate-400 mb-5 line-clamp-2 leading-tight font-medium">
          {item.desc}
        </p>
        
        {/* Acción de descarga */}
        <button
          className="w-full bg-slate-50 hover:bg-pink-500 text-slate-600 hover:text-white py-2 rounded-lg border border-slate-100 hover:border-pink-500 flex items-center justify-center gap-2 transition-all duration-150 font-black text-[10px] uppercase tracking-widest"
          onClick={() => window.open(item.link, '_blank')}
          aria-label={`Descargar ${item.name}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download_File</span>
        </button>
      </div>
    </motion.div>
  );
});

DownloadCard.displayName = "DownloadCard";
