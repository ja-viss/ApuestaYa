/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Lock, User, LogIn, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

/**
 * Componente de la página de inicio de sesión para el acceso técnico.
 * Valida las credenciales proporcionadas por el usuario.
 */
export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Maneja el envío del formulario de inicio de sesión.
   * Valida contra las credenciales: apuestaya / apuestaya1326.
   * @param e - Evento de envío del formulario.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulamos un retraso de red
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Credenciales proporcionadas por el usuario
    if (username === "apuestaya" && password === "apuestaya1326.") {
      // Guardamos el estado de autenticación en localStorage para persistencia básica
      localStorage.setItem("isTechnicalAuthenticated", "true");
      navigate("/upload");
    } else {
      setError("Usuario o contraseña incorrectos. Por favor, intente de nuevo.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-pink-500 text-white mb-4 shadow-lg shadow-pink-500/20">
              <Lock size={28} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Acceso Técnico</h1>
            <p className="text-sm text-slate-500">Ingrese sus credenciales para gestionar archivos</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Usuario</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                  placeholder="Nombre de usuario"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-red-50/50 border border-red-100 rounded-2xl text-red-600 text-sm"
              >
                <AlertCircle size={18} className="shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
