import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bus, MapPin, Clock,
  Search, Bell, SlidersHorizontal, ChevronRight,
  AlertTriangle, CheckCircle, Play
} from 'lucide-react';

export default function PageUtilisateur() {
  const [userName, setUserName] = useState('Utilisateur');

  useEffect(() => {
    // Récupération du nom depuis le localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // On récupère le prénom (le premier mot) ou le nom complet
        if (parsedUser.nom) {
          const prenom = parsedUser.nom.split(' ')[0];
          setUserName(prenom);
        }
      } catch (e) {
        console.error("Erreur lecture user data", e);
      }
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 25 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-full min-h-screen p-4 sm:p-6 md:p-8 pb-24 flex flex-col gap-6 overflow-x-hidden bg-gray-50/50 justify-start items-stretch"
    >
      {/* 1. EN-TÊTE DE LA PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div>
          {/* Nom dynamique ici */}
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Bienvenue, {userName}!</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">32 taxis-be géo-localisés actifs sur vos coopératives suivies.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une ligne, un arrêt, un véhicule..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-orange-500 shadow-sm shadow-gray-100/30 font-medium transition-all"
            />
          </div>
          
          <button className="p-2 bg-white border border-gray-100 text-gray-500 rounded-xl hover:bg-gray-50 shadow-sm transition-colors relative shrink-0">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
          </button>
        </div>
      </div>

      {/* 2. SECTION HIGHLIGHTS (Bento Grid supérieur - 4 indicateurs analytiques) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              
              {/* Card 1 : Bus Actifs */}
              <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl border border-gray-100/80 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Véhicules En Ligne</span>
                  <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">+12%</span>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <span className="text-3xl font-extrabold text-gray-800 tracking-tight">142</span>
                  {/* Mini graphique en barres orange */}
                  <div className="flex items-end gap-0.5 h-8 mb-1">
                    <div className="w-1 bg-orange-100 h-3 rounded-full" />
                    <div className="w-1 bg-orange-200 h-5 rounded-full" />
                    <div className="w-1 bg-orange-300 h-4 rounded-full" />
                    <div className="w-1 bg-orange-400 h-6 rounded-full" />
                    <div className="w-1 bg-orange-500 h-8 rounded-full" />
                  </div>
                </div>
              </motion.div>
      
              {/* Card 2 : Statistiques des trajets */}
              <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl border border-gray-100/80 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Statistiques Trajets</span>
                  <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">+5%</span>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <span className="text-3xl font-extrabold text-gray-800 tracking-tight">584</span>
                  {/* Tracé SVG de la courbe orange */}
                  <div className="w-16 h-6 mb-1 opacity-90">
                    <svg viewBox="0 0 50 20" className="w-full h-full stroke-orange-500 stroke-2 fill-none">
                      <path d="M 2 18 L 12 8 L 22 14 L 32 4 L 48 10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </motion.div>
      
              {/* Card 3 : Temps moyen de déplacement */}
              <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl border border-gray-100/80 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tps Moyen Déplacement</span>
                  <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">-10%</span>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <span className="text-3xl font-extrabold text-gray-800 tracking-tight">24<span className="text-lg font-bold text-gray-400">min</span></span>
                  <div className="w-10 h-6 mb-1 text-orange-500 opacity-20">
                    <Clock className="w-6 h-6 stroke-[2.5]" />
                  </div>
                </div>
              </motion.div>
      
              {/* Card 4 : Fréquentation globale */}
              <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl border border-gray-100/80 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Fréquentation Lignes</span>
                  <span className="text-[10px] font-extrabold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">Forte</span>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <span className="text-3xl font-extrabold text-gray-800 tracking-tight">12.5<span className="text-xs text-gray-400 font-medium ml-1">k/j</span></span>
                  <div className="flex gap-1 mb-1.5">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="w-2 h-2 bg-gray-100 rounded-full" />
                  </div>
                </div>
              </motion.div>
      
            </div>
      
            {/* 3. SECTION DU MILIEU : GRAPHIQUE LINÉAIRE & ACTIVITÉ DE FLOTTE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
              
              {/* Graphique de Progression */}
              <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col justify-between overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Fréquentation et Flux de Mobilité</h3>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">Analyse des flux de mobilité et volume de passagers par heure (Milliers).</p>
                  </div>
                  
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <select className="px-2.5 py-1.5 bg-gray-50 border-0 rounded-lg text-[11px] font-semibold text-gray-600 focus:outline-none">
                      <option>Flux Axe Analakely</option>
                      <option>Flux Axe Ankatso</option>
                    </select>
                    <select className="px-2.5 py-1.5 bg-gray-50 border-0 rounded-lg text-[11px] font-semibold text-gray-600 focus:outline-none">
                      <option>Aujourd'hui</option>
                      <option>Ce mois</option>
                    </select>
                  </div>
                </div>
      
                <div className="h-48 w-full relative mt-4">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                    <div className="w-full border-t border-dashed border-gray-100 text-[9px] text-gray-300 pt-0.5">100k</div>
                    <div className="w-full border-t border-dashed border-gray-100 text-[9px] text-gray-300 pt-0.5">75k</div>
                    <div className="w-full border-t border-dashed border-gray-100 text-[9px] text-gray-300 pt-0.5">50k</div>
                    <div className="w-full border-t border-dashed border-gray-100 text-[9px] text-gray-300 pt-0.5">25k</div>
                    <div className="w-full text-[9px] text-gray-300">0</div>
                  </div>
      
                  <svg className="w-full h-full absolute inset-0 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0.00" />
                      </linearGradient>
                    </defs>
                    <path d="M 0,90 Q 20,80 35,60 T 60,50 T 85,35 L 100,20 L 100,100 L 0,100 Z" fill="url(#chartGradient)" />
                    <path d="M 0,90 Q 20,80 35,60 T 60,50 T 85,35 L 100,20" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
                  </svg>
      
                  {/* Bulle d'information */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute left-[35%] sm:left-[42%] top-[25%] bg-white border border-gray-100/80 rounded-xl p-2.5 shadow-md flex flex-col gap-0.5 pointer-events-none z-10"
                  >
                    <div className="flex items-center gap-1.5 justify-between">
                      <span className="text-[9px] font-bold text-gray-400">Pointe Midi</span>
                      <span className="text-[9px] text-emerald-600 font-extrabold bg-emerald-50 px-1 rounded">+5%</span>
                    </div>
                    <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className="w-[75%] h-full bg-orange-500 rounded-full" />
                    </div>
                    <span className="text-[10px] font-extrabold text-gray-700 mt-0.5">75% d'occupation</span>
                  </motion.div>
                </div>
      
                <div className="flex justify-between px-1 text-[10px] font-bold text-gray-400 mt-2">
                  <span>06h</span><span>09h</span><span>12h</span><span>15h</span><span>18h</span><span>21h</span>
                </div>
              </motion.div>
      
              {/* Graphique d'activité (Donut) */}
              <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-800">Performance Transports</h3>
                  <div className="flex gap-1">
                    <button className="p-1 bg-gray-50 text-gray-400 hover:text-gray-600 rounded"><Search className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
      
                <div className="relative flex items-center justify-center my-4">
                  <svg width="130" height="130" viewBox="0 0 36 36" className="transform -rotate-90">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f97316" strokeWidth="3.2" strokeDasharray="45 100" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="3.2" strokeDasharray="25 100" strokeDashoffset="-45" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e11d48" strokeWidth="3.2" strokeDasharray="20 100" strokeDashoffset="-70" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a855f7" strokeWidth="3.2" strokeDasharray="10 100" strokeDashoffset="-90" />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Indice Ef.</span>
                    <span className="text-2xl font-black text-gray-800">88%</span>
                  </div>
                </div>
      
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10px] font-bold text-gray-500">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" />Optimisés: 45%</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />Réguliers: 25%</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" />En Retard: 20%</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" />Ralentis: 10%</div>
                </div>
              </motion.div>
      
            </div>
      
            {/* 4. SECTION INFÉRIEURE : TABLES DE SUPERVISION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
              
              {/* Liste des Lignes surveillées */}
              <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-800">Supervision des Flux de Mobilité</h3>
                  <div className="flex items-center gap-1.5">
                    <button className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-50 text-[10px] font-bold text-gray-500 rounded-lg border border-gray-100/50"><SlidersHorizontal className="w-3 h-3" />Filtrer</button>
                  </div>
                </div>
      
                <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
                  <table className="w-full text-left text-xs font-medium min-w-[500px]">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-50 pb-2">
                        <th className="pb-2 font-bold uppercase text-[10px] tracking-wider">Ligne / Flux Analysé</th>
                        <th className="pb-2 font-bold uppercase text-[10px] tracking-wider">Tps Moyen</th>
                        <th className="pb-2 font-bold uppercase text-[10px] tracking-wider">Fréquentation</th>
                        <th className="pb-2 font-bold uppercase text-[10px] tracking-wider">Statut Flux</th>
                        <th className="pb-2 font-bold uppercase text-[10px] tracking-wider">Performance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50/50">
                      <tr className="text-gray-700">
                        <td className="py-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500" /> Ligne 119 - Urbain</td>
                        <td className="py-3 text-gray-400 font-semibold">38 min</td>
                        <td className="py-3 text-gray-500 font-semibold">Forte (4.2k)</td>
                        <td className="py-3"><span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-600 rounded">Saturé</span></td>
                        <td className="py-3 text-gray-400 font-bold">Critique</td>
                      </tr>
                      <tr className="text-gray-700">
                        <td className="py-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" /> Ligne 163 - Suburbain</td>
                        <td className="py-3 text-gray-400 font-semibold">18 min</td>
                        <td className="py-3 text-gray-500 font-semibold">Moyenne (2.1k)</td>
                        <td className="py-3"><span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded">Fluide</span></td>
                        <td className="py-3 text-gray-400 font-bold">Optimale</td>
                      </tr>
                      <tr className="text-gray-700">
                        <td className="py-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500" /> Ligne 194 - Urbain</td>
                        <td className="py-3 text-gray-400 font-semibold">22 min</td>
                        <td className="py-3 text-gray-500 font-semibold">Forte (3.8k)</td>
                        <td className="py-3"><span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-600 rounded">Régulé</span></td>
                        <td className="py-3 text-gray-400 font-bold">Stable</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
      
              {/* Bloc d'action rapide - Contrôle de véhicule */}
              <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Contrôle de Véhicule</h3>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">Ping manuel de balise GPS en 2 secondes.</p>
                  
                  <div className="relative mt-4">
                    <input
                      type="text"
                      placeholder="Entrer le numéro matricule..."
                      className="w-full pl-3 pr-8 py-2 bg-gray-50 border-0 rounded-xl text-xs focus:outline-none font-semibold text-gray-700 placeholder-gray-400"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-orange-500"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium mt-1.5 pl-1">Récents: <span className="underline cursor-pointer hover:text-gray-600 font-semibold">0412-TB-Ankatso</span></p>
                </div>
      
                <div className="flex gap-2 justify-center my-3">
                  <div className="w-7 h-7 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center border border-orange-100 cursor-pointer hover:bg-orange-100 transition-colors"><Bus className="w-3.5 h-3.5" /></div>
                  <div className="w-7 h-7 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors"><MapPin className="w-3.5 h-3.5" /></div>
                  <div className="w-7 h-7 bg-rose-50 text-rose-500 rounded-lg flex items-center justify-center border border-rose-100 cursor-pointer hover:bg-rose-100 transition-colors"><AlertTriangle className="w-3.5 h-3.5" /></div>
                  <div className="w-7 h-7 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center border border-purple-100 cursor-pointer hover:bg-purple-100 transition-colors"><CheckCircle className="w-3.5 h-3.5" /></div>
                </div>
      
                <div className="flex gap-2 mt-2">
                  <button className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200/60 rounded-xl text-xs font-bold text-gray-600 transition-colors">Ping Balise</button>
                  <button className="flex-1 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 group active:scale-95">
                    <span>Suivre Live</span>
                    <Play className="w-2.5 h-2.5 fill-white group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
      
            </div>
      
    </motion.div>
  );
}