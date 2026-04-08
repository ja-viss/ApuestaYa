/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { 
  Instagram, 
  MessageCircle, 
  Trophy,
  ArrowLeft,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect, memo, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

// Carga perezosa de páginas para reducir el bundle inicial
const HomePage = lazy(() => import("./components/HomePage"));
const Windows10Page = lazy(() => import("./components/Windows10Page"));
const Windows7Page = lazy(() => import("./components/Windows7Page"));
const ToolsPage = lazy(() => import("./components/ToolsPage"));
const DrivePage = lazy(() => import("./components/DrivePage"));
const LoginPage = lazy(() => import("./components/LoginPage").then(m => ({ default: m.LoginPage })));
const UploadPage = lazy(() => import("./components/UploadPage").then(m => ({ default: m.UploadPage })));

/**
 * Componente de carga simple para Suspense
 */
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
  </div>
);

/**
 * Componente FloatingMoney: Crea un efecto visual de billetes de dólar cayendo.
 * Optimizado para rendimiento: menos billetes en dispositivos móviles.
 */
const FloatingMoney = memo(() => {
  const [bills, setBills] = useState<{ id: number; x: number; delay: number; duration: number; rotation: number }[]>([]);

  useEffect(() => {
    // Detectar si es móvil para reducir carga o desactivar
    const isMobile = window.innerWidth < 768;
    const isVerySmall = window.innerWidth < 480; // Aumentado el umbral para mini celulares
    
    if (isVerySmall) {
      setBills([]);
      return;
    }

    const count = isMobile ? 2 : 5; // Reducido al mínimo para ahorrar RAM

    const newBills = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 12 + Math.random() * 8, 
      rotation: Math.random() * 360,
    }));
    setBills(newBills);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
      {bills.map((bill) => (
        <motion.div
          key={bill.id}
          initial={{ y: -50, opacity: 0, x: `${bill.x}%`, rotate: bill.rotation }}
          animate={{ 
            y: "110vh", 
            opacity: [0, 1, 1, 0],
            rotate: bill.rotation + 180 
          }}
          transition={{ 
            duration: bill.duration, 
            repeat: Infinity, 
            delay: bill.delay,
            ease: "linear"
          }}
          className="absolute"
        >
          <div className="w-8 h-4 bg-pink-500/20 border border-pink-400/10 rounded-sm" />
        </motion.div>
      ))}
    </div>
  );
});

FloatingMoney.displayName = "FloatingMoney";

/**
 * Componente Navbar: Barra de navegación principal con menú móvil integrado.
 */
const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const isHome = location.pathname === "/";

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className="relative z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group text-slate-900">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center"
        >
          <span className="text-2xl font-black tracking-tighter italic uppercase">
            Apuesta <span className="text-pink-500">Ya</span>
          </span>
        </motion.div>
      </Link>
      
      {/* Desktop Menu */}
      <div className="hidden lg:flex gap-10 font-black uppercase text-[10px] tracking-[0.2em] text-slate-600">
        {!isHome && (
          <Link to="/" className="flex items-center gap-2 text-pink-500 hover:text-pink-600 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Inicio
          </Link>
        )}
        <Link to="/windows10" className="hover:text-pink-500 transition-colors">Windows 10</Link>
        <Link to="/windows7" className="hover:text-pink-500 transition-colors">Windows 7</Link>
        <Link to="/tools" className="hover:text-pink-500 transition-colors">Herramientas</Link>
        <Link to="/drive" className="hover:text-pink-500 transition-colors">Drive</Link>
      </div>

      {/* Desktop Action */}
      <div className="hidden lg:flex items-center gap-4">
        {deferredPrompt && (
          <button
            onClick={handleInstall}
            className="bg-pink-50 hover:bg-pink-100 text-pink-600 px-4 py-3 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all border border-pink-100"
          >
            Instalar App
          </button>
        )}
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(236,72,153,0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-pink-500 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-pink-500/20 transition-all"
          >
            Acceso Técnico
          </motion.button>
        </Link>
      </div>

      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden p-3 bg-white rounded-2xl border border-slate-100 text-pink-500 shadow-sm"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-6 right-6 bg-white/95 backdrop-blur-2xl border border-pink-100 rounded-[2.5rem] p-8 z-50 shadow-2xl lg:hidden"
          >
            <div className="flex flex-col gap-6 font-black uppercase text-sm tracking-widest text-center text-slate-600">
              {deferredPrompt && (
                <button 
                  onClick={handleInstall}
                  className="py-4 border-b border-slate-50 text-pink-500"
                >
                  Instalar Aplicación
                </button>
              )}
              <Link to="/windows10" className="py-4 border-b border-slate-50 hover:text-pink-500">Windows 10</Link>
              <Link to="/windows7" className="py-4 border-b border-slate-50 hover:text-pink-500">Windows 7</Link>
              <Link to="/tools" className="py-4 border-b border-slate-50 hover:text-pink-500">Herramientas</Link>
              <Link to="/drive" className="py-4 border-b border-slate-50 hover:text-pink-500">Drive</Link>
              <Link to="/login" className="mt-4">
                <button className="w-full bg-pink-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-pink-500/20">
                  Acceso Técnico
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

/**
 * Componente Principal App: Configura el enrutador y la estructura global del sitio.
 */
export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-pink-200 selection:text-pink-900 overflow-x-hidden">
        {/* Fondo Light Premium: Blanco con gradiente rosa sutil */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#fafafa]">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-50 to-transparent" />
          {/* Patrón de puntos ultra ligero para modo light */}
          <div className="absolute inset-0 opacity-[0.05]" 
               style={{ backgroundImage: 'radial-gradient(#ec4899 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
        </div>

        {/* Fondo animado de billetes (Optimizado para light) */}
        <FloatingMoney />

        {/* Navegación */}
        <Navbar />

        {/* Contenido Dinámico según la Ruta */}
        <main className="relative z-10 min-h-[70vh]" style={{ contentVisibility: 'auto' }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/windows10" element={<Windows10Page />} />
              <Route path="/windows7" element={<Windows7Page />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/drive" element={<DrivePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/upload" element={<UploadPage />} />
            </Routes>
          </Suspense>
        </main>

        {/* Footer Global Light */}
        <footer className="relative z-10 px-6 py-12 border-t border-pink-100 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="text-2xl font-black tracking-tighter italic uppercase mb-2 text-slate-900">
                Apuesta <span className="text-pink-500">Ya</span>
              </div>
              <p className="text-[10px] text-pink-600/60 font-bold tracking-widest uppercase">Portal Técnico • Rif: J-50728157-4</p>
            </div>
            
            <div className="flex gap-6">
              <Instagram className="w-5 h-5 text-slate-400 hover:text-pink-500 cursor-pointer transition-colors" />
              <MessageCircle className="w-5 h-5 text-slate-400 hover:text-pink-500 cursor-pointer transition-colors" />
              <Trophy className="w-5 h-5 text-slate-400 hover:text-pink-500 cursor-pointer transition-colors" />
            </div>

            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">© 2026 Apuesta Ya Tech. Uso restringido.</p>
          </div>
        </footer>

        {/* Patrón de cuadrícula de fondo */}
        <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>
    </Router>
  );
}
