import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router'; // Importation du hook de redirection v7

export default function AuthInterface({ onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('utilisateur'); // Rôle par défaut : utilisateur
  const navigate = useNavigate(); // Initialisation de la fonction de navigation

  // Gestion de la soumission de la connexion
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Tu pourras ajouter ta logique de validation d'API ici plus tard
    navigate('/dashboard'); // Redirection immédiate et fluide vers le dashboard
  };

  // Gestion de la soumission de l'inscription
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    // Logique d'inscription avec le rôle sélectionné disponible dans la variable 'role'
    console.log("Rôle sélectionné à l'inscription :", role);
    navigate('/dashboard');
  };

  // Variantes d'animation pour le basculement fluide entre Login et Register
  const formVariants = {
    hidden: { opacity: 0, x: isLogin ? -20 : 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: isLogin ? 20 : -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  // Variantes d'animation fluides pour le bouton Retour
  const backButtonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { delay: 0.2, duration: 0.5, ease: "easeOut" } 
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans antialiased overflow-x-hidden select-none py-8 lg:py-0">
      
      {/* BACKGROUND : ARRIÈRE-PLAN VIDÉO AMÉLIORÉ ET SOMBRE */}
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

      {/* CONTENEUR PRINCIPAL (GRILLE RESPONSIVE PROPRE) */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* CÔTÉ GAUCHE : TEXTE DE PRÉSENTATION "PAGEDONE" + BOUTON RETOUR */}
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
              BIENVENUE
            </h1>
            <p className="text-base sm:text-lg md:text-xl font-medium text-white/95 tracking-wide">
              Suivez les taxi-be en temps réel avec une plateforme moderne pensée pour tous.
            </p>
            <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed max-w-md mx-auto lg:mx-0">
              Cette plateforme est conçue pour moderniser le transport public à Madagascar.Elle permet de suivre en temps réel les taxi-be, de consulter les différentes lignes et trajets, et de faciliter les déplacements des usagers grâce à une interface simple, rapide et accessible sur web et mobile. L’objectif est d’offrir une solution numérique fiable pour améliorer l’expérience des transports urbains
            </p>
          </div>

          {/* BOUTON RETOUR POSITIONNÉ EN BAS DU TEXTE DE DESCRIPTION AVEC ANIMATIONS AMÉLIORÉES */}
          <div className="flex justify-center lg:justify-start pt-2">
            <motion.button
              onClick={onBack}
              variants={backButtonVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.18)" }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 bg-white/10 text-white text-xs font-medium px-5 py-2.5 rounded-full border border-white/10 transition-colors duration-200 shadow-lg cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Retour
            </motion.button>
          </div>
        </div>

        {/* CÔTÉ DROIT : FORMULAIRE ADAPTÉ AUX ÉCRANS MOBILES */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end w-full mb-4 lg:mb-0">
          <div className="bg-white w-full max-w-md rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              {isLogin ? (
                
                /* FORMULAIRE DE CONNEXION (SANS BOUTONS SOCIAUX) */
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

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <input 
                        type="text" 
                        required
                        placeholder="Nom d'utilisateur" 
                        className="w-full bg-white border border-slate-200 rounded-full px-5 py-2.5 sm:py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-sm"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <input 
                        type="password" 
                        required
                        placeholder="Mot de passe" 
                        className="w-full bg-white border border-slate-200 rounded-full px-5 py-2.5 sm:py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-sm"
                      />
                    </div>

                    <div className="text-center pt-1">
                      <a href="#forgot" className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                        Mot de passe oublié ?
                      </a>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 sm:py-3.5 rounded-full text-sm tracking-wide shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2 cursor-pointer"
                    >
                      Se connecter
                    </button>
                  </form>

                  {/* Lien bascule vers inscription */}
                  <div className="text-center pt-2 border-t border-slate-50">
                    <p className="text-xs text-slate-500">
                      Vous n'avez pas de compte ?{' '}
                      <button 
                        onClick={() => setIsLogin(false)} 
                        className="font-bold text-indigo-600 hover:underline focus:outline-none cursor-pointer"
                      >
                        S'inscrire
                      </button>
                    </p>
                  </div>
                </motion.div>
              ) : (
                
                /* FORMULAIRE D'INSCRIPTION AVEC INTÉGRATION DES 3 RÔLES */
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

                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    
                    {/* CHOIX DES 3 RÔLES (Administrateur, Opérateur, Utilisateur) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 pl-2">Sélectionnez votre rôle :</label>
                      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-full text-[11px] sm:text-xs font-medium">
                        <button
                          type="button"
                          onClick={() => setRole('admin')}
                          className={`py-2 px-1 rounded-full text-center transition-all cursor-pointer ${
                            role === 'admin' 
                              ? 'bg-indigo-600 text-white shadow-md font-bold' 
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Admin
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole('operateur')}
                          className={`py-2 px-1 rounded-full text-center transition-all cursor-pointer ${
                            role === 'operateur' 
                              ? 'bg-indigo-600 text-white shadow-md font-bold' 
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Opérateur
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole('utilisateur')}
                          className={`py-2 px-1 rounded-full text-center transition-all cursor-pointer ${
                            role === 'utilisateur' 
                              ? 'bg-indigo-600 text-white shadow-md font-bold' 
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Utilisateur
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <input 
                        type="text" 
                        required
                        placeholder="Nom complet" 
                        className="w-full bg-white border border-slate-200 rounded-full px-5 py-2.5 sm:py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <input 
                        type="email" 
                        required
                        placeholder="Adresse e-mail" 
                        className="w-full bg-white border border-slate-200 rounded-full px-5 py-2.5 sm:py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-sm"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <input 
                        type="password" 
                        required
                        placeholder="Créer un mot de passe" 
                        className="w-full bg-white border border-slate-200 rounded-full px-5 py-2.5 sm:py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-sm"
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 sm:py-3.5 rounded-full text-sm tracking-wide shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2 cursor-pointer"
                    >
                      S'inscrire
                    </button>
                  </form>

                  {/* Lien bascule vers connexion */}
                  <div className="text-center pt-2 border-t border-slate-50">
                    <p className="text-xs text-slate-500">
                      Vous avez déjà un compte ?{' '}
                      <button 
                        onClick={() => setIsLogin(true)} 
                        className="font-bold text-indigo-600 hover:underline focus:outline-none cursor-pointer"
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