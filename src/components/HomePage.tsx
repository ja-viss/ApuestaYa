/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Smartphone, Settings, ShieldCheck, Monitor, Trophy, Database } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Página de inicio del Portal Técnico de Apuesta Ya.
 * 
 * Características:
 * - Diseño Hero impactante con animaciones de entrada.
 * - Indicadores de estado del sistema y seguridad.
 * - Accesos rápidos a las categorías principales de descarga.
 * - Diseño totalmente responsivo y adaptado a la estética técnica.
 */
export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section: Adaptable para móvil y escritorio */}
      <section className="grid lg:grid-cols-2 gap-12 items-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center lg:text-left"
        >
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black italic uppercase leading-none mb-6 drop-shadow-[0_5px_0_rgba(0,0,0,0.2)]">
            <span className="block text-white">Portal</span>
            <span className="block text-cyan-400">Técnico</span>
            <span className="block text-white">Oficial</span>
          </h1>
          <p className="text-base md:text-xl text-purple-100 mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
            Recursos exclusivos para el personal técnico de Apuesta Ya. Drivers, sistemas y herramientas de lotería.
          </p>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4">
              <div className="bg-green-500 p-3 rounded-xl">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-purple-200 uppercase font-bold tracking-tighter">Estado</p>
                <p className="font-bold">Servidor Online</p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4">
              <div className="bg-cyan-400 p-3 rounded-xl text-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-purple-200 uppercase font-bold tracking-tighter">Seguridad</p>
                <p className="font-bold">VPN Requerida</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-500 rounded-full blur-3xl opacity-50 animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-cyan-400 rounded-full blur-3xl opacity-30 animate-pulse" />
          
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 bg-purple-900/20 backdrop-blur-xl p-8 text-center">
             <Trophy className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
             <h2 className="text-3xl font-black uppercase italic">Bienvenido, Técnico</h2>
             <p className="text-purple-200 mt-4">Selecciona una categoría para comenzar la descarga de archivos.</p>
          </div>
        </motion.div>
      </section>

      {/* Categorías Rápidas */}
      <section className="grid md:grid-cols-3 gap-8">
        <Link to="/windows10" className="group">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white/5 p-8 rounded-[2rem] border border-white/10 text-center hover:bg-white/10 hover:border-cyan-400/30 transition-all">
            <Monitor className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold uppercase italic">Windows 10</h3>
            <p className="text-purple-300 text-sm mt-2">Drivers y Sistemas Modernos</p>
          </motion.div>
        </Link>
        <Link to="/windows7" className="group">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white/5 p-8 rounded-[2rem] border border-white/10 text-center hover:bg-white/10 hover:border-cyan-400/30 transition-all">
            <Smartphone className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold uppercase italic">Windows 7</h3>
            <p className="text-purple-300 text-sm mt-2">Sistemas Legacy y Terminales</p>
          </motion.div>
        </Link>
        <Link to="/lottery" className="group">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white/5 p-8 rounded-[2rem] border border-white/10 text-center hover:bg-white/10 hover:border-cyan-400/30 transition-all">
            <Database className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold uppercase italic">Lotería</h3>
            <p className="text-purple-300 text-sm mt-2">Scripts y Formatos de Carga</p>
          </motion.div>
        </Link>
      </section>
    </div>
  );
}
