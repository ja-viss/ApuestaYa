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
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: isMobile ? 0 : (index % 6) * 0.03, duration: 0.2 }}
      viewport={{ once: true, margin: "50px" }}
      whileHover={isMobile ? {} : { y: -4, scale: 1.02 }}
      className="relative bg-[#1a1033] border border-white/10 p-5 rounded-2xl group transition-all duration-200 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] overflow-hidden"
    >
      {/* Fondo decorativo sutil */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-400/5 rounded-full blur-2xl group-hover:bg-cyan-400/10 transition-colors" />
      
      <div className="relative z-10">
        {/* Icono y Badge de tamaño */}
        <div className="flex items-start justify-between mb-4">
          <div className="bg-white/5 w-10 h-10 rounded-lg flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400 group-hover:text-black transition-all duration-300 border border-white/10">
            {item.icon}
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-white/30 bg-white/5 px-2 py-1 rounded-md border border-white/5">
            {item.size}
          </span>
        </div>
        
        {/* Información del archivo */}
        <h3 className="text-lg font-black mb-1 group-hover:text-cyan-400 transition-colors line-clamp-1 italic uppercase tracking-tight">
          {item.name}
        </h3>
        <p className="text-xs text-purple-200/60 mb-5 line-clamp-2 leading-relaxed">
          {item.desc}
        </p>
        
        {/* Botón de descarga optimizado */}
        <button
          className="w-full bg-white/5 hover:bg-cyan-400 text-white hover:text-black py-2.5 rounded-xl border border-white/10 hover:border-cyan-400 flex items-center justify-center gap-2 transition-all duration-200 font-bold text-xs uppercase italic tracking-widest"
          onClick={() => window.open(item.link, '_blank')}
          aria-label={`Descargar ${item.name}`}
        >
          <Download className="w-4 h-4" />
          <span>Descargar</span>
        </button>
      </div>
    </motion.div>
  );
});

DownloadCard.displayName = "DownloadCard";
