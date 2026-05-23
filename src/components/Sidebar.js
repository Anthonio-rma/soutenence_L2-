import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router';

import { 
  LayoutDashboard, Map, Route, Navigation, Users, 
  ChevronDown, ChevronUp, Bell, BarChart3, ShieldCheck, 
  Moon, Settings, LogOut, MoreHorizontal, Bus, Menu, X
} from 'lucide-react';

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // État pour les infos utilisateur dynamiques
  const [user, setUser] = useState({ nom: 'Invité', role: '' });

  // Chargement des données utilisateur depuis le localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser({
          nom: parsedUser.nom || 'Utilisateur',
          role: parsedUser.role || 'Rôle'
        });
      } catch (e) {
        console.error("Erreur parsing user data", e);
      }
    }
  }, []);

  // Gestion de l'ouverture des sous-menus spécifiques au transport
  const [openMenus, setOpenMenus] = useState({
    reseau: true,
    securite: false,
  });

  // Détection dynamique du format mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = (menuKey) => {
    if (isCollapsed && !isMobile) {
      setIsCollapsed(false);
      setOpenMenus(prev => ({ ...prev, [menuKey]: true }));
    } else {
      setOpenMenus(prev => ({ ...prev, [menuKey]: !prev[menuKey] }));
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleNavigation = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    handleNavigation();
  };

  const dropdownVariants = {
    hidden: { height: 0, opacity: 0, marginTop: 0, transition: { height: { duration: 0.2, ease: 'easeInOut' }, opacity: { duration: 0.15 } } },
    visible: { 
      height: 'auto', 
      opacity: 1, 
      marginTop: 4,
      transition: { height: { duration: 0.25, ease: 'easeOut' }, opacity: { duration: 0.2, delay: 0.05 } } 
    }
  };

  const sidebarVariants = {
    desktop: (collapsed) => ({
      width: collapsed ? 78 : 260,
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 32 }
    }),
    mobile: (isOpen) => ({
      width: '100%',
      maxWidth: 320,
      x: isOpen ? 0 : '-100%',
      transition: { type: 'spring', stiffness: 350, damping: 35 }
    })
  };

  return (
    <>
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 shadow-lg px-2 flex items-center justify-around z-50 md:hidden">
          <Link to="/dashboard" onClick={handleNavigation} className={`flex flex-col items-center justify-center flex-1 py-1 gap-0.5 rounded-xl transition-all ${isActive('/dashboard') ? 'text-indigo-600' : 'text-gray-400'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight">Accueil</span>
          </Link>

          <Link to="/dashboard/carte-temps-reel" onClick={handleNavigation} className={`flex flex-col items-center justify-center flex-1 py-1 gap-0.5 rounded-xl transition-all ${isActive('/dashboard/carte-temps-reel') ? 'text-indigo-600' : 'text-gray-400'}`}>
            <Map className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight">GPS Live</span>
          </Link>

          <Link to="/dashboard/alert_trafic" onClick={handleNavigation} className={`flex flex-col items-center justify-center flex-1 py-1 gap-0.5 rounded-xl transition-all relative ${isActive('/dashboard/alert_trafic') ? 'text-indigo-600' : 'text-gray-400'}`}>
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 center right-4 bg-red-500 text-[9px] font-bold text-white px-1 rounded-full scale-90">3</span>
            <span className="text-[10px] font-medium tracking-tight">Alertes</span>
          </Link>

          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className={`flex flex-col items-center justify-center flex-1 py-1 gap-0.5 rounded-xl transition-all ${isMobileOpen ? 'text-indigo-600' : 'text-gray-400'}`}>
            <AnimatePresence mode="wait">
              {isMobileOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90 }} transition={{ duration: 0.1 }}>
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90 }} transition={{ duration: 0.1 }}>
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="text-[10px] font-medium tracking-tight">Menu</span>
          </button>
        </div>
      )}

      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileOpen(false)} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden" />
        )}
      </AnimatePresence>

      <motion.aside 
        custom={isMobile ? isMobileOpen : isCollapsed}
        variants={sidebarVariants}
        animate={isMobile ? 'mobile' : 'desktop'}
        style={{ willChange: 'width, transform' }}
        className={`h-screen bg-white border-r border-gray-100 flex flex-col justify-between p-4 fixed left-0 top-0 font-sans select-none z-50 overflow-x-hidden ${isMobile ? 'pb-20 shadow-2xl rounded-r-2xl' : ''}`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar overflow-x-hidden pt-4 md:pt-0">
          <div onClick={() => !isMobile && setIsCollapsed(!isCollapsed)} className={`flex items-center gap-2 px-3 py-3 mb-4 rounded-xl select-none flex-shrink-0 min-h-[56px] ${isMobile ? '' : 'cursor-pointer hover:bg-black/[0.02]'}`}>
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100 flex-shrink-0">
              <Bus className="text-white w-4 h-4" />
            </div>
            <div className="relative overflow-hidden h-9 flex items-center pl-1">
              <AnimatePresence mode="wait">
                {(!isCollapsed || isMobile) && (
                  <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.2, ease: 'easeOut' }} className="flex flex-col whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-800 tracking-tight leading-none">TAXI-BE</span>
                    <span className="text-[10px] text-indigo-600 font-medium mt-0.5">Suivi Numérique</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <nav className="flex flex-col gap-1 px-1">
            <Link to="/dashboard" onClick={handleNavigation} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${isActive('/dashboard') ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50' : 'text-gray-500 hover:bg-black/[0.04] hover:text-black'} ${(isCollapsed && !isMobile) ? 'justify-center' : ''} ${isMobile ? 'md:flex' : ''}`}>
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
              <span className={`transition-all duration-300 whitespace-nowrap ${(isCollapsed && !isMobile) ? 'opacity-0 scale-95 w-0 pointer-events-none hidden' : 'opacity-100 scale-100 inline-block'}`}>Vue d'ensemble</span>
            </Link>

            <Link to="/dashboard/carte-temps-reel" onClick={handleNavigation} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${isActive('/dashboard/carte-temps-reel') ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50' : 'text-gray-500 hover:bg-black/[0.04] hover:text-black'} ${(isCollapsed && !isMobile) ? 'justify-center' : ''} ${isMobile ? 'md:flex' : ''}`}>
              <Map className="w-4 h-4 flex-shrink-0" />
              <span className={`transition-all duration-300 whitespace-nowrap ${(isCollapsed && !isMobile) ? 'opacity-0 scale-95 w-0 pointer-events-none hidden' : 'opacity-100 scale-100 inline-block'}`}>Suivi GPS Live</span>
            </Link>

            <div className="flex flex-col">
              <button onClick={() => toggleMenu('reseau')} className={`w-full flex items-center rounded-xl text-sm font-medium text-gray-500 hover:bg-black/[0.04] hover:text-black transition-all flex-shrink-0 ${(isCollapsed && !isMobile) ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'}`}>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Route className="w-4 h-4 flex-shrink-0" />
                  <span className={`transition-all duration-300 whitespace-nowrap ${(isCollapsed && !isMobile) ? 'opacity-0 scale-95 w-0 pointer-events-none hidden' : 'opacity-100 scale-100 inline-block'}`}>Gestion Réseau</span>
                </div>
                {(!isCollapsed || isMobile) && (openMenus.reseau ? <ChevronUp className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200" /> : <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200" />)}
              </button>
              <AnimatePresence initial={false}>
                {openMenus.reseau && (!isCollapsed || isMobile) && (
                  <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="hidden" className="pl-10 flex flex-col gap-1 overflow-hidden border-l border-gray-100 ml-5">
                    <Link to="/dashboard" onClick={handleNavigation} className={`text-xs py-1.5 transition-colors ${isActive('/dashboard') ? 'text-indigo-600 font-semibold' : 'text-gray-500 hover:text-black'}`}>Tableau de Bord</Link>
                    <Link to="/dashboard/lignes" onClick={handleNavigation} className={`text-xs py-1.5 transition-colors ${isActive('/dashboard/lignes') ? 'text-indigo-600 font-semibold' : 'text-gray-500 hover:text-black'}`}>Lignes & Horaires</Link>
                    <Link to="/dashboard/arrets" onClick={handleNavigation} className={`text-xs py-1.5 transition-colors ${isActive('/dashboard/arrets') ? 'text-indigo-600 font-semibold' : 'text-gray-500 hover:text-black'}`}>Arrêts de Bus</Link>
                    <Link to="/dashboard/vehicules" onClick={handleNavigation} className={`text-xs py-1.5 transition-colors ${isActive('/dashboard/vehicules') ? 'text-indigo-600 font-semibold' : 'text-gray-500 hover:text-black'}`}>Flotte Véhicules</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/dashboard/alert_trafic" onClick={handleNavigation} className={`flex items-center rounded-xl text-sm font-medium transition-all flex-shrink-0 ${isActive('/dashboard/alert_trafic') ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50' : 'text-gray-500 hover:bg-black/[0.04] hover:text-black'} ${(isCollapsed && !isMobile) ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'} ${isMobile ? 'md:flex' : ''}`}>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="relative"><Bell className="w-4 h-4 flex-shrink-0" />{(isCollapsed && !isMobile) && (<span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />)}</div>
                <span className={`transition-all duration-300 whitespace-nowrap ${(isCollapsed && !isMobile) ? 'opacity-0 scale-95 w-0 pointer-events-none hidden' : 'opacity-100 scale-100 inline-block'}`}>Alertes Trafic</span>
              </div>
              {(!isCollapsed || isMobile) && (<span className="bg-red-500 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full flex-shrink-0">3</span>)}
            </Link>

            <Link to="/dashboard/analyses" onClick={handleNavigation} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${isActive('/dashboard/analyses') ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50' : 'text-gray-500 hover:bg-black/[0.04] hover:text-black'} ${(isCollapsed && !isMobile) ? 'justify-center' : ''}`}>
              <BarChart3 className="w-4 h-4 flex-shrink-0" />
              <span className={`transition-all duration-300 whitespace-nowrap ${(isCollapsed && !isMobile) ? 'opacity-0 scale-95 w-0 pointer-events-none hidden' : 'opacity-100 scale-100 inline-block'}`}>Flux & Mobilité</span>
            </Link>
          </nav>
        </div>

        <div className="border-t border-gray-100 pt-3 flex flex-col gap-1 px-1 overflow-hidden flex-shrink-0">
          <div className={`flex items-center rounded-xl text-sm font-medium text-gray-500 ${(isCollapsed && !isMobile) ? 'justify-center p-2.5' : 'justify-between px-3 py-2'}`}>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Moon className="w-4 h-4 flex-shrink-0" />
              <span className={`transition-all duration-300 whitespace-nowrap ${(isCollapsed && !isMobile) ? 'opacity-0 scale-95 w-0 pointer-events-none hidden' : 'opacity-100 scale-100 inline-block'}`}>Mode Sombre</span>
            </div>
            {(!isCollapsed || isMobile) && (
              <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-8 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center flex-shrink-0 ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-sm" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
              </button>
            )}
          </div>

          <Link to="/dashboard/configuration" onClick={handleNavigation} className={`flex items-center gap-3 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${isActive('/dashboard/configuration') ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50' : 'text-gray-500 hover:bg-black/[0.04] hover:text-black'} ${(isCollapsed && !isMobile) ? 'justify-center p-2.5' : 'px-3 py-2'}`}>
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span className={`transition-all duration-300 whitespace-nowrap ${(isCollapsed && !isMobile) ? 'opacity-0 scale-95 w-0 pointer-events-none hidden' : 'opacity-100 scale-100 inline-block'}`}>Configuration</span>
          </Link>

          <Link to="/" onClick={handleLogout} className={`flex items-center gap-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all flex-shrink-0 ${(isCollapsed && !isMobile) ? 'justify-center p-2.5' : 'px-3 py-2'}`}>
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className={`transition-all duration-300 whitespace-nowrap ${(isCollapsed && !isMobile) ? 'opacity-0 scale-95 w-0 pointer-events-none hidden' : 'opacity-100 scale-100 inline-block'}`}>Déconnexion</span>
          </Link>

          <div className={`flex items-center bg-gray-50/50 rounded-xl mt-3 border border-gray-50 transition-all duration-200 flex-shrink-0 ${(isCollapsed && !isMobile) ? 'p-1.5 justify-center' : 'p-2'}`}>
            <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden flex items-center justify-center font-bold text-xs text-indigo-700 flex-shrink-0">
              {user.nom.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div className="relative overflow-hidden flex-1 flex items-center">
              <AnimatePresence mode="wait">
                {(!isCollapsed || isMobile) && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }} className="flex flex-col ml-3 whitespace-nowrap flex-1">
                    <span className="text-xs font-semibold text-gray-800 leading-none">{user.nom}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5 capitalize">{user.role}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {(!isCollapsed || isMobile) && (
              <button className="ml-auto p-1 text-gray-400 hover:bg-black/[0.04] hover:text-black rounded-lg transition-colors flex-shrink-0">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}