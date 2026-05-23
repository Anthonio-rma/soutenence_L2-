import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function AuthInterface({ onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('utilisateur');
  const [showPassword, setShowPassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Nouvel état pour le succès
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom_complet: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
    if (successMessage) setSuccessMessage('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      // --- MODIFICATION ICI ---
      // On récupère l'objet 'user' renvoyé par le backend
      const { user } = response.data;
      
      // On sauvegarde dans le localStorage pour que la Sidebar puisse le lire
      localStorage.setItem('user', JSON.stringify({
        nom: user.nom_complet,
        role: user.role
      }));
      // ------------------------

      console.log("Connexion réussie :", response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error("Erreur de connexion :", error);
      // On affiche le message d'erreur du backend s'il existe, sinon un message par défaut
      setErrorMessage(error.response?.data?.error || "E-mail ou mot de passe incorrect.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', { ...formData, role });
      setSuccessMessage("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      setFormData({ nom_complet: '', email: '', password: '' }); // Réinitialiser le formulaire
      setIsLogin(true);
    } catch (error) {
      console.error("Erreur d'inscription :", error);
      setErrorMessage("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: isLogin ? -20 : 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: isLogin ? 20 : -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans antialiased overflow-x-hidden select-none py-8 lg:py-0">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover" src="/video/video01.mp4" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-6 text-white space-y-4 md:space-y-6 text-center lg:text-left mt-12 lg:mt-0">
          <div className="flex items-center gap-2 justify-center lg:justify-start">
            <div className="h-9 w-9 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">TAXI-BE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-none">BIENVENUE</h1>
          <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed max-w-md mx-auto lg:mx-0">
            Cette plateforme est conçue pour moderniser le transport public à Madagascar. Elle permet de suivre en temps réel les taxi-be, de consulter les différentes lignes et trajets, et de faciliter les déplacements des usagers grâce à une interface simple, rapide et accessible sur web et mobile. L’objectif est d’offrir une solution numérique fiable pour améliorer l’expérience des transports urbains.
          </p>
          <button onClick={onBack} className="flex items-center gap-2 bg-white/10 text-white text-xs font-medium px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/20 transition-all shadow-lg mx-auto lg:mx-0">
            Retour
          </button>
        </div>

        <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div key="login" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <h2 className="text-2xl font-bold text-center text-slate-900">Ravi de vous revoir</h2>
                  {errorMessage && <div className="bg-red-50 text-red-600 text-xs text-center py-2 px-4 rounded-full border border-red-200">{errorMessage}</div>}
                  {successMessage && <div className="bg-green-50 text-green-600 text-xs text-center py-2 px-4 rounded-full border border-green-200">{successMessage}</div>}
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <input name="email" type="email" required placeholder="E-mail" value={formData.email} onChange={handleInputChange} className="w-full border rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
                    <div className="relative w-full">
                      <input name="password" type={showPassword ? "text" : "password"} required placeholder="Mot de passe" value={formData.password} onChange={handleInputChange} className="w-full border rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none pr-12" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                    <div className="text-right"><a href="#" className="text-xs text-indigo-600 hover:underline">Mot de passe oublié ?</a></div>
                    <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-70">
                      {isLoading ? <><Loader2 className="animate-spin" size={18} /> Connexion...</> : "Se connecter"}
                    </button>
                    <div className="w-full mt-4 flex justify-center">
                      <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                          try {
                            setIsLoading(true);
                            const response = await axios.post('/api/auth/google', {
                              token: credentialResponse.credential
                            });

                            localStorage.setItem('user', JSON.stringify({
                              nom: response.data.user.nom_complet,
                              role: response.data.user.role
                            }));

                            navigate('/dashboard');
                          } catch (error) {
                            console.error("Erreur Google :", error);
                            setErrorMessage("Erreur lors de la connexion Google.");
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                        onError={() => setErrorMessage("Échec de l'authentification Google.")}
                        // useOneTap // Supprimez cette ligne si vous avez des erreurs de FedCM
                        theme="outline"
                        size="large"
                        width="100%"
                      />
                    </div>
                  </form>
                  <p className="text-xs text-center text-slate-500">Vous n'avez pas de compte ? <button onClick={() => setIsLogin(false)} className="font-bold text-indigo-600">S'inscrire</button></p>
                </motion.div>
              ) : (
                <motion.div key="register" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <h2 className="text-2xl font-bold text-center text-slate-900">Créer un compte</h2>
                  {errorMessage && <div className="bg-red-50 text-red-600 text-xs text-center py-2 px-4 rounded-full border border-red-200">{errorMessage}</div>}
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-full text-xs font-medium">
                      {['admin', 'operateur', 'utilisateur'].map((r) => (
                        <button key={r} type="button" onClick={() => setRole(r)} className={`py-2 rounded-full capitalize ${role === r ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600'}`}>
                          {r === 'operateur' ? 'Opérateur' : r}
                        </button>
                      ))}
                    </div>
                    <input name="nom_complet" type="text" required placeholder="Nom complet" value={formData.nom_complet} onChange={handleInputChange} className="w-full border rounded-full px-5 py-3 text-sm outline-none" />
                    <input name="email" type="email" required placeholder="E-mail" value={formData.email} onChange={handleInputChange} className="w-full border rounded-full px-5 py-3 text-sm outline-none" />
                    <div className="relative w-full">
                      <input name="password" type={showPassword ? "text" : "password"} required placeholder="Créer un mot de passe" value={formData.password} onChange={handleInputChange} className="w-full border rounded-full px-5 py-3 text-sm outline-none pr-12" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-70">
                      {isLoading ? <><Loader2 className="animate-spin" size={18} /> Création...</> : "S'inscrire"}
                    </button>
                  </form>
                  <p className="text-xs text-center text-slate-500">Vous avez déjà un compte ? <button onClick={() => setIsLogin(true)} className="font-bold text-indigo-600">Se connecter</button></p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}