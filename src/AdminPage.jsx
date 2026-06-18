import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard, Newspaper, Globe, Monitor, AlertTriangle,
  Mail, Layers, Plus, Eye, LogOut, Printer, ChevronLeft,
  Clock, RefreshCw, Pencil, Trash2,
} from "lucide-react";
import siteLogo from "../images/logo.jpg";
import {
  fetchActualites,
  adminFetchDemandsDomaine,
  adminFetchDemandesEquipement,
  adminFetchDeclarationsPanne,
  adminFetchContacts,
  adminFetchDemandesEmail,
  adminFetchDemandesPlateforme,
  adminUpdateStatus,
  adminAddActualite,
  adminUpdateActualite,
  adminDeleteActualite,
  uploadArticleImage,
} from "./supabaseClient";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "Adetic@2024";
const ACCENT = "#00C9A7";
const DARK = "#050A19";
const NAVY = "#0d1a3d";
const TEXT = "#0f172a";
const MUTED = "rgba(15,23,42,0.58)";
const BG = "#f0f4f8";
const WHITE = "#ffffff";

const IMAGE_OPTIONS = [
  { key: "igf-reunion.jpg", label: "IGF Réunion" },
  { key: "rencontre-dg-et-smart.jpg", label: "DG & Smart" },
  { key: "fond-humain-de-poignee-de-main-de-robot-ere-numerique-futuriste-2048x1365.jpg", label: "Tech numérique" },
  { key: "pexels-photo-1054397-1.jpeg", label: "Formation IA" },
  { key: "act1.jpg", label: "Activité 1" },
  { key: "act2.jpg", label: "Activité 2" },
  { key: "act3.jpg", label: "Activité 3" },
  { key: "act4.jpg", label: "Activité 4" },
];

const COLORS = [
  { val: "#00C9A7", label: "Teal" },
  { val: "#4F8EF7", label: "Bleu" },
  { val: "#F7B731", label: "Or" },
  { val: "#FC5C65", label: "Rouge" },
  { val: "#A55EEA", label: "Violet" },
  { val: "#20BF6B", label: "Vert" },
];

const ICONS_EMOJI = ["🌐", "🤝", "💻", "🤖", "📡", "🔒", "📊", "🏛️", "⚡", "🌍", "📰", "🔧", "📱", "🗺️"];

function scColor(s) {
  const v = (s || "").toLowerCase();
  if (["en attente", "ouvert", "nouveau"].includes(v)) return "#F7B731";
  if (v === "en cours") return "#4F8EF7";
  if (["traité", "résolu", "répondu", "fermé"].includes(v)) return "#20BF6B";
  if (v === "lu") return ACCENT;
  if (v === "rejeté") return "#FC5C65";
  return "#94a3b8";
}

function StatusBadge({ statut }) {
  const c = scColor(statut);
  return (
    <span style={{
      background: `${c}18`, color: c, border: `1px solid ${c}40`,
      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, whiteSpace: "nowrap",
    }}>{statut || "Nouveau"}</span>
  );
}

function FieldInput({ label, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: TEXT }}>{label}</label>}
      <input style={{
        padding: "10px 14px", borderRadius: 8, fontSize: 14, color: TEXT, outline: "none",
        border: "1.5px solid rgba(15,23,42,0.12)", background: WHITE, fontFamily: "inherit",
        boxSizing: "border-box", width: "100%",
      }} onFocus={e => e.target.style.borderColor = ACCENT}
        onBlur={e => e.target.style.borderColor = "rgba(15,23,42,0.12)"} {...props} />
    </div>
  );
}

function FieldArea({ label, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: TEXT }}>{label}</label>}
      <textarea style={{
        padding: "10px 14px", borderRadius: 8, fontSize: 14, color: TEXT, outline: "none",
        border: "1.5px solid rgba(15,23,42,0.12)", background: WHITE, fontFamily: "inherit",
        resize: "vertical", minHeight: 80, boxSizing: "border-box", width: "100%",
      }} onFocus={e => e.target.style.borderColor = ACCENT}
        onBlur={e => e.target.style.borderColor = "rgba(15,23,42,0.12)"} {...props} />
    </div>
  );
}

/* ─── DOSSIER DOCUMENT ADETIC ─── */
const TYPE_CFG = {
  domaine:    { label: "Demande de nom de domaine .td",       color: "#00C9A7", icon: "🌐", section: "DOMAINES .TD"    },
  equipement: { label: "Demande d'équipements réseau",        color: "#4F8EF7", icon: "🖥️", section: "ÉQUIPEMENTS"     },
  panne:      { label: "Déclaration de panne technique",      color: "#FC5C65", icon: "⚡", section: "INCIDENTS RÉSEAU" },
  email:      { label: "Demande de création de mails",        color: "#A55EEA", icon: "📧", section: "MAILS"           },
  plateforme: { label: "Demande de conception de plateforme", color: "#20BF6B", icon: "💻", section: "PLATEFORMES"     },
  contact:    { label: "Message du formulaire de contact",    color: "#4F8EF7", icon: "✉️", section: "CONTACTS"         },
};

const FIELD_LABELS = {
  domaine_souhaite: "Domaine souhaité", type_entite: "Type d'entité",
  nom_organisation: "Organisation", nom_contact: "Nom du contact",
  email: "Adresse e-mail", telephone: "Téléphone", adresse: "Adresse",
  usage_description: "Description de l'usage",
  type_equipement: "Type d'équipement", quantite: "Quantité",
  localisation_ville: "Ville", adresse_exacte: "Adresse exacte",
  responsable_nom: "Responsable", responsable_email: "E-mail responsable",
  responsable_telephone: "Téléphone responsable", date_souhaitee: "Date souhaitée",
  description_besoins: "Description des besoins",
  type_panne: "Type de panne", niveau_urgence: "Niveau d'urgence",
  localisation: "Localisation", equipement_concerne: "Équipement concerné",
  nombre_utilisateurs_affectes: "Utilisateurs affectés", description_panne: "Description de la panne",
  nom_declarant: "Déclarant", email_declarant: "E-mail déclarant",
  telephone_declarant: "Téléphone déclarant",
  nom: "Nom complet", email_contact: "Adresse e-mail", message: "Message",
};

function DossierDocument({ item, type, onClose, onStatusUpdate }) {
  const [newStatus, setNewStatus] = useState(item.statut || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [logoB64, setLogoB64] = useState("");

  const cfg = TYPE_CFG[type] || TYPE_CFG.contact;
  const statusOptions = type === "panne"
    ? ["Ouvert", "En cours", "Résolu", "Fermé"]
    : type === "contact"
    ? ["Nouveau", "Lu", "Répondu"]
    : ["En attente", "En cours", "Traité", "Rejeté"];

  const tableMap = {
    domaine: "demandes_domaine", equipement: "demandes_equipement",
    panne: "declarations_panne", contact: "contacts",
  };

  // Convertit le logo en base64 pour l'embarquer dans l'impression
  useEffect(() => {
    fetch(siteLogo)
      .then(r => r.blob())
      .then(blob => new Promise(res => {
        const reader = new FileReader();
        reader.onloadend = () => res(reader.result);
        reader.readAsDataURL(blob);
      }))
      .then(setLogoB64)
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await adminUpdateStatus(tableMap[type], item.id, newStatus);
    setSaved(true);
    onStatusUpdate(item.id, newStatus);
    setTimeout(() => setSaved(false), 2200);
    setSaving(false);
  };

  const handlePrint = () => {
    const content = document.getElementById("adetic-doc-printable");
    if (!content) return;

    // Clone et remplace le src de l'image par le base64 embarqué
    const clone = content.cloneNode(true);
    if (logoB64) {
      clone.querySelectorAll("img").forEach(img => { img.src = logoB64; });
    }

    const pw = window.open("", "_blank", "width=900,height=1100");
    if (!pw) return;
    pw.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<title>${ref}</title>
<style>
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
  @page { size: A4 portrait; margin: 0; }
  body { margin: 0; padding: 0; background: white; font-family: 'Segoe UI', Arial, sans-serif; }
  img { display: block !important; }
</style>
</head><body>${clone.outerHTML}</body></html>`);
    pw.document.close();
    pw.focus();
    setTimeout(() => { pw.print(); }, 600);
  };

  const ref = `ADETIC-${type.toUpperCase()}-${String(item.id).padStart(5, "0")}`;
  const now = new Date();
  const dateEmission = now.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  const dateReception = item.created_at
    ? new Date(item.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
    : "—";
  const displayFields = Object.entries(item).filter(([k]) => !["id", "created_at", "statut"].includes(k));

  const DocContent = () => (
    <div id="adetic-doc-printable" style={{
      fontFamily: "'Segoe UI', 'Arial', sans-serif",
      background: WHITE, color: TEXT,
      width: "100%", position: "relative", overflow: "hidden",
    }}>

      {/* Filigrane de fond */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%) rotate(-35deg)",
        fontSize: 130, fontWeight: 900, letterSpacing: 8,
        color: "rgba(0,201,167,0.04)", userSelect: "none", pointerEvents: "none",
        whiteSpace: "nowrap", zIndex: 0,
      }}>ADETIC</div>

      {/* Barre latérale gauche */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 6,
        background: `linear-gradient(to bottom, ${cfg.color}, ${DARK})`,
        zIndex: 1,
      }} />

      {/* EN-TÊTE OFFICIEL */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, #0d1a3d 60%, #091428 100%)`,
        padding: "28px 40px 0 40px", position: "relative", zIndex: 1,
      }}>
        {/* Motif géométrique décoratif */}
        <div style={{ position: "absolute", right: 0, top: 0, opacity: 0.07 }}>
          {[0,1,2,3,4].map(row => (
            <div key={row} style={{ display: "flex" }}>
              {[0,1,2,3,4,5,6,7].map(col => (
                <div key={col} style={{
                  width: 18, height: 18, margin: 3, borderRadius: "50%",
                  background: cfg.color,
                }} />
              ))}
            </div>
          ))}
        </div>

        {/* République + Institution */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <img src={logoB64 || siteLogo} alt="ADETIC" style={{
              width: 62, height: 62, borderRadius: 14, objectFit: "cover",
              border: `2px solid ${cfg.color}60`, flexShrink: 0,
            }} />
            <div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 9, letterSpacing: 3, fontWeight: 600, marginBottom: 4 }}>
                RÉPUBLIQUE DU TCHAD
              </div>
              <div style={{ color: WHITE, fontWeight: 900, fontSize: 22, letterSpacing: 3 }}>ADETIC</div>
              <div style={{ color: cfg.color, fontSize: 8.5, letterSpacing: 2, fontWeight: 700, marginTop: 3 }}>
                AGENCE DE DÉVELOPPEMENT DES TECHNOLOGIES DE L'INFORMATION ET DE LA COMMUNICATION
              </div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 9.5, marginTop: 4 }}>
                Loi n° 012/PR/2014 · B.P. 6531 N'Djaména, Tchad
              </div>
            </div>
          </div>
          {/* Référence document */}
          <div style={{
            background: "rgba(255,255,255,0.05)", borderRadius: 12,
            border: `1px solid ${cfg.color}40`, padding: "14px 20px", textAlign: "right",
          }}>
            <div style={{ color: cfg.color, fontSize: 8, letterSpacing: 2.5, fontWeight: 800, marginBottom: 6 }}>
              RÉFÉRENCE DU DOSSIER
            </div>
            <div style={{ color: WHITE, fontWeight: 900, fontSize: 18, letterSpacing: 2, fontFamily: "'Courier New', monospace" }}>
              {ref}
            </div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9.5, marginTop: 6 }}>
              Reçu le {dateReception}
            </div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9.5, marginTop: 2 }}>
              Émis le {dateEmission}
            </div>
          </div>
        </div>

        {/* Bandeau type de document */}
        <div style={{
          background: `linear-gradient(90deg, ${cfg.color}30, transparent)`,
          borderTop: `1px solid ${cfg.color}30`,
          padding: "12px 0",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <span style={{ fontSize: 18 }}>{cfg.icon}</span>
          <div>
            <div style={{ color: cfg.color, fontSize: 8, fontWeight: 800, letterSpacing: 3 }}>
              SERVICE {cfg.section}
            </div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600, marginTop: 2 }}>
              {cfg.label}
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              background: `${scColor(item.statut)}20`,
              border: `1.5px solid ${scColor(item.statut)}60`,
              color: scColor(item.statut),
              fontSize: 10, fontWeight: 800, padding: "4px 14px",
              borderRadius: 100, letterSpacing: 1,
            }}>
              {item.statut || "Nouveau"}
            </div>
          </div>
        </div>
      </div>

      {/* Ligne teal décorative */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${cfg.color}, transparent)` }} />

      {/* CORPS DU DOCUMENT */}
      <div style={{ padding: "30px 40px", position: "relative", zIndex: 1 }}>

        {/* Titre de section */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 22,
        }}>
          <div style={{ width: 3, height: 18, background: cfg.color, borderRadius: 2, flexShrink: 0 }} />
          <div style={{ color: TEXT, fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase" }}>
            Informations du dossier
          </div>
        </div>

        {/* Grille de champs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: "1px solid rgba(15,23,42,0.1)", borderRadius: 10, overflow: "hidden", marginBottom: 24 }}>
          {displayFields.map(([key, val], idx) => {
            const isLong = ["description", "message", "usage", "besoins", "panne", "adresse"].some(w => key.includes(w));
            const isEven = idx % 2 === 0;
            return (
              <div key={key} style={{
                gridColumn: isLong ? "1 / -1" : "auto",
                borderBottom: idx < displayFields.length - (isLong ? 1 : 2) ? "1px solid rgba(15,23,42,0.07)" : "none",
                borderRight: !isLong && isEven ? "1px solid rgba(15,23,42,0.07)" : "none",
              }}>
                <div style={{
                  padding: "13px 16px",
                  background: isEven && !isLong ? "rgba(0,201,167,0.02)" : "transparent",
                }}>
                  <div style={{
                    color: cfg.color, fontSize: 9, fontWeight: 800,
                    letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 5,
                  }}>
                    {FIELD_LABELS[key] || key.replace(/_/g, " ")}
                  </div>
                  <div style={{ color: TEXT, fontSize: 13.5, lineHeight: 1.6, fontWeight: 500, minHeight: isLong ? 60 : "auto" }}>
                    {String(val ?? "—") || "—"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* VISA DE TRAITEMENT */}
        <div style={{
          border: `1.5px solid ${cfg.color}40`,
          borderRadius: 12, overflow: "hidden", marginBottom: 24,
        }}>
          <div style={{
            background: `linear-gradient(90deg, ${cfg.color}18, ${cfg.color}06)`,
            padding: "11px 18px",
            borderBottom: `1px solid ${cfg.color}30`,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{ width: 3, height: 14, background: cfg.color, borderRadius: 2 }} />
            <div style={{ color: TEXT, fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase" }}>
              Visa de traitement
            </div>
          </div>
          <div style={{ padding: "22px 24px", display: "flex", alignItems: "center", gap: 40 }}>
            {/* Zone signature DG */}
            <div style={{ flex: 1 }}>
              <div style={{ color: MUTED, fontSize: 10, fontWeight: 600, letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>
                Signature du Directeur Général
              </div>
              <div style={{
                height: 72, border: "1px dashed rgba(15,23,42,0.18)", borderRadius: 10,
                background: "rgba(15,23,42,0.015)",
              }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <div style={{ color: MUTED, fontSize: 9.5 }}>Date : _______ / _______ / ___________</div>
              </div>
              <div style={{
                marginTop: 10, borderTop: "1px solid rgba(15,23,42,0.08)", paddingTop: 8,
                color: TEXT, fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
              }}>
                M. ADOUM DJIMET SABOUN
              </div>
              <div style={{ color: MUTED, fontSize: 9.5, marginTop: 2 }}>
                Directeur Général · ADETIC
              </div>
            </div>
            {/* Cachet circulaire DG */}
            <div style={{ flexShrink: 0, textAlign: "center" }}>
              <div style={{ color: MUTED, fontSize: 10, fontWeight: 600, letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>
                Cachet officiel
              </div>
              <div style={{
                width: 90, height: 90, borderRadius: "50%",
                border: `2px dashed ${cfg.color}55`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 3,
              }}>
                <div style={{ fontSize: 18 }}>🏛️</div>
                <div style={{ color: `${cfg.color}70`, fontSize: 7, fontWeight: 800, letterSpacing: 1.5, textAlign: "center", lineHeight: 1.4 }}>
                  ADETIC<br />OFFICIEL
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PIED DE PAGE */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 16, borderTop: `1px solid rgba(15,23,42,0.07)`,
        }}>
          <div>
            <div style={{ color: MUTED, fontSize: 9, letterSpacing: 1 }}>DOCUMENT INTERNE CONFIDENTIEL</div>
            <div style={{ color: "rgba(15,23,42,0.3)", fontSize: 9, marginTop: 2 }}>
              ADETIC © {now.getFullYear()} · Système de gestion numérique · adetic.td
            </div>
          </div>
          {/* Mini identifiant QR-like */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: cfg.color, fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>{ref}</div>
              <div style={{ color: "rgba(15,23,42,0.3)", fontSize: 8 }}>Page 1/1</div>
            </div>
            <div style={{
              width: 36, height: 36, display: "grid",
              gridTemplateColumns: "repeat(5,6px)", gridTemplateRows: "repeat(5,6px)", gap: 1.2,
            }}>
              {[1,1,1,1,1, 1,0,0,0,1, 1,0,1,0,1, 1,0,0,0,1, 1,1,1,1,1].map((v, i) => (
                <div key={i} style={{ borderRadius: 1, background: v ? cfg.color : "transparent" }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Modal écran */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 500, display: "flex",
        alignItems: "center", justifyContent: "center", padding: 20,
        background: "rgba(5,10,25,0.82)", backdropFilter: "blur(8px)",
      }} onClick={onClose}>
        <div style={{
          width: "100%", maxWidth: 820, maxHeight: "94vh", overflowY: "auto",
          background: WHITE, borderRadius: 20,
          boxShadow: "0 60px 140px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.05)",
        }} onClick={e => e.stopPropagation()}>

          <DocContent />

          {/* Barre d'actions (masquée à l'impression) */}
          <div style={{
            padding: "18px 40px 22px",
            borderTop: `2px solid ${cfg.color}25`,
            background: "#f8fafc",
            borderRadius: "0 0 20px 20px",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: TEXT, marginBottom: 12, letterSpacing: 0.5 }}>
              Mettre à jour le statut du dossier
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {statusOptions.map(s => (
                <button key={s} onClick={() => setNewStatus(s)} style={{
                  padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                  fontSize: 12, fontWeight: 600, transition: "all 0.18s",
                  border: `2px solid ${newStatus === s ? scColor(s) : "rgba(15,23,42,0.1)"}`,
                  background: newStatus === s ? `${scColor(s)}15` : WHITE,
                  color: newStatus === s ? scColor(s) : MUTED,
                }}>{s}</button>
              ))}
              <button onClick={handleSave}
                disabled={saving || !newStatus || newStatus === item.statut}
                style={{
                  padding: "9px 22px", borderRadius: 8, border: "none",
                  background: saved ? "#20BF6B" : cfg.color, color: WHITE, cursor: "pointer",
                  fontWeight: 700, fontSize: 13, transition: "background 0.3s", marginLeft: 4,
                  opacity: (!newStatus || newStatus === item.statut) ? 0.45 : 1,
                }}>
                {saved ? "✓ Enregistré" : saving ? "…" : "Enregistrer"}
              </button>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button onClick={handlePrint} style={{
                  background: WHITE, color: TEXT, border: "1.5px solid rgba(15,23,42,0.12)",
                  padding: "9px 18px", borderRadius: 9, cursor: "pointer",
                  fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
                }}>
                  <Printer size={14} /> Imprimer
                </button>
                <button onClick={onClose} style={{
                  background: DARK, color: WHITE, border: "none",
                  padding: "9px 22px", borderRadius: 9, cursor: "pointer",
                  fontSize: 13, fontWeight: 700,
                }}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── VUE D'ENSEMBLE ─── */
function OverviewTab({ stats, domaines, equipements, pannes, emails, plateformes, contacts }) {
  const cards = [
    { label: "Articles publiés", val: stats.articles, color: ACCENT, Icon: Newspaper },
    { label: "Demandes en attente", val: stats.pending, color: "#F7B731", Icon: Clock },
    { label: "Pannes actives", val: stats.activePannes, color: "#FC5C65", Icon: AlertTriangle },
    { label: "Messages reçus", val: stats.contacts, color: "#4F8EF7", Icon: Mail },
  ];

  const barData = [
    { name: "Domaines", count: domaines.length, fill: "#00C9A7" },
    { name: "Équipements", count: equipements.length, fill: "#4F8EF7" },
    { name: "Pannes", count: pannes.length, fill: "#FC5C65" },
    { name: "Mails", count: emails.length, fill: "#A55EEA" },
    { name: "Plateformes", count: plateformes.length, fill: "#20BF6B" },
    { name: "Contacts", count: contacts.length, fill: "#F7B731" },
  ];

  const STATUS_COLORS = {
    "En attente": "#F7B731",
    "En cours": "#4F8EF7",
    "Traité": "#00C9A7",
    "Rejeté": "#FC5C65",
    "Ouvert": "#FF6B6B",
    "Résolu": "#20BF6B",
    "Nouveau": "#A55EEA",
  };
  const allDemandes = [...domaines, ...equipements, ...pannes, ...emails, ...plateformes];
  const statusCounts = {};
  allDemandes.forEach(d => {
    const s = d.statut || "Inconnu";
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({
    name, value, fill: STATUS_COLORS[name] || "#94a3b8",
  }));

  return (
    <div>
      <div style={{ marginBottom: 30 }}>
        <h2 style={{ color: TEXT, fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>Vue d'ensemble</h2>
        <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>Tableau de bord administratif ADETIC</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 24 }}>
        {cards.map(({ label, val, color, Icon }, i) => (
          <div key={i} style={{
            background: WHITE, borderRadius: 16, padding: "24px 22px",
            border: "1px solid rgba(15,23,42,0.06)", boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: `${color}18`,
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
            }}>
              <Icon size={20} color={color} strokeWidth={1.8} />
            </div>
            <div style={{ color: TEXT, fontSize: 34, fontWeight: 900, lineHeight: 1 }}>{val ?? 0}</div>
            <div style={{ color: MUTED, fontSize: 13, marginTop: 6 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20, marginBottom: 24 }}>
        {/* Bar chart */}
        <div style={{
          background: WHITE, borderRadius: 16, padding: "24px 20px",
          border: "1px solid rgba(15,23,42,0.06)", boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
        }}>
          <div style={{ color: TEXT, fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Demandes par service</div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={barData} margin={{ top: 4, right: 10, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: "1px solid rgba(15,23,42,0.08)", fontSize: 13, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                cursor={{ fill: "rgba(15,23,42,0.03)" }}
                formatter={(value) => [value, "Demandes"]}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={52}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie / donut chart */}
        <div style={{
          background: WHITE, borderRadius: 16, padding: "24px 20px",
          border: "1px solid rgba(15,23,42,0.06)", boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
        }}>
          <div style={{ color: TEXT, fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Statuts des demandes</div>
          {pieData.length === 0 ? (
            <div style={{ height: 230, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED, fontSize: 14 }}>
              Aucune donnée
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="42%"
                  innerRadius={55}
                  outerRadius={82}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid rgba(15,23,42,0.08)", fontSize: 13, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                  formatter={(value, name) => [value + " dossier(s)", name]}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 6 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div style={{
        background: WHITE, borderRadius: 16, padding: 28,
        border: "1px solid rgba(15,23,42,0.06)", boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
      }}>
        <div style={{ color: TEXT, fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Activité récente</div>
        {(stats.recent || []).length === 0 ? (
          <div style={{ color: MUTED, textAlign: "center", padding: 24, fontSize: 14 }}>Aucune activité récente</div>
        ) : stats.recent.map((item, i, arr) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "13px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(15,23,42,0.06)" : "none",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>{item.label}</div>
              <div style={{ color: MUTED, fontSize: 12 }}>{item.sub}</div>
            </div>
            <StatusBadge statut={item.statut} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── FORM ARTICLE (partagé création + édition) ─── */
function ArticleForm({ initial, editingId, onSubmit, onCancel, submitting, err }) {
  const EMPTY = { title: "", category: "", date: "", excerpt: "", content: "", color: "#00C9A7", icon: "🌐", image_url: "" };
  const [form, setForm] = useState(initial || EMPTY);
  const [uploadPreview, setUploadPreview] = useState(
    initial?.image_url?.startsWith("http") ? initial.image_url : null
  );
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [localErr, setLocalErr] = useState("");

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setLocalErr("Format non supporté. Utilisez JPG, PNG ou WebP."); return;
    }
    if (file.size > 5 * 1024 * 1024) { setLocalErr("Image trop lourde (max 5 Mo)."); return; }
    setLocalErr("");
    setUploadPreview(URL.createObjectURL(file));
    setUploading(true); setUploadDone(false);
    try {
      const url = await uploadArticleImage(file);
      upd("image_url", url);
      setUploadDone(true);
    } catch (e) {
      setLocalErr("Erreur upload : " + (e.message || "vérifiez le bucket Supabase Storage"));
      setUploadPreview(null);
    } finally { setUploading(false); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalErr("");
    onSubmit(form);
  };

  const allErr = localErr || err;
  const imgId = `article-img-${editingId || "new"}`;

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <FieldInput label="Titre *" value={form.title} onChange={e => upd("title", e.target.value)} placeholder="Titre de l'article" />
        <FieldInput label="Catégorie *" value={form.category} onChange={e => upd("category", e.target.value)} placeholder="ex: Forum, Coopération..." />
        <FieldInput label="Date *" value={form.date} onChange={e => upd("date", e.target.value)} placeholder="ex: Juin 2026" />
      </div>
      <FieldArea label="Extrait *" rows={3} value={form.excerpt} onChange={e => upd("excerpt", e.target.value)} placeholder="Résumé court visible sur la page d'accueil..." />
      <FieldArea label="Contenu complet" rows={5} value={form.content} onChange={e => upd("content", e.target.value)} placeholder="Corps complet de l'article..." />

      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: TEXT, display: "block", marginBottom: 10 }}>Couleur de catégorie</label>
        <div style={{ display: "flex", gap: 10 }}>
          {COLORS.map(c => (
            <button type="button" key={c.val} onClick={() => upd("color", c.val)} title={c.label} style={{
              width: 34, height: 34, borderRadius: "50%", background: c.val, cursor: "pointer",
              border: form.color === c.val ? `3px solid ${TEXT}` : "3px solid transparent",
              transition: "border 0.15s",
            }} />
          ))}
        </div>
      </div>

      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: TEXT, display: "block", marginBottom: 10 }}>Icône</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {ICONS_EMOJI.map(ic => (
            <button type="button" key={ic} onClick={() => upd("icon", ic)} style={{
              width: 42, height: 42, borderRadius: 10, fontSize: 20, cursor: "pointer",
              border: `2px solid ${form.icon === ic ? ACCENT : "rgba(15,23,42,0.12)"}`,
              background: form.icon === ic ? `${ACCENT}15` : "#f8fafc",
            }}>{ic}</button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: TEXT, display: "block", marginBottom: 10 }}>Image de l'article</label>
        <label htmlFor={imgId} style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 10, padding: "28px 20px", borderRadius: 14, cursor: "pointer",
          border: `2px dashed ${uploadDone ? ACCENT : "rgba(15,23,42,0.15)"}`,
          background: uploadDone ? `${ACCENT}08` : "#f8fafc",
          transition: "all 0.2s", position: "relative", overflow: "hidden",
          minHeight: uploadPreview ? 200 : 110,
        }}>
          {uploadPreview ? (
            <>
              <img src={uploadPreview} alt="preview" style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 8 }} />
              <div style={{
                position: "absolute", bottom: 10, right: 10,
                background: uploadDone ? "#20BF6B" : uploading ? ACCENT : "rgba(15,23,42,0.55)",
                color: WHITE, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100,
              }}>
                {uploading ? "⏳ Envoi…" : uploadDone ? "✓ Uploadé" : "Image actuelle"}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 32 }}>🖼️</div>
              <div style={{ color: MUTED, fontSize: 13, fontWeight: 500, textAlign: "center" }}>
                Cliquez ou glissez une image ici<br />
                <span style={{ fontSize: 11, color: "rgba(15,23,42,0.35)" }}>JPG, PNG, WebP — max 5 Mo</span>
              </div>
            </>
          )}
          <input id={imgId} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange} style={{ display: "none" }} />
        </label>
        {uploadPreview && !uploading && (
          <button type="button" onClick={() => { setUploadPreview(null); setUploadDone(false); upd("image_url", ""); }}
            style={{ marginTop: 8, background: "transparent", border: "none", color: "#ef4444", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
            ✕ Retirer l'image
          </button>
        )}

        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, marginBottom: 10, letterSpacing: 0.5, textTransform: "uppercase" }}>
            Ou choisir une image existante
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {IMAGE_OPTIONS.map(img => (
              <button type="button" key={img.key} onClick={() => { upd("image_url", img.key); setUploadPreview(null); setUploadDone(false); }} style={{
                padding: "10px 6px", borderRadius: 8, cursor: "pointer",
                border: `2px solid ${form.image_url === img.key ? ACCENT : "rgba(15,23,42,0.1)"}`,
                background: form.image_url === img.key ? `${ACCENT}15` : "#f8fafc",
                color: form.image_url === img.key ? ACCENT : MUTED,
                fontSize: 11, fontWeight: 600,
              }}>{img.label}</button>
            ))}
          </div>
        </div>
      </div>

      {allErr && <div style={{ color: "#ef4444", fontSize: 13, background: "#fef2f2", padding: "10px 14px", borderRadius: 8, border: "1px solid #fecaca" }}>{allErr}</div>}

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button type="button" onClick={onCancel} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid rgba(15,23,42,0.12)", background: "transparent", color: MUTED, cursor: "pointer", fontSize: 14 }}>
          Annuler
        </button>
        <button type="submit" disabled={submitting} style={{ padding: "10px 26px", borderRadius: 8, background: editingId ? "#4F8EF7" : ACCENT, color: WHITE, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, opacity: submitting ? 0.7 : 1 }}>
          {submitting ? "Enregistrement..." : editingId ? "Enregistrer les modifications" : "Publier l'article"}
        </button>
      </div>
    </form>
  );
}

/* ─── ARTICLES ─── */
function ArticlesTab({ articles, onRefresh }) {
  const [mode, setMode] = useState(null); // null | "new" | {id, ...article}
  const [submitting, setSubmitting] = useState(false);
  const [formErr, setFormErr] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteErr, setDeleteErr] = useState("");

  const openNew = () => { setMode("new"); setFormErr(""); };
  const openEdit = (a) => { setMode(a); setFormErr(""); };
  const closeForm = () => { setMode(null); setFormErr(""); };

  const handleSubmit = async (form) => {
    if (!form.title || !form.category || !form.date || !form.excerpt) {
      setFormErr("Les champs * sont obligatoires."); return;
    }
    setSubmitting(true); setFormErr("");
    const payload = {
      title: form.title, category: form.category, date: form.date,
      excerpt: form.excerpt, content: form.content || "",
      color: form.color, icon: form.icon, image_url: form.image_url,
    };
    try {
      if (mode !== "new" && mode?.id) {
        await adminUpdateActualite(mode.id, payload);
        setSuccess("Article modifié avec succès !");
      } else {
        await adminAddActualite(payload);
        setSuccess("Article publié avec succès !");
      }
      setMode(null);
      onRefresh();
      setTimeout(() => setSuccess(""), 3500);
    } catch (e) {
      setFormErr("Erreur : " + (e?.message || e?.details || JSON.stringify(e)));
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    setDeleting(true); setDeleteErr("");
    try {
      await adminDeleteActualite(id);
      setDeleteConfirm(null);
      setSuccess("Article supprimé.");
      onRefresh();
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setDeleteErr("Erreur : " + (e?.message || e?.details || String(e)));
    } finally { setDeleting(false); }
  };

  const isEditing = mode && mode !== "new";
  const isNew = mode === "new";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h2 style={{ color: TEXT, fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>Articles & Actualités</h2>
          <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>{articles.length} article(s) en base</p>
        </div>
        {!mode && (
          <button onClick={openNew} style={{
            background: ACCENT, color: WHITE, border: "none", padding: "10px 20px",
            borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 700,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <Plus size={16} /> Nouvel article
          </button>
        )}
      </div>

      {success && (
        <div style={{ background: "#dcfce7", color: "#16a34a", padding: "12px 18px", borderRadius: 10, marginBottom: 20, fontSize: 14, fontWeight: 600, border: "1px solid #bbf7d0" }}>
          ✓ {success}
        </div>
      )}

      {/* Formulaire création ou édition */}
      {mode && (
        <div style={{ background: WHITE, borderRadius: 18, padding: 34, marginBottom: 28, border: `1.5px solid ${isEditing ? "rgba(79,142,247,0.3)" : "rgba(15,23,42,0.08)"}`, boxShadow: "0 6px 28px rgba(15,23,42,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div style={{ color: TEXT, fontSize: 16, fontWeight: 700 }}>
                {isEditing ? "Modifier l'article" : "Rédiger un article"}
              </div>
              {isEditing && (
                <div style={{ color: MUTED, fontSize: 12, marginTop: 3 }}>
                  ID #{mode.id} · {mode.title}
                </div>
              )}
            </div>
            <button onClick={closeForm} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", color: MUTED, fontSize: 13 }}>
              ✕ Annuler
            </button>
          </div>
          <ArticleForm
            key={isEditing ? mode.id : "new"}
            initial={isEditing ? mode : undefined}
            editingId={isEditing ? mode.id : null}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            submitting={submitting}
            err={formErr}
          />
        </div>
      )}

      {/* Modale de confirmation de suppression */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(5,10,25,0.65)", backdropFilter: "blur(4px)" }}
          onClick={() => setDeleteConfirm(null)}>
          <div style={{ background: WHITE, borderRadius: 18, padding: "38px 42px", maxWidth: 420, width: "90%", boxShadow: "0 40px 80px rgba(0,0,0,0.4)" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 44, textAlign: "center", marginBottom: 16 }}>🗑️</div>
            <div style={{ color: TEXT, fontWeight: 800, fontSize: 17, textAlign: "center", marginBottom: 10 }}>Supprimer cet article ?</div>
            <div style={{ color: MUTED, fontSize: 13, textAlign: "center", marginBottom: 28, lineHeight: 1.6 }}>
              Cette action est irréversible. L'article sera définitivement supprimé de la base de données.
            </div>
            {deleteErr && (
              <div style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 12, marginBottom: 16 }}>
                {deleteErr}
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setDeleteConfirm(null); setDeleteErr(""); }} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1px solid rgba(15,23,42,0.12)", background: "transparent", color: MUTED, cursor: "pointer", fontSize: 14 }}>
                Annuler
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} disabled={deleting} style={{ flex: 1, padding: "11px", borderRadius: 10, background: "#ef4444", color: WHITE, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, opacity: deleting ? 0.7 : 1 }}>
                {deleting ? "Suppression…" : "Oui, supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tableau des articles */}
      <div style={{ background: WHITE, borderRadius: 16, border: "1px solid rgba(15,23,42,0.06)", boxShadow: "0 2px 12px rgba(15,23,42,0.05)", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(15,23,42,0.06)", color: TEXT, fontWeight: 700, fontSize: 14 }}>
          Articles existants en base
        </div>
        {articles.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: MUTED, fontSize: 14 }}>Aucun article trouvé</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["#", "Catégorie", "Titre", "Date", "Image", "Actions"].map(h => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 0.8 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articles.map((a, i) => (
                <tr key={a.id || i}
                  style={{ borderTop: "1px solid rgba(15,23,42,0.05)", background: isEditing && mode?.id === a.id ? "rgba(79,142,247,0.05)" : "transparent" }}
                  onMouseEnter={e => e.currentTarget.style.background = isEditing && mode?.id === a.id ? "rgba(79,142,247,0.08)" : "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = isEditing && mode?.id === a.id ? "rgba(79,142,247,0.05)" : "transparent"}>
                  <td style={{ padding: "13px 16px", color: MUTED, fontSize: 12 }}>{a.id || i + 1}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ background: `${a.color || ACCENT}18`, color: a.color || ACCENT, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>
                      {a.icon && <span style={{ marginRight: 4 }}>{a.icon}</span>}{a.category || "—"}
                    </span>
                  </td>
                  <td style={{ padding: "13px 16px", color: TEXT, fontSize: 13, fontWeight: 500, maxWidth: 250 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                  </td>
                  <td style={{ padding: "13px 16px", color: MUTED, fontSize: 13, whiteSpace: "nowrap" }}>{a.date || "—"}</td>
                  <td style={{ padding: "13px 16px", color: MUTED, fontSize: 11, maxWidth: 120 }}>
                    {a.image_url?.startsWith("http") ? (
                      <img src={a.image_url} alt="" style={{ width: 40, height: 30, objectFit: "cover", borderRadius: 4, display: "block" }} />
                    ) : (
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{a.image_url || "—"}</span>
                    )}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(a)} title="Modifier" style={{
                        background: "rgba(79,142,247,0.1)", border: "none", borderRadius: 7,
                        padding: "7px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                        color: "#4F8EF7", fontSize: 12, fontWeight: 600, transition: "background 0.15s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(79,142,247,0.2)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(79,142,247,0.1)"}>
                        <Pencil size={13} /> Modifier
                      </button>
                      <button onClick={() => setDeleteConfirm(a.id)} title="Supprimer" style={{
                        background: "rgba(239,68,68,0.08)", border: "none", borderRadius: 7,
                        padding: "7px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                        color: "#ef4444", fontSize: 12, fontWeight: 600, transition: "background 0.15s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.18)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}>
                        <Trash2 size={13} /> Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ─── DOSSIERS E-SERVICE (réutilisable) ─── */
function DossiersTab({ type, data, onDataChange }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("Tous");

  const cfg = {
    domaine: {
      title: "Demandes Domaine .td", subtitle: "Enregistrement de noms de domaine",
      Icon: Globe, color: ACCENT,
      statuts: ["Tous", "En attente", "En cours", "Traité", "Rejeté"],
      cols: [{ key: "domaine_souhaite", label: "Domaine" }, { key: "nom_organisation", label: "Organisation" }, { key: "nom_contact", label: "Contact" }, { key: "email", label: "Email" }],
    },
    equipement: {
      title: "Demandes Équipements", subtitle: "Installation d'équipements réseau",
      Icon: Monitor, color: "#4F8EF7",
      statuts: ["Tous", "En attente", "En cours", "Traité", "Rejeté"],
      cols: [{ key: "type_equipement", label: "Type" }, { key: "nom_organisation", label: "Organisation" }, { key: "localisation_ville", label: "Ville" }, { key: "responsable_nom", label: "Responsable" }],
    },
    panne: {
      title: "Déclarations de Panne", subtitle: "Signalements techniques urgents",
      Icon: AlertTriangle, color: "#FC5C65",
      statuts: ["Tous", "Ouvert", "En cours", "Résolu", "Fermé"],
      cols: [{ key: "type_panne", label: "Type" }, { key: "localisation", label: "Localisation" }, { key: "nom_declarant", label: "Déclarant" }, { key: "niveau_urgence", label: "Urgence" }],
    },
    email: {
      title: "Demandes de Mails", subtitle: "Création de boîtes mail professionnelles",
      Icon: Mail, color: "#A55EEA",
      statuts: ["Tous", "En attente", "En cours", "Traité", "Rejeté"],
      cols: [{ key: "nom_organisation", label: "Organisation" }, { key: "domaine_email", label: "Domaine" }, { key: "nombre_comptes", label: "Comptes" }, { key: "nom_responsable", label: "Responsable" }],
    },
    plateforme: {
      title: "Demandes de Plateformes", subtitle: "Conception de plateformes numériques",
      Icon: Layers, color: "#20BF6B",
      statuts: ["Tous", "En attente", "En cours", "Traité", "Rejeté"],
      cols: [{ key: "nom_projet", label: "Projet" }, { key: "type_plateforme", label: "Type" }, { key: "nom_organisation", label: "Organisation" }, { key: "nom_responsable", label: "Responsable" }],
    },
  }[type];

  const filtered = filter === "Tous" ? data : data.filter(d => d.statut === filter);

  const handleStatusUpdate = (id, newStatus) => {
    onDataChange(prev => prev.map(d => d.id === id ? { ...d, statut: newStatus } : d));
    if (selected?.id === id) setSelected(s => ({ ...s, statut: newStatus }));
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <div style={{ width: 50, height: 50, borderRadius: 14, background: `${cfg.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <cfg.Icon size={22} color={cfg.color} strokeWidth={1.8} />
        </div>
        <div>
          <h2 style={{ color: TEXT, fontSize: 22, fontWeight: 800, margin: "0 0 3px" }}>{cfg.title}</h2>
          <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>{data.length} dossier(s) · {cfg.subtitle}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {cfg.statuts.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
            fontWeight: filter === s ? 700 : 500, transition: "all 0.18s",
            border: `1px solid ${filter === s ? cfg.color : "rgba(15,23,42,0.1)"}`,
            background: filter === s ? `${cfg.color}14` : WHITE,
            color: filter === s ? cfg.color : MUTED,
          }}>
            {s}{s !== "Tous" ? ` (${data.filter(d => d.statut === s).length})` : ""}
          </button>
        ))}
      </div>

      <div style={{ background: WHITE, borderRadius: 16, border: "1px solid rgba(15,23,42,0.06)", boxShadow: "0 2px 12px rgba(15,23,42,0.05)", overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 56, textAlign: "center", color: MUTED, fontSize: 14 }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>📂</div>
            Aucun dossier {filter !== "Tous" ? `"${filter}"` : ""}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 0.8 }}>Réf.</th>
                {cfg.cols.map(c => (
                  <th key={c.key} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 0.8 }}>{c.label}</th>
                ))}
                <th style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 0.8 }}>Date</th>
                <th style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 0.8 }}>Statut</th>
                <th style={{ padding: "11px 16px" }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}
                  style={{ borderTop: "1px solid rgba(15,23,42,0.05)", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  onClick={() => setSelected(item)}>
                  <td style={{ padding: "13px 16px", color: cfg.color, fontSize: 11, fontWeight: 700 }}>
                    ADETIC-{type.toUpperCase()}-{String(item.id).padStart(5, "0")}
                  </td>
                  {cfg.cols.map(c => (
                    <td key={c.key} style={{ padding: "13px 16px", color: TEXT, fontSize: 13, maxWidth: 160 }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item[c.key] || "—"}
                      </div>
                    </td>
                  ))}
                  <td style={{ padding: "13px 16px", color: MUTED, fontSize: 12, whiteSpace: "nowrap" }}>
                    {item.created_at ? new Date(item.created_at).toLocaleDateString("fr-FR") : "—"}
                  </td>
                  <td style={{ padding: "13px 16px" }}><StatusBadge statut={item.statut} /></td>
                  <td style={{ padding: "13px 16px" }}>
                    <button style={{ background: "transparent", border: "none", color: cfg.color, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600 }}>
                      <Eye size={13} /> Ouvrir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <DossierDocument
          item={selected} type={type}
          onClose={() => setSelected(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}

/* ─── CONTACTS ─── */
function ContactsTab({ contacts, onDataChange }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("Tous");
  const [statusErr, setStatusErr] = useState("");

  const filtered = filter === "Tous" ? contacts : contacts.filter(c => (c.statut || "Nouveau") === filter);

  const handleStatusUpdate = async (id, newStatus) => {
    setStatusErr("");
    try {
      await adminUpdateStatus("contacts", id, newStatus);
      onDataChange(prev => prev.map(d => d.id === id ? { ...d, statut: newStatus } : d));
      if (selected?.id === id) setSelected(s => ({ ...s, statut: newStatus }));
    } catch (e) {
      setStatusErr("Erreur mise à jour : " + (e.message || "réessayez"));
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ color: TEXT, fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>Messages de contact</h2>
        <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>{contacts.length} message(s) reçu(s) via le formulaire</p>
      </div>

      {statusErr && (
        <div style={{ background: "rgba(252,92,101,0.1)", border: "1px solid rgba(252,92,101,0.3)", borderRadius: 10, padding: "10px 16px", color: "#FC5C65", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
          ⚠ {statusErr}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["Tous", "Nouveau", "Lu", "Répondu"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
            fontWeight: filter === s ? 700 : 500,
            border: `1px solid ${filter === s ? "#4F8EF7" : "rgba(15,23,42,0.1)"}`,
            background: filter === s ? "rgba(79,142,247,0.12)" : WHITE,
            color: filter === s ? "#4F8EF7" : MUTED,
          }}>
            {s}{s !== "Tous" ? ` (${contacts.filter(c => (c.statut || "Nouveau") === s).length})` : ""}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: WHITE, borderRadius: 16, padding: 56, textAlign: "center", color: MUTED, fontSize: 14, border: "1px solid rgba(15,23,42,0.06)" }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>✉️</div>Aucun message
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(msg => {
            const isNew = !msg.statut || msg.statut === "Nouveau";
            return (
              <div key={msg.id} onClick={() => setSelected(msg)} style={{
                background: WHITE, borderRadius: 14, padding: "20px 24px",
                border: `1px solid ${isNew ? "rgba(79,142,247,0.3)" : "rgba(15,23,42,0.07)"}`,
                cursor: "pointer", display: "flex", gap: 16, alignItems: "flex-start",
                boxShadow: isNew ? "0 2px 14px rgba(79,142,247,0.1)" : "0 2px 8px rgba(15,23,42,0.04)",
                transition: "transform 0.18s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                <div style={{
                  width: 46, height: 46, borderRadius: "50%", background: "rgba(79,142,247,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Mail size={19} color="#4F8EF7" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, gap: 12, alignItems: "center" }}>
                    <span style={{ color: TEXT, fontWeight: 700, fontSize: 14 }}>{msg.nom || "Anonyme"}</span>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                      <StatusBadge statut={msg.statut || "Nouveau"} />
                      <span style={{ color: MUTED, fontSize: 12 }}>
                        {msg.created_at ? new Date(msg.created_at).toLocaleDateString("fr-FR") : "—"}
                      </span>
                    </div>
                  </div>
                  {msg.email && <div style={{ color: "#4F8EF7", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{msg.email}</div>}
                  <div style={{ color: MUTED, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {msg.message || "—"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <DossierDocument
          item={selected} type="contact"
          onClose={() => setSelected(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}

/* ─── PAGE ADMIN PRINCIPALE ─── */
export default function AdminPage({ onBack }) {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [tab, setTab] = useState("overview");
  const [articles, setArticles] = useState([]);
  const [domaines, setDomaines] = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [pannes, setPannes] = useState([]);
  const [emails, setEmails] = useState([]);
  const [plateformes, setPlateformes] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [arts, doms, equips, pnns, mails, plats, ctcts] = await Promise.all([
        fetchActualites(),
        adminFetchDemandsDomaine(),
        adminFetchDemandesEquipement(),
        adminFetchDeclarationsPanne(),
        adminFetchDemandesEmail(),
        adminFetchDemandesPlateforme(),
        adminFetchContacts(),
      ]);
      setArticles(arts || []);
      setDomaines(doms || []);
      setEquipements(equips || []);
      setPannes(pnns || []);
      setEmails(mails || []);
      setPlateformes(plats || []);
      setContacts(ctcts || []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { if (auth) loadAll(); }, [auth]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) { setAuth(true); setPwErr(""); }
    else setPwErr("Mot de passe incorrect.");
  };

  /* --- LOGIN --- */
  if (!auth) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: `linear-gradient(135deg, ${DARK} 0%, ${NAVY} 100%)`,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}>
        <div style={{ background: WHITE, borderRadius: 24, padding: "50px 42px", width: "100%", maxWidth: 420, boxShadow: "0 40px 90px rgba(0,0,0,0.45)" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <img src={siteLogo} alt="ADETIC" style={{ width: 68, height: 68, borderRadius: 18, objectFit: "cover", marginBottom: 18, border: `2px solid ${ACCENT}55` }} />
            <div style={{ color: TEXT, fontWeight: 900, fontSize: 22, letterSpacing: 0.5 }}>Dashboard Admin</div>
            <div style={{ color: MUTED, fontSize: 14, marginTop: 5 }}>ADETIC — Espace administrateur</div>
          </div>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: TEXT, display: "block", marginBottom: 7 }}>Mot de passe</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••" autoFocus
                style={{
                  width: "100%", padding: "13px 16px", borderRadius: 10, fontSize: 15,
                  border: `1.5px solid ${pwErr ? "#ef4444" : "rgba(15,23,42,0.12)"}`,
                  outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: TEXT,
                }}
                onFocus={e => e.target.style.borderColor = ACCENT}
                onBlur={e => e.target.style.borderColor = pwErr ? "#ef4444" : "rgba(15,23,42,0.12)"}
              />
              {pwErr && <div style={{ color: "#ef4444", fontSize: 13, marginTop: 6 }}>{pwErr}</div>}
            </div>
            <button type="submit" style={{
              background: ACCENT, color: WHITE, border: "none", padding: "14px",
              borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer",
              boxShadow: "0 8px 28px rgba(0,201,167,0.32)",
            }}>Accéder au dashboard</button>
          </form>
          <div style={{ textAlign: "center", marginTop: 26 }}>
            <button onClick={onBack} style={{ background: "transparent", border: "none", color: MUTED, cursor: "pointer", fontSize: 13 }}>
              ← Retour au site public
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* --- DASHBOARD --- */
  const TABS = [
    { id: "overview", label: "Vue d'ensemble", Icon: LayoutDashboard },
    { id: "articles", label: "Articles", Icon: Newspaper },
    { id: "domaines", label: "Domaines .td", Icon: Globe },
    { id: "equipements", label: "Équipements", Icon: Monitor },
    { id: "pannes", label: "Pannes", Icon: AlertTriangle },
    { id: "emails", label: "Mails", Icon: Mail },
    { id: "plateformes", label: "Plateformes", Icon: Layers },
    { id: "contacts", label: "Messages", Icon: Eye },
  ];

  const pendingCount = [...domaines, ...equipements].filter(d => d.statut === "En attente").length;
  const activePannes = pannes.filter(p => ["Ouvert", "En cours"].includes(p.statut)).length;
  const newContacts = contacts.filter(c => !c.statut || c.statut === "Nouveau").length;

  const badgeFor = (id) => ({
    domaines: domaines.filter(d => d.statut === "En attente").length,
    pannes: activePannes,
    contacts: newContacts,
  }[id] || 0);

  const stats = {
    articles: articles.length,
    pending: pendingCount,
    activePannes,
    contacts: contacts.length,
    recent: [
      ...domaines.slice(0, 2).map(d => ({ label: d.domaine_souhaite || d.nom_organisation, sub: `Domaine .td · ${d.nom_contact || ""}`, color: ACCENT, statut: d.statut })),
      ...pannes.slice(0, 2).map(p => ({ label: p.type_panne || p.localisation, sub: `Panne · ${p.nom_declarant || ""}`, color: "#FC5C65", statut: p.statut })),
      ...contacts.slice(0, 2).map(c => ({ label: c.nom || "Anonyme", sub: (c.message || "").substring(0, 50), color: "#4F8EF7", statut: c.statut || "Nouveau" })),
    ].slice(0, 6),
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", background: BG }}>
      {/* Sidebar */}
      <div style={{
        width: 250, flexShrink: 0, background: DARK,
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
      }}>
        <div style={{ padding: "26px 18px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={siteLogo} alt="ADETIC" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} />
            <div>
              <div style={{ color: WHITE, fontWeight: 800, fontSize: 13, letterSpacing: 0.5 }}>ADETIC Admin</div>
              <div style={{ color: ACCENT, fontSize: 9, letterSpacing: 2, fontWeight: 700 }}>DASHBOARD</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "4px 10px" }}>
          {TABS.map(({ id, label, Icon }) => {
            const active = tab === id;
            const badge = badgeFor(id);
            return (
              <button key={id} onClick={() => setTab(id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 11,
                padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                marginBottom: 3, textAlign: "left", transition: "all 0.18s",
                background: active ? "rgba(0,201,167,0.16)" : "transparent",
                color: active ? ACCENT : "rgba(255,255,255,0.58)",
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                <span style={{ fontSize: 13, fontWeight: active ? 700 : 400, flex: 1 }}>{label}</span>
                {badge > 0 && (
                  <span style={{
                    background: id === "pannes" ? "#FC5C65" : ACCENT,
                    color: WHITE, fontSize: 10, fontWeight: 700,
                    minWidth: 18, height: 18, borderRadius: 9, padding: "0 5px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "10px 10px 22px" }}>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 12 }}>
            <button onClick={() => loadAll()} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "9px 14px", borderRadius: 10, border: "none", cursor: "pointer",
              background: "transparent", color: "rgba(255,255,255,0.4)",
            }}
              onMouseEnter={e => e.currentTarget.style.color = ACCENT}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
              <RefreshCw size={15} /><span style={{ fontSize: 13 }}>Actualiser</span>
            </button>
            <button onClick={onBack} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "9px 14px", borderRadius: 10, border: "none", cursor: "pointer",
              background: "transparent", color: "rgba(255,255,255,0.4)",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
              <ChevronLeft size={15} /><span style={{ fontSize: 13 }}>Retour au site</span>
            </button>
            <button onClick={() => { setAuth(false); setPassword(""); onBack(); }} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "9px 14px", borderRadius: 10, border: "none", cursor: "pointer",
              background: "transparent", color: "rgba(255,255,255,0.4)",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "#FC5C65"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
              <LogOut size={15} /><span style={{ fontSize: 13 }}>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div style={{ flex: 1, padding: "40px 36px", overflowY: "auto", minHeight: "100vh" }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: MUTED, fontSize: 15, flexDirection: "column", gap: 14 }}>
            <RefreshCw size={28} color={ACCENT} style={{ animation: "spin 1s linear infinite" }} />
            Chargement des données...
          </div>
        ) : (
          <>
            {tab === "overview" && <OverviewTab stats={stats} domaines={domaines} equipements={equipements} pannes={pannes} emails={emails} plateformes={plateformes} contacts={contacts} />}
            {tab === "articles" && <ArticlesTab articles={articles} onRefresh={loadAll} />}
            {tab === "domaines" && <DossiersTab type="domaine" data={domaines} onDataChange={setDomaines} />}
            {tab === "equipements" && <DossiersTab type="equipement" data={equipements} onDataChange={setEquipements} />}
            {tab === "pannes" && <DossiersTab type="panne" data={pannes} onDataChange={setPannes} />}
            {tab === "emails" && <DossiersTab type="email" data={emails} onDataChange={setEmails} />}
            {tab === "plateformes" && <DossiersTab type="plateforme" data={plateformes} onDataChange={setPlateformes} />}
            {tab === "contacts" && <ContactsTab contacts={contacts} onDataChange={setContacts} />}
          </>
        )}
      </div>
    </div>
  );
}
