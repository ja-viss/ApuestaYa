/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  Smartphone, 
  ShieldCheck, 
  Monitor, 
  Wrench, 
  Globe, 
  Layers, 
  Zap, 
  Server, 
  ArrowRight 
} from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Página de inicio del Portal Técnico de Apuesta Ya.
 * Estética Cyber-Tech Light Premium, dinámica, atractiva y ultra-optimizada.
 */
export default function HomePage() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 md:py-16 relative z-10 space-y-16 md:space-y-24">
      {/* 1. Hero Section: Cyber-Tech Light Dinámico */}
      <section className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Columna Izquierda: Branding y Mensaje Principal */}
        <div className="lg:col-span-7 text-center lg:text-left">
          {/* Badge de Versión / Estado */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6 shadow-sm">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-600">
              Sistema Técnico Grupo Andino v4.5
            </span>
          </div>
          
          {/* Título Principal Tipográfico */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl xl:text-9xl font-black italic uppercase leading-[0.85] mb-8 tracking-tighter text-slate-900">
            <span>Apuesta</span>{" "}
            <span className="text-pink-500 drop-shadow-[0_0_35px_rgba(236,72,153,0.25)]">Ya</span>
          </h1>
          
          {/* Descripción con acento visual */}
          <div className="relative max-w-xl mx-auto lg:mx-0 mb-8 pl-4 border-l-4 border-pink-500">
            <p className="text-lg md:text-xl font-black text-slate-800 italic uppercase tracking-tight mb-2">
              Infraestructura Técnica & Repositorio de Software
            </p>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Plataforma centralizada para la descarga acelerada de drivers, instaladores del Sistema Atenas y herramientas de diagnóstico de la red nacional.
            </p>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <Link 
              to="/drive" 
              className="group relative px-8 py-4 bg-slate-900 hover:bg-pink-500 text-white font-black uppercase italic text-xs tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/10 hover:shadow-pink-500/25 flex items-center gap-3"
            >
              <span>Explorar Repositorio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              to="/atenas" 
              className="px-8 py-4 bg-white border border-slate-200 text-slate-800 font-black uppercase italic text-xs tracking-widest rounded-xl hover:bg-pink-50 hover:border-pink-300 transition-all shadow-sm flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-amber-500" />
              <span>Sistemas Atenas</span>
            </Link>
          </div>
        </div>

        {/* Columna Derecha: Escenario Gráfico Dinámico (Interactive Core HUD) */}
        <div className="lg:col-span-5 relative">
          <div className="relative max-w-md mx-auto aspect-square">
            {/* Glows de Fondo */}
            <div className="absolute inset-0 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />

            {/* Anillos Dinámicos CSS */}
            <div className="absolute inset-0 border-2 border-pink-500/15 rounded-3xl rotate-6 animate-[spin_40s_linear_infinite]" />
            <div className="absolute inset-4 border border-slate-200 rounded-3xl -rotate-3 animate-[spin_25s_linear_infinite_reverse]" />

            {/* Contenedor Principal de la Interfaz HUD */}
            <div className="relative w-full h-full bg-white/90 backdrop-blur-md border border-slate-200 rounded-3xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
              {/* Header HUD */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-700">
                    STATUS_ONLINE // SERVIDOR_ACTIVO
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-pink-500 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                  LATENCIA: 8ms
                </span>
              </div>

              {/* Centro de Control Interactivo */}
              <div className="my-auto py-6 space-y-3">
                {/* Card Flotante 1: Atenas Status */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xs">
                      AT
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-800">Atenas Grupo Andino</h4>
                      <p className="text-[10px] text-slate-400 font-mono">v1.14 - W10 & W7</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                    OK
                  </span>
                </motion.div>

                {/* Card Flotante 2: Red y Drivers */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-pink-500 text-white flex items-center justify-center">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-800">Carga Acelerada</h4>
                      <p className="text-[10px] text-slate-400 font-mono">Descargas Directas Confirmadas</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    FAST
                  </span>
                </motion.div>

                {/* Card Flotante 3: Acceso Corporativo */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-900">Acceso Corporativo</h4>
                      <p className="text-[10px] font-mono text-slate-400">Red Exclusiva de Empresa</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-slate-900 text-white px-2 py-1 rounded">
                    PRIVADO
                  </span>
                </motion.div>
              </div>

              {/* Footer HUD */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[9px] font-mono text-slate-400">
                <span>REPOS_FIREBASE_SYNC: YES</span>
                <span>GRUPO_ANDINO_2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Estadísticas / Tarjetas Destacadas */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { icon: Server, label: "REPOSITORIO", value: "Google Drive & Cloud", sub: "Actualizado 24/7" },
          { icon: Zap, label: "DESCARGA", value: "Sin Tiempos de Espera", sub: "Enlaces Directos" },
          { icon: ShieldCheck, label: "ACCESO", value: "Uso Corporativo", sub: "Red Privada PDV" },
          { icon: ShieldCheck, label: "SEGURIDAD", value: "Drivers Verificados", sub: "Red Nacional PDV" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:border-pink-500/30 transition-all">
            <stat.icon className="w-6 h-6 text-pink-500 mb-3" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 block">{stat.label}</span>
            <h4 className="text-sm font-black text-slate-900 uppercase italic mt-0.5">{stat.value}</h4>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">{stat.sub}</p>
          </div>
        ))}
      </section>

      {/* 3. Categorías Principales */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-3xl font-black uppercase italic text-slate-900">Categorías de Archivos</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
              Acceso directo a instaladores y paquetes por sistema operativo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {[
            { to: "/windows10", icon: Monitor, title: "Windows 10", desc: "Drivers Modernos", badge: "Win10" },
            { to: "/windows7", icon: Smartphone, title: "Windows 7", desc: "Sistemas Legacy", badge: "Win7" },
            { to: "/tools", icon: Wrench, title: "Herramientas", desc: "Software Técnico", badge: "Tools" },
            { to: "/atenas", icon: Layers, title: "Atenas", desc: "Sistemas Atenas", badge: "Atenas" },
            { to: "/drive", icon: Globe, title: "Repositorio", desc: "Archivos Drive", badge: "Drive" }
          ].map((item) => (
            <Link key={item.to} to={item.to} className="group">
              <div className="relative bg-white p-6 md:p-7 rounded-3xl border border-slate-100 text-center hover:bg-pink-50/40 hover:border-pink-500/30 transition-all duration-300 shadow-sm hover:shadow-md h-full flex flex-col justify-between overflow-hidden">
                <div className="absolute top-3 right-3 text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-50 text-slate-400 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                  {item.badge}
                </div>
                <div>
                  <item.icon className="w-10 h-10 md:w-12 md:h-12 text-pink-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold uppercase italic text-slate-900">{item.title}</h3>
                  <p className="text-slate-400 text-xs mt-2 font-medium">{item.desc}</p>
                </div>
                <div className="mt-5 text-[10px] font-black uppercase text-pink-600 tracking-wider flex items-center justify-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Ver Archivos</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
