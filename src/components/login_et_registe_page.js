import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthInterface({ onBack }) {
  const [isLogin, setIsLogin] = useState(true);

  // Variantes d'animation pour le basculement fluide entre Login et Register
  const formVariants = {
    hidden: { opacity: 0, x: isLogin ? -20 : 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: isLogin ? 20 : -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans antialiased overflow-x-hidden select-none py-8 lg:py-0">
      
      {/* ======================================================= */}
      {/* BACKGROUND : ARRIÈRE-PLAN VIDÉO AMÉLIORÉ ET SOMBRE      */}
      {/* ======================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src="/video/video01.mp4"
        />
        {/* Filtre sombre pour préserver les couleurs d'origine tout en augmentant le contraste */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* ======================================================= */}
      {/* BOUTON RETOUR (POSITIONNÉ EN HAUT À GAUCHE DISCRET)     */}
      {/* ======================================================= */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-medium px-4 py-2 rounded-full border border-white/10 transition-all active:scale-95 shadow-lg"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Retour
      </button>

      {/* ======================================================= */}
      {/* CONTENEUR PRINCIPAL (GRILLE RESPONSIVE PROPRE)          */}
      {/* ======================================================= */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* CÔTÉ GAUCHE : TEXTE DE PRÉSENTATION "PAGEDONE" */}
        <div className="lg:col-span-6 text-white space-y-4 md:space-y-6 text-center lg:text-left mt-12 lg:mt-0">
          <div className="flex items-center gap-2 justify-center lg:justify-start">
            {/* Logo similaire à Pagedone */}
            <div className="h-9 w-9 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">TAXI-BE</span>
          </div>

          <div className="space-y-3 md:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-none">
              Hé, Bonjour !
            </h1>
            <p className="text-base sm:text-lg md:text-xl font-medium text-white/95 tracking-wide">
              Rejoignez la liste d'attente pour le Design System !
            </p>
            <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed max-w-md mx-auto lg:mx-0">
              Nous offrons tous les avantages nécessaires pour simplifier l'ensemble de vos transactions financières, sans aucune exigence supplémentaire.
            </p>
          </div>
        </div>

        {/* CÔTÉ DROIT : FORMULAIRE ADAPTÉ AUX ÉCRANS MOBILES */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end w-full mb-4 lg:mb-0">
          <div className="bg-white w-full max-w-md rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              {isLogin ? (
                /* ========================================== */
                /* FORMULAIRE DE CONNEXION (FRANÇAIS)        */
                /* ========================================== */
                <motion.div
                  key="login-form"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-5 sm:space-y-6"
                >
                  <div className="text-center space-y-1.5 sm:space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Ravi de vous revoir</h2>
                    <p className="text-[11px] sm:text-xs text-slate-400 font-normal">Commencez dès maintenant votre essai gratuit de 30 jours.</p>
                  </div>

                  <form onSubmit={(e) => e.preventDefault()} className="space-y-3 sm:space-y-4">
                    <div className="space-y-1">
                      <input 
                        type="text" 
                        placeholder="Nom d'utilisateur" 
                        className="w-full bg-white border border-slate-200 rounded-full px-5 py-2.5 sm:py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-sm"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <input 
                        type="password" 
                        placeholder="Mot de passe" 
                        className="w-full bg-white border border-slate-200 rounded-full px-5 py-2.5 sm:py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-sm"
                      />
                    </div>

                    <div className="text-center">
                      <a href="#forgot" className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                        Mot de passe oublié ?
                      </a>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 sm:py-3.5 rounded-full text-sm tracking-wide shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                      Se connecter
                    </button>
                  </form>

                  {/* Séparateur */}
                  <div className="relative flex py-1 items-center justify-center">
                    <div className="absolute inset-x-0 h-[1px] bg-slate-100" />
                    <span className="relative bg-white px-4 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-slate-400 z-10">OU</span>
                  </div>

                  {/* Boutons Sociaux */}
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 border border-slate-100 bg-slate-50/50 hover:bg-slate-50 py-2.5 sm:py-3 px-4 rounded-full text-xs font-semibold text-slate-700 transition-colors shadow-sm">
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-4 w-4" />
                      Google
                    </button>
                    <button className="flex items-center justify-center gap-2 border border-slate-100 bg-slate-50/50 hover:bg-slate-50 py-2.5 sm:py-3 px-4 rounded-full text-xs font-semibold text-slate-700 transition-colors shadow-sm">
                      <img src="https://www.svgrepo.com/show/475644/facebook-color.svg" alt="Facebook" className="h-4 w-4" />
                      Facebook
                    </button>
                  </div>

                  {/* Lien bascule */}
                  <div className="text-center pt-1 sm:pt-2">
                    <p className="text-xs text-slate-500">
                      Vous n'avez pas de compte ?{' '}
                      <button 
                        onClick={() => setIsLogin(false)} 
                        className="font-bold text-indigo-600 hover:underline focus:outline-none"
                      >
                        S'inscrire
                      </button>
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* ========================================== */
                /* FORMULAIRE D'INSCRIPTION (FRANÇAIS)        */
                /* ========================================== */
                <motion.div
                  key="register-form"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-5 sm:space-y-6"
                >
                  <div className="text-center space-y-1.5 sm:space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Créer un compte</h2>
                    <p className="text-[11px] sm:text-xs text-slate-400 font-normal">Rejoignez-nous et profitez de 30 jours d'essai gratuit.</p>
                  </div>

                  <form onSubmit={(e) => e.preventDefault()} className="space-y-3 sm:space-y-4">
                    <div className="space-y-1">
                      <input 
                        type="text" 
                        placeholder="Nom complet" 
                        className="w-full bg-white border border-slate-200 rounded-full px-5 py-2.5 sm:py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <input 
                        type="email" 
                        placeholder="Adresse e-mail" 
                        className="w-full bg-white border border-slate-200 rounded-full px-5 py-2.5 sm:py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-sm"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <input 
                        type="password" 
                        placeholder="Créer un mot de passe" 
                        className="w-full bg-white border border-slate-200 rounded-full px-5 py-2.5 sm:py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-sm"
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 sm:py-3.5 rounded-full text-sm tracking-wide shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] mt-1"
                    >
                      S'inscrire
                    </button>
                  </form>

                  {/* Séparateur */}
                  <div className="relative flex py-1 items-center justify-center">
                    <div className="absolute inset-x-0 h-[1px] bg-slate-100" />
                    <span className="relative bg-white px-4 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-slate-400 z-10">OU S'INSCRIRE AVEC</span>
                  </div>

                  {/* Boutons Sociaux */}
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 border border-slate-100 bg-slate-50/50 hover:bg-slate-50 py-2.5 sm:py-3 px-4 rounded-full text-xs font-semibold text-slate-700 transition-colors shadow-sm">
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-4 w-4" />
                      Google
                    </button>
                    <button className="flex items-center justify-center gap-2 border border-slate-100 bg-slate-50/50 hover:bg-slate-50 py-2.5 sm:py-3 px-4 rounded-full text-xs font-semibold text-slate-700 transition-colors shadow-sm">
                      <img src="https://www.svgrepo.com/show/475644/facebook-color.svg" alt="Facebook" className="h-4 w-4" />
                      Facebook
                    </button>
                  </div>

                  {/* Lien bascule */}
                  <div className="text-center pt-1 sm:pt-2">
                    <p className="text-xs text-slate-500">
                      Vous avez déjà un compte ?{' '}
                      <button 
                        onClick={() => setIsLogin(true)} 
                        className="font-bold text-indigo-600 hover:underline focus:outline-none"
                      >
                        Se connecter
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </div>
  );
}