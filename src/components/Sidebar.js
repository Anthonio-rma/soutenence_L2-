import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Map, Route, Navigation, Users, 
  ChevronDown, ChevronUp, Bell, BarChart3, ShieldCheck, 
  Moon, Settings, LogOut, MoreHorizontal, Bus
} from 'lucide-react';

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Gestion de l'ouverture des sous-menus spécifiques au transport
  const [openMenus, setOpenMenus] = useState({
    reseau: true, // Ouvert par défaut pour montrer les sous-options
    securite: false,
  });

  const toggleMenu = (menuKey) => {
    if (isCollapsed) {
      // Si la barre est réduite, un clic sur un menu l'ouvre d'abord
      setIsCollapsed(false);
      setOpenMenus(prev => ({ ...prev, [menuKey]: true }));
    } else {
      setOpenMenus(prev => ({ ...prev, [menuKey]: !prev[menuKey] }));
    }
  };

  const isActive = (path) => location.pathname === path;

  // Configuration des animations de glissement fluide pour les sous-menus
  const dropdownVariants = {
    hidden: { height: 0, opacity: 0, marginTop: 0, transition: { height: { duration: 0.2, ease: 'easeInOut' }, opacity: { duration: 0.15 } } },
    visible: { 
      height: 'auto', 
      opacity: 1, 
      marginTop: 4,
      transition: { height: { duration: 0.25, ease: 'easeOut' }, opacity: { duration: 0.2, delay: 0.05 } } 
    }
  };

  return (
    <motion.aside 
      animate={{ width: isCollapsed ? 78 : 260 }}
      transition={{ type: 'spring', stiffness: 300, damping: 32 }}
      style={{ willChange: 'width' }}
      className="h-screen bg-white border-r border-gray-100 flex flex-col justify-between p-4 fixed left-0 top-0 font-sans select-none z-50 overflow-x-hidden"
    >
      
      {/* SECTION SUPÉRIEURE : Logo & Liens de Gestion */}
      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar overflow-x-hidden">
        
        {/* Logo du Projet G-Transport - CLIC SUR LE BLOC TITRE POUR FERMER/OUVRIR */}
        <div 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 px-3 py-3 mb-4 cursor-pointer hover:opacity-90 select-none flex-shrink-0 min-h-[56px]"
        >
          <div className="w-8 h-8 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-100 flex-shrink-0">
            <Bus className="text-white w-4 h-4" />
          </div>
          
          <div className="relative overflow-hidden h-9 flex items-center pl-1">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="flex flex-col whitespace-nowrap"
                >
                  <span className="text-sm font-bold text-gray-800 tracking-tight leading-none">TAXI-BE</span>
                  <span className="text-[10px] text-orange-500 font-medium mt-0.5">Suivi Numérique</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Principale adaptée au cahier des charges */}
        <nav className="flex flex-col gap-1 px-1">
          
          {/* 1. Tableau de bord principal */}
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${
              isActive('/dashboard') 
                ? 'bg-orange-50 text-orange-600 shadow-sm shadow-orange-100/50' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
            <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 scale-95 w-0 pointer-events-none hidden' : 'opacity-100 scale-100 inline-block'}`}>
              Vue d'ensemble
            </span>
          </Link>

          {/* 2. Carte Interactive / Suivi GPS en Temps Réel */}
          <Link 
            to="/dashboard/carte-temps-reel" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${
              isActive('/dashboard/carte-temps-reel') 
                ? 'bg-orange-50 text-orange-600 shadow-sm shadow-orange-100/50' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <Map className="w-4 h-4 flex-shrink-0" />
            <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 scale-95 w-0 pointer-events-none hidden' : 'opacity-100 scale-100 inline-block'}`}>
              Suivi GPS Live
            </span>
          </Link>

          {/* 3. MENU DÉROULANT : Gestion du Réseau (Lignes & Itinéraires) */}
          <div className="flex flex-col">
            <button 
              onClick={() => toggleMenu('reseau')}
              className={`w-full flex items-center rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all flex-shrink-0 ${
                isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
              }`}
            >
              <div className="flex items-center gap-3 flex-shrink-0">
                <Route className="w-4 h-4 flex-shrink-0" />
                <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 scale-95 w-0 pointer-events-none hidden' : 'opacity-100 scale-100 inline-block'}`}>
                  Gestion Réseau
                </span>
              </div>
              {!isCollapsed && (openMenus.reseau ? <ChevronUp className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200" /> : <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200" />)}
            </button>
            
            <AnimatePresence initial={false}>
              {openMenus.reseau && !isCollapsed && (
                <motion.div 
                  variants={dropdownVariants} 
                  initial="hidden" 
                  animate="visible" 
                  exit="hidden" 
                  className="pl-10 flex flex-col gap-1 overflow-hidden border-l border-gray-100 ml-5"
                >
                  <Link to="/dashboard/lignes" className={`text-xs py-1.5 transition-colors ${isActive('/dashboard/lignes') ? 'text-orange-600 font-semibold' : 'text-gray-500 hover:text-gray-900'}`}>
                    Lignes & Horaires
                  </Link>
                  <Link to="/dashboard/arrets" className={`text-xs py-1.5 transition-colors ${isActive('/dashboard/arrets') ? 'text-orange-600 font-semibold' : 'text-gray-500 hover:text-gray-900'}`}>
                    Arrêts de Bus
                  </Link>
                  <Link to="/dashboard/vehicules" className={`text-xs py-1.5 transition-colors ${isActive('/dashboard/vehicules') ? 'text-orange-600 font-semibold' : 'text-gray-500 hover:text-gray-900'}`}>
                    Flotte Véhicules
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 5. Alertes & Notifications Intelligentes -> MODIFIÉ VERS /dashboard/alert_trafic */}
          <Link 
            to="/dashboard/alert_trafic" 
            className={`flex items-center rounded-xl text-sm font-medium transition-all flex-shrink-0 ${
              isActive('/dashboard/alert_trafic') 
                ? 'bg-orange-50 text-orange-600 shadow-sm shadow-orange-100/50' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            } ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'}`}
          >
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="relative">
                <Bell className="w-4 h-4 flex-shrink-0" />
                {isCollapsed && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
              <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 scale-95 w-0 pointer-events-none hidden' : 'opacity-100 scale-100 inline-block'}`}>
                Alertes Trafic
              </span>
            </div>
            {!isCollapsed && (
              <span className="bg-red-500 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full flex-shrink-0">3</span>
            )}
          </Link>

          {/* 6. Analyses & Statistiques du réseau */}
          <Link 
            to="/dashboard/analyses" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${
              isActive('/dashboard/analyses') 
                ? 'bg-orange-50 text-orange-600 shadow-sm shadow-orange-100/50' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <BarChart3 className="w-4 h-4 flex-shrink-0" />
            <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 scale-95 w-0 pointer-events-none hidden' : 'opacity-100 scale-100 inline-block'}`}>
              Flux & Mobilité
            </span>
          </Link>
        </nav>
      </div>

      {/* SECTION INFÉRIEURE : Paramètres & Informations Utilisateur */}
      <div className="border-t border-gray-100 pt-3 flex flex-col gap-1 px-1 overflow-hidden flex-shrink-0">
        
        {/* Toggle Mode Sombre */}
        <div className={`flex items-center rounded-xl text-sm font-medium text-gray-500 ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'}`}>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Moon className="w-4 h-4 flex-shrink-0" />
            <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 scale-95 w-0 pointer-events-none hidden' : 'opacity-100 scale-100 inline-block'}`}>
              Mode Sombre
            </span>
          </div>
          {!isCollapsed && (
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-200 flex items-center flex-shrink-0 ${isDarkMode ? 'bg-orange-500' : 'bg-gray-200'}`}
            >
              <motion.div 
                layout 
                className="w-3.5 h-3.5 bg-white rounded-full shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          )}
        </div>

        {/* Configuration */}
        <Link to="/dashboard/configuration" className={`flex items-center gap-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all flex-shrink-0 ${isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2'}`}>
          <Settings className="w-4 h-4 flex-shrink-0" />
          <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 scale-95 w-0 pointer-events-none hidden' : 'opacity-100 scale-100 inline-block'}`}>
            Configuration
          </span>
        </Link>

        {/* Déconnexion */}
        <Link to="/" className={`flex items-center gap-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all flex-shrink-0 ${isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2'}`}>
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 scale-95 w-0 pointer-events-none hidden' : 'opacity-100 scale-100 inline-block'}`}>
            Déconnexion
          </span>
        </Link>

        {/* Profil de l'administrateur ou opérateur en session */}
        <div className={`flex items-center bg-gray-50/50 rounded-xl mt-3 border border-gray-50 transition-all duration-200 flex-shrink-0 ${isCollapsed ? 'p-1.5 justify-center' : 'p-2'}`}>
          <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 overflow-hidden flex items-center justify-center font-bold text-xs text-orange-700 flex-shrink-0">
            ADM
          </div>
          <div className="relative overflow-hidden flex-1 flex items-center">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col ml-3 whitespace-nowrap flex-1"
                >
                  <span className="text-xs font-semibold text-gray-800 leading-none">Rova Andriana</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Administrateur</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {!isCollapsed && (
            <button className="ml-auto p-1 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </motion.aside>
  );
}