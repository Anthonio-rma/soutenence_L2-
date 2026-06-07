import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, X, Check, Trash2, Edit2,
  MapPin, Bus, Clock, ArrowRight,
  CheckCircle2, AlertCircle, PauseCircle, Route,
  RotateCcw, ChevronDown, Filter, TrendingUp,
} from "lucide-react";

// ── DONNÉES ──
const INITIAL_LIGNES = [
  { id:1,  code:"L-101", nom:"Ankatso – Analakely",         depart:"Ankatso",        arrivee:"Analakely",      coop:"Ankatso",         statut:"active",    tarif:400,  distance:8.2,  duree:"35 min", vehicules:12, date:"12 jan. 2024", activite:"Il y a 2h"    },
  { id:2,  code:"L-102", nom:"Analakely – Ambohidratrimo",  depart:"Analakely",      arrivee:"Ambohidratrimo", coop:"Analakely",       statut:"active",    tarif:600,  distance:14.5, duree:"55 min", vehicules:8,  date:"03 fév. 2024", activite:"Il y a 15min" },
  { id:3,  code:"L-103", nom:"Ambohidratrimo – Tana-Est",   depart:"Ambohidratrimo", arrivee:"Tana-Est",       coop:"Ambohidratrimo",  statut:"active",    tarif:500,  distance:11.0, duree:"45 min", vehicules:6,  date:"21 mar. 2024", activite:"Il y a 1j"    },
  { id:4,  code:"L-104", nom:"Tana-Est – Ankatso",          depart:"Tana-Est",       arrivee:"Ankatso",        coop:"Tana-Est",        statut:"active",    tarif:450,  distance:9.7,  duree:"40 min", vehicules:10, date:"08 jan. 2024", activite:"Il y a 30min" },
  { id:5,  code:"L-105", nom:"Analakely – Tana-Est",        depart:"Analakely",      arrivee:"Tana-Est",       coop:"Analakely",       statut:"suspendue", tarif:550,  distance:13.3, duree:"50 min", vehicules:4,  date:"15 avr. 2024", activite:"Il y a 6j"    },
  { id:6,  code:"L-106", nom:"Ankatso – Ambohidratrimo",    depart:"Ankatso",        arrivee:"Ambohidratrimo", coop:"Ankatso",         statut:"active",    tarif:650,  distance:16.1, duree:"60 min", vehicules:7,  date:"02 mai 2024",  activite:"Il y a 4h"    },
  { id:7,  code:"L-107", nom:"Ambohidratrimo – Analakely",  depart:"Ambohidratrimo", arrivee:"Analakely",      coop:"Ambohidratrimo",  statut:"active",    tarif:600,  distance:14.5, duree:"55 min", vehicules:9,  date:"19 fév. 2024", activite:"Il y a 20min" },
  { id:8,  code:"L-108", nom:"Tana-Est – Analakely",        depart:"Tana-Est",       arrivee:"Analakely",      coop:"Tana-Est",        statut:"inactive",  tarif:550,  distance:13.3, duree:"50 min", vehicules:0,  date:"30 mar. 2024", activite:"Il y a 12j"   },
  { id:9,  code:"L-109", nom:"Ankatso – Tana-Est",          depart:"Ankatso",        arrivee:"Tana-Est",       coop:"Ankatso",         statut:"active",    tarif:700,  distance:18.4, duree:"70 min", vehicules:11, date:"05 jan. 2024", activite:"Il y a 1h"    },
  { id:10, code:"L-110", nom:"Analakely – Ankatso",         depart:"Analakely",      arrivee:"Ankatso",        coop:"Analakely",       statut:"active",    tarif:400,  distance:8.2,  duree:"35 min", vehicules:13, date:"11 juin 2024", activite:"Il y a 3h"    },
  { id:11, code:"L-111", nom:"Ambohidratrimo – Tana-Ville", depart:"Ambohidratrimo", arrivee:"Tana-Ville",     coop:"Ambohidratrimo",  statut:"active",    tarif:500,  distance:10.8, duree:"42 min", vehicules:5,  date:"22 avr. 2024", activite:"Il y a 2j"    },
  { id:12, code:"L-112", nom:"Tana-Est – Tana-Ville",       depart:"Tana-Est",       arrivee:"Tana-Ville",     coop:"Tana-Est",        statut:"suspendue", tarif:300,  distance:6.5,  duree:"28 min", vehicules:2,  date:"17 mar. 2024", activite:"Il y a 20j"   },
  { id:13, code:"L-113", nom:"Tana-Ville – Ankatso",        depart:"Tana-Ville",     arrivee:"Ankatso",        coop:"Ankatso",         statut:"active",    tarif:350,  distance:7.0,  duree:"30 min", vehicules:8,  date:"09 mai 2024",  activite:"Il y a 5h"    },
  { id:14, code:"L-114", nom:"Tana-Ville – Analakely",      depart:"Tana-Ville",     arrivee:"Analakely",      coop:"Analakely",       statut:"active",    tarif:300,  distance:6.0,  duree:"25 min", vehicules:15, date:"01 jan. 2024", activite:"Il y a 10min" },
  { id:15, code:"L-115", nom:"Tana-Ville – Ambohidratrimo", depart:"Tana-Ville",     arrivee:"Ambohidratrimo", coop:"Ambohidratrimo",  statut:"active",    tarif:500,  distance:10.8, duree:"42 min", vehicules:6,  date:"14 fév. 2024", activite:"Il y a 45min" },
  { id:16, code:"L-116", nom:"Tana-Est – Ambohidratrimo",   depart:"Tana-Est",       arrivee:"Ambohidratrimo", coop:"Tana-Est",        statut:"inactive",  tarif:620,  distance:15.2, duree:"58 min", vehicules:0,  date:"28 avr. 2024", activite:"Il y a 8j"    },
];

const COOPS = ["Toutes", "Ankatso", "Analakely", "Ambohidratrimo", "Tana-Est"];

const COOP_THEME = {
  Ankatso:        { accent:"#7c3aed", light:"#f5f3ff", mid:"#ede9fe", dark:"#5b21b6" },
  Analakely:      { accent:"#ea580c", light:"#fff7ed", mid:"#fed7aa", dark:"#c2410c" },
  Ambohidratrimo: { accent:"#2563eb", light:"#eff6ff", mid:"#bfdbfe", dark:"#1d4ed8" },
  "Tana-Est":     { accent:"#059669", light:"#ecfdf5", mid:"#a7f3d0", dark:"#047857" },
};

const STATUT_CONFIG = {
  active:    { label:"Active",    bg:"#ecfdf5", text:"#059669", border:"#6ee7b7", icon:CheckCircle2 },
  inactive:  { label:"Inactive",  bg:"#f9fafb", text:"#6b7280", border:"#e5e7eb", icon:PauseCircle  },
  suspendue: { label:"Suspendue", bg:"#fef2f2", text:"#dc2626", border:"#fca5a5", icon:AlertCircle  },
};

// ── MODAL SUPPRESSION ──
function ModalSupprimer({ ligne, onConfirm, onCancel, isSmallMobile }) {
  if (!ligne) return null;
  const th = COOP_THEME[ligne.coop] ?? COOP_THEME["Ankatso"];
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        onClick={onCancel}
        style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.35)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center" }}
      >
        <motion.div
          initial={{ scale:0.94, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }}
          exit={{ scale:0.94, opacity:0, y:20 }}
          transition={{ type:"spring", stiffness:340, damping:28 }}
          onClick={e => e.stopPropagation()}
          style={{ background:"#fff", borderRadius:20, padding: isSmallMobile ? "1.25rem" : "2rem", width:isSmallMobile ? `min(95vw, 320px)` : `min(92vw, 440px)`, boxShadow:"0 32px 80px rgba(0,0,0,0.18)", fontFamily:"'DM Sans','Segoe UI',sans-serif", display:"flex", flexDirection:"column", gap:18 }}
        >
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:38, height:38, borderRadius:11, background:"#fef2f2", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Trash2 size={17} color="#dc2626" />
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:"#111", lineHeight:1 }}>Supprimer la ligne</div>
                <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>Action irréversible</div>
              </div>
            </div>
            <button onClick={onCancel} style={{ width:30, height:30, borderRadius:8, border:"1px solid #e5e7eb", background:"#f9fafb", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#9ca3af" }}>
              <X size={14} />
            </button>
          </div>

          <div style={{ background:th.light, border:`1.5px solid ${th.mid}`, borderRadius:12, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:11, background:th.mid, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:th.accent, flexShrink:0 }}>
              {ligne.code.replace("L-","")}
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"#111" }}>{ligne.code}</div>
              <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>{ligne.depart} → {ligne.arrivee}</div>
            </div>
          </div>

          <p style={{ fontSize:13, color:"#6b7280", margin:0, lineHeight:1.7 }}>
            La ligne <strong style={{ color:"#111" }}>{ligne.code}</strong> et toutes ses données associées seront définitivement supprimées de la plateforme.
          </p>

          <div style={{ display:"flex", gap:10 }}>
            <button onClick={onCancel} style={{ flex:1, padding:"11px", fontSize:13, fontWeight:600, borderRadius:10, border:"1.5px solid #e5e7eb", background:"#fff", color:"#374151", cursor:"pointer", fontFamily:"inherit" }}>
              Annuler
            </button>
            <button onClick={onConfirm} style={{ flex:1, padding:"11px", fontSize:13, fontWeight:600, borderRadius:10, border:"none", background:"#dc2626", color:"#fff", cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <Trash2 size={13} /> Supprimer définitivement
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── MODAL MODIFIER ──
function ModalModifier({ ligne, onSave, onCancel, isMobile, isSmallMobile }) {
  const [form, setForm] = useState(ligne ? { ...ligne } : null);
  useEffect(() => { if (ligne) setForm({ ...ligne }); }, [ligne]);
  if (!ligne || !form) return null;
  const th = COOP_THEME[form.coop] ?? COOP_THEME["Ankatso"];

  const Field = ({ label, children }) => (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      <label style={{ fontSize:11, fontWeight:600, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>
      {children}
    </div>
  );

  const inputCss = { padding:"9px 12px", fontSize:13, borderRadius:9, border:"1.5px solid #e5e7eb", background:"#fafafa", color:"#111", outline:"none", fontFamily:"inherit", width:"100%", boxSizing:"border-box", transition:"border-color 0.15s, background 0.15s" };
  const focusIn  = e => { e.target.style.borderColor = th.accent; e.target.style.background = "#fff"; };
  const focusOut = e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        onClick={onCancel}
        style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.35)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center" }}
      >
        <motion.div
          initial={{ scale:0.94, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }}
          exit={{ scale:0.94, opacity:0, y:20 }}
          transition={{ type:"spring", stiffness:340, damping:28 }}
          onClick={e => e.stopPropagation()}
          style={{ background:"#fff", borderRadius:20, padding:"2rem", width:"min(92vw, 540px)", maxHeight:"92vh", overflowY:"auto", boxShadow:"0 32px 80px rgba(0,0,0,0.18)", fontFamily:"'DM Sans','Segoe UI',sans-serif", display:"flex", flexDirection:"column", gap:16 }}
        >
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:38, height:38, borderRadius:11, background:th.light, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Edit2 size={16} color={th.accent} />
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:"#111", lineHeight:1 }}>Modifier la ligne</div>
                <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{form.code}</div>
              </div>
            </div>
            <button onClick={onCancel} style={{ width:30, height:30, borderRadius:8, border:"1px solid #e5e7eb", background:"#f9fafb", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#9ca3af" }}>
              <X size={14} />
            </button>
          </div>

          <div style={{ background:th.light, border:`1.5px solid ${th.mid}`, borderRadius:12, padding:"10px 14px", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:th.mid, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:th.accent, flexShrink:0 }}>
              {form.code.replace("L-","")}
            </div>
            <div style={{ fontSize:12, color:th.dark, fontWeight:600 }}>{form.coop} — {form.nom}</div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns: isSmallMobile ? "1fr" : isMobile ? "1fr" : "1fr 1fr", gap:12 }}>
            <Field label="Code">
              <input style={inputCss} value={form.code} onFocus={focusIn} onBlur={focusOut} onChange={e=>setForm({...form,code:e.target.value})} />
            </Field>
            <Field label="Nom de la ligne">
              <input style={inputCss} value={form.nom} onFocus={focusIn} onBlur={focusOut} onChange={e=>setForm({...form,nom:e.target.value})} />
            </Field>
          </div>

          <div style={{ display:"grid", gridTemplateColumns: isSmallMobile ? "1fr" : isMobile ? "1fr" : "1fr 1fr", gap:12 }}>
            <Field label="Point de départ">
              <input style={inputCss} value={form.depart} onFocus={focusIn} onBlur={focusOut} onChange={e=>setForm({...form,depart:e.target.value})} />
            </Field>
            <Field label="Point d'arrivée">
              <input style={inputCss} value={form.arrivee} onFocus={focusIn} onBlur={focusOut} onChange={e=>setForm({...form,arrivee:e.target.value})} />
            </Field>
          </div>

          <div style={{ display:"grid", gridTemplateColumns: isSmallMobile ? "repeat(2,1fr)" : isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)", gap:12 }}>
            <Field label="Tarif (Ar)">
              <input style={inputCss} type="number" value={form.tarif} onFocus={focusIn} onBlur={focusOut} onChange={e=>setForm({...form,tarif:Number(e.target.value)})} />
            </Field>
            <Field label="Distance (km)">
              <input style={inputCss} type="number" step="0.1" value={form.distance} onFocus={focusIn} onBlur={focusOut} onChange={e=>setForm({...form,distance:parseFloat(e.target.value)})} />
            </Field>
            <Field label="Durée">
              <input style={inputCss} value={form.duree} onFocus={focusIn} onBlur={focusOut} onChange={e=>setForm({...form,duree:e.target.value})} />
            </Field>
          </div>

          <div style={{ display:"grid", gridTemplateColumns: isSmallMobile ? "repeat(2,1fr)" : isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)", gap:12 }}>
            <Field label="Coopérative">
              <select style={inputCss} value={form.coop} onChange={e=>setForm({...form,coop:e.target.value})}>
                {["Ankatso","Analakely","Ambohidratrimo","Tana-Est"].map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Statut">
              <select style={inputCss} value={form.statut} onChange={e=>setForm({...form,statut:e.target.value})}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspendue">Suspendue</option>
              </select>
            </Field>
            <Field label="Véhicules">
              <input style={inputCss} type="number" value={form.vehicules} onFocus={focusIn} onBlur={focusOut} onChange={e=>setForm({...form,vehicules:Number(e.target.value)})} />
            </Field>
          </div>

          <div style={{ display:"flex", gap:10, paddingTop:4 }}>
            <button onClick={onCancel} style={{ flex:1, padding:"11px", fontSize:13, fontWeight:600, borderRadius:10, border:"1.5px solid #e5e7eb", background:"#fff", color:"#374151", cursor:"pointer", fontFamily:"inherit" }}>
              Annuler
            </button>
            <button onClick={()=>onSave(form)} style={{ flex:1, padding:"11px", fontSize:13, fontWeight:600, borderRadius:10, border:"none", background:th.accent, color:"#fff", cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <Check size={13} /> Enregistrer les modifications
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ────────────────────────────────────────────────
// ── CARTE LIGNE — version grille (desktop/tablette) ──
// ────────────────────────────────────────────────
function CarteLGrid({ ligne, onEdit, onDelete, onClick, isSelected, index }) {
  const th = COOP_THEME[ligne.coop] ?? COOP_THEME["Ankatso"];
  const sc = STATUT_CONFIG[ligne.statut] ?? STATUT_CONFIG["inactive"];
  const StatusIcon = sc.icon;
  const noVehicles = ligne.vehicules === 0;

  return (
    <motion.div
      layout
      initial={{ opacity:0, y:16 }}
      animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, scale:0.95 }}
      transition={{ type:"spring", stiffness:320, damping:28, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y:-4, transition:{ type:"spring", stiffness:400, damping:22 } }}
      onClick={onClick}
      style={{
        background:"#fff",
        border: isSelected ? `2px solid ${th.accent}` : "1.5px solid #eef0f3",
        borderRadius:18,
        padding:"1.1rem 1.15rem 1rem",
        cursor:"pointer",
        position:"relative",
        overflow:"hidden",
        boxShadow: isSelected
          ? `0 0 0 4px ${th.light}, 0 10px 30px rgba(0,0,0,0.10)`
          : "0 2px 10px rgba(0,0,0,0.045)",
        transition:"box-shadow 0.22s ease, border-color 0.22s ease",
      }}
    >
      {/* Accent bar gauche */}
      <div style={{
        position:"absolute", top:0, left:0, width:4, bottom:0,
        background: `linear-gradient(180deg, ${th.accent} 0%, ${th.dark} 100%)`,
        borderRadius:"18px 0 0 18px",
      }} />

      {/* Fond décoratif coin */}
      <div style={{
        position:"absolute", top:-30, right:-30, width:90, height:90,
        background: th.light, borderRadius:"50%", opacity:0.7, pointerEvents:"none",
      }} />

      <div style={{ paddingLeft:12 }}>
        {/* ─ Header ─ */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:11 }}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{
              width:42, height:42, borderRadius:12,
              background: `linear-gradient(135deg, ${th.mid} 0%, ${th.light} 100%)`,
              border:`1.5px solid ${th.mid}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:11, fontWeight:800, color:th.accent, letterSpacing:"-0.5px", flexShrink:0,
            }}>
              {ligne.code.replace("L-","")}
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"#111", lineHeight:1.25 }}>{ligne.code}</div>
              <div style={{ fontSize:11, color: th.accent, marginTop:2, fontWeight:600, opacity:0.75 }}>{ligne.coop}</div>
            </div>
          </div>

          {/* Statut + boutons */}
          <div style={{ display:"flex", alignItems:"center", gap:5, flexShrink:0 }}>
            <span style={{
              display:"inline-flex", alignItems:"center", gap:3,
              fontSize:10, fontWeight:600, padding:"3px 8px",
              borderRadius:99, background:sc.bg, color:sc.text,
              border:`1px solid ${sc.border}`,
            }}>
              <StatusIcon size={9} /> {sc.label}
            </span>
            <ActionBtn icon={Edit2} color="#2563eb" hoverBg="#eff6ff" hoverBorder="#bfdbfe" onClick={e=>{ e.stopPropagation(); onEdit(ligne); }} title="Modifier" />
            <ActionBtn icon={Trash2} color="#dc2626" hoverBg="#fef2f2" hoverBorder="#fca5a5" onClick={e=>{ e.stopPropagation(); onDelete(ligne); }} title="Supprimer" />
          </div>
        </div>

        {/* ─ Trajet ─ */}
        <div style={{
          display:"flex", alignItems:"center", gap:6, marginBottom:11,
          padding:"8px 10px", background:"#f8f9fc", borderRadius:10,
          border:"1px solid #eef0f3", minWidth:0,
        }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:th.accent, flexShrink:0 }} />
          <span style={{ fontSize:12, fontWeight:600, color:"#374151", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1, minWidth:0 }}>{ligne.depart}</span>
          <ArrowRight size={11} style={{ color:"#d1d5db", flexShrink:0 }} />
          <span style={{ fontSize:12, fontWeight:600, color:"#374151", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1, minWidth:0, textAlign:"right" }}>{ligne.arrivee}</span>
          <div style={{ width:7, height:7, borderRadius:2, background:th.accent, opacity:0.3, flexShrink:0 }} />
        </div>

        {/* ─ Stats 3 colonnes ─ */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginBottom:11 }}>
          <StatCell icon={Route} value={`${ligne.distance}`} unit="km" label="Distance" accent={th.accent} warn={false} />
          <StatCell icon={Clock}  value={ligne.duree}         unit=""   label="Durée"    accent={th.accent} warn={false} />
          <StatCell icon={Bus}    value={`${ligne.vehicules}`} unit=""  label="Véhicules" accent={th.accent} warn={noVehicles} />
        </div>

        {/* ─ Footer tarif + activité ─ */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          paddingTop:10, borderTop:"1px solid #f3f4f6",
        }}>
          <div style={{ display:"flex", alignItems:"baseline", gap:3 }}>
            <span style={{ fontSize:15, fontWeight:800, color:th.accent, letterSpacing:"-0.5px" }}>
              {ligne.tarif.toLocaleString("fr-FR")}
            </span>
            <span style={{ fontSize:10, fontWeight:700, color:th.accent, opacity:0.65 }}>Ar</span>
          </div>
          <span style={{ fontSize:10, color:"#c4cdd6", fontWeight:500 }}>{ligne.activite}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─ Cellule stat réutilisable ─
function StatCell({ icon:Icon, value, unit, label, accent, warn }) {
  return (
    <div style={{
      textAlign:"center", padding:"8px 4px",
      background: warn ? "#fef2f2" : "#f8f9fc",
      borderRadius:9,
      border: warn ? "1px solid #fca5a5" : "1px solid #eef0f3",
    }}>
      <Icon size={12} style={{ color: warn ? "#dc2626" : "#b0b8c4", display:"block", margin:"0 auto 4px" }} />
      <div style={{ fontSize:12, fontWeight:700, color: warn ? "#dc2626" : "#111", lineHeight:1 }}>
        {value}<span style={{ fontSize:9, fontWeight:600, marginLeft:1 }}>{unit}</span>
      </div>
      <div style={{ fontSize:10, color:"#b0b8c4", marginTop:2, fontWeight:500 }}>{label}</div>
    </div>
  );
}

// ─ Bouton action icône ─
function ActionBtn({ icon:Icon, color, hoverBg, hoverBorder, onClick, title }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        width:28, height:28, borderRadius:7, cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
        border: hov ? `1px solid ${hoverBorder}` : "1px solid #eef0f3",
        background: hov ? hoverBg : "#f8f9fc",
        color: hov ? color : "#b0b8c4",
        transition:"all 0.15s ease",
        flexShrink:0,
      }}
    >
      <Icon size={11} />
    </button>
  );
}

// ────────────────────────────────────────────────
// ── CARTE LIGNE — version liste mobile (AMÉLIORÉE) ──
// ────────────────────────────────────────────────
function CarteLMobile({ ligne, onEdit, onDelete, onClick, isSelected, index }) {
  const th = COOP_THEME[ligne.coop] ?? COOP_THEME["Ankatso"];
  const sc = STATUT_CONFIG[ligne.statut] ?? STATUT_CONFIG["inactive"];
  const StatusIcon = sc.icon;
  const noVehicles = ligne.vehicules === 0;

  return (
    <motion.div
      layout
      initial={{ opacity:0, y:10 }}
      animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, x:-8, scale:0.98 }}
      transition={{ type:"spring", stiffness:340, damping:28, delay: Math.min(index * 0.03, 0.25) }}
      onClick={onClick}
      style={{
        background:"#fff",
        border: isSelected ? `2px solid ${th.accent}` : "1.5px solid #eef0f3",
        borderRadius:14,
        cursor:"pointer",
        position:"relative",
        overflow:"hidden",
        boxShadow: isSelected
          ? `0 0 0 3px ${th.light}, 0 4px 16px rgba(0,0,0,0.08)`
          : "0 1px 5px rgba(0,0,0,0.055)",
        transition:"box-shadow 0.2s ease, border-color 0.2s ease",
      }}
    >
      {/* Accent bar gauche */}
      <div style={{
        position:"absolute", top:0, left:0, width:4, bottom:0,
        background: `linear-gradient(180deg, ${th.accent} 0%, ${th.dark} 100%)`,
      }} />

      <div style={{ paddingLeft:14, paddingRight:12, paddingTop:11, paddingBottom:11 }}>

        {/* ── LIGNE 1 : badge + trajet + statut ── */}
        <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:8 }}>

          {/* Badge code */}
          <div style={{
            width:38, height:38, borderRadius:10, flexShrink:0,
            background: `linear-gradient(135deg, ${th.mid} 0%, ${th.light} 100%)`,
            border:`1.5px solid ${th.mid}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:10, fontWeight:800, color:th.accent, letterSpacing:"-0.5px",
          }}>
            {ligne.code.replace("L-","")}
          </div>

          {/* Trajet + sous-ligne */}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{
              fontSize:13, fontWeight:700, color:"#111", lineHeight:1.3,
              display:"flex", alignItems:"center", gap:5, flexWrap:"nowrap",
            }}>
              <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"42%" }}>
                {ligne.depart}
              </span>
              <ArrowRight size={10} style={{ color:"#d1d5db", flexShrink:0 }} />
              <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"42%" }}>
                {ligne.arrivee}
              </span>
            </div>
            <div style={{ fontSize:11, color: th.accent, marginTop:2, fontWeight:600, opacity:0.75 }}>
              {ligne.code} · {ligne.coop}
            </div>
          </div>

          {/* Statut pill */}
          <span style={{
            display:"inline-flex", alignItems:"center", gap:3,
            fontSize:9, fontWeight:700, padding:"3px 7px",
            borderRadius:99, background:sc.bg, color:sc.text,
            border:`1px solid ${sc.border}`, flexShrink:0, whiteSpace:"nowrap",
          }}>
            <StatusIcon size={8} /> {sc.label}
          </span>
        </div>

        {/* ── LIGNE 2 : stats + tarif + actions ── */}
        <div style={{
          display:"flex", alignItems:"center",
          justifyContent:"space-between", gap:8,
          paddingTop:8, borderTop:"1px solid #f3f4f6",
        }}>

          {/* Stats inline */}
          <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"nowrap", minWidth:0 }}>
            <MiniStat icon={Route} value={`${ligne.distance} km`} warn={false} />
            <MiniStat icon={Clock}  value={ligne.duree}             warn={false} />
            <MiniStat icon={Bus}    value={`${ligne.vehicules}`}    warn={noVehicles} />
          </div>

          {/* Tarif + boutons */}
          <div style={{ display:"flex", alignItems:"center", gap:7, flexShrink:0 }}>
            {/* Tarif */}
            <div style={{ display:"flex", alignItems:"baseline", gap:2 }}>
              <span style={{ fontSize:14, fontWeight:800, color:th.accent, letterSpacing:"-0.5px" }}>
                {ligne.tarif.toLocaleString("fr-FR")}
              </span>
              <span style={{ fontSize:9, fontWeight:700, color:th.accent, opacity:0.65 }}>Ar</span>
            </div>

            {/* Bouton Modifier */}
            <TouchBtn
              icon={Edit2}
              color="#2563eb"
              bg="#eff6ff"
              border="#bfdbfe"
              onClick={e=>{ e.stopPropagation(); onEdit(ligne); }}
              title="Modifier"
            />
            {/* Bouton Supprimer */}
            <TouchBtn
              icon={Trash2}
              color="#dc2626"
              bg="#fef2f2"
              border="#fca5a5"
              onClick={e=>{ e.stopPropagation(); onDelete(ligne); }}
              title="Supprimer"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─ Stat inline mobile ─
function MiniStat({ icon:Icon, value, warn }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:4, flexShrink:0 }}>
      <div style={{
        width:22, height:22, borderRadius:6,
        background: warn ? "#fef2f2" : "#f3f4f6",
        border: warn ? "1px solid #fca5a5" : "1px solid #eef0f3",
        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
      }}>
        <Icon size={11} style={{ color: warn ? "#dc2626" : "#9ca3af" }} />
      </div>
      <span style={{ fontSize:11, fontWeight:600, color: warn ? "#dc2626" : "#374151", whiteSpace:"nowrap" }}>
        {value}
      </span>
    </div>
  );
}

// ─ Bouton tactile mobile (taille touchable 32px) ─
function TouchBtn({ icon:Icon, color, bg, border, onClick, title }) {
  const [pressed, setPressed] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      title={title}
      onTouchStart={()=>setPressed(true)}
      onTouchEnd={()=>setPressed(false)}
      onMouseEnter={()=>setPressed(true)}
      onMouseLeave={()=>setPressed(false)}
      whileTap={{ scale:0.9 }}
      style={{
        width:32, height:32, borderRadius:9, cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
        border: `1px solid ${pressed ? border : "#eef0f3"}`,
        background: pressed ? bg : "#f8f9fc",
        color: pressed ? color : "#b0b8c4",
        transition:"all 0.15s ease",
        flexShrink:0,
      }}
    >
      <Icon size={13} />
    </motion.button>
  );
}

// ────────────────────────────────────────────────
// ── PAGE PRINCIPALE ──
// ────────────────────────────────────────────────
export default function PageLignes() {
  const [lignes, setLignes]               = useState(INITIAL_LIGNES);
  const [loading, setLoading]             = useState(true);
  const [activeCoop, setActiveCoop]       = useState("Toutes");
  const [activeStatut, setActiveStatut]   = useState("tous");
  const [search, setSearch]               = useState("");
  const [selected, setSelected]           = useState(null);
  const [toDelete, setToDelete]           = useState(null);
  const [toEdit, setToEdit]               = useState(null);
  const [sortBy, setSortBy]               = useState("code");
  const [isMobile, setIsMobile]           = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  const API_URL = "http://localhost:5000/api/lignes";

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(API_URL, { signal:ctrl.signal })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => {
        if (Array.isArray(d) && d.length) {
          const normalized = d.map(item => ({
            id:item.id,
            code:item.code||item.ref||"N/A",
            nom:item.nom||item.name||"Sans titre",
            ref:item.ref||item.code,
            name:item.name||item.nom,
            depart:item.depart||"Départ",
            arrivee:item.arrivee||"Arrivée",
            coop:item.coop||"Autre",
            statut:item.statut||"inactive",
            tarif:Number(item.tarif)||0,
            distance:Number(item.distance)||0,
            duree:item.duree||"N/A",
            vehicules:Number(item.vehicules)||0,
            date:item.date||new Date().toLocaleDateString('fr-FR'),
            activite:item.activite||"Jamais",
            ...item
          }));
          setLignes(normalized);
        } else {
          setLignes(INITIAL_LIGNES);
        }
        setLoading(false);
      })
      .catch(e => { if (e.name !== "AbortError") { setLignes(INITIAL_LIGNES); setLoading(false); } });
    return () => ctrl.abort();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 960);
      setIsSmallMobile(window.innerWidth <= 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDeleteConfirm = async () => {
    try { await fetch(`${API_URL}/${toDelete.id}`, { method:"DELETE" }); } catch {}
    setLignes(p => p.filter(l => l.id !== toDelete.id));
    if (selected?.id === toDelete.id) setSelected(null);
    setToDelete(null);
  };

  const handleEditSave = async (updated) => {
    try {
      await fetch(`${API_URL}/${updated.id}`, {
        method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(updated),
      });
    } catch {}
    setLignes(p => p.map(l => l.id === updated.id ? updated : l));
    if (selected?.id === updated.id) setSelected(updated);
    setToEdit(null);
  };

  const filtered = lignes.filter(l => {
    if (activeCoop !== "Toutes" && l.coop !== activeCoop) return false;
    if (activeStatut !== "tous" && l.statut !== activeStatut) return false;
    if (search) {
      const q = search.toLowerCase();
      return `${l.code} ${l.nom} ${l.depart} ${l.arrivee} ${l.coop}`.toLowerCase().includes(q);
    }
    return true;
  }).sort((a,b) => {
    if (sortBy === "tarif")     return (Number(b.tarif)||0) - (Number(a.tarif)||0);
    if (sortBy === "distance")  return (Number(b.distance)||0) - (Number(a.distance)||0);
    if (sortBy === "vehicules") return (Number(b.vehicules)||0) - (Number(a.vehicules)||0);
    return String(a.code||"").trim().localeCompare(String(b.code||"").trim(), 'fr');
  });

  const stats = {
    total:      lignes.length,
    actives:    lignes.filter(l => l.statut === "active").length,
    suspendues: lignes.filter(l => l.statut === "suspendue").length,
    vehicules:  lignes.reduce((s,l) => s + l.vehicules, 0),
    distMoy:    lignes.length ? (lignes.reduce((s,l) => s + l.distance, 0) / lignes.length).toFixed(1) : 0,
    tarifMoy:   lignes.length ? Math.round(lignes.reduce((s,l) => s + l.tarif, 0) / lignes.length) : 0,
  };

  const hasFilters = search || activeCoop !== "Toutes" || activeStatut !== "tous";

  const toggleSelected = useCallback((l) => {
    setSelected(prev => prev?.id === l.id ? null : l);
  }, []);

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#f5f6fa", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
        <div style={{ width:44, height:44, borderRadius:13, background:"#ede9fe", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Bus size={22} color="#7c3aed" />
        </div>
        <div style={{ fontSize:13, color:"#a0aec0", fontWeight:500 }}>Chargement des lignes…</div>
      </div>
    </div>
  );

  return (
    <>
      {toDelete && <ModalSupprimer ligne={toDelete} onConfirm={handleDeleteConfirm} onCancel={()=>setToDelete(null)} isSmallMobile={isSmallMobile} />}
      {toEdit   && <ModalModifier  ligne={toEdit}   onSave={handleEditSave}        onCancel={()=>setToEdit(null)}   isMobile={isMobile} isSmallMobile={isSmallMobile} />}

      <div style={{ minHeight:"100vh", background:"#f5f6fa", fontFamily:"'DM Sans','Segoe UI',sans-serif", display:"flex", flexDirection:"column" }}>

        {/* ══ BARRE DE CONTRÔLE PRINCIPALE ══ */}
        <div style={{
          background:"#fff", borderBottom:"1px solid #eef0f3",
          boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
          padding:isSmallMobile ? "0 1rem" : "0 1.5rem", flexShrink:0,
        }}>
          {/* Ligne 1 : Titre + Actions */}
          <div style={{ display:"flex", alignItems:"center", gap:14, height: isMobile ? "auto" : 60, borderBottom:"1px solid #f3f4f6", flexWrap: isMobile ? "wrap" : "nowrap", justifyContent: isMobile ? "space-between" : "flex-start", paddingTop: isMobile ? 12 : 0, paddingBottom: isMobile ? 10 : 0 }}>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize: isSmallMobile ? 14 : 16, fontWeight:800, color:"#111", letterSpacing:"-0.3px", lineHeight:1 }}>Lignes de transport</div>
              <div style={{ fontSize:11, color:"#a0aec0", marginTop:2, fontWeight:500 }}>
                {stats.total} lignes · {stats.actives} actives · {stats.vehicules} véhicules
              </div>
            </div>

            {/* Search */}
            <div style={{ flex:1, minWidth:0, maxWidth: isMobile ? "100%" : 400, position:"relative", marginLeft: isSmallMobile ? 0 : 8, width: isSmallMobile ? "100%" : "auto" }}>
              <Search size={14} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#c4cdd6" }} />
              <input
                value={search}
                onChange={e=>setSearch(e.target.value)}
                placeholder={isSmallMobile ? "Chercher une ligne…" : "Rechercher une ligne, un trajet, une coopérative…"}
                style={{ width:"100%", paddingLeft:34, paddingRight:search?34:12, paddingTop:9, paddingBottom:9, fontSize: isSmallMobile ? 12 : 13, borderRadius:10, border:"1.5px solid #eef0f3", background:"#f8f9fc", color:"#111", outline:"none", fontFamily:"inherit", boxSizing:"border-box", transition:"border-color 0.15s, background 0.15s" }}
                onFocus={e=>{ e.target.style.borderColor="#7c3aed"; e.target.style.background="#fff"; }}
                onBlur={e=>{ e.target.style.borderColor="#eef0f3"; e.target.style.background="#f8f9fc"; }}
              />
              {search && (
                <button onClick={()=>setSearch("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#b0b8c4", display:"flex" }}>
                  <X size={13} />
                </button>
              )}
            </div>

            <div style={{ display:"flex", gap:8, marginLeft: isMobile ? 0 : "auto", alignItems:"center", flexWrap:"nowrap", width: isSmallMobile ? "100%" : "auto", marginTop: isSmallMobile ? 4 : isMobile ? 8 : 0, marginBottom: isSmallMobile ? 4 : 0, justifyContent: isSmallMobile ? "space-between" : isMobile ? "flex-start" : "flex-end" }}>
              {/* Sort */}
              <div style={{ position:"relative", flex: isSmallMobile ? 1 : "0 auto", minWidth: isSmallMobile ? 0 : 160 }}>
                <select
                  value={sortBy}
                  onChange={e=>setSortBy(e.target.value)}
                  style={{ padding:"8px 28px 8px 10px", fontSize:12, fontWeight:600, borderRadius:9, border:"1.5px solid #eef0f3", background:"#fff", color:"#374151", cursor:"pointer", fontFamily:"inherit", outline:"none", appearance:"none", width:"100%" }}
                >
                  <option value="code">Trier : Code</option>
                  <option value="tarif">Trier : Tarif</option>
                  <option value="distance">Trier : Distance</option>
                  <option value="vehicules">Trier : Véhicules</option>
                </select>
                <ChevronDown size={12} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", color:"#b0b8c4", pointerEvents:"none" }} />
              </div>

              {/* Reset */}
              {hasFilters && (
                <motion.button
                  initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                  onClick={()=>{ setSearch(""); setActiveCoop("Toutes"); setActiveStatut("tous"); }}
                  style={{ display:"flex", alignItems:"center", gap:5, padding:"8px 12px", fontSize:12, fontWeight:600, borderRadius:9, border:"1.5px solid #eef0f3", background:"#fff", color:"#6b7280", cursor:"pointer", fontFamily:"inherit", flexShrink:0 }}
                >
                  <RotateCcw size={12} /> {isSmallMobile ? "" : "Réinitialiser"}
                </motion.button>
              )}

            </div>
          </div>

          {/* Ligne 2 : Filtres coops + statuts */}
          <div style={{ display:"flex", alignItems:"center", gap:isSmallMobile ? 8 : 16, minHeight:48, flexWrap: isSmallMobile ? "wrap" : "nowrap", justifyContent: "space-between", paddingTop: isSmallMobile ? 8 : 0, paddingBottom: isSmallMobile ? 8 : 0 }}>
            {/* Coopératives pills */}
            <div style={{ display:"flex", alignItems:"center", gap: isSmallMobile ? 4 : 4, overflowX:"auto", paddingBottom: isSmallMobile ? 4 : 0, flexShrink:0, maxWidth: isSmallMobile ? "100%" : "none", width: isSmallMobile ? "100%" : "auto" }}>
              <span style={{ fontSize: isSmallMobile ? 9 : 11, fontWeight:600, color:"#c4cdd6", textTransform:"uppercase", letterSpacing:"0.06em", marginRight:4, flexShrink:0 }}>Coop.</span>
              {COOPS.map(coop => {
                const th = COOP_THEME[coop];
                const isActive = activeCoop === coop;
                const count = coop === "Toutes" ? lignes.length : lignes.filter(l=>l.coop===coop).length;
                return (
                  <button
                    key={coop}
                    onClick={()=>setActiveCoop(coop)}
                    style={{
                      display:"flex", alignItems:"center", gap: isSmallMobile ? 2 : 5,
                      padding: isSmallMobile ? "4px 9px" : "4px 10px", borderRadius:99, cursor:"pointer",
                      border: isActive ? `1.5px solid ${th ? th.accent : "#7c3aed"}` : "1.5px solid #eef0f3",
                      background: isActive ? (th ? th.light : "#f5f3ff") : "#fff",
                      color: isActive ? (th ? th.accent : "#7c3aed") : "#6b7280",
                      fontSize: isSmallMobile ? 11 : 12, fontWeight:600, fontFamily:"inherit",
                      transition:"all 0.15s", flexShrink:0, whiteSpace:"nowrap",
                    }}
                  >
                    {th && isActive && <div style={{ width:6, height:6, borderRadius:"50%", background:th.accent, flexShrink:0 }} />}
                    {coop}
                    <span style={{ fontSize:10, fontWeight:700, background: isActive ? (th ? th.mid : "#ede9fe") : "#f3f4f6", color: isActive ? (th ? th.dark : "#5b21b6") : "#9ca3af", borderRadius:99, padding:"0px 5px", minWidth:16, textAlign:"center" }}>{count}</span>
                  </button>
                );
              })}
            </div>

            {!isSmallMobile && <div style={{ width:1, height:24, background:"#eef0f3", flexShrink:0 }} />}

            {/* Statuts */}
            <div style={{ display:"flex", alignItems:"center", gap:4, overflowX:"auto", paddingBottom: isSmallMobile ? 4 : 0, flexShrink:0, width: isSmallMobile ? "100%" : "auto" }}>
              <span style={{ fontSize: isSmallMobile ? 9 : 11, fontWeight:600, color:"#c4cdd6", textTransform:"uppercase", letterSpacing:"0.06em", marginRight:4, flexShrink:0 }}>Statut</span>
              {[
                { key:"tous",      label:"Tous",       color:null },
                { key:"active",    label:"Actives",    color:"#059669" },
                { key:"suspendue", label:"Suspendues", color:"#dc2626" },
                { key:"inactive",  label:"Inactives",  color:"#6b7280" },
              ].map(({ key, label, color }) => {
                const isActive = activeStatut === key;
                return (
                  <button
                    key={key}
                    onClick={()=>setActiveStatut(key)}
                    style={{
                      padding: isSmallMobile ? "4px 9px" : "4px 10px", fontSize: isSmallMobile ? 11 : 12, fontWeight:600, borderRadius:99,
                      cursor:"pointer", fontFamily:"inherit",
                      border: isActive ? `1.5px solid ${color || "#7c3aed"}` : "1.5px solid #eef0f3",
                      background: isActive ? (color ? `${color}14` : "#f5f3ff") : "#fff",
                      color: isActive ? (color || "#7c3aed") : "#6b7280",
                      transition:"all 0.15s", flexShrink:0, whiteSpace:"nowrap",
                    }}
                  >{label}</button>
                );
              })}
            </div>

            {/* Résultats count */}
            {!isSmallMobile && (
              <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                <span style={{ fontSize:12, color:"#a0aec0", fontWeight:500 }}>
                  <strong style={{ color:"#374151", fontWeight:700 }}>{filtered.length}</strong> résultat{filtered.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          {/* Résultats count mobile */}
          {isSmallMobile && (
            <div style={{ paddingBottom:8 }}>
              <span style={{ fontSize:11, color:"#a0aec0", fontWeight:500 }}>
                <strong style={{ color:"#374151", fontWeight:700 }}>{filtered.length}</strong> résultat{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* ══ CONTENU PRINCIPAL ══ */}
        <div style={{ display:"flex", flex:1, overflow:"hidden", flexDirection: isMobile ? "column" : "row" }}>

          {/* ── Grille / Liste principale ── */}
          <div style={{ flex:1, overflowY:"auto", padding: isSmallMobile ? "0.875rem" : "1.5rem" }}>

            {/* ── Stat cards ── */}
            <motion.div
              initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
              style={{
                display:"grid",
                gridTemplateColumns: isSmallMobile ? "repeat(2,1fr)" : isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)",
                gap: isSmallMobile ? 8 : 12,
                marginBottom: isSmallMobile ? "0.875rem" : "1.5rem",
              }}
            >
              {[
                { label:"Total lignes",     value:stats.total,      sub:"toutes coopératives", icon:Route,        color:"#7c3aed", bg:"#f5f3ff", border:"#ede9fe" },
                { label:"Lignes actives",   value:stats.actives,    sub:`sur ${stats.total} au total`, icon:CheckCircle2, color:"#059669", bg:"#ecfdf5", border:"#a7f3d0" },
                { label:"Suspendues",       value:stats.suspendues, sub:"nécessitent attention", icon:AlertCircle,  color:"#dc2626", bg:"#fef2f2", border:"#fca5a5" },
                { label:"Véhicules actifs", value:stats.vehicules,  sub:`moy. ${(stats.vehicules/stats.total).toFixed(1)}/ligne`, icon:Bus, color:"#2563eb", bg:"#eff6ff", border:"#bfdbfe" },
              ].map(({ label, value, sub, icon:Icon, color, bg, border }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay: i * 0.07 }}
                  style={{ background:"#fff", border:`1.5px solid ${border}`, borderRadius:16, padding: isSmallMobile ? "10px 12px" : "16px 18px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", position:"relative", overflow:"hidden" }}
                >
                  <div style={{ position:"absolute", top:0, right:0, width:80, height:80, background:bg, borderRadius:"0 16px 0 80px", opacity:0.6 }} />
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom: isSmallMobile ? 8 : 12 }}>
                    <div style={{ width: isSmallMobile ? 32 : 38, height: isSmallMobile ? 32 : 38, borderRadius:10, background:bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Icon size={isSmallMobile ? 15 : 18} style={{ color }} />
                    </div>
                    <TrendingUp size={13} style={{ color:border, marginTop:4 }} />
                  </div>
                  <div style={{ fontSize: isSmallMobile ? 22 : 28, fontWeight:800, color:"#111", lineHeight:1, letterSpacing:"-1px" }}>{value}</div>
                  <div style={{ fontSize: isSmallMobile ? 10 : 11, color:"#9ca3af", marginTop:4, fontWeight:500 }}>{label}</div>
                  {!isSmallMobile && <div style={{ fontSize:10, color:"#c4cdd6", marginTop:2 }}>{sub}</div>}
                </motion.div>
              ))}
            </motion.div>

            {/* ── Cards / Liste ── */}
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                isSmallMobile ? (
                  // ── LISTE MOBILE ──
                  <motion.div layout style={{ display:"flex", flexDirection:"column", gap:9 }}>
                    {filtered.map((l, i) => (
                      <CarteLMobile
                        key={l.id}
                        ligne={l}
                        index={i}
                        isSelected={selected?.id === l.id}
                        onClick={() => toggleSelected(l)}
                        onEdit={setToEdit}
                        onDelete={setToDelete}
                      />
                    ))}
                  </motion.div>
                ) : (
                  // ── GRILLE desktop / tablette ──
                  <motion.div layout style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px,1fr))", gap:14 }}>
                    {filtered.map((l, i) => (
                      <CarteLGrid
                        key={l.id}
                        ligne={l}
                        index={i}
                        isSelected={selected?.id === l.id}
                        onClick={() => toggleSelected(l)}
                        onEdit={setToEdit}
                        onDelete={setToDelete}
                      />
                    ))}
                  </motion.div>
                )
              ) : (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:"center", padding:"5rem 2rem" }}>
                  <div style={{ width:60, height:60, borderRadius:18, background:"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                    <Route size={26} style={{ color:"#d1d5db" }} />
                  </div>
                  <div style={{ fontSize:15, fontWeight:700, color:"#374151", marginBottom:6 }}>Aucune ligne trouvée</div>
                  <div style={{ fontSize:13, color:"#9ca3af" }}>Essayez de modifier vos filtres de recherche</div>
                  {hasFilters && (
                    <button onClick={()=>{ setSearch(""); setActiveCoop("Toutes"); setActiveStatut("tous"); }} style={{ marginTop:16, padding:"9px 18px", fontSize:13, fontWeight:600, borderRadius:10, border:"1.5px solid #e5e7eb", background:"#fff", color:"#374151", cursor:"pointer", fontFamily:"inherit" }}>
                      Réinitialiser les filtres
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ══ PANNEAU DÉTAIL ══ */}
          <AnimatePresence>
            {selected && (() => {
              const th = COOP_THEME[selected.coop] ?? COOP_THEME["Ankatso"];
              const sc = STATUT_CONFIG[selected.statut] ?? STATUT_CONFIG["inactive"];
              return (
                <motion.div
                  initial={{ width:0, opacity:0 }} animate={{ width: isMobile ? "100%" : 310, opacity:1 }}
                  exit={{ width:0, opacity:0 }}
                  transition={{ type:"spring", stiffness:340, damping:30 }}
                  style={{ flexShrink:0, overflow:"hidden", background:"#fff", borderLeft: isMobile ? "none" : "1px solid #eef0f3", borderTop: isMobile ? "1px solid #eef0f3" : "none", boxShadow: isMobile ? "none" : "-4px 0 16px rgba(0,0,0,0.04)" }}
                >
                  <div style={{ width:"100%", height:"100%", overflowY:"auto", padding: isSmallMobile ? "1rem" : "1.5rem 1.25rem", display:"flex", flexDirection:"column", gap:18 }}>
                    {/* Header */}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <span style={{ fontSize: isSmallMobile ? 12 : 13, fontWeight:700, color:"#111" }}>Détails de la ligne</span>
                      <button onClick={()=>setSelected(null)} style={{ width:28, height:28, borderRadius:8, border:"1px solid #eef0f3", background:"#f8f9fc", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#b0b8c4" }}>
                        <X size={13} />
                      </button>
                    </div>

                    {/* Hero */}
                    <div style={{ background:th.light, border:`1.5px solid ${th.mid}`, borderRadius:14, padding: isSmallMobile ? "12px" : "16px", position:"relative", overflow:"hidden" }}>
                      <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80, background:th.mid, borderRadius:"50%", opacity:0.5 }} />
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                        <div style={{ width:46, height:46, borderRadius:13, background:th.mid, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:th.accent, letterSpacing:"-0.5px", flexShrink:0 }}>
                          {selected.code.replace("L-","")}
                        </div>
                        <div>
                          <div style={{ fontSize: isSmallMobile ? 15 : 17, fontWeight:800, color:"#111", letterSpacing:"-0.3px" }}>{selected.code}</div>
                          <div style={{ display:"inline-flex", alignItems:"center", gap:4, marginTop:4, fontSize:10, fontWeight:600, padding:"3px 8px", borderRadius:99, background:sc.bg, color:sc.text, border:`1px solid ${sc.border}` }}>
                            <sc.icon size={9} /> {sc.label}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize:12, color:th.dark, fontWeight:500, opacity:0.8 }}>{selected.coop}</div>
                    </div>

                    {/* Trajet */}
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", color:"#c4cdd6", marginBottom:10 }}>Trajet</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                        {[["Départ", selected.depart, th.accent],["Arrivée", selected.arrivee, th.mid]].map(([k,v,c]) => (
                          <div key={k} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", background:"#f8f9fc", borderRadius:10, border:"1px solid #eef0f3" }}>
                            <div style={{ width:8, height:8, borderRadius:"50%", background:c, flexShrink:0 }} />
                            <span style={{ fontSize:10, color:"#a0aec0", minWidth:42, fontWeight:600 }}>{k}</span>
                            <span style={{ fontSize:12, fontWeight:700, color:"#111" }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats mini */}
                    <div style={{ display:"grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)", gap:8 }}>
                      {[
                        { icon:Route, val:`${selected.distance}`, unit:"km", lbl:"Distance" },
                        { icon:Clock, val:selected.duree,          unit:"",  lbl:"Durée" },
                        { icon:Bus,   val:`${selected.vehicules}`, unit:"",  lbl:"Véhicules" },
                      ].map(({ icon:Icon, val, unit, lbl }) => (
                        <div key={lbl} style={{ textAlign:"center", padding:"10px 6px", background:th.light, border:`1.5px solid ${th.mid}`, borderRadius:10 }}>
                          <Icon size={13} style={{ color:th.accent, display:"block", margin:"0 auto 5px" }} />
                          <div style={{ fontSize:13, fontWeight:800, color:th.accent, lineHeight:1 }}>{val}<span style={{ fontSize:10, fontWeight:600 }}>{unit}</span></div>
                          <div style={{ fontSize:10, color:th.dark, marginTop:3, opacity:0.7 }}>{lbl}</div>
                        </div>
                      ))}
                    </div>

                    {/* Infos détaillées */}
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", color:"#c4cdd6", marginBottom:10 }}>Informations</div>
                      {[
                        ["Tarif",    `${selected.tarif.toLocaleString("fr-FR")} Ar`],
                        ["Statut",   sc.label],
                        ["Créé le",  selected.date],
                        ["Activité", selected.activite],
                      ].map(([k,v]) => (
                        <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid #f8f9fc" }}>
                          <span style={{ fontSize:11, color:"#a0aec0", fontWeight:500 }}>{k}</span>
                          <span style={{ fontSize:11, fontWeight:700, color: k==="Statut" ? sc.text : "#374151" }}>{v}</span>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:"auto" }}>
                      <button onClick={()=>setToEdit(selected)} style={{ width:"100%", padding:"11px", fontSize:13, fontWeight:600, borderRadius:10, border:`1.5px solid ${th.mid}`, background:th.light, color:th.accent, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6, transition:"all 0.15s" }}>
                        <Edit2 size={13} /> Modifier la ligne
                      </button>
                      <button onClick={()=>setToDelete(selected)} style={{ width:"100%", padding:"11px", fontSize:13, fontWeight:600, borderRadius:10, border:"1.5px solid #fca5a5", background:"#fef2f2", color:"#dc2626", cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6, transition:"all 0.15s" }}>
                        <Trash2 size={13} /> Supprimer la ligne
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}