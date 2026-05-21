import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PencilIcon, 
  ShieldCheckIcon, 
  KeyIcon, 
  DevicePhoneMobileIcon, 
  ComputerDesktopIcon,
  XMarkIcon,
  CheckIcon,
  CameraIcon
} from '@heroicons/react/24/outline';

const contentVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

export default function AccountSettings() {
  // Réf pour le trigger de l'input type file
  const fileInputRef = useRef(null);

  // --- ÉTATS POUR RENDRE LES BOUTONS OPÉRATIONNELS ---
  
  // 1. Profil de base (Ajout de l'état avatar)
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [headerData, setHeaderData] = useState({
    fullName: 'Rafiqur Rahman',
    role: "Gestionnaire d'Équipe",
    location: 'Leeds, Royaume-Uni',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'
  });
  const [tempHeaderData, setTempHeaderData] = useState({ ...headerData });

  // 2. Informations Personnelles
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'Rafiqur',
    lastName: 'Rahman',
    email: 'rafiqurrahman51@gmail.com',
    phone: '+09 345 346 46',
    bio: "Gestionnaire d'Équipe"
  });
  const [tempPersonalInfo, setTempPersonalInfo] = useState({ ...personalInfo });

  // 3. Adresse
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressData, setAddressData] = useState({
    country: 'Royaume-Uni',
    city: 'Leeds, East London',
    postalCode: 'ERT 2354',
    taxId: 'AS45645756'
  });
  const [tempAddressData, setTempAddressData] = useState({ ...addressData });

  // 4. Sécurité : Mot de passe
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });

  // 5. Sécurité : 2FA
  const [is2FAActive, setIs2FAActive] = useState(true);

  // 6. Sécurité : Appareils connectés
  const [devices, setDevices] = useState([
    { id: 1, type: 'desktop', name: 'MacBook Pro — Antananarivo, Madagascar', meta: 'Chrome • Session actuelle', current: true },
    { id: 2, type: 'mobile', name: 'iPhone 14 — Mahajanga, Madagascar', meta: 'Application ProDeel • Il y a 2 heures', current: false }
  ]);

  // --- ACTIONS ---
  const handleDisconnectDevice = (id) => {
    setDevices(devices.filter(device => device.id !== id));
  };

  // Gestion du changement d'image locale (File Reader)
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempHeaderData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 sm:p-8 font-sans text-[#1E293B]">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-[#0F172A]">Paramètres du Compte</h1>

      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 sm:space-y-8 max-w-5xl mx-auto"
      >
        
        {/* ==========================================
            BLOC 1 : MON PROFIL
           ========================================== */}
        <div className="space-y-6">
          
          {/* Section 1: Photo & En-tête de base */}
          <div className="border border-[#E2E8F0] rounded-xl p-4 sm:p-5 bg-white shadow-sm">
            {!isEditingHeader ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-sm shrink-0">
                    <img 
                      src={headerData.avatar} 
                      alt={headerData.fullName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A]">{headerData.fullName}</h3>
                    <p className="text-sm text-[#64748B]">{headerData.role}</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">{headerData.location}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setTempHeaderData({ ...headerData }); setIsEditingHeader(true); }}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors w-full sm:w-auto"
                >
                  <PencilIcon className="w-3.5 h-3.5" /> Modifier
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
                  <h4 className="text-sm font-bold text-[#0F172A]">Modifier l'en-tête de profil</h4>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsEditingHeader(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Gestion de l'image en Mode Édition */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-2">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-sm cursor-pointer group mx-auto sm:mx-0 shrink-0"
                  >
                    <img 
                      src={tempHeaderData.avatar} 
                      alt="Aperçu" 
                      className="w-full h-full object-cover group-hover:opacity-70 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <CameraIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <div className="text-center sm:text-left">
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1 border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#475569] hover:bg-[#F8FAFC]"
                    >
                      Téléverser une photo
                    </button>
                    <p className="text-[11px] text-[#94A3B8] mt-1">JPG, PNG ou GIF. Clickez sur le cercle pour changer.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-1">Nom Complet</label>
                    <input 
                      type="text" 
                      value={tempHeaderData.fullName} 
                      onChange={(e) => setTempHeaderData({ ...tempHeaderData, fullName: e.target.value })}
                      className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB] focus:bg-white text-[#334155]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-1">Rôle</label>
                    <input 
                      type="text" 
                      value={tempHeaderData.role} 
                      onChange={(e) => setTempHeaderData({ ...tempHeaderData, role: e.target.value })}
                      className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB] focus:bg-white text-[#334155]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-1">Localisation</label>
                    <input 
                      type="text" 
                      value={tempHeaderData.location} 
                      onChange={(e) => setTempHeaderData({ ...tempHeaderData, location: e.target.value })}
                      className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB] focus:bg-white text-[#334155]"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-3">
                    <label className="block text-xs font-medium text-[#94A3B8] mb-1">Ou coller l'URL d'une image</label>
                    <input 
                      type="text" 
                      value={tempHeaderData.avatar} 
                      onChange={(e) => setTempHeaderData({ ...tempHeaderData, avatar: e.target.value })}
                      className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB] focus:bg-white text-[#334155]"
                      placeholder="https://exemple.com/image.jpg"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setIsEditingHeader(false)} className="px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] flex-1 sm:flex-none">Annuler</button>
                  <button onClick={() => { setHeaderData({ ...tempHeaderData }); setIsEditingHeader(false); }} className="px-3 py-1.5 bg-[#2563EB] text-white rounded-lg text-xs font-semibold hover:bg-[#1D4ED8] flex-1 sm:flex-none">Enregistrer</button>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Personal Information */}
          <div className="border border-[#E2E8F0] rounded-xl p-4 sm:p-6 bg-white shadow-sm space-y-5">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-bold text-[#0F172A]">Informations Personnelles</h3>
              {!isEditingInfo && (
                <button 
                  onClick={() => { setTempPersonalInfo({ ...personalInfo }); setIsEditingInfo(true); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors shrink-0"
                >
                  <PencilIcon className="w-3.5 h-3.5" /> Modifier
                </button>
              )}
            </div>
            
            {!isEditingInfo ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <span className="block text-xs font-medium text-[#94A3B8] mb-1">Prénom</span>
                  <span className="text-sm font-medium text-[#334155]">{personalInfo.firstName}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-[#94A3B8] mb-1">Nom</span>
                  <span className="text-sm font-medium text-[#334155]">{personalInfo.lastName}</span>
                </div>
                <div className="break-all">
                  <span className="block text-xs font-medium text-[#94A3B8] mb-1">Adresse e-mail</span>
                  <span className="text-sm font-medium text-[#334155]">{personalInfo.email}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-[#94A3B8] mb-1">Téléphone</span>
                  <span className="text-sm font-medium text-[#334155]">{personalInfo.phone}</span>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <span className="block text-xs font-medium text-[#94A3B8] mb-1">Biographie</span>
                  <span className="text-sm font-medium text-[#334155]">{personalInfo.bio}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-1">Prénom</label>
                    <input 
                      type="text" 
                      value={tempPersonalInfo.firstName} 
                      onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB] focus:bg-white text-[#334155]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-1">Nom</label>
                    <input 
                      type="text" 
                      value={tempPersonalInfo.lastName} 
                      onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB] focus:bg-white text-[#334155]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-1">Adresse e-mail</label>
                    <input 
                      type="email" 
                      value={tempPersonalInfo.email} 
                      onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, email: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB] focus:bg-white text-[#334155]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-1">Téléphone</label>
                    <input 
                      type="text" 
                      value={tempPersonalInfo.phone} 
                      onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB] focus:bg-white text-[#334155]"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs font-medium text-[#94A3B8] mb-1">Biographie</label>
                    <textarea 
                      rows="2"
                      value={tempPersonalInfo.bio} 
                      onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, bio: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB] focus:bg-white text-[#334155] resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setIsEditingInfo(false)} className="px-4 py-2 border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] flex-1 sm:flex-none">Annuler</button>
                  <button onClick={() => { setPersonalInfo({ ...tempPersonalInfo }); setIsEditingInfo(false); }} className="px-4 py-2 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:bg-[#1D4ED8] flex-1 sm:flex-none">Enregistrer</button>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Address */}
          <div className="border border-[#E2E8F0] rounded-xl p-4 sm:p-6 bg-white shadow-sm space-y-5">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-bold text-[#0F172A]">Adresse</h3>
              {!isEditingAddress && (
                <button 
                  onClick={() => { setTempAddressData({ ...addressData }); setIsEditingAddress(true); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors shrink-0"
                >
                  <PencilIcon className="w-3.5 h-3.5" /> Modifier
                </button>
              )}
            </div>

            {!isEditingAddress ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <span className="block text-xs font-medium text-[#94A3B8] mb-1">Pays</span>
                  <span className="text-sm font-medium text-[#334155]">{addressData.country}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-[#94A3B8] mb-1">Ville / État</span>
                  <span className="text-sm font-medium text-[#334155]">{addressData.city}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-[#94A3B8] mb-1">Code Postal</span>
                  <span className="text-sm font-medium text-[#334155]">{addressData.postalCode}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-[#94A3B8] mb-1">Identifiant Fiscal (TAX ID)</span>
                  <span className="text-sm font-medium text-[#334155]">{addressData.taxId}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-1">Pays</label>
                    <input 
                      type="text" 
                      value={tempAddressData.country} 
                      onChange={(e) => setTempAddressData({ ...tempAddressData, country: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB] focus:bg-white text-[#334155]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-1">Ville / État</label>
                    <input 
                      type="text" 
                      value={tempAddressData.city} 
                      onChange={(e) => setTempAddressData({ ...tempAddressData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB] focus:bg-white text-[#334155]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-1">Code Postal</label>
                    <input 
                      type="text" 
                      value={tempAddressData.postalCode} 
                      onChange={(e) => setTempAddressData({ ...tempAddressData, postalCode: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB] focus:bg-white text-[#334155]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-1">Identifiant Fiscal (TAX ID)</label>
                    <input 
                      type="text" 
                      value={tempAddressData.taxId} 
                      onChange={(e) => setTempAddressData({ ...tempAddressData, taxId: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB] focus:bg-white text-[#334155]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setIsEditingAddress(false)} className="px-4 py-2 border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] flex-1 sm:flex-none">Annuler</button>
                  <button onClick={() => { setAddressData({ ...tempAddressData }); setIsEditingAddress(false); }} className="px-4 py-2 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:bg-[#1D4ED8] flex-1 sm:flex-none">Enregistrer</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Separator linéaire discret entre les deux grands thèmes */}
        <hr className="border-[#E2E8F0] my-8" />

        {/* ==========================================
            BLOC 2 : SÉCURITÉ DU COMPTE
           ========================================== */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-[#0F172A] px-1">Sécurité du Compte</h2>

          {/* Section Mot de passe */}
          <div className="border border-[#E2E8F0] rounded-xl p-4 sm:p-6 bg-white shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3 w-full">
                <div className="p-2 bg-blue-50 text-[#2563EB] rounded-lg mt-0.5 shrink-0">
                  <KeyIcon className="w-5 h-5" />
                </div>
                <div className="space-y-1 w-full">
                  <h3 className="text-sm font-bold text-[#0F172A]">Mot de passe de connexion</h3>
                  <p className="text-xs text-[#64748B]">Dernière modification il y a 3 mois</p>
                  
                  {/* Formulaire d'extension pour la mise à jour réelle */}
                  <AnimatePresence>
                    {isUpdatingPassword && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-4 space-y-3 overflow-hidden w-full max-w-xs"
                      >
                        <input 
                          type="password" 
                          placeholder="Mot de passe actuel"
                          value={passwordForm.current}
                          onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                          className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                        />
                        <input 
                          type="password" 
                          placeholder="Nouveau mot de passe"
                          value={passwordForm.next}
                          onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
                          className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                        />
                        <input 
                          type="password" 
                          placeholder="Confirmer le nouveau mot de passe"
                          value={passwordForm.confirm}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                          className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs bg-[#F8FAFC] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                        />
                        <div className="flex gap-2 pt-1">
                          <button 
                            onClick={() => { setPasswordForm({ current: '', next: '', confirm: '' }); setIsUpdatingPassword(false); }}
                            className="px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg text-[11px] font-semibold text-[#475569] flex-1 sm:flex-none text-center"
                          >
                            Annuler
                          </button>
                          <button 
                            onClick={() => { setPasswordForm({ current: '', next: '', confirm: '' }); setIsUpdatingPassword(false); }}
                            className="px-2.5 py-1.5 bg-[#2563EB] text-white rounded-lg text-[11px] font-semibold flex-1 sm:flex-none text-center"
                          >
                            Mettre à jour
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              {!isUpdatingPassword && (
                <button 
                  onClick={() => setIsUpdatingPassword(true)}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors w-full sm:w-auto shrink-0"
                >
                  Mettre à jour
                </button>
              )}
            </div>
          </div>

          {/* Section Double Authentification (2FA) */}
          <div className="border border-[#E2E8F0] rounded-xl p-4 sm:p-6 bg-white shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg transition-colors shrink-0 ${is2FAActive ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                  <ShieldCheckIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-[#0F172A]">Authentification à deux facteurs (2FA)</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      is2FAActive 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {is2FAActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">Sécurisez votre compte avec une étape de vérification supplémentaire.</p>
                </div>
              </div>
              
              <button 
                onClick={() => setIs2FAActive(!is2FAActive)}
                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border w-full sm:w-auto shrink-0 ${
                  is2FAActive 
                    ? 'border-red-200 bg-red-50/30 text-red-600 hover:bg-red-50' 
                    : 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] hover:bg-blue-100'
                }`}
              >
                {is2FAActive ? 'Désactiver' : 'Activer'}
              </button>
            </div>
          </div>

          {/* Section Sessions actives / Appareils */}
          <div className="border border-[#E2E8F0] rounded-xl p-4 sm:p-6 bg-white shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0F172A]">Appareils connectés</h3>
            <p className="text-xs text-[#64748B]">Voici la liste des terminaux actuellement connectés à votre compte utilisateur.</p>
            
            <div className="divide-y divide-[#E2E8F0] pt-2">
              <AnimatePresence initial={false}>
                {devices.map((device) => (
                  <motion.div 
                    key={device.id}
                    initial={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, padding: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-3 overflow-hidden"
                  >
                    <div className="flex items-start gap-3">
                      {device.type === 'desktop' ? (
                        <ComputerDesktopIcon className="w-5 h-5 text-[#64748B] shrink-0 mt-0.5" />
                      ) : (
                        <DevicePhoneMobileIcon className="w-5 h-5 text-[#64748B] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-[#334155]">{device.name}</p>
                        <p className="text-xs text-[#94A3B8]">{device.meta}</p>
                      </div>
                    </div>
                    
                    {!device.current && (
                      <button 
                        onClick={() => handleDisconnectDevice(device.id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors text-left sm:text-right px-8 sm:px-0"
                      >
                        Déconnecter
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {devices.length === 0 && (
                <p className="text-xs text-center text-slate-400 py-4">Aucun appareil connecté enregistré.</p>
              )}
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}