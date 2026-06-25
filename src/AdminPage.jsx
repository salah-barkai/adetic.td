import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard, Newspaper, Globe, Monitor, AlertTriangle,
  Mail, Layers, Plus, Eye, LogOut, Printer, ChevronLeft,
  Clock, RefreshCw, Pencil, Trash2, Activity, FileDown, Search,
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
  supabase,
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
const DND  = "DIRECTION DE NOM DE DOMAINE ET ADRESSE IP";
const DITIC = "DIRECTION DES INFRASTRUCTURES TIC";
const TYPE_CFG = {
  domaine:    { label: "Demande de nom de domaine .td",       color: "#00C9A7", section: "DOMAINES .TD",    direction: DND,   service: "SERVICE DE NOM DE DOMAINE ET ADRESSE IP" },
  equipement: { label: "Demande d'equipements reseau",        color: "#4F8EF7", section: "EQUIPEMENTS",     direction: DITIC, service: "SERVICE DES INFRASTRUCTURES TIC"          },
  panne:      { label: "Declaration de panne technique",      color: "#FC5C65", section: "INCIDENTS RESEAU", direction: DITIC, service: "SERVICE DES INFRASTRUCTURES TIC"          },
  email:      { label: "Demande de creation de mails",        color: "#A55EEA", section: "MAILS",           direction: DND,   service: "SERVICE DE NOM DE DOMAINE ET ADRESSE IP" },
  plateforme: { label: "Demande de conception de plateforme", color: "#20BF6B", section: "PLATEFORMES",     direction: DND,   service: "SERVICE DE SYSTEME D'INFORMATION"        },
  contact:    { label: "Message du formulaire de contact",    color: "#4F8EF7", section: "CONTACTS",         direction: "DIRECTION DE LA COMMUNICATION", service: "SERVICE DE COMMUNICATION" },
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

  const genFormalText = () => {
    const org   = item.nom_organisation || "notre institution";
    const entite = item.type_entite ? ` (${item.type_entite})` : "";
    const resp  = item.nom_contact || item.responsable_nom || item.nom_responsable || "";
    const signBy = resp ? `Le responsable désigné pour le suivi de ce dossier est ${resp}.` : "";
    const closing = (
      <p style={{ margin: "12px 0 0", fontStyle: "italic", color: "#4a5568" }}>
        Dans l'attente d'une suite favorable à notre requête, nous vous prions d'agréer,{" "}
        <strong>Monsieur le Directeur Général</strong>, l'expression de notre haute considération.
      </p>
    );
    const pStyle = { margin: "0 0 10px", lineHeight: 1.85, color: "#1e293b", fontSize: 12.5 };
    const salut = (
      <p style={{ ...pStyle, fontWeight: 700, marginBottom: 14 }}>Monsieur le Directeur Général,</p>
    );
    if (type === "domaine") return (<>
      {salut}
      <p style={pStyle}>
        Nous avons l'honneur de porter à votre haute attention la présente demande d'enregistrement
        de nom de domaine <strong>.td</strong>, formulée au nom de <strong>{org}</strong>{entite}.
        Cette démarche s'inscrit dans le cadre du renforcement de la présence numérique institutionnelle
        de notre organisation sur l'espace internet national.
      </p>
      <p style={pStyle}>
        À cet effet, nous sollicitons votre bienveillante approbation pour l'attribution du domaine{" "}
        <strong>« {item.domaine_souhaite || "—"} »</strong>, conformément aux procédures établies
        par l'Agence pour la gestion des noms de domaine .td. Nous nous engageons à respecter
        scrupuleusement l'ensemble des obligations liées à l'utilisation dudit domaine.{" "}
        {signBy}
      </p>
      {closing}
    </>);
    if (type === "equipement") return (<>
      {salut}
      <p style={pStyle}>
        Nous avons l'honneur de soumettre à votre haute bienveillance la présente demande de fourniture
        et d'installation d'équipements réseau au profit de <strong>{org}</strong>{entite}.
        Les besoins exprimés portent sur des équipements de type{" "}
        <strong>« {item.type_equipement || "—"} »</strong>{item.quantite ? ` (quantité : ${item.quantite})` : ""},
        destinés à être déployés sur le site de <strong>{item.localisation_ville || "—"}</strong>.
      </p>
      <p style={pStyle}>
        Dans le souci d'assurer la continuité et la qualité des services informatiques de notre institution,
        nous sollicitons votre approbation pour la prise en charge de cette demande par les équipes
        compétentes de la Direction des Infrastructures TIC de l'ADETIC, selon les spécifications
        techniques détaillées dans le présent dossier. {signBy}
      </p>
      {closing}
    </>);
    if (type === "panne") return (<>
      {salut}
      <p style={pStyle}>
        Nous avons l'honneur de vous signaler, par la présente déclaration, la survenance d'une panne
        technique de type <strong>« {item.type_panne || "—"} »</strong> affectant les infrastructures
        de notre organisation, localisées à <strong>{item.localisation || "—"}</strong>.
        {item.niveau_urgence ? ` Le niveau d'urgence de cet incident est évalué à : ${item.niveau_urgence}.` : ""}
        {item.nom_declarant ? ` Ce signalement est effectué par ${item.nom_declarant}.` : ""}
      </p>
      <p style={pStyle}>
        Face à l'impact de cette défaillance sur nos activités opérationnelles, nous sollicitons votre
        intervention diligente afin qu'une équipe technique de l'ADETIC puisse procéder aux diagnostics
        et aux opérations de rétablissement nécessaires dans les meilleurs délais, conformément aux
        engagements de service de l'Agence.
      </p>
      <p style={{ ...pStyle, fontStyle: "italic", color: "#4a5568", margin: 0 }}>
        Dans l'attente de votre diligente intervention, nous vous prions d'agréer,{" "}
        <strong>Monsieur le Directeur Général</strong>, l'expression de notre haute considération.
      </p>
    </>);
    if (type === "email") return (<>
      {salut}
      <p style={pStyle}>
        Nous avons l'honneur de soumettre à votre haute attention la présente demande de création
        de comptes de messagerie professionnelle institutionnelle, au bénéfice de{" "}
        <strong>{org}</strong>{entite}. Cette demande porte sur la création de{" "}
        <strong>{item.nombre_comptes || "—"} boîte(s) mail</strong> sous le domaine{" "}
        <strong>« {item.domaine_email || "—"} »</strong>. {signBy}
      </p>
      <p style={pStyle}>
        La mise en place de ces adresses de messagerie institutionnelle permettra à notre organisation
        de disposer de moyens de communication officiels, sécurisés et conformes aux standards
        numériques en vigueur. Nous sollicitons votre bienveillante approbation pour la prise en
        charge de cette demande dans les meilleurs délais.
      </p>
      {closing}
    </>);
    if (type === "plateforme") return (<>
      {salut}
      <p style={pStyle}>
        Nous avons l'honneur de soumettre à votre haute bienveillance la présente demande de conception
        et de développement d'une plateforme numérique
        {item.type_plateforme ? <> de type <strong>« {item.type_plateforme} »</strong></> : ""},
        dénommée <strong>« {item.nom_projet || "—"} »</strong>, au profit de{" "}
        <strong>{org}</strong>{entite}. {signBy}
      </p>
      <p style={pStyle}>
        Ce projet numérique vise à répondre aux besoins opérationnels exprimés par notre organisation
        et détaillés dans le présent dossier technique. Nous sollicitons votre approbation pour la
        prise en charge de sa réalisation par les équipes compétentes de l'ADETIC, ainsi que votre
        accompagnement technique tout au long du processus de développement et de déploiement.
      </p>
      {closing}
    </>);
    return (<>
      <p style={{ ...pStyle, fontWeight: 700, marginBottom: 14 }}>Monsieur le Directeur Général,</p>
      <p style={pStyle}>
        J'ai l'honneur de vous adresser le présent message par le biais du formulaire de contact
        officiel du site institutionnel de l'ADETIC
        {item.nom ? <>, au nom de <strong>{item.nom}</strong></> : ""}.
        Je vous serais reconnaissant(e) de bien vouloir prendre en considération ma requête et
        de m'apporter une réponse dans les meilleurs délais.
      </p>
      <p style={{ ...pStyle, fontStyle: "italic", color: "#4a5568", margin: 0 }}>
        Dans l'attente de votre retour, veuillez agréer, <strong>Monsieur le Directeur Général</strong>,
        l'expression de ma haute considération.
      </p>
    </>);
  };

  const getGroups = () => {
    switch (type) {
      case "domaine": return [
        { title: "Identification de l'entité", fields: [
          { label: "Organisation", key: "nom_organisation" },
          { label: "Type d'entité", key: "type_entite" },
          { label: "Adresse", key: "adresse", full: true },
        ]},
        { title: "Contact référent", fields: [
          { label: "Nom du contact", key: "nom_contact" },
          { label: "Adresse e-mail", key: "email" },
          { label: "Téléphone", key: "telephone" },
        ]},
        { title: "Détails de la demande", fields: [
          { label: "Domaine souhaité", key: "domaine_souhaite" },
          { label: "Description de l'usage", key: "usage_description", full: true },
        ]},
      ];
      case "equipement": return [
        { title: "Institution bénéficiaire", fields: [
          { label: "Organisation", key: "nom_organisation" },
          { label: "Ville", key: "localisation_ville" },
          { label: "Adresse exacte", key: "adresse_exacte", full: true },
        ]},
        { title: "Spécifications techniques", fields: [
          { label: "Type d'équipement", key: "type_equipement" },
          { label: "Quantité demandée", key: "quantite" },
          { label: "Description des besoins", key: "description_besoins", full: true },
        ]},
        { title: "Responsable du suivi", fields: [
          { label: "Responsable", key: "responsable_nom" },
          { label: "E-mail responsable", key: "responsable_email" },
          { label: "Téléphone responsable", key: "responsable_telephone" },
          { label: "Date d'installation souhaitée", key: "date_souhaitee" },
        ]},
      ];
      case "panne": return [
        { title: "Nature de l'incident", fields: [
          { label: "Type de panne", key: "type_panne" },
          { label: "Niveau d'urgence", key: "niveau_urgence" },
          { label: "Utilisateurs affectés", key: "nombre_utilisateurs_affectes" },
        ]},
        { title: "Localisation & équipement concerné", fields: [
          { label: "Localisation", key: "localisation" },
          { label: "Équipement concerné", key: "equipement_concerne" },
          { label: "Description de la panne", key: "description_panne", full: true },
        ]},
        { title: "Contact déclarant", fields: [
          { label: "Déclarant", key: "nom_declarant" },
          { label: "E-mail déclarant", key: "email_declarant" },
          { label: "Téléphone déclarant", key: "telephone_declarant" },
        ]},
      ];
      case "email": return [
        { title: "Institution bénéficiaire", fields: [
          { label: "Organisation", key: "nom_organisation" },
          { label: "Type d'entité", key: "type_entite" },
          { label: "Adresse", key: "adresse", full: true },
        ]},
        { title: "Détails de la demande", fields: [
          { label: "Domaine de messagerie", key: "domaine_email" },
          { label: "Nombre de comptes", key: "nombre_comptes" },
        ]},
        { title: "Responsable du suivi", fields: [
          { label: "Responsable", key: "nom_responsable" },
          { label: "Adresse e-mail", key: "email" },
          { label: "Téléphone", key: "telephone" },
        ]},
      ];
      case "plateforme": return [
        { title: "Identification du projet", fields: [
          { label: "Nom du projet", key: "nom_projet" },
          { label: "Type de plateforme", key: "type_plateforme" },
          { label: "Organisation", key: "nom_organisation" },
          { label: "Type d'entité", key: "type_entite" },
        ]},
        { title: "Description & besoins", fields: [
          { label: "Description des besoins", key: "description_besoins", full: true },
        ]},
        { title: "Responsable du projet", fields: [
          { label: "Responsable", key: "nom_responsable" },
          { label: "Adresse e-mail", key: "email" },
          { label: "Téléphone", key: "telephone" },
          { label: "Date souhaitée", key: "date_souhaitee" },
        ]},
      ];
      default: return [
        { title: "Expéditeur", fields: [
          { label: "Nom complet", key: "nom" },
          { label: "Adresse e-mail", key: "email" },
        ]},
        { title: "Contenu du message", fields: [
          { label: "Message", key: "message", full: true },
        ]},
      ];
    }
  };

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

      {/* BANDEAU REPUBLIQUE DU TCHAD */}
      <div style={{
        background: "#f8f9fa", borderBottom: "3px solid #e2e8f0",
        padding: "10px 40px", position: "relative", zIndex: 1,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 2.5, color: "#1e293b", textTransform: "uppercase" }}>REPUBLIQUE DU TCHAD</div>
          <div style={{ fontSize: 8.5, color: "#64748b", letterSpacing: 1.5, marginTop: 2 }}>Unité — Travail — Progrès</div>
        </div>
        <div style={{ width: 1, height: 36, background: "#cbd5e1", margin: "0 24px" }} />
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: "#1e293b", textTransform: "uppercase" }}>Ministère des Postes et des Nouvelles Technologies</div>
          <div style={{ fontSize: 8.5, color: "#64748b", letterSpacing: 1, marginTop: 2 }}>N'Djamena, République du Tchad</div>
        </div>
      </div>

      {/* EN-TÊTE OFFICIEL ADETIC */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, #0d1a3d 60%, #091428 100%)`,
        padding: "24px 40px 0 40px", position: "relative", zIndex: 1,
      }}>
        {/* République + Institution */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <img src={logoB64 || siteLogo} alt="ADETIC" style={{
              width: 62, height: 62, borderRadius: 14, objectFit: "cover",
              border: `2px solid ${cfg.color}60`, flexShrink: 0,
            }} />
            <div>
              <div style={{ color: WHITE, fontWeight: 900, fontSize: 22, letterSpacing: 3 }}>ADETIC</div>
              <div style={{ color: cfg.color, fontSize: 8.5, letterSpacing: 2, fontWeight: 700, marginTop: 3 }}>
                AGENCE DE DEVELOPPEMENT DES TECHNOLOGIES DE L'INFORMATION ET DE LA COMMUNICATION
              </div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 9.5, marginTop: 4 }}>
                Loi n° 012/PR/2014 · B.P. 6531 N'Djamena, Tchad · adetic.td
              </div>
            </div>
          </div>
          {/* Référence document */}
          <div style={{
            background: "rgba(255,255,255,0.05)", borderRadius: 12,
            border: `1px solid ${cfg.color}40`, padding: "14px 20px", textAlign: "right",
          }}>
            <div style={{ color: cfg.color, fontSize: 8, letterSpacing: 2.5, fontWeight: 800, marginBottom: 6 }}>
              REFERENCE DU DOSSIER
            </div>
            <div style={{ color: WHITE, fontWeight: 900, fontSize: 18, letterSpacing: 2, fontFamily: "'Courier New', monospace" }}>
              {ref}
            </div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9.5, marginTop: 6 }}>
              Recu le {dateReception}
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
          <div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 8, fontWeight: 700, letterSpacing: 2.5, marginBottom: 3 }}>
              {cfg.direction}
            </div>
            <div style={{ color: cfg.color, fontSize: 8.5, fontWeight: 800, letterSpacing: 2, marginBottom: 3 }}>
              {cfg.service}
            </div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 600 }}>
              {cfg.label}
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 8.5, letterSpacing: 1 }}>
              Reçu le {dateReception}
            </div>
          </div>
        </div>
      </div>

      {/* Ligne teal décorative */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${cfg.color}, transparent)` }} />

      {/* CORPS DU DOCUMENT */}
      <div style={{ padding: "30px 40px", position: "relative", zIndex: 1 }}>

        {/* COURRIER FORMEL */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 3, height: 16, background: cfg.color, borderRadius: 2, flexShrink: 0 }} />
            <div style={{ color: TEXT, fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase" }}>
              Courrier de demande
            </div>
          </div>
          <div style={{
            padding: "20px 24px",
            background: "rgba(15,23,42,0.012)",
            border: "1px solid rgba(15,23,42,0.09)",
            borderRadius: 10,
            borderLeft: `4px solid ${cfg.color}`,
          }}>
            {genFormalText()}
          </div>
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
            {/* Zone cachet */}
            <div style={{ flexShrink: 0, textAlign: "center" }}>
              <div style={{ color: MUTED, fontSize: 10, fontWeight: 600, letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>
                Cachet officiel
              </div>
              <div style={{
                width: 100, height: 100, borderRadius: "50%",
                border: `1.5px dashed rgba(15,23,42,0.18)`,
                background: "rgba(15,23,42,0.012)",
              }} />
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

      {/* ── Légende des statuts ── */}
      <div style={{
        background: WHITE, borderRadius: 12, padding: "12px 18px",
        border: "1px solid rgba(15,23,42,0.06)", marginBottom: 20,
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
      }}>
        <span style={{ color: MUTED, fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", flexShrink: 0 }}>Légende des statuts :</span>
        {[
          { color: "#F7B731", label: "En attente / Nouveau / Ouvert", desc: "action requise" },
          { color: "#4F8EF7", label: "En cours",                       desc: "en traitement" },
          { color: ACCENT,    label: "Lu",                              desc: "pris en compte" },
          { color: "#20BF6B", label: "Traité / Résolu / Répondu",       desc: "clôturé" },
          { color: "#FC5C65", label: "Rejeté",                          desc: "refusé" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", background: `${s.color}0d`, borderRadius: 20, border: `1px solid ${s.color}30` }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11.5, color: TEXT, fontWeight: 600 }}>{s.label}</span>
            <span style={{ fontSize: 11, color: MUTED }}>· {s.desc}</span>
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

    </div>
  );
}

/* ─── ACTIVITÉS RÉCENTES ─── */
function ActivitesTab({ domaines, equipements, pannes, emails, plateformes }) {
  const [filter, setFilter]         = useState("Tous");
  const [search, setSearch]         = useState("");
  const [generating, setGenerating] = useState(false);
  const [logoB64, setLogoB64]       = useState("");

  useEffect(() => {
    fetch(siteLogo)
      .then(r => r.blob())
      .then(blob => new Promise(res => { const rd = new FileReader(); rd.onloadend = () => res(rd.result); rd.readAsDataURL(blob); }))
      .then(setLogoB64).catch(() => {});
  }, []);

  const TYPE_META = {
    domaine:    { label: "Domaine .td",  color: "#00C9A7" },
    equipement: { label: "Equipement",   color: "#4F8EF7" },
    panne:      { label: "Panne",        color: "#FC5C65" },
    email:      { label: "Mail",         color: "#A55EEA" },
    plateforme: { label: "Plateforme",   color: "#20BF6B" },
  };

  const allActivities = [
    ...domaines.map(d => ({
      ...d, _type: "domaine",
      _label: d.domaine_souhaite || d.nom_organisation || "—",
      _sub:   d.nom_contact || d.email || "—",
      _org:   d.nom_organisation || "—",
      _ref:   `ADETIC-DOMAINE-${String(d.id).padStart(5,"0")}`,
    })),
    ...equipements.map(d => ({
      ...d, _type: "equipement",
      _label: d.nom_organisation || d.type_equipement || "—",
      _sub:   d.responsable_nom || d.localisation_ville || "—",
      _org:   d.nom_organisation || "—",
      _ref:   `ADETIC-EQUIPEMENT-${String(d.id).padStart(5,"0")}`,
    })),
    ...pannes.map(d => ({
      ...d, _type: "panne",
      _label: d.type_panne || d.localisation || "—",
      _sub:   d.nom_declarant || d.niveau_urgence || "—",
      _org:   d.localisation || "—",
      _ref:   `ADETIC-PANNE-${String(d.id).padStart(5,"0")}`,
    })),
    ...emails.map(d => ({
      ...d, _type: "email",
      _label: d.nom_organisation || d.domaine_email || "—",
      _sub:   d.nom_responsable || "—",
      _org:   d.nom_organisation || "—",
      _ref:   `ADETIC-EMAIL-${String(d.id).padStart(5,"0")}`,
    })),
    ...plateformes.map(d => ({
      ...d, _type: "plateforme",
      _label: d.nom_projet || d.nom_organisation || "—",
      _sub:   d.nom_responsable || d.type_plateforme || "—",
      _org:   d.nom_organisation || "—",
      _ref:   `ADETIC-PLATEFORME-${String(d.id).padStart(5,"0")}`,
    })),
  ].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  const FILTERS = [
    { id: "Tous",       label: "Tous",        count: allActivities.length },
    { id: "domaine",    label: "Domaines",    count: domaines.length },
    { id: "equipement", label: "Equipements", count: equipements.length },
    { id: "panne",      label: "Pannes",      count: pannes.length },
    { id: "email",      label: "Mails",       count: emails.length },
    { id: "plateforme", label: "Plateformes", count: plateformes.length },
  ];

  const filtered = allActivities
    .filter(a => filter === "Tous" || a._type === filter)
    .filter(a => !search.trim() ||
      a._label.toLowerCase().includes(search.toLowerCase()) ||
      a._sub.toLowerCase().includes(search.toLowerCase()) ||
      a._ref.toLowerCase().includes(search.toLowerCase()) ||
      (a._org || "").toLowerCase().includes(search.toLowerCase())
    );

  /* ── Rapport PDF professionnel ── */
  const handlePDF = () => {
    setGenerating(true);
    const now     = new Date();
    const dateStr = now.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
    const timeStr = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    const SERVICES = [
      { id: "domaine",    label: "Nom de Domaine .td",       data: domaines    },
      { id: "equipement", label: "Installation d'Equipements", data: equipements },
      { id: "panne",      label: "Declarations de Panne",     data: pannes      },
      { id: "email",      label: "Creation de Mails",         data: emails      },
      { id: "plateforme", label: "Conception de Plateforme",  data: plateformes },
    ];

    const totalPending = allActivities.filter(a => ["En attente","Ouvert","Nouveau"].includes(a.statut || "")).length;
    const totalInProg  = allActivities.filter(a => a.statut === "En cours").length;
    const totalDone    = allActivities.filter(a => ["Traité","Résolu","Répondu","Fermé"].includes(a.statut || "")).length;
    const totalRej     = allActivities.filter(a => a.statut === "Rejeté").length;

    const summaryRows = SERVICES.map((s, idx) => {
      const pending = s.data.filter(d => ["En attente","Ouvert","Nouveau"].includes(d.statut || "")).length;
      const inprog  = s.data.filter(d => d.statut === "En cours").length;
      const done    = s.data.filter(d => ["Traité","Résolu","Répondu","Fermé"].includes(d.statut || "")).length;
      const rej     = s.data.filter(d => d.statut === "Rejeté").length;
      const bg = idx % 2 === 0 ? "#f8fafc" : "#ffffff";
      return `<tr style="background:${bg};">
        <td style="padding:9px 12px;font-size:11px;font-weight:600;border:1px solid #dde3ec;">${s.label}</td>
        <td style="padding:9px 12px;text-align:center;font-size:11px;font-weight:700;border:1px solid #dde3ec;">${s.data.length}</td>
        <td style="padding:9px 12px;text-align:center;font-size:11px;border:1px solid #dde3ec;">${pending}</td>
        <td style="padding:9px 12px;text-align:center;font-size:11px;border:1px solid #dde3ec;">${inprog}</td>
        <td style="padding:9px 12px;text-align:center;font-size:11px;border:1px solid #dde3ec;">${done}</td>
        <td style="padding:9px 12px;text-align:center;font-size:11px;border:1px solid #dde3ec;">${rej}</td>
      </tr>`;
    }).join("");

    const detailRows = allActivities.map((a, idx) => {
      const meta = TYPE_META[a._type] || {};
      const date = a.created_at ? new Date(a.created_at).toLocaleDateString("fr-FR") : "—";
      const statut = a.statut || "Nouveau";
      const bg = idx % 2 === 0 ? "#f8fafc" : "#ffffff";
      return `<tr style="background:${bg};">
        <td style="padding:7px 10px;font-size:10px;border:1px solid #dde3ec;white-space:nowrap;">${date}</td>
        <td style="padding:7px 10px;font-size:10px;font-weight:600;border:1px solid #dde3ec;">${meta.label || "—"}</td>
        <td style="padding:7px 10px;font-size:10px;border:1px solid #dde3ec;white-space:nowrap;">${a._ref}</td>
        <td style="padding:7px 10px;font-size:11px;font-weight:600;border:1px solid #dde3ec;max-width:170px;overflow:hidden;">${a._label}</td>
        <td style="padding:7px 10px;font-size:10px;color:#475569;border:1px solid #dde3ec;max-width:150px;overflow:hidden;">${a._sub}</td>
        <td style="padding:7px 10px;font-size:10px;font-weight:700;border:1px solid #dde3ec;white-space:nowrap;">${statut}</td>
      </tr>`;
    }).join("");

    const logoHtml = logoB64
      ? `<img src="${logoB64}" style="width:60px;height:60px;object-fit:cover;border:2px solid #00C9A7;" />`
      : `<div style="width:60px;height:60px;background:#00C9A7;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:22px;color:#fff;border:2px solid #00C9A7;">A</div>`;

    const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
<title>Rapport des Activites E-Services — ADETIC — ${dateStr}</title>
<style>
  *{box-sizing:border-box;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}
  @page{size:A4 portrait;margin:18mm 16mm;}
  body{margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;color:#0f172a;font-size:11px;line-height:1.5;}
  table{width:100%;border-collapse:collapse;}
  th{padding:9px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;background:#1e293b;color:#fff;border:1px solid #1e293b;}
  .kpi-box{border:1px solid #cbd5e1;padding:14px 16px;text-align:center;}
  .section-title{font-size:12px;font-weight:800;color:#0f172a;margin:22px 0 8px;padding:6px 10px;background:#e2e8f0;border-left:4px solid #00C9A7;letter-spacing:.3px;text-transform:uppercase;}
  .separator{border:none;border-top:1px solid #cbd5e1;margin:12px 0;}
</style></head><body>

<!-- EN-TETE INSTITUTIONNEL -->
<table style="margin-bottom:18px;border-bottom:3px solid #00C9A7;padding-bottom:14px;">
  <tr>
    <td style="width:72px;vertical-align:middle;">${logoHtml}</td>
    <td style="padding-left:16px;vertical-align:middle;">
      <div style="font-size:18px;font-weight:900;letter-spacing:.5px;color:#050A19;">ADETIC</div>
      <div style="font-size:9.5px;font-weight:700;color:#475569;letter-spacing:1.5px;text-transform:uppercase;margin-top:2px;">Agence de Developpement des Technologies de l'Information et de la Communication du Tchad</div>
      <div style="font-size:9px;color:#94a3b8;margin-top:3px;">Avenue du Colonel Hassan Moursal Kourda — BP 240, N'Djamena, Tchad — adetic.td</div>
    </td>
    <td style="text-align:right;vertical-align:middle;padding-left:20px;">
      <div style="font-size:14px;font-weight:900;color:#050A19;white-space:nowrap;">RAPPORT DES ACTIVITES</div>
      <div style="font-size:10px;color:#475569;margin-top:4px;">E-Services — Systeme de gestion numerique</div>
      <div style="font-size:9px;color:#94a3b8;margin-top:3px;">Genere le ${dateStr} a ${timeStr}</div>
      <div style="font-size:9px;color:#94a3b8;">Ref. : ADETIC/RAPP/${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,"0")}</div>
    </td>
  </tr>
</table>

<!-- INDICATEURS CLES -->
<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:0;margin-bottom:20px;border:1px solid #cbd5e1;">
  ${[
    { label:"Total dossiers",  val: allActivities.length },
    { label:"En attente",      val: totalPending },
    { label:"En cours",        val: totalInProg  },
    { label:"Traites",         val: totalDone    },
    { label:"Rejetes",         val: totalRej     },
  ].map((k,i)=>`<div class="kpi-box" style="${i>0?"border-left:1px solid #cbd5e1;":""}">
    <div style="font-size:22px;font-weight:900;color:#050A19;">${k.val}</div>
    <div style="font-size:9px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin-top:3px;">${k.label}</div>
  </div>`).join("")}
</div>

<!-- RESUME PAR SERVICE -->
<div class="section-title">I. Synthese par service</div>
<table style="margin-bottom:20px;">
  <thead><tr>
    <th style="width:38%;">Service</th>
    <th style="text-align:center;width:12%;">Total</th>
    <th style="text-align:center;width:12%;">En attente</th>
    <th style="text-align:center;width:12%;">En cours</th>
    <th style="text-align:center;width:13%;">Traites</th>
    <th style="text-align:center;width:13%;">Rejetes</th>
  </tr></thead>
  <tbody>
    ${summaryRows}
    <tr style="background:#1e293b;font-weight:700;">
      <td style="padding:9px 12px;font-size:11px;color:#fff;border:1px solid #334155;">TOTAL GENERAL</td>
      <td style="padding:9px 12px;text-align:center;font-size:11px;color:#fff;border:1px solid #334155;">${allActivities.length}</td>
      <td style="padding:9px 12px;text-align:center;font-size:11px;color:#fff;border:1px solid #334155;">${totalPending}</td>
      <td style="padding:9px 12px;text-align:center;font-size:11px;color:#fff;border:1px solid #334155;">${totalInProg}</td>
      <td style="padding:9px 12px;text-align:center;font-size:11px;color:#fff;border:1px solid #334155;">${totalDone}</td>
      <td style="padding:9px 12px;text-align:center;font-size:11px;color:#fff;border:1px solid #334155;">${totalRej}</td>
    </tr>
  </tbody>
</table>

<!-- DETAIL COMPLET -->
<div class="section-title">II. Detail de l'ensemble des dossiers (${allActivities.length} entrees)</div>
<table>
  <thead><tr>
    <th>Date de reception</th>
    <th>Service</th>
    <th>Reference</th>
    <th>Objet / Organisation</th>
    <th>Contact / Detail</th>
    <th>Statut</th>
  </tr></thead>
  <tbody>${detailRows}</tbody>
</table>

<!-- PIED DE PAGE -->
<div style="margin-top:28px;padding-top:10px;border-top:2px solid #1e293b;display:flex;justify-content:space-between;align-items:flex-end;">
  <div>
    <div style="font-size:9px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:.5px;">ADETIC — Document officiel confidentiel</div>
    <div style="font-size:8.5px;color:#94a3b8;margin-top:2px;">Etablissement public administratif · Loi n° 012/PR/2014 · N'Djamena, Tchad</div>
  </div>
  <div style="text-align:right;">
    <div style="font-size:9px;color:#475569;">Rapport genere le ${dateStr} a ${timeStr}</div>
    <div style="font-size:9px;color:#94a3b8;">Ref. ADETIC/RAPP/${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,"0")} · adetic.td</div>
  </div>
</div>
</body></html>`;

    const pw = window.open("", "_blank", "width=900,height=1200");
    if (pw) {
      pw.document.write(html);
      pw.document.close();
      pw.focus();
      setTimeout(() => { pw.print(); setGenerating(false); }, 700);
    } else {
      setGenerating(false);
    }
  };

  return (
    <div>
      {/* En-tête */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: `${ACCENT}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Activity size={22} color={ACCENT} strokeWidth={1.8} />
          </div>
          <div>
            <h2 style={{ color: TEXT, fontSize: 22, fontWeight: 800, margin: "0 0 3px" }}>Activités récentes</h2>
            <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>{allActivities.length} dossier(s) E-Services au total</p>
          </div>
        </div>
        <button onClick={handlePDF} disabled={generating} style={{
          display: "flex", alignItems: "center", gap: 8,
          background: generating ? "rgba(0,201,167,0.6)" : ACCENT,
          color: WHITE, border: "none", padding: "11px 22px",
          borderRadius: 10, cursor: generating ? "not-allowed" : "pointer",
          fontWeight: 700, fontSize: 14, boxShadow: "0 4px 16px rgba(0,201,167,0.28)",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { if (!generating) e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,201,167,0.42)"; }}
          onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,201,167,0.28)"}
        >
          <FileDown size={16} />
          {generating ? "Génération…" : "Rapport PDF complet"}
        </button>
      </div>

      {/* Mini-stats par type */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
        {FILTERS.filter(f => f.id !== "Tous").map(f => {
          const meta = TYPE_META[f.id];
          return (
            <div key={f.id} onClick={() => setFilter(f.id === filter ? "Tous" : f.id)}
              style={{
                background: filter === f.id ? `${meta.color}14` : WHITE,
                border: `1.5px solid ${filter === f.id ? meta.color : "rgba(15,23,42,0.07)"}`,
                borderRadius: 12, padding: "16px 14px", cursor: "pointer",
                textAlign: "center", transition: "all 0.18s",
              }}
              onMouseEnter={e => { if (filter !== f.id) e.currentTarget.style.borderColor = meta.color; }}
              onMouseLeave={e => { if (filter !== f.id) e.currentTarget.style.borderColor = "rgba(15,23,42,0.07)"; }}
            >
              <div style={{ color: filter === f.id ? meta.color : TEXT, fontSize: 26, fontWeight: 900 }}>{f.count}</div>
              <div style={{ color: filter === f.id ? meta.color : MUTED, fontSize: 11, marginTop: 4, fontWeight: 600 }}>{f.label}</div>
              <div style={{ width: 28, height: 3, background: filter === f.id ? meta.color : "rgba(15,23,42,0.08)", borderRadius: 2, margin: "8px auto 0" }} />
            </div>
          );
        })}
      </div>

      {/* Barre filtre + recherche */}
      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: "7px 14px", borderRadius: 8, fontSize: 12.5, cursor: "pointer",
              fontWeight: filter === f.id ? 700 : 500, transition: "all 0.18s",
              border: `1px solid ${filter === f.id ? ACCENT : "rgba(15,23,42,0.1)"}`,
              background: filter === f.id ? `${ACCENT}14` : WHITE,
              color: filter === f.id ? ACCENT : MUTED,
            }}>
              {f.label}{f.id !== "Tous" ? ` (${f.count})` : ""}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", position: "relative", minWidth: 220 }}>
          <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: MUTED }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher…"
            style={{
              width: "100%", padding: "8px 12px 8px 32px",
              borderRadius: 8, border: "1px solid rgba(15,23,42,0.12)",
              fontSize: 13, color: TEXT, outline: "none", background: WHITE,
              fontFamily: "inherit", boxSizing: "border-box",
            }}
            onFocus={e => e.target.style.borderColor = ACCENT}
            onBlur={e => e.target.style.borderColor = "rgba(15,23,42,0.12)"}
          />
        </div>
      </div>

      {/* Table activités */}
      <div style={{ background: WHITE, borderRadius: 16, border: "1px solid rgba(15,23,42,0.06)", boxShadow: "0 2px 12px rgba(15,23,42,0.05)", overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 56, textAlign: "center", color: MUTED, fontSize: 14 }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>📂</div>
            Aucune activité {search ? `pour "${search}"` : ""}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Date", "Type", "Référence", "Libellé", "Détail / Contact", "Statut"].map(h => (
                  <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: 0.8, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => {
                const meta = TYPE_META[item._type] || {};
                const date = item.created_at ? new Date(item.created_at).toLocaleDateString("fr-FR") : "—";
                return (
                  <tr key={i} style={{ borderTop: "1px solid rgba(15,23,42,0.05)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "12px 14px", color: MUTED, fontSize: 12, whiteSpace: "nowrap" }}>{date}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        background: `${meta.color}15`, color: meta.color,
                        padding: "3px 10px", borderRadius: 20,
                        fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                        border: `1px solid ${meta.color}30`,
                      }}>
                        {meta.label}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", color: meta.color, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{item._ref}</td>
                    <td style={{ padding: "12px 14px", color: TEXT, fontSize: 13, fontWeight: 600, maxWidth: 180 }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item._label}</div>
                    </td>
                    <td style={{ padding: "12px 14px", color: MUTED, fontSize: 12, maxWidth: 180 }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item._sub}</div>
                    </td>
                    <td style={{ padding: "12px 14px" }}><StatusBadge statut={item.statut} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {filtered.length > 0 && (
          <div style={{ padding: "12px 16px", background: "#f8fafc", borderTop: "1px solid rgba(15,23,42,0.05)", color: MUTED, fontSize: 12 }}>
            {filtered.length} activité(s) affichée(s){search ? ` pour "${search}"` : ""}
          </div>
        )}
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
                {uploading ? "Envoi en cours…" : uploadDone ? "Importé" : "Image actuelle"}
              </div>
            </>
          ) : (
            <>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(15,23,42,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(15,23,42,0.35)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              </div>
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
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><Trash2 size={40} color="#ef4444" strokeWidth={1.5} /></div>
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

      {/* ── Légende statuts ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16, padding: "10px 14px", background: WHITE, borderRadius: 10, border: "1px solid rgba(15,23,42,0.06)" }}>
        <span style={{ color: MUTED, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginRight: 4 }}>Légende :</span>
        {cfg.statuts.filter(s => s !== "Tous").map(s => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: scColor(s), flexShrink: 0 }} />
            <span style={{ fontSize: 11.5, color: MUTED, fontWeight: 500 }}>{s}</span>
          </div>
        ))}
        <span style={{ color: "rgba(15,23,42,0.18)", margin: "0 4px" }}>·</span>
        <span style={{ fontSize: 11, color: MUTED, fontStyle: "italic" }}>Cliquez sur une ligne pour ouvrir et modifier le dossier</span>
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
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><Mail size={40} color="rgba(15,23,42,0.2)" strokeWidth={1.3} /></div>
          Aucun message
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

  /* ── Realtime : mise à jour automatique quand un formulaire est soumis ── */
  useEffect(() => {
    if (!auth) return;

    const addOrUpdate = (setter, row) =>
      setter(prev =>
        prev.some(r => r.id === row.id)
          ? prev.map(r => r.id === row.id ? row : r)
          : [row, ...prev]
      );

    const channels = [
      supabase.channel("rt-contacts")
        .on("postgres_changes", { event: "*", schema: "public", table: "contacts" },
          ({ new: row }) => row && addOrUpdate(setContacts, row))
        .subscribe(),

      supabase.channel("rt-domaines")
        .on("postgres_changes", { event: "*", schema: "public", table: "demandes_domaine" },
          ({ new: row }) => row && addOrUpdate(setDomaines, row))
        .subscribe(),

      supabase.channel("rt-equipements")
        .on("postgres_changes", { event: "*", schema: "public", table: "demandes_equipement" },
          ({ new: row }) => row && addOrUpdate(setEquipements, row))
        .subscribe(),

      supabase.channel("rt-pannes")
        .on("postgres_changes", { event: "*", schema: "public", table: "declarations_panne" },
          ({ new: row }) => row && addOrUpdate(setPannes, row))
        .subscribe(),

      supabase.channel("rt-emails")
        .on("postgres_changes", { event: "*", schema: "public", table: "demandes_email" },
          ({ new: row }) => row && addOrUpdate(setEmails, row))
        .subscribe(),

      supabase.channel("rt-plateformes")
        .on("postgres_changes", { event: "*", schema: "public", table: "demandes_plateforme" },
          ({ new: row }) => row && addOrUpdate(setPlateformes, row))
        .subscribe(),
    ];

    return () => channels.forEach(c => supabase.removeChannel(c));
  }, [auth]);

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
    { id: "overview",   label: "Vue d'ensemble",   Icon: LayoutDashboard },
    { id: "activites",  label: "Activités",         Icon: Activity        },
    { id: "articles",   label: "Articles",          Icon: Newspaper       },
    { id: "domaines",   label: "Domaines .td",      Icon: Globe           },
    { id: "equipements",label: "Équipements",       Icon: Monitor         },
    { id: "pannes",     label: "Pannes",            Icon: AlertTriangle   },
    { id: "emails",     label: "Mails",             Icon: Mail            },
    { id: "plateformes",label: "Plateformes",       Icon: Layers          },
    { id: "contacts",   label: "Messages",          Icon: Eye             },
  ];

  const activePannes = pannes.filter(p => ["Ouvert", "En cours"].includes(p.statut)).length;
  const newContacts = contacts.filter(c => !c.statut || c.statut === "Nouveau").length;
  const pendingCount = [...domaines, ...equipements, ...emails, ...plateformes].filter(d => d.statut === "En attente").length;

  const badgeFor = (id) => ({
    domaines:    domaines.filter(d => d.statut === "En attente").length,
    equipements: equipements.filter(d => d.statut === "En attente").length,
    pannes:      activePannes,
    emails:      emails.filter(d => d.statut === "En attente").length,
    plateformes: plateformes.filter(d => d.statut === "En attente").length,
    contacts:    newContacts,
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
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'Segoe UI', system-ui, sans-serif", background: BG }}>
      {/* Sidebar */}
      <div style={{
        width: 250, flexShrink: 0, background: DARK,
        display: "flex", flexDirection: "column",
        height: "100vh", overflowY: "auto",
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

        {/* ── Légende des badges ── */}
        <div style={{ margin: "0 10px 10px", padding: "13px 14px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ color: "rgba(255,255,255,0.28)", fontSize: 8.5, letterSpacing: 1.8, fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>Légende des badges</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { bg: ACCENT,     text: "Requêtes en attente de traitement" },
              { bg: "#FC5C65",  text: "Pannes actives (ouvertes / en cours)" },
            ].map(({ bg, text }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <div style={{ width: 18, height: 18, borderRadius: 9, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: WHITE, fontWeight: 800, flexShrink: 0 }}>N</div>
                <span style={{ color: "rgba(255,255,255,0.42)", fontSize: 10.5, lineHeight: 1.55 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

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
      <div style={{ flex: 1, padding: "40px 36px", overflowY: "auto", height: "100vh" }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: MUTED, fontSize: 15, flexDirection: "column", gap: 14 }}>
            <RefreshCw size={28} color={ACCENT} style={{ animation: "spin 1s linear infinite" }} />
            Chargement des données...
          </div>
        ) : (
          <>
            {tab === "overview"    && <OverviewTab stats={stats} domaines={domaines} equipements={equipements} pannes={pannes} emails={emails} plateformes={plateformes} contacts={contacts} />}
            {tab === "activites"   && <ActivitesTab domaines={domaines} equipements={equipements} pannes={pannes} emails={emails} plateformes={plateformes} />}
            {tab === "articles"    && <ArticlesTab articles={articles} onRefresh={loadAll} />}
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
