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
    <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
      {/* Hero Section: Adaptable para móvil y escritorio */}
      <section className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-20">
        <div className={`text-center lg:text-left ${!isMobile ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : ''}`}>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black italic uppercase leading-none mb-6 drop-shadow-[0_5px_0_rgba(0,0,0,0.2)]">
            <span className="block text-white">Portal</span>
            <span className="block text-cyan-400">Técnico</span>
            <span className="block text-white">Oficial</span>
          </h1>
          <p className="text-sm md:text-xl text-purple-100 mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed opacity-90">
            Recursos exclusivos para el personal técnico de Apuesta Ya. Drivers, sistemas y herramientas de lotería.
          </p>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4">
            <div className="bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-white/10 flex items-center gap-3 md:gap-4">
              <div className="bg-green-500/80 p-2 md:p-3 rounded-xl">
                <Settings className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-[10px] text-purple-200 uppercase font-bold tracking-tighter">Estado</p>
                <p className="text-sm md:text-base font-bold">Online</p>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-white/10 flex items-center gap-3 md:gap-4">
              <div className="bg-cyan-400/80 p-2 md:p-3 rounded-xl text-black">
                <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-[10px] text-purple-200 uppercase font-bold tracking-tighter">Seguridad</p>
                <p className="text-sm md:text-base font-bold">VPN</p>
              </div>
            </div>
          </div>
        </div>

        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-500 rounded-full blur-3xl opacity-20" />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-cyan-400 rounded-full blur-3xl opacity-10" />
            
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 bg-purple-900/10 backdrop-blur-xl p-8 text-center">
               <Trophy className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
               <h2 className="text-2xl font-black uppercase italic">Bienvenido, Técnico</h2>
               <p className="text-purple-200 mt-4 text-sm">Selecciona una categoría para comenzar la descarga de archivos.</p>
            </div>
          </motion.div>
        )}
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
