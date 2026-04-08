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
          <div className="w-8 h-4 bg-green-500/30 border border-green-400/20 rounded-sm" />
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
      <Link to="/" className="flex items-center gap-2 group">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center"
        >
          <span className="text-2xl font-black tracking-tighter italic uppercase">
            Apuesta <span className="text-cyan-400">Ya</span>
          </span>
        </motion.div>
      </Link>
      
      {/* Desktop Menu */}
      <div className="hidden lg:flex gap-10 font-black uppercase text-[10px] tracking-[0.2em]">
        {!isHome && (
          <Link to="/" className="flex items-center gap-2 text-cyan-400 hover:text-white transition-colors">
            <ArrowLeft className="w-3 h-3" /> Inicio
          </Link>
        )}
        <Link to="/windows10" className="hover:text-cyan-400 transition-colors">Windows 10</Link>
        <Link to="/windows7" className="hover:text-cyan-400 transition-colors">Windows 7</Link>
        <Link to="/tools" className="hover:text-cyan-400 transition-colors">Herramientas</Link>
        <Link to="/drive" className="hover:text-cyan-400 transition-colors">Drive</Link>
      </div>

      {/* Desktop Action */}
      <div className="hidden lg:flex items-center gap-4">
        {deferredPrompt && (
          <button
            onClick={handleInstall}
            className="bg-white/10 hover:bg-white/20 text-cyan-400 px-4 py-3 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all"
          >
            Instalar App
          </button>
        )}
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34,211,238,0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-cyan-400 text-black px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-cyan-400/20 transition-all"
          >
            Acceso Técnico
          </motion.button>
        </Link>
      </div>

      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden p-3 bg-white/5 rounded-2xl border border-white/10 text-cyan-400"
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
            className="absolute top-24 left-6 right-6 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 z-50 shadow-2xl lg:hidden"
          >
            <div className="flex flex-col gap-6 font-black uppercase text-sm tracking-widest text-center">
              {deferredPrompt && (
                <button 
                  onClick={handleInstall}
                  className="py-4 border-b border-white/5 text-cyan-400"
                >
                  Instalar Aplicación
                </button>
              )}
              <Link to="/windows10" className="py-4 border-b border-white/5 hover:text-cyan-400">Windows 10</Link>
              <Link to="/windows7" className="py-4 border-b border-white/5 hover:text-cyan-400">Windows 7</Link>
              <Link to="/tools" className="py-4 border-b border-white/5 hover:text-cyan-400">Herramientas</Link>
              <Link to="/drive" className="py-4 border-b border-white/5 hover:text-cyan-400">Drive</Link>
              <Link to="/login" className="mt-4">
                <button className="w-full bg-cyan-400 text-black py-5 rounded-2xl font-black uppercase tracking-widest">
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
      <div className="min-h-screen bg-[#7c3aed] text-white font-sans selection:bg-cyan-400 selection:text-black overflow-x-hidden">
        {/* Fondo Optimizado: Solo CSS, cero imágenes o filtros pesados */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6]">
          {/* Patrón de cuadrícula ultra ligero */}
          <div className="absolute inset-0 opacity-[0.05]" 
               style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        {/* Fondo animado de billetes */}
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

        {/* Footer Global */}
        <footer className="relative z-10 px-6 py-12 border-t border-white/10 bg-black/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="text-2xl font-black tracking-tighter italic uppercase mb-2">
                Apuesta <span className="text-cyan-400">Ya</span>
              </div>
              <p className="text-xs text-purple-300 font-bold tracking-widest uppercase">Portal Técnico • Rif: J-50728157-4</p>
            </div>
            
            <div className="flex gap-6">
              <Instagram className="w-6 h-6 text-white/60 hover:text-white cursor-pointer transition-colors" />
              <MessageCircle className="w-6 h-6 text-white/60 hover:text-white cursor-pointer transition-colors" />
              <Trophy className="w-6 h-6 text-white/60 hover:text-white cursor-pointer transition-colors" />
            </div>

            <p className="text-xs text-white/40">© 2026 Apuesta Ya Tech. Uso exclusivo personal autorizado.</p>
          </div>
        </footer>

        {/* Patrón de cuadrícula de fondo */}
        <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>
    </Router>
  );
}
