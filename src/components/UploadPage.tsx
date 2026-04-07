/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { FileText, LogOut, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Componente de la página de carga de archivos para el personal técnico.
 * 
 * Funcionalidades:
 * - Autenticación técnica local.
 * - Integración de Google Forms a pantalla completa.
 * - Diseño responsivo y animaciones fluidas.
 */
export const UploadPage = () => {
  const navigate = useNavigate();

  /**
   * Hook para proteger la ruta. 
   * Redirige al login si no hay sesión técnica activa.
   */
  useEffect(() => {
    const isAuth = localStorage.getItem("isTechnicalAuthenticated");
    if (!isAuth) {
      navigate("/login");
    }
  }, [navigate]);

  /**
   * Cierra la sesión técnica eliminando el flag de localStorage.
   */
  const handleLogout = () => {
    localStorage.removeItem("isTechnicalAuthenticated");
    navigate("/");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 min-h-screen flex flex-col">
      {/* Encabezado del Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-400/20 shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white uppercase italic tracking-tighter">Panel de Carga</h1>
            <p className="text-purple-200 text-sm font-bold tracking-widest uppercase opacity-60">Repositorio de Drivers y Recursos</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-red-500/20 text-purple-200 hover:text-red-200 border border-white/10 hover:border-red-500/30 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest"
        >
          <LogOut size={16} />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {/* Contenedor del Botón de Carga */}
      <div className="flex-1 w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col items-center justify-center p-8 text-center min-h-[400px] animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-cyan-400/10 p-6 rounded-full mb-8 border border-cyan-400/20">
          <Upload size={48} className="text-cyan-400" />
        </div>
        
        <h2 className="text-3xl font-black uppercase italic mb-4">¿Listo para subir archivos?</h2>
        <p className="text-purple-200 max-w-md mb-10 leading-relaxed">
          Haz clic en el botón de abajo para abrir el formulario oficial de carga en una nueva pestaña y enviar tus recursos al repositorio.
        </p>

        <button
          onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLScRilfRjdnhRykod69C1St2mLa9vqfVPfH6FGH73VXJyvsv2Q/viewform?usp=sf_link", "_blank")}
          className="bg-cyan-400 text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-cyan-400/20 flex items-center gap-3 group transition-all active:scale-95"
        >
          <FileText size={20} className="group-hover:rotate-12 transition-transform" />
          <span>Abrir Formulario de Carga</span>
        </button>
      </div>

      {/* Pie de página del panel */}
      <div className="mt-8 text-center shrink-0">
        <p className="text-[10px] text-purple-400 font-black uppercase tracking-[0.3em]">
          Sistema de Gestión de Archivos • Apuesta Ya Tech
        </p>
      </div>
    </div>
  );
};
