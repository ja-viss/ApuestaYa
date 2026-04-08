/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Smartphone, Settings, ShieldCheck, Monitor, Trophy, Wrench, Globe } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Página de inicio del Portal Técnico de Apuesta Ya.
 * Optimizada para máximo rendimiento en dispositivos de gama baja.
 */
export default function HomePage() {
  // Detectar si es móvil para reducir animaciones
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 md:py-16 relative z-10">
      {/* Hero Section: Estética Cyber-Tech Light Premium */}
      <section className="grid lg:grid-cols-2 gap-16 items-center mb-20 md:mb-32">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6">
            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-600">System_v4.5_Light</span>
          </div>
          
          <h1 className="text-7xl sm:text-8xl md:text-[10rem] font-black italic uppercase leading-[0.8] mb-8 tracking-tighter">
            <span className="block text-slate-900">Apuesta</span>
            <span className="block text-pink-500 drop-shadow-[0_0_30px_rgba(236,72,153,0.2)]">Ya</span>
          </h1>
          
          <div className="relative max-w-lg mx-auto lg:mx-0 mb-10">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 to-transparent" />
            <p className="text-lg md:text-xl font-bold text-slate-800 leading-tight mb-4 italic uppercase tracking-tight">
              Infraestructura Técnica de Alto Rendimiento
            </p>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Repositorio centralizado de drivers, herramientas de diagnóstico y software especializado para la red nacional de puntos de venta.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <Link to="/drive" className="group relative px-8 py-4 bg-pink-500 text-white font-black uppercase italic text-sm tracking-widest overflow-hidden rounded-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-pink-500/20">
              <span className="relative z-10">Explorar_Repo</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </Link>
            <div className="px-8 py-4 border border-slate-200 text-slate-600 font-black uppercase italic text-sm tracking-widest rounded-sm hover:bg-pink-50 hover:border-pink-200 transition-all cursor-pointer">
              Soporte_Live
            </div>
          </div>
        </div>

        {/* Visualizador de Núcleo CSS Avanzado (Modo Light) */}
        <div className="relative aspect-square max-w-md mx-auto lg:ml-auto">
          {/* Anillos de Datos */}
          <div className="absolute inset-0 border border-pink-500/10 rounded-full animate-[spin_30s_linear_infinite]" />
          <div className="absolute inset-8 border border-slate-200 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
          <div className="absolute inset-16 border-2 border-pink-500/5 rounded-full border-dotted animate-[spin_40s_linear_infinite]" />
          
          {/* Núcleo Central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              {/* Hexágono o Cubo CSS */}
              <div className="absolute inset-0 bg-pink-500/5 rotate-45 animate-pulse rounded-3xl" />
              <div className="absolute inset-4 bg-white border border-pink-500/20 rotate-45 flex items-center justify-center overflow-hidden rounded-2xl shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent" />
                <Settings className="w-20 h-20 md:w-32 md:h-32 text-pink-500/20 animate-[spin_15s_linear_infinite]" />
              </div>
              
              {/* Partículas de Datos */}
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899]"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 90}deg) translate(120px, 0)`,
                    animation: `ping 2s cubic-bezier(0, 0, 0.2, 1) infinite ${i * 0.5}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* HUD de Telemetría */}
          <div className="absolute top-10 right-0 font-mono text-[9px] text-pink-600/60 text-right space-y-1">
            <p>NET_LATENCY: 12ms</p>
            <p>UPLINK_SECURE: YES</p>
            <p>THEME: LIGHT_PINK</p>
          </div>
          
          <div className="absolute bottom-10 left-0 font-mono text-[9px] text-slate-400 space-y-1">
            <p>CORE_TEMP: 28°C</p>
            <p>STATUS: OPTIMIZED</p>
            <div className="w-24 h-0.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-4/5 h-full bg-pink-500/40" />
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Rápidas */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[
          { to: "/windows10", icon: Monitor, title: "Windows 10", desc: "Drivers Modernos" },
          { to: "/windows7", icon: Smartphone, title: "Windows 7", desc: "Sistemas Legacy" },
          { to: "/tools", icon: Wrench, title: "Herramientas", desc: "Software Técnico" },
          { to: "/drive", icon: Globe, title: "Repositorio", desc: "Archivos Drive" }
        ].map((item, idx) => (
          <Link key={item.to} to={item.to} className="group">
            <div className={`bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 text-center hover:bg-pink-50/50 hover:border-pink-500/30 transition-all duration-300 shadow-sm hover:shadow-md ${isMobile ? '' : 'hover:-translate-y-1'}`}>
              <item.icon className="w-10 h-10 md:w-12 md:h-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold uppercase italic text-slate-900">{item.title}</h3>
              <p className="text-slate-400 text-xs md:text-sm mt-2">{item.desc}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
