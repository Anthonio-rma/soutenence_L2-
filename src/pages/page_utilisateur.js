import React from 'react';
import { motion } from 'motion/react';
import { 
  Bus, MapPin, Clock, Users, ArrowUpRight, 
  Search, Bell, RefreshCw, SlidersHorizontal, ChevronRight, 
  TrendingUp, AlertTriangle, CheckCircle, Play
} from 'lucide-react';

export default function PageUtilisateur() {
  
  // Variantes d'animation pour une apparition fluide en cascade (Bento Grid)
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
      className="p-6 md:p-8 flex flex-col gap-6"
    >
      {/* 1. EN-TÊTE DE LA PAGE (Header avec barre de recherche) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Manao fety, Alex!</h1>
          <p className="text-xs text-gray-400 mt-1 font-medium">32 taxis-be géo-localisés actifs sur vos coopératives suivies.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Barre de recherche identique à la maquette */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Rechercher une ligne, un arrêt, un véhicule..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-orange-500 shadow-sm shadow-gray-100/30 font-medium transition-all"
            />
          </div>
          
          {/* Boutons d'action rapides */}
          <button className="p-2 bg-white border border-gray-100 text-gray-500 rounded-xl hover:bg-gray-50 shadow-sm transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
          </button>
        </div>
      </div>

      {/* 2. SECTION HIGHLIGHTS (Bento Grid supérieur - 4 indicateurs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 : Bus Actifs */}
        <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl border border-gray-100/80 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Véhicules En Ligne</span>
            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">+12%</span>
          </div>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-extrabold text-gray-800 tracking-tight">142</span>
            {/* Simulation de mini graphique en barres orange comme sur l'image */}
            <div className="flex items-end gap-0.5 h-8 mb-1">
              <div className="w-1 bg-orange-100 h-3 rounded-full" />
              <div className="w-1 bg-orange-200 h-5 rounded-full" />
              <div className="w-1 bg-orange-300 h-4 rounded-full" />
              <div className="w-1 bg-orange-400 h-6 rounded-full" />
              <div className="w-1 bg-orange-500 h-8 rounded-full" />
            </div>
          </div>
        </motion.div>

        {/* Card 2 : Rotations complétées */}
        <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl border border-gray-100/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Trajets Effectués</span>
            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">+5%</span>
          </div>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-extrabold text-gray-800 tracking-tight">584</span>
            {/* Simulation de mini graphique en ligne orange */}
            <div className="w-16 h-6 mb-1 opacity-80">
              <svg viewBox="0 0 50 20" className="w-full h-full stroke-orange-500 stroke-2 fill-none">
                <path d="M0,15 Q10,5 20,12 T40,3 T50,8" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Card 3 : Performance Ponctualité */}
        <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl border border-gray-100/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Respect Horaires</span>
            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">+10%</span>
          </div>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-extrabold text-gray-800 tracking-tight">88<span className="text-lg font-bold text-gray-400">%</span></span>
            <div className="w-10 h-6 mb-1 text-orange-500 opacity-20">
              <Clock className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
        </motion.div>

        {/* Card 4 : Heures de pointes consécutives */}
        <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl border border-gray-100/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Régulation Flux</span>
            <span className="text-[10px] font-extrabold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">Stable</span>
          </div>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-extrabold text-gray-800 tracking-tight">07<span className="text-xs text-gray-400 font-medium ml-1">Lignes</span></span>
            <div className="flex gap-1 mb-1.5">
              <span className="w-2 h-2 bg-orange-500 rounded-full" />
              <span className="w-2 h-2 bg-orange-500 rounded-full" />
              <span className="w-2 h-2 bg-orange-300 rounded-full" />
              <span className="w-2 h-2 bg-gray-100 rounded-full" />
            </div>
          </div>
        </motion.div>

      </div>

      {/* 3. SECTION DU MILIEU : GRAPHIQUE LINÉAIRE & ACTIVITÉ DE FLOTTE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graphique de Progression (2 Tiers de l'espace) */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Fréquentation du Réseau</h3>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">Évolution du volume de passagers par heure (Milliers).</p>
            </div>
            
            <div className="flex items-center gap-2">
              <select className="px-2.5 py-1.5 bg-gray-50 border-0 rounded-lg text-[11px] font-semibold text-gray-600 focus:outline-none">
                <option>Axe Analakely</option>
                <option>Axe Ankatso</option>
              </select>
              <select className="px-2.5 py-1.5 bg-gray-50 border-0 rounded-lg text-[11px] font-semibold text-gray-600 focus:outline-none">
                <option>Aujourd'hui</option>
                <option>Ce mois</option>
              </select>
            </div>
          </div>

          {/* Zone du graphique principal reproduite à l'identique */}
          <div className="h-48 w-full relative mt-4">
            {/* Grille d'arrière-plan en CSS */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="w-full border-t border-dashed border-gray-100 text-[9px] text-gray-300 pt-0.5">100k</div>
              <div className="w-full border-t border-dashed border-gray-100 text-[9px] text-gray-300 pt-0.5">75k</div>
              <div className="w-full border-t border-dashed border-gray-100 text-[9px] text-gray-300 pt-0.5">50k</div>
              <div className="w-full border-t border-dashed border-gray-100 text-[9px] text-gray-300 pt-0.5">25k</div>
              <div className="w-full text-[9px] text-gray-300">0</div>
            </div>

            {/* Tracé de courbe fluide en SVG avec remplissage dégradé orange */}
            <svg className="w-full h-full absolute inset-0 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.00" />
                </linearGradient>
              </defs>
              {/* Le fond coloré dégradé */}
              <path d="M 0,90 Q 20,80 35,60 T 60,50 T 85,35 L 100,20 L 100,100 L 0,100 Z" fill="url(#chartGradient)" />
              {/* La ligne orange fluide */}
              <path d="M 0,90 Q 20,80 35,60 T 60,50 T 85,35 L 100,20" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
            </svg>

            {/* Bulle d'information Interactive survolée (Tooltip identique à l'image) */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, x: '42%', y: '25%' }}
              className="absolute bg-white border border-gray-100/80 rounded-xl p-2.5 shadow-md flex flex-col gap-0.5 pointer-events-none z-10"
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

          {/* Échelle horizontale du temps */}
          <div className="flex justify-between px-1 text-[10px] font-bold text-gray-400 mt-2">
            <span>06h</span><span>09h</span><span>12h</span><span>15h</span><span>18h</span><span>21h</span>
          </div>
        </motion.div>

        {/* Graphique d'activité splité (Donut de droite) */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800">Répartition d'Activité</h3>
            <div className="flex gap-1">
              <button className="p-1 bg-gray-50 text-gray-400 hover:text-gray-600 rounded"><Search className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {/* Cercle d'activité SVG identique au design original */}
          <div className="relative flex items-center justify-center my-4">
            <svg width="130" height="130" viewBox="0 0 36 36" className="transform -rotate-90">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f4f6" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f97316" strokeWidth="3.2" strokeDasharray="45 100" strokeDashoffset="0" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="3.2" strokeDasharray="25 100" strokeDashoffset="-45" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e11d48" strokeWidth="3.2" strokeDasharray="20 100" strokeDashoffset="-70" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a855f7" strokeWidth="3.2" strokeDasharray="10 100" strokeDashoffset="-90" />
            </svg>
            <div className="absolute text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Véh.</span>
              <span className="text-2xl font-black text-gray-800">42</span>
            </div>
          </div>

          {/* Légendes détaillées */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10px] font-bold text-gray-500">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" />En Route: 45%</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />Aux Arrêts: 25%</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" />En Retard: 20%</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" />Dépôt: 10%</div>
          </div>
        </motion.div>

      </div>

      {/* 4. SECTION INFÉRIEURE : PROCHAINES CRISES/DÉPARTS & QUICK REVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Liste des Lignes surveillées (Tableau inférieur - 2 Tiers) */}
        <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800">Supervision des Lignes</h3>
            <div className="flex items-center gap-1.5">
              <button className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-50 text-[10px] font-bold text-gray-500 rounded-lg border border-gray-100/50"><SlidersHorizontal className="w-3 h-3" />Filtrer</button>
            </div>
          </div>

          {/* Table Responsive identique à la maquette de cours */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead>
                <tr className="text-gray-400 border-b border-gray-50 pb-2">
                  <th className="pb-2 font-bold uppercase text-[10px] tracking-wider">Ligne / Coopérative</th>
                  <th className="pb-2 font-bold uppercase text-[10px] tracking-wider">Dernier Check</th>
                  <th className="pb-2 font-bold uppercase text-[10px] tracking-wider">Type</th>
                  <th className="pb-2 font-bold uppercase text-[10px] tracking-wider">Statut</th>
                  <th className="pb-2 font-bold uppercase text-[10px] tracking-wider">Priorité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/50">
                <tr className="text-gray-700">
                  <td className="py-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500" /> Ligne 119 - Taxis-be</td>
                  <td className="py-3 text-gray-400 font-semibold">12:32:05</td>
                  <td className="py-3 text-gray-500 font-semibold">Urbain</td>
                  <td className="py-3"><span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-600 rounded">Embouteillage</span></td>
                  <td className="py-3 text-gray-400 font-bold">Haute</td>
                </tr>
                <tr className="text-gray-700">
                  <td className="py-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" /> Ligne 163 - Mirindra</td>
                  <td className="py-3 text-gray-400 font-semibold">12:30:10</td>
                  <td className="py-3 text-gray-500 font-semibold">Suburbain</td>
                  <td className="py-3"><span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded">Fluide</span></td>
                  <td className="py-3 text-gray-400 font-bold">Moyenne</td>
                </tr>
                <tr className="text-gray-700">
                  <td className="py-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500" /> Ligne 194 - MA-FA</td>
                  <td className="py-3 text-gray-400 font-semibold">12:28:42</td>
                  <td className="py-3 text-gray-500 font-semibold">Urbain</td>
                  <td className="py-3"><span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-600 rounded">En Itinéraire</span></td>
                  <td className="py-3 text-gray-400 font-bold">Haute</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Bloc d'action rapide - Quick Review (1 Tiers) */}
        <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Contrôle de Véhicule</h3>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">Ping manuel de balise GPS en 2 secondes.</p>
            
            {/* Champ input rapide */}
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

          {/* Rangée de mini icônes interactives comme sur l'image */}
          <div className="flex gap-2 justify-center my-3">
            <div className="w-7 h-7 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center border border-orange-100 cursor-pointer hover:bg-orange-100 transition-colors"><Bus className="w-3.5 h-3.5" /></div>
            <div className="w-7 h-7 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors"><MapPin className="w-3.5 h-3.5" /></div>
            <div className="w-7 h-7 bg-rose-50 text-rose-500 rounded-lg flex items-center justify-center border border-rose-100 cursor-pointer hover:bg-rose-100 transition-colors"><AlertTriangle className="w-3.5 h-3.5" /></div>
            <div className="w-7 h-7 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center border border-purple-100 cursor-pointer hover:bg-purple-100 transition-colors"><CheckCircle className="w-3.5 h-3.5" /></div>
          </div>

          {/* Boutons d'action inférieurs du Bento */}
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