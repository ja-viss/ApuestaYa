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
      initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: isMobile ? 0 : index * 0.05, duration: 0.3 }}
      viewport={{ once: true }}
      whileHover={isMobile ? {} : { y: -5 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl group transition-colors hover:border-cyan-400/30"
    >
      {/* Icono con efecto de hover */}
      <div className="bg-cyan-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-cyan-400 group-hover:bg-cyan-400 group-hover:text-black transition-all duration-300 border border-cyan-400/20">
        {item.icon}
      </div>
      
      {/* Información del archivo */}
      <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1">{item.name}</h3>
      <p className="text-sm text-purple-200 mb-6 line-clamp-2">
        {item.desc}
      </p>
      
      {/* Pie de la tarjeta con tamaño y botón de descarga */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{item.size}</span>
        <motion.button
          whileHover={isMobile ? {} : { scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-cyan-400 text-black p-3 rounded-xl shadow-lg shadow-cyan-400/20"
          onClick={() => window.open(item.link, '_blank')}
          aria-label={`Descargar ${item.name}`}
        >
          <Download className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
});

DownloadCard.displayName = "DownloadCard";
