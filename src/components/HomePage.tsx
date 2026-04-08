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
    <div className="max-w-7xl mx-auto px-6 py-8 md:py-12 relative z-10">
      {/* Hero Section: Optimizado para carga instantánea */}
      <section className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-20">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black italic uppercase leading-none mb-6 drop-shadow-lg">
            <span className="block text-white [text-shadow:2px_2px_0_#000]">Apuesta</span>
            <span className="block text-cyan-400 [text-shadow:2px_2px_0_#fff]">Ya</span>
            <span className="block text-white text-2xl md:text-4xl mt-4 tracking-tighter opacity-90">Portal Técnico</span>
          </h1>
          
          <div className="bg-black/10 p-6 rounded-2xl border border-white/10 mb-8 max-w-lg mx-auto lg:mx-0">
            <p className="text-sm md:text-base font-bold italic uppercase text-cyan-300 mb-2 tracking-widest">• ANIMALITOS • RULETA • PARLEY</p>
            <div className="text-xs md:text-sm font-medium text-white/80">
              <p>RIF: J-50728157-4</p>
              <p>Telf: 0414-7221613 / 0414-7221091</p>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-start">
            <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] uppercase font-black tracking-widest">Sistemas Activos</span>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="relative z-10 overflow-hidden rounded-[2rem] shadow-2xl border-2 border-white/10 bg-white/5">
            <img 
              src="/hero-image.jpeg" 
              alt="Apuesta Ya Hero" 
              className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Decoración simple sin filtros de blur pesados */}
          <div className="absolute -inset-4 bg-cyan-400/10 rounded-[2.5rem] -z-10" />
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
            <div className={`bg-white/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 text-center hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300 ${isMobile ? '' : 'hover:-translate-y-1'}`}>
              <item.icon className="w-10 h-10 md:w-12 md:h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold uppercase italic">{item.title}</h3>
              <p className="text-purple-300 text-xs md:text-sm mt-2">{item.desc}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
