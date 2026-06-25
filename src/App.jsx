import { useState, useEffect, useRef } from "react";
import "./responsive.css";
import { fetchActualites, addContactMessage, submitDemandeDomaine, submitDemandeEquipement, submitDeclarationPanne, submitDemandeEmail, submitDemandePlateforme } from "./supabaseClient";
import AdminPage from "./AdminPage";
import {
  Globe, Handshake, Server, Brain,
  Zap, Network, GraduationCap, Shield,
  Radio, Building2, Calendar, Database,
  Code2, Landmark, Monitor, AlertTriangle, Mail, Layers,
} from "lucide-react";
import emailjs from "@emailjs/browser";

async function sendEmailNotification(sujet, contenu, emailExpediteur = "") {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (!serviceId || !templateId || !publicKey) return;
  try {
    await emailjs.send(serviceId, templateId, {
      sujet,
      contenu,
      email_expediteur: emailExpediteur,
    }, { publicKey });
  } catch {}
}
// Images from project `images/` folder
import heroImg from "../images/fond-humain-de-poignee-de-main-de-robot-ere-numerique-futuriste-2048x1365.jpg";
import act1 from "../images/act1.jpg";
import act2 from "../images/act2.jpg";
import act3 from "../images/act3.jpg";
import act4 from "../images/act4.jpg";
import dgAdoum from "../images/dg geek.jpg";
import igfReunion from "../images/igf-reunion.jpg";
import rencontreDgSmart from "../images/rencontre-dg-et-smart.jpg";
import aiTraining from "../images/pexels-photo-1054397-1.jpeg";
import siteLogo from "../images/logo.jpg";
import eqDG      from "../equipes adetic/DG adoum djimet 1.jpg";
import eqDGA     from "../equipes adetic/DG a abdramane Tom.jpg";
import eqAbdelkerim from "../equipes adetic/Directeur des noms de domaines et adress ip abdelkerim fadoul.jpg";
import eqKhadidja   from "../equipes adetic/Khadidja harsou abbas dsus.jpg";
import eqZara        from "../equipes adetic/Zara janette daj.jpg";
import eqAhmat       from "../equipes adetic/ahmat moussa dtic.jpg";
import eqHissein     from "../equipes adetic/hissein issa rozi dcri.jpg";
import eqMahamat     from "../equipes adetic/mahamat youssouf boy daf.jpg";
import eqDebora      from "../equipes adetic/debora drh.jpg";
import eqZaki        from "../equipes adetic/dr zaki.jpg";

const IMAGE_MAP = {
  "igf-reunion.jpg": igfReunion,
  "rencontre-dg-et-smart.jpg": rencontreDgSmart,
  "fond-humain-de-poignee-de-main-de-robot-ere-numerique-futuriste-2048x1365.jpg": heroImg,
  "pexels-photo-1054397-1.jpeg": aiTraining,
  "act1.jpg": act1,
  "act2.jpg": act2,
  "act3.jpg": act3,
  "act4.jpg": act4,
};

const NAV_LINKS = [
  { label: "Accueil",            href: "#hero",       page: "home"     },
  { label: "Direction Générale", href: "#direction",  page: "home"     },
  { label: "Équipe",             href: "#equipe",     page: "equipe"   },
  { label: "Actualités",         href: "#actualites", page: "articles" },
  { label: "Activités",          href: "#activites",  page: "home"     },
  { label: "Missions",           href: "#missions",   page: "home"     },
  { label: "E-Services",         href: "#eservices",  page: "eservices"},
  { label: "Contact",            href: "#contact",    page: "home"     },
];

const PRIMARY_COLOR = "#ffffff";
const SECONDARY_COLOR = "#00C9A7";
const SECONDARY_COLOR_ALT = "#4F8EF7";
const BG_COLOR = "#050A19";
const SITE_BG_COLOR = "#f8fafc";
const TEXT_COLOR = "#0f172a";
const MUTED_TEXT = "rgba(15,23,42,0.7)";
const CARD_BG = "rgba(15,23,42,0.04)";
const PANEL_BG = "rgba(15,23,42,0.03)";

const FORM_INPUT_STYLE = {
  padding: "12px 16px",
  borderRadius: 8,
  border: "1px solid rgba(15,23,42,0.12)",
  background: "rgba(15,23,42,0.03)",
  fontSize: 14,
  color: "#0f172a",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  fontFamily: "inherit",
};
const HERO_TEXT_COLOR = "#0f172a";
const HERO_SUBTEXT_COLOR = "rgba(15,23,42,0.7)";

const ACTUALITES = [
  {
    category: "Forum",
    date: "16–21 Fév 2026",
    title: "Participation stratégique du Tchad au Forum sur la Gouvernance de l’Internet de l’Afrique Centrale",
    excerpt: "Du 16 au 21 février 2026, le Tchad a pris une part active au Forum sur la Gouvernance de l’Internet, renforçant sa position comme acteur clé du numérique africain.",
    content: "Le Tchad a défendu une vision de gouvernance inclusive, soulignant l’importance d’une infrastructure numérique souveraine et d’un accès universel au premier plan des politiques nationales.",
    color: "#00C9A7",
    icon: Globe,
    image: igfReunion,
  },
  {
    category: "Coopération",
    date: "Fév 2026",
    title: "Coopération numérique : des experts azerbaïdjanais en visite de travail à l'ADETIC",
    excerpt: "Dans le cadre du renforcement de la coopération internationale en matière de transformation digitale, une délégation d'experts azerbaïdjanais a effectué une visite officielle.",
    content: "Les échanges ont porté sur des projets de connectivité, des solutions d'interopérabilité et l'accompagnement des startups tchadiennes vers des partenariats technologiques durables.",
    color: "#4F8EF7",
    icon: Handshake,
    image: rencontreDgSmart,
  },
  {
    category: "Data Center",
    date: "Fév 2026",
    title: "Audit et certification du Data Center national : l'ADETIC, l'ANSICE et TECHSO-GROUP en mission conjointe",
    excerpt: "Dans le cadre de la mise en œuvre de l'accord tripartite, l'ADETIC s'engage pour la certification du datacenter national tchadien.",
    content: "L'audit porte sur l'architecture, la résilience et la conformité aux meilleures pratiques internationales, assurant ainsi la sécurité des données publiques de l'État.",
    color: "#F7B731",
    icon: Server,
    image: heroImg,
  },
  {
    category: "Intelligence Artificielle",
    date: "2025",
    title: "Formation de haut niveau sur l'Intelligence Artificielle",
    excerpt: "L'ADETIC, en collaboration avec l'UNESCO et l'ENASTIC, organise une formation d'excellence sur l'IA pour les cadres nationaux.",
    content: "La formation vise à renforcer les compétences en data science, apprentissage automatique et gouvernance éthique de l'IA au sein des administrations publiques tchadiennes.",
    color: "#FC5C65",
    icon: Brain,
    image: aiTraining,
  },
];

const MISSIONS = [
  {
    icon: Zap,
    title: "Infrastructures Numériques",
    desc: "Mise en place et maintenance d'infrastructures solides et sécurisées pour un accès fiable aux services numériques de l'État.",
    stat: "80%",
    statLabel: "Réseau fibre optique déployé",
    color: "#00C9A7",
  },
  {
    icon: Network,
    title: "Systèmes d'Information Publics",
    desc: "Coordination des systèmes gouvernementaux pour leur interopérabilité, leur sécurité et une gestion efficace des données.",
    stat: "IXP",
    statLabel: "Point d'échange internet souverain",
    color: "#4F8EF7",
  },
  {
    icon: GraduationCap,
    title: "Formation & Accompagnement",
    desc: "Montée en compétences digitales des administrations avec des formations adaptées pour une utilisation optimale des outils.",
    stat: "6+",
    statLabel: "Télécentres déployés en province",
    color: "#F7B731",
  },
  {
    icon: Shield,
    title: "Sécurité & Veille Technologique",
    desc: "Veille technologique permanente et recommandations en matière de sécurité des réseaux et certification numérique.",
    stat: ".td",
    statLabel: "Gestionnaire domaine national",
    color: "#A55EEA",
  },
];

const CHIFFRES = [
  { val: "80%", label: "Réseau fibre complété", icon: Radio },
  { val: "6+", label: "Télécentres provinciaux", icon: Building2 },
  { val: "2014", label: "Année de création", icon: Calendar },
  { val: "IXP", label: "Internet Exchange Point", icon: Globe },
];

function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

function IconBadge({ icon: Icon, bg = "rgba(15,23,42,0.08)", color = "#0f172a", size = 44 }) {
  const iconSize = size <= 44 ? 18 : 24;
  return (
    <div style={{
      width: size, height: size, minWidth: size,
      borderRadius: 16, background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      color,
      boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
      flexShrink: 0,
    }}>
      {typeof Icon === "string"
        ? <span style={{ fontSize: size <= 44 ? 20 : 26, lineHeight: 1 }}>{Icon}</span>
        : <Icon size={iconSize} strokeWidth={1.8} color={color} />}
    </div>
  );
}

function AnimSection({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Navbar({ scrolled, activePage, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 920);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 920);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const navBg = scrolled ? "rgba(255,255,255,0.97)" : "transparent";
  const navTextColor = scrolled ? "rgba(15,23,42,0.78)" : "rgba(15,23,42,0.85)";

  const handleLink = (e, l) => {
    e.preventDefault();
    setMenuOpen(false);
    if (l.page === "articles") { onNavigate("articles"); return; }
    if (l.page === "eservices") { onNavigate("eservices"); return; }
    if (l.page === "equipe") { onNavigate("equipe"); return; }
    onNavigate("home");
    setTimeout(() => {
      const el = document.querySelector(l.href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 60);
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: navBg,
      backdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(15,23,42,0.08)" : "none",
      transition: "all 0.4s ease",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72, padding: "0 1.2rem" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => onNavigate("home")}>
          <div style={{ width: 42, height: 42, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
            <img src={siteLogo} alt="ADETIC" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <div style={{ color: scrolled ? TEXT_COLOR : HERO_TEXT_COLOR, fontWeight: 800, fontSize: 15, letterSpacing: 1, lineHeight: 1 }}>ADETIC</div>
            <div style={{ color: scrolled ? SECONDARY_COLOR : "rgba(15,23,42,0.55)", fontSize: 9, letterSpacing: 2, fontWeight: 600 }}>TCHAD · NUMÉRIQUE</div>
          </div>
        </div>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {NAV_LINKS.map(l => {
              const isActive = activePage === l.page && (l.page === "articles" || l.page === "eservices" || l.page === "equipe");
              const isEService = l.page === "eservices";
              return (
                <a key={l.label} href={l.href}
                  style={{
                    color: isEService ? SECONDARY_COLOR : (isActive ? SECONDARY_COLOR : navTextColor),
                    textDecoration: "none", fontSize: 13,
                    fontWeight: isEService || isActive ? 700 : 500,
                    padding: "7px 12px", borderRadius: 8, transition: "all 0.2s",
                    background: isEService ? "rgba(0,201,167,0.1)" : (isActive ? "rgba(0,201,167,0.1)" : "transparent"),
                    border: isEService ? "1px solid rgba(0,201,167,0.28)" : "1px solid transparent",
                  }}
                  onClick={e => handleLink(e, l)}
                  onMouseEnter={e => { e.currentTarget.style.color = SECONDARY_COLOR; e.currentTarget.style.background = "rgba(0,201,167,0.12)"; }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = isEService ? SECONDARY_COLOR : (isActive ? SECONDARY_COLOR : navTextColor);
                    e.currentTarget.style.background = isEService || isActive ? "rgba(0,201,167,0.1)" : "transparent";
                  }}
                >{l.label}</a>
              );
            })}
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button onClick={() => setMenuOpen(o => !o)} style={{
            background: "transparent", border: "none", cursor: "pointer",
            padding: 8, display: "flex", flexDirection: "column", gap: 5,
          }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block", width: 24, height: 2, borderRadius: 2,
                background: scrolled ? TEXT_COLOR : "rgba(15,23,42,0.8)",
                transition: "all 0.3s",
                transform: menuOpen
                  ? i === 0 ? "rotate(45deg) translate(5px, 5px)"
                  : i === 1 ? "scaleX(0)"
                  : "rotate(-45deg) translate(5px, -5px)"
                  : "none",
              }} />
            ))}
          </button>
        )}
      </div>

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <div style={{
          background: "rgba(255,255,255,0.98)", backdropFilter: "blur(14px)",
          borderTop: "1px solid rgba(15,23,42,0.08)", padding: "8px 2rem 20px",
        }}>
          {NAV_LINKS.map(l => {
            const isActive = activePage === l.page && (l.page === "articles" || l.page === "eservices" || l.page === "equipe");
            return (
              <a key={l.label} href={l.href}
                style={{
                  display: "block", color: isActive ? SECONDARY_COLOR : TEXT_COLOR,
                  textDecoration: "none", fontSize: 15, fontWeight: isActive ? 700 : 500,
                  padding: "14px 4px", borderBottom: "1px solid rgba(15,23,42,0.06)",
                }}
                onClick={e => handleLink(e, l)}
              >{l.label}</a>
            );
          })}
        </div>
      )}
    </nav>
  );
}

function TDVisual() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(id);
  }, []);
  const icons = [
    { Icon: Monitor, color: "#00C9A7" },
    { Icon: Radio, color: "#4F8EF7" },
    { Icon: Shield, color: "#F7B731" },
    { Icon: Database, color: "#FC5C65" },
  ];
  return (
    <div style={{
      width: 420, height: 420,
      background: "linear-gradient(145deg, #0a1628 0%, #050A19 70%, #0d1a3d 100%)",
      borderRadius: 32,
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      boxShadow: "0 30px 80px rgba(5,10,25,0.5), 0 0 0 1px rgba(0,201,167,0.2)",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(0,201,167,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,201,167,0.05) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />
      <div style={{
        position: "absolute", left: 0, right: 0, height: 120,
        background: "linear-gradient(180deg, transparent, rgba(0,201,167,0.05), transparent)",
        top: `${((tick * 2) % 540) - 120}px`,
      }} />
      {[280, 210, 140].map((size, i) => (
        <div key={i} style={{
          position: "absolute", width: size, height: size, borderRadius: "50%",
          border: `${i === 2 ? 2 : 1}px ${i === 1 ? "dashed" : "solid"} rgba(${i === 1 ? "79,142,247" : "0,201,167"},${i === 2 ? 0.6 : i === 0 ? 0.12 : 0.22})`,
          animation: `spin ${18 + i * 7}s linear infinite ${i % 2 ? "reverse" : ""}`,
        }} />
      ))}
      <div style={{
        position: "absolute", width: 120, height: 120, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,201,167,0.22) 0%, transparent 70%)",
        filter: "blur(20px)",
        animation: "tdPulse 3s ease-in-out infinite",
      }} />
      <div style={{
        position: "relative", zIndex: 10,
        animation: "tdFloat 4s ease-in-out infinite",
        display: "flex", alignItems: "baseline",
      }}>
        <span style={{
          color: "#00C9A7", fontSize: 90, fontWeight: 900, letterSpacing: -3,
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          animation: "tdGlow 2.5s ease-in-out infinite",
          display: "inline-block",
        }}>.</span>
        <span style={{
          color: "#ffffff", fontSize: 90, fontWeight: 900, letterSpacing: -3,
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          animation: "tdGlow 2.5s ease-in-out infinite 0.4s",
          display: "inline-block",
        }}>td</span>
      </div>
      {icons.map(({ Icon, color }, i) => {
        const angle = (i / 4) * 2 * Math.PI + tick * 0.01;
        const r = 155;
        return (
          <div key={i} style={{
            position: "absolute",
            left: `calc(50% + ${Math.cos(angle) * r}px - 20px)`,
            top: `calc(50% + ${Math.sin(angle) * r}px - 20px)`,
            width: 40, height: 40,
            background: "rgba(10,22,40,0.92)",
            border: `1px solid ${color}55`,
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 16px ${color}30`,
          }}>
            <Icon size={18} strokeWidth={1.8} color={color} />
          </div>
        );
      })}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, transparent, #00C9A7, #4F8EF7, transparent)" }} />
      <div style={{ position: "absolute", top: 22, left: 24, color: "rgba(79,142,247,0.55)", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>ADETIC</div>
      <div style={{ position: "absolute", bottom: 22, right: 24, color: "rgba(0,201,167,0.55)", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>TCHAD</div>
    </div>
  );
}

function HeroSection() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="hero" style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #ffffff 0%, #f4f7fb 40%, #e2e8f0 100%)",
      display: "flex", alignItems: "center",
      position: "relative", overflow: "hidden",
      padding: "0 2rem",
    }}>
      {/* Animated grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(15,23,42,0.065) 1px, transparent 1px),
          linear-gradient(90deg, rgba(15,23,42,0.065) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        animation: "gridDrift 20s linear infinite",
      }} />

      {/* Glowing orbs */}
      <div style={{ position: "absolute", top: "15%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,201,167,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 500, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,142,247,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", top: "40%", left: "40%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(247,183,49,0.06) 0%, transparent 70%)", filter: "blur(30px)" }} />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: i % 3 === 0 ? 4 : 2,
          height: i % 3 === 0 ? 4 : 2,
          borderRadius: "50%",
          background: i % 2 === 0 ? "#00C9A7" : "#4F8EF7",
          left: `${(i * 47 + 10) % 90}%`,
          top: `${(i * 31 + 15) % 85}%`,
          opacity: 0.4 + Math.sin(tick * 0.02 + i) * 0.3,
          transform: `translateY(${Math.sin(tick * 0.015 + i * 0.7) * 12}px)`,
          transition: "transform 0.1s, opacity 0.1s",
        }} />
      ))}

      <div className="hero-inner" style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 1, paddingTop: 100 }}>
        <div className="hero-grid">
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 100, padding: "6px 14px", marginBottom: 28,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: PRIMARY_COLOR, display: "block", boxShadow: "0 0 10px rgba(255,255,255,0.6)", animation: "pulse 2s infinite" }} />
              <span style={{ color: PRIMARY_COLOR, fontSize: 12, fontWeight: 600, letterSpacing: 1.5 }}>AGENCE OFFICIELLE DU TCHAD</span>
            </div>

            <h1 style={{
              color: HERO_TEXT_COLOR, fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
              fontWeight: 900, lineHeight: 1.15, margin: "0 0 20px",
            }}>
              Excellence en{" "}
              <span style={{
                color: SECONDARY_COLOR,
              }}>
                télécommunication
              </span>{" "}
              au Tchad
            </h1>

            <p style={{ color: HERO_SUBTEXT_COLOR, fontSize: 17, lineHeight: 1.7, margin: "0 0 40px", maxWidth: 480 }}>
              L'ADETIC est l'agence publique chargée de piloter le développement numérique et la transformation digitale de l'État tchadien. Connecter chaque coin du pays à l'économie mondiale.
            </p>

            <div className="hero-buttons">
              <a href="#missions" style={{
                background: SECONDARY_COLOR,
                color: PRIMARY_COLOR, textDecoration: "none",
                padding: "14px 28px", borderRadius: 10,
                fontWeight: 700, fontSize: 15,
                boxShadow: "0 8px 30px rgba(0,201,167,0.25)",
                transition: "all 0.3s",
              }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.background = `linear-gradient(135deg, ${SECONDARY_COLOR}, ${SECONDARY_COLOR_ALT})`; e.target.style.color = PRIMARY_COLOR; e.target.style.boxShadow = "0 12px 40px rgba(0,201,167,0.4)"; }}
                onMouseLeave={e => { e.target.style.transform = ""; e.target.style.background = SECONDARY_COLOR; e.target.style.color = PRIMARY_COLOR; e.target.style.boxShadow = "0 8px 30px rgba(0,201,167,0.25)"; }}
              >Découvrez nos missions →</a>              <a href="#actualites" style={{
                color: HERO_TEXT_COLOR, textDecoration: "none",
                padding: "14px 28px", borderRadius: 10,
                fontWeight: 600, fontSize: 15,
                border: "1px solid rgba(15,23,42,0.12)",
                background: "rgba(15,23,42,0.04)",
                transition: "all 0.3s",
              }}
                onMouseEnter={e => { e.target.style.background = "rgba(15,23,42,0.12)"; e.target.style.borderColor = "rgba(15,23,42,0.2)"; }}
                onMouseLeave={e => { e.target.style.background = "rgba(15,23,42,0.04)"; e.target.style.borderColor = "rgba(15,23,42,0.12)"; }}
              >Actualités</a>
            </div>
          </div>

          {/* Right: .td animated visual */}
          <div className="hero-td-visual" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <TDVisual />
          </div>
        </div>

        {/* Stats bar */}
        <div className="hero-stats-grid hero-stats-bar" style={{
          marginTop: 80,
          gap: 1,
          background: "rgba(0,201,167,0.1)",
          border: "1px solid rgba(0,201,167,0.15)",
          borderRadius: 16, overflow: "hidden",
        }}>
          {CHIFFRES.map((c, i) => (
            <div key={i} style={{
              padding: "24px 20px",
              background: "rgba(5,10,25,0.6)",
              textAlign: "center",
              borderRight: i < 3 ? "1px solid rgba(0,201,167,0.1)" : "none",
            }}>
              <IconBadge icon={c.icon} bg="rgba(255,255,255,0.08)" color="#fff" />
              <div style={{ color: "#00C9A7", fontWeight: 900, fontSize: 26, marginTop: 10 }}>{c.val}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 4 }}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes gridDrift { from { transform: translateY(0); } to { transform: translateY(60px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; box-shadow:0 0 8px #00C9A7; } 50% { opacity:0.5; box-shadow:0 0 3px #00C9A7; } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
        @keyframes fadeSlide { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes tdPulse { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
        @keyframes tdFloat { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-14px); } }
        @keyframes tdGlow { 0%,100% { text-shadow:0 0 20px rgba(0,201,167,0.4),0 0 40px rgba(0,201,167,0.15); } 50% { text-shadow:0 0 40px rgba(0,201,167,0.9),0 0 80px rgba(0,201,167,0.5),0 0 120px rgba(79,142,247,0.3); } }
      `}</style>
    </section>
  );
}

function ArticleCard({ article, onClick, featured = false }) {
  const [hovered, setHovered] = useState(false);
  const color = article.color || SECONDARY_COLOR;

  if (featured) {
    return (
      <div
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="art-featured-grid"
        style={{
          borderRadius: 24, overflow: "hidden",
          boxShadow: hovered ? "0 24px 64px rgba(15,23,42,0.18)" : "0 8px 32px rgba(15,23,42,0.10)",
          cursor: "pointer", transition: "box-shadow 0.3s",
          border: "1px solid rgba(15,23,42,0.07)", marginBottom: 28,
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", overflow: "hidden", minHeight: 320 }}>
          {article.image ? (
            <img
              src={article.image}
              alt={article.title}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center",
                display: "block", position: "absolute", inset: 0,
                transform: hovered ? "scale(1.04)" : "scale(1)",
                transition: "transform 0.5s ease",
              }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: `${color}18`, position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64 }}>
              {article.icon || "📰"}
            </div>
          )}
          {/* Badge catégorie sur l'image */}
          <div style={{
            position: "absolute", top: 18, left: 18,
            background: color, color: "#fff",
            fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase",
            padding: "5px 12px", borderRadius: 100,
            boxShadow: `0 4px 14px ${color}50`,
          }}>{article.category || "Actualité"}</div>
        </div>

        {/* Contenu */}
        <div style={{
          padding: "40px 40px",
          background: "#fff",
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span style={{ color, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>{article.category}</span>
            <span style={{ color: "rgba(15,23,42,0.35)", fontSize: 11 }}>—</span>
            <span style={{ color: "rgba(15,23,42,0.5)", fontSize: 11 }}>{article.date}</span>
          </div>
          <h3 style={{
            color: BG_COLOR, fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)", fontWeight: 900,
            lineHeight: 1.35, margin: "0 0 16px",
          }}>{article.title}</h3>
          <p style={{ color: MUTED_TEXT, fontSize: 14, lineHeight: 1.75, margin: "0 0 28px", flex: 1 }}>
            {(article.excerpt || "").slice(0, 180)}{(article.excerpt || "").length > 180 ? "…" : ""}
          </p>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            color, fontWeight: 700, fontSize: 14,
          }}>
            Lire l'article
            <span style={{ transform: hovered ? "translateX(4px)" : "translateX(0)", transition: "transform 0.2s", display: "inline-block" }}>→</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", borderRadius: 20, overflow: "hidden",
        cursor: "pointer", transition: "all 0.3s",
        boxShadow: hovered ? "0 16px 48px rgba(15,23,42,0.14)" : "0 4px 16px rgba(15,23,42,0.07)",
        border: "1px solid rgba(15,23,42,0.06)",
        transform: hovered ? "translateY(-4px)" : "none",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", paddingTop: "56.25%", overflow: "hidden", background: `${color}10` }}>
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            loading="lazy"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.45s ease",
            }}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40,
          }}>{article.icon || "📰"}</div>
        )}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
          background: "linear-gradient(to top, rgba(5,10,25,0.35), transparent)",
        }} />
        <span style={{
          position: "absolute", top: 14, left: 14,
          background: color, color: "#fff",
          fontSize: 9, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase",
          padding: "4px 10px", borderRadius: 100,
        }}>{article.category || "Actualité"}</span>
      </div>

      {/* Contenu */}
      <div style={{ padding: "20px 22px 24px" }}>
        <div style={{ color: "rgba(15,23,42,0.45)", fontSize: 11, marginBottom: 8 }}>{article.date}</div>
        <h3 style={{
          color: BG_COLOR, fontSize: 15, fontWeight: 800,
          lineHeight: 1.45, margin: "0 0 10px",
        }}>{article.title}</h3>
        <p style={{
          color: MUTED_TEXT, fontSize: 13, lineHeight: 1.65,
          margin: 0, display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{article.excerpt}</p>
        <div style={{ marginTop: 16, color, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
          Lire <span style={{ transition: "transform 0.2s", transform: hovered ? "translateX(3px)" : "none", display: "inline-block" }}>→</span>
        </div>
      </div>
    </div>
  );
}

function ArticleShareBar({ article }) {
  const [copied, setCopied] = useState(false);
  const pageUrl = window.location.origin + window.location.pathname;
  const title = article.title || "Article ADETIC";
  const eu = encodeURIComponent(pageUrl);
  const et = encodeURIComponent(title + " — ADETIC");

  const PLATFORMS = [
    {
      label: "Facebook",
      color: "#1877F2",
      href: `https://www.facebook.com/sharer/sharer.php?u=${eu}&quote=${et}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
        </svg>
      ),
    },
    {
      label: "WhatsApp",
      color: "#25D366",
      href: `https://wa.me/?text=${encodeURIComponent(title + " — ADETIC\n" + pageUrl)}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
    {
      label: "X",
      color: "#000000",
      href: `https://twitter.com/intent/tweet?text=${et}&url=${eu}`,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      color: "#0A66C2",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${eu}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({ title, url: pageUrl }).catch(() => {});
    }
  };

  return (
    <div style={{
      marginTop: 32, paddingTop: 24,
      borderTop: "1px solid rgba(15,23,42,0.08)",
    }}>
      <div style={{ color: "rgba(15,23,42,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
        Partager cet article
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        {PLATFORMS.map(p => (
          <a
            key={p.label}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Partager sur ${p.label}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: p.color, color: "#fff",
              padding: "9px 16px", borderRadius: 10,
              fontSize: 13, fontWeight: 600, textDecoration: "none",
              transition: "opacity 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = ""; }}
          >
            {p.icon}
            {p.label}
          </a>
        ))}

        {"share" in navigator && (
          <button
            onClick={handleNativeShare}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "rgba(15,23,42,0.07)", color: TEXT_COLOR, border: "none",
              padding: "9px 16px", borderRadius: 10, cursor: "pointer",
              fontSize: 13, fontWeight: 600, transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(15,23,42,0.13)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(15,23,42,0.07)"}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Partager
          </button>
        )}

        <button
          onClick={handleCopy}
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: copied ? "rgba(0,201,167,0.1)" : "rgba(15,23,42,0.05)",
            border: `1px solid ${copied ? "rgba(0,201,167,0.35)" : "rgba(15,23,42,0.1)"}`,
            color: copied ? SECONDARY_COLOR : TEXT_COLOR, borderRadius: 10, cursor: "pointer",
            padding: "9px 16px", fontSize: 13, fontWeight: 600, transition: "all 0.25s",
          }}
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Copié !
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
              Copier le lien
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ArticleModal({ article, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(15,23,42,0.72)", padding: "24px",
      backdropFilter: "blur(4px)",
    }} onClick={onClose}>
      <div style={{
        width: "100%", maxWidth: 780,
        maxHeight: "calc(100vh - 48px)", overflowY: "auto",
        background: "#fff", borderRadius: 24,
        position: "relative", boxShadow: "0 40px 100px rgba(15,23,42,0.4)",
      }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16, zIndex: 10,
          border: "none", background: "rgba(15,23,42,0.08)",
          width: 38, height: 38, borderRadius: 12,
          cursor: "pointer", fontSize: 18, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>×</button>

        {/* Image pleine largeur en haut */}
        {article.image && (
          <div style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden", borderRadius: "24px 24px 0 0" }}>
            <img
              src={article.image}
              alt={article.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        )}

        <div style={{ padding: "32px 36px 36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{
              background: article.color || SECONDARY_COLOR,
              color: "#fff", fontSize: 10, fontWeight: 800,
              letterSpacing: 1.5, textTransform: "uppercase",
              padding: "4px 12px", borderRadius: 100,
            }}>{article.category}</span>
            <span style={{ color: "rgba(15,23,42,0.45)", fontSize: 13 }}>{article.date}</span>
          </div>
          <h2 style={{ color: BG_COLOR, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 900, margin: "0 0 18px", lineHeight: 1.3 }}>
            {article.title}
          </h2>
          <p style={{ color: MUTED_TEXT, fontSize: 15, lineHeight: 1.85 }}>
            {article.content || article.excerpt}
          </p>
          <ArticleShareBar article={article} />
        </div>
      </div>
    </div>
  );
}

function ActualitesSection({ actualites, loading, fetchError, onNavigate }) {
  const [openArticle, setOpenArticle] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref);
  const hasActualites = actualites && actualites.length > 0;

  const featured = hasActualites ? actualites[0] : null;
  const rest = hasActualites ? actualites.slice(1, 4) : [];

  return (
    <section id="actualites" ref={ref} className="section-pad" style={{ background: SITE_BG_COLOR }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <AnimSection>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 52, flexWrap: "wrap", gap: 16 }}>
            <div>
              <span style={{ color: SECONDARY_COLOR, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>📰 Dernières nouvelles</span>
              <h2 style={{ color: BG_COLOR, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 900, margin: "10px 0 0" }}>Actualités</h2>
            </div>
            {onNavigate && (
              <button onClick={() => onNavigate("articles")} style={{
                background: "transparent", border: `1px solid ${SECONDARY_COLOR}`,
                color: SECONDARY_COLOR, borderRadius: 10, padding: "10px 20px",
                cursor: "pointer", fontWeight: 700, fontSize: 13, transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = SECONDARY_COLOR; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = SECONDARY_COLOR; }}
              >Voir toutes les actualités →</button>
            )}
          </div>
        </AnimSection>

        {/* Chargement / erreur / vide */}
        {loading && (
          <div style={{ padding: 60, textAlign: "center", color: MUTED_TEXT }}>Chargement des actualités…</div>
        )}
        {!loading && fetchError && (
          <div style={{ padding: 40, background: "rgba(252,92,101,0.06)", borderRadius: 16, textAlign: "center", color: "#FC5C65" }}>
            Erreur de chargement : {fetchError}
          </div>
        )}
        {!loading && !fetchError && !hasActualites && (
          <div style={{ padding: 60, textAlign: "center", color: MUTED_TEXT }}>Aucune actualité pour le moment.</div>
        )}

        {/* Article featured */}
        {featured && (
          <AnimSection>
            <ArticleCard article={featured} onClick={() => setOpenArticle(featured)} featured />
          </AnimSection>
        )}

        {/* Grille des autres articles */}
        {rest.length > 0 && (
          <div className="actualites-cards-grid">
            {rest.map((a, i) => (
              <AnimSection key={i} delay={i * 80}>
                <ArticleCard article={a} onClick={() => setOpenArticle(a)} />
              </AnimSection>
            ))}
          </div>
        )}
      </div>

      {openArticle && <ArticleModal article={openArticle} onClose={() => setOpenArticle(null)} />}
    </section>
  );
}

const MOIS_FR = { janvier:1, février:2, fevrier:2, mars:3, avril:4, mai:5, juin:6, juillet:7, août:8, aout:8, septembre:9, octobre:10, novembre:11, décembre:12, decembre:12 };
function parseDateArticle(str = "") {
  const parts = str.trim().toLowerCase().split(/\s+/);
  const month = MOIS_FR[parts[0]] || 0;
  const year = parseInt(parts[1]) || 0;
  return year * 100 + month;
}

/* ──────────────────────────────────────────────
   ÉQUIPE / ORGANIGRAMME
────────────────────────────────────────────── */
function EquipePage({ onBack }) {
  const DG_TEAM = [
    { nom: "Adoum Djimet Saboun", poste: "Directeur Général",         initials: "AS", image: eqDG  },
    { nom: "Abdraman Tom",         poste: "Directeur Général Adjoint", initials: "AT", image: eqDGA },
  ];

  const DIRS = [
    { nom: "Abdelkerim Fadoul",      poste: "Directeur",  direction: "Nom de Domaine & Adresses IP",               initials: "AF", color: "#00C9A7", image: eqAbdelkerim },
    { nom: "Ahmat Moussa Abdoulaye", poste: "Directeur",  direction: "Infrastructures TIC",                        initials: "AM", color: "#4F8EF7", image: eqAhmat      },
    { nom: "Hissein Issa Rozi",      poste: "Directeur",  direction: "Communication & Coopération Internationale",  initials: "HR", color: "#A55EEA", image: eqHissein    },
    { nom: "Dr Zaki Mahmat",         poste: "Directeur",  direction: "Études & Planifications",                    initials: "ZM", color: "#20BF6B", image: eqZaki        },
    { nom: "Khadidja H. Abbas",      poste: "Directrice", direction: "Service Universel & Suivi",                  initials: "KA", color: "#F7B731", image: eqKhadidja   },
    { nom: "Mahamat Youssouf",       poste: "Directeur",  direction: "Finance & Comptabilité",                     initials: "MY", color: "#FC5C65", image: eqMahamat    },
    { nom: "Débora Dokhonmo",        poste: "Directrice", direction: "Ressources Humaines",                        initials: "DD", color: "#00C9A7", image: eqDebora      },
    { nom: "Zara Jeannette Sidick",  poste: "Directrice", direction: "Affaires Juridiques",                        initials: "ZS", color: "#4F8EF7", image: eqZara        },
  ];

  const Avatar = ({ initials, image, size = 88, color = "#00C9A7", fs = 26 }) => (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: image ? "transparent" : `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: fs, fontWeight: 900, color: "#fff", overflow: "hidden",
      boxShadow: `0 6px 24px ${color}44`,
      border: `3px solid ${color}50`,
    }}>
      {image
        ? <img src={image} alt={initials} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : initials}
    </div>
  );

  return (
    <div style={{ background: SITE_BG_COLOR, minHeight: "100vh", paddingTop: 72 }}>

      {/* ── Header ── */}
      <div className="equipe-header" style={{
        background: `linear-gradient(135deg, ${BG_COLOR} 0%, #0d1a3d 60%, #091428 100%)`,
        padding: "64px 2rem 80px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: 0, top: 0, opacity: 0.05 }}>
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", background: SECONDARY_COLOR, margin: 5 }} />
          ))}
        </div>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <button onClick={onBack} style={{
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)",
            color: "rgba(255,255,255,0.65)", padding: "8px 18px", borderRadius: 8,
            fontSize: 13, cursor: "pointer", marginBottom: 44,
            display: "inline-flex", alignItems: "center", gap: 7,
          }}>← Retour au site</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: SECONDARY_COLOR, fontSize: 11, letterSpacing: 3, fontWeight: 700, textTransform: "uppercase", marginBottom: 14 }}>
              ADETIC · ORGANIGRAMME
            </div>
            <h1 style={{ color: "#fff", fontSize: 42, fontWeight: 900, margin: "0 0 18px", letterSpacing: -0.5 }}>Notre Équipe</h1>
            <p style={{ color: "rgba(255,255,255,0.48)", fontSize: 15, maxWidth: 560, margin: "0 auto", lineHeight: 1.75 }}>
              L'ADETIC est dirigée par une équipe de cadres engagés et experts dans le développement
              des technologies de l'information et de la communication au Tchad.
            </p>
          </div>
        </div>
      </div>

      {/* ── Corps ── */}
      <div className="equipe-body" style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 2rem 88px" }}>

        {/* Direction Générale */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${SECONDARY_COLOR}14`, border: `1px solid ${SECONDARY_COLOR}35`, borderRadius: 100, padding: "6px 22px", marginBottom: 40 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: SECONDARY_COLOR }} />
            <span style={{ color: SECONDARY_COLOR, fontSize: 11, fontWeight: 800, letterSpacing: 2.5, textTransform: "uppercase" }}>Direction Générale</span>
          </div>

          <div className="dg-cards">
            {DG_TEAM.map((p, i) => (
              <div key={i} className="dg-card" style={{
                background: `linear-gradient(145deg, ${BG_COLOR} 0%, #0d1a3d 100%)`,
                borderRadius: 24, padding: "40px 48px",
                border: `1px solid ${SECONDARY_COLOR}30`,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
                minWidth: 240, position: "relative", overflow: "hidden",
                boxShadow: "0 16px 48px rgba(0,0,0,0.28)",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${SECONDARY_COLOR}, ${SECONDARY_COLOR}00)` }} />
                <Avatar initials={p.initials} image={p.image} size={100} color={SECONDARY_COLOR} fs={32} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#fff", fontWeight: 800, fontSize: 17, marginBottom: 8 }}>{p.nom}</div>
                  <div style={{ color: SECONDARY_COLOR, fontSize: 11.5, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>{p.poste}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connecteur hiérarchique */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 52 }}>
          <div style={{ width: 2, height: 36, background: `linear-gradient(to bottom, ${SECONDARY_COLOR}, ${SECONDARY_COLOR}30)` }} />
          <div style={{ width: "65%", maxWidth: 700, height: 2, background: `linear-gradient(90deg, transparent, ${SECONDARY_COLOR}30, transparent)` }} />
        </div>

        {/* Directions */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${SECONDARY_COLOR_ALT}14`, border: `1px solid ${SECONDARY_COLOR_ALT}35`, borderRadius: 100, padding: "6px 22px" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: SECONDARY_COLOR_ALT }} />
            <span style={{ color: SECONDARY_COLOR_ALT, fontSize: 11, fontWeight: 800, letterSpacing: 2.5, textTransform: "uppercase" }}>Directions</span>
          </div>
        </div>

        <div className="org-grid">
          {DIRS.map((p, i) => (
            <div key={i}
              style={{
                background: "#fff", borderRadius: 20, padding: "30px 20px",
                border: "1px solid rgba(15,23,42,0.07)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
                boxShadow: "0 4px 18px rgba(15,23,42,0.06)",
                position: "relative", overflow: "hidden",
                transition: "transform 0.22s, box-shadow 0.22s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 14px 36px ${p.color}25`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(15,23,42,0.06)"; }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: p.color }} />
              <Avatar initials={p.initials} image={p.image} size={76} color={p.color} fs={22} />
              <div style={{ textAlign: "center" }}>
                <div style={{ color: TEXT_COLOR, fontWeight: 700, fontSize: 13.5, marginBottom: 5, lineHeight: 1.4 }}>{p.nom}</div>
                <div style={{ color: p.color, fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{p.poste}</div>
                <div style={{
                  color: MUTED_TEXT, fontSize: 11.5, lineHeight: 1.55,
                  padding: "6px 10px", background: `${p.color}0d`,
                  borderRadius: 8, border: `1px solid ${p.color}20`,
                }}>{p.direction}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArticlesPage({ actualites, loading, fetchError, onBack }) {
  const [openArticle, setOpenArticle] = useState(null);

  const sorted = [...(actualites || [])].sort((a, b) => parseDateArticle(b.date) - parseDateArticle(a.date));
  const featured = sorted[0] || null;
  const rest = sorted.slice(1);

  return (
    <section id="articles-page" className="section-pad" style={{ background: SITE_BG_COLOR, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        <div className="articles-header" style={{ marginBottom: 48 }}>
          <div>
            <span style={{ color: SECONDARY_COLOR, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>{"📰"} Actualités</span>
            <h2 style={{ color: BG_COLOR, fontSize: "clamp(2rem, 3vw, 2.8rem)", fontWeight: 900, margin: "10px 0 8px" }}>Toutes les actualités</h2>
            <p style={{ color: MUTED_TEXT, fontSize: 15, margin: 0 }}>
              {sorted.length > 0 ? `${sorted.length} article${sorted.length > 1 ? "s" : ""} publié${sorted.length > 1 ? "s" : ""}` : "Retrouvez les dernières nouvelles de l'ADETIC."}
            </p>
          </div>
          <button onClick={onBack} style={{
            background: "transparent", border: "1px solid rgba(15,23,42,0.14)",
            borderRadius: 12, color: BG_COLOR, padding: "12px 20px",
            cursor: "pointer", fontWeight: 700, fontSize: 14, transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = BG_COLOR; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = BG_COLOR; }}
          >{"←"} Retour à l'accueil</button>
        </div>

        {loading && (
          <div style={{ padding: 60, textAlign: "center", color: MUTED_TEXT }}>Chargement des actualités…</div>
        )}
        {!loading && fetchError && (
          <div style={{ padding: 40, background: "rgba(252,92,101,0.06)", borderRadius: 16, textAlign: "center", color: "#FC5C65" }}>
            <strong>Erreur de chargement :</strong> {fetchError}
          </div>
        )}
        {!loading && !fetchError && sorted.length === 0 && (
          <div style={{ padding: 60, background: PANEL_BG, borderRadius: 20, textAlign: "center", color: MUTED_TEXT }}>Aucun article pour le moment.</div>
        )}

        {featured && (
          <ArticleCard article={featured} onClick={() => setOpenArticle(featured)} featured />
        )}

        {rest.length > 0 && (
          <div className="actualites-cards-grid">
            {rest.map((article, i) => (
              <ArticleCard key={i} article={article} onClick={() => setOpenArticle(article)} />
            ))}
          </div>
        )}
      </div>

      {openArticle && <ArticleModal article={openArticle} onClose={() => setOpenArticle(null)} />}
    </section>
  );
}

function ServiceCard({ service, onClick }) {
  const [hovered, setHovered] = useState(false);
  const Icon = service.icon;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? service.bg : "#fff",
        border: `1px solid ${hovered ? service.color : "rgba(15,23,42,0.08)"}`,
        borderRadius: 16, padding: 32, cursor: "pointer",
        transition: "all 0.3s",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 20px 40px ${service.color}20` : "0 2px 8px rgba(15,23,42,0.04)",
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: hovered ? service.color : service.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 20, transition: "all 0.3s",
      }}>
        {typeof Icon === "string"
          ? <span style={{ fontSize: 26 }}>{Icon}</span>
          : <Icon size={26} strokeWidth={1.8} color={hovered ? "#fff" : service.color} />}
      </div>
      <div style={{ color: service.color, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, marginBottom: 8, textTransform: "uppercase" }}>{service.subtitle}</div>
      <h3 style={{ color: TEXT_COLOR, fontSize: 18, fontWeight: 800, margin: "0 0 12px" }}>{service.title}</h3>
      <p style={{ color: MUTED_TEXT, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{service.description}</p>
      <div style={{ marginTop: 24, color: service.color, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
        Commencer la demande
        <span style={{ transition: "transform 0.2s", transform: hovered ? "translateX(4px)" : "none", display: "inline-block" }}>→</span>
      </div>
    </div>
  );
}

function FormField({ label, hint, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ color: TEXT_COLOR, fontSize: 13, fontWeight: 600 }}>{label}</label>
      {hint && <span style={{ color: MUTED_TEXT, fontSize: 11 }}>{hint}</span>}
      {children}
    </div>
  );
}

function SuccessMessage({ title, message }) {
  return (
    <div style={{
      textAlign: "center", padding: "60px 40px",
      background: "linear-gradient(135deg, rgba(0,201,167,0.06), rgba(79,142,247,0.06))",
      border: "1px solid rgba(0,201,167,0.2)", borderRadius: 20,
    }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
      <h3 style={{ color: TEXT_COLOR, fontSize: 22, fontWeight: 800, margin: "0 0 12px" }}>{title}</h3>
      <p style={{ color: MUTED_TEXT, fontSize: 15, lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>{message}</p>
    </div>
  );
}

function DomainForm() {
  const [form, setForm] = useState({
    domaine_souhaite: "", type_entite: "", nom_organisation: "",
    nom_contact: "", email: "", telephone: "", adresse: "", usage_description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: err } = await submitDemandeDomaine(form);
    if (!err) {
      await sendEmailNotification(
        `Demande nom de domaine .td — ${form.domaine_souhaite}`,
        `Domaine souhaité : ${form.domaine_souhaite}\nType d'entité : ${form.type_entite}\nOrganisation : ${form.nom_organisation}\nContact : ${form.nom_contact}\nEmail : ${form.email}\nTéléphone : ${form.telephone}\nAdresse : ${form.adresse}\n\nUsage prévu :\n${form.usage_description}`,
        form.email
      );
      setSuccess(true);
    } else {
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
    setSubmitting(false);
  };
  if (success) return <SuccessMessage title="Demande soumise avec succès !" message="Votre demande de nom de domaine .td a été enregistrée. Nos équipes vous contacteront dans les 48 heures ouvrables." />;
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ color: TEXT_COLOR, fontSize: 22, fontWeight: 800, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 10 }}>
          <Globe size={22} color={SECONDARY_COLOR} strokeWidth={2} /> Demande de Nom de Domaine .td
        </h2>
        <p style={{ color: MUTED_TEXT, fontSize: 14, margin: 0 }}>Remplissez ce formulaire pour demander l'enregistrement d'un nom de domaine sous l'extension nationale .td</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 20 }}>
          <FormField label="Nom de domaine souhaité *" hint="Exemple : monentreprise.td">
            <input type="text" required value={form.domaine_souhaite} onChange={handleChange("domaine_souhaite")} placeholder="mondomaine.td" style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Type d'entité *">
            <select required value={form.type_entite} onChange={handleChange("type_entite")} style={FORM_INPUT_STYLE}>
              <option value="">Sélectionnez...</option>
              <option value="Commerciale">Commerciale</option>
              <option value="Gouvernementale">Gouvernementale</option>
              <option value="Associative">Associative / ONG</option>
              <option value="Personnelle">Personnelle</option>
              <option value="Académique">Académique / Éducative</option>
            </select>
          </FormField>
          <FormField label="Nom de l'organisation *">
            <input type="text" required value={form.nom_organisation} onChange={handleChange("nom_organisation")} placeholder="Nom de votre organisation" style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Nom du contact responsable *">
            <input type="text" required value={form.nom_contact} onChange={handleChange("nom_contact")} placeholder="Nom et prénom" style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Email *">
            <input type="email" required value={form.email} onChange={handleChange("email")} placeholder="contact@exemple.com" style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Téléphone *">
            <input type="tel" required value={form.telephone} onChange={handleChange("telephone")} placeholder="+235 XX XX XX XX" style={FORM_INPUT_STYLE} />
          </FormField>
          <div style={{ gridColumn: "1 / -1" }}>
            <FormField label="Adresse *">
              <input type="text" required value={form.adresse} onChange={handleChange("adresse")} placeholder="Adresse complète" style={FORM_INPUT_STYLE} />
            </FormField>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <FormField label="Description de l'usage prévu *">
              <textarea required value={form.usage_description} onChange={handleChange("usage_description")} placeholder="Décrivez l'usage que vous ferez de ce nom de domaine (site web, email professionnel, service en ligne...)" style={{ ...FORM_INPUT_STYLE, minHeight: 100, resize: "vertical" }} />
            </FormField>
          </div>
        </div>
        {error && <div style={{ color: "#FC5C65", fontSize: 14, marginTop: 16 }}>{error}</div>}
        <button type="submit" disabled={submitting} style={{
          marginTop: 28, background: submitting ? "rgba(0,201,167,0.5)" : SECONDARY_COLOR,
          color: "#fff", border: "none", padding: "14px 32px", borderRadius: 10,
          fontWeight: 700, fontSize: 15, cursor: submitting ? "not-allowed" : "pointer",
          boxShadow: "0 8px 30px rgba(0,201,167,0.25)", transition: "all 0.3s",
        }}>
          {submitting ? "Envoi en cours..." : "Soumettre la demande →"}
        </button>
      </form>
    </div>
  );
}

function EquipmentForm() {
  const [form, setForm] = useState({
    type_equipement: "", quantite: "", nom_organisation: "", localisation_ville: "",
    adresse_exacte: "", responsable_nom: "", responsable_email: "",
    responsable_telephone: "", date_souhaitee: "", description_besoins: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: err } = await submitDemandeEquipement({ ...form, quantite: Number(form.quantite) || null });
    if (!err) {
      await sendEmailNotification(
        `Demande installation équipements — ${form.nom_organisation}`,
        `Type d'équipement : ${form.type_equipement}\nQuantité : ${form.quantite || "—"}\nOrganisation : ${form.nom_organisation}\nVille : ${form.localisation_ville}\nAdresse : ${form.adresse_exacte}\nResponsable : ${form.responsable_nom}\nEmail : ${form.responsable_email}\nTéléphone : ${form.responsable_telephone}\nDate souhaitée : ${form.date_souhaitee || "—"}\n\nBesoins :\n${form.description_besoins}`,
        form.responsable_email
      );
      setSuccess(true);
    } else {
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
    setSubmitting(false);
  };
  if (success) return <SuccessMessage title="Demande enregistrée !" message="Votre demande d'installation d'équipements a été soumise. Un technicien ADETIC vous contactera sous 48 heures ouvrables." />;
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ color: TEXT_COLOR, fontSize: 22, fontWeight: 800, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 10 }}>
          <Monitor size={22} color={SECONDARY_COLOR_ALT} strokeWidth={2} /> Demande d'Installation d'Équipements
        </h2>
        <p style={{ color: MUTED_TEXT, fontSize: 14, margin: 0 }}>Soumettez une demande d'installation d'équipements réseau ou de télécommunications sur votre site</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 20 }}>
          <FormField label="Type d'équipement *">
            <select required value={form.type_equipement} onChange={handleChange("type_equipement")} style={FORM_INPUT_STYLE}>
              <option value="">Sélectionnez...</option>
              <option value="Routeur">Routeur</option>
              <option value="Switch">Switch / Commutateur</option>
              <option value="Point d'accès WiFi">Point d'accès WiFi</option>
              <option value="Câblage réseau">Câblage réseau</option>
              <option value="Serveur">Serveur</option>
              <option value="Antenne">Antenne / Station de base</option>
              <option value="Autre">Autre</option>
            </select>
          </FormField>
          <FormField label="Quantité souhaitée">
            <input type="number" min="1" value={form.quantite} onChange={handleChange("quantite")} placeholder="Ex: 2" style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Nom de l'organisation / Institution *">
            <input type="text" required value={form.nom_organisation} onChange={handleChange("nom_organisation")} placeholder="Nom de votre organisation" style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Ville / Localisation *">
            <input type="text" required value={form.localisation_ville} onChange={handleChange("localisation_ville")} placeholder="N'Djamena, Moundou..." style={FORM_INPUT_STYLE} />
          </FormField>
          <div style={{ gridColumn: "1 / -1" }}>
            <FormField label="Adresse exacte du site d'installation *">
              <input type="text" required value={form.adresse_exacte} onChange={handleChange("adresse_exacte")} placeholder="Adresse complète" style={FORM_INPUT_STYLE} />
            </FormField>
          </div>
          <FormField label="Responsable technique — Nom *">
            <input type="text" required value={form.responsable_nom} onChange={handleChange("responsable_nom")} placeholder="Nom et prénom" style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Responsable technique — Email *">
            <input type="email" required value={form.responsable_email} onChange={handleChange("responsable_email")} placeholder="email@exemple.com" style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Téléphone du responsable">
            <input type="tel" value={form.responsable_telephone} onChange={handleChange("responsable_telephone")} placeholder="+235 XX XX XX XX" style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Date souhaitée d'intervention">
            <input type="date" value={form.date_souhaitee} onChange={handleChange("date_souhaitee")} style={FORM_INPUT_STYLE} />
          </FormField>
          <div style={{ gridColumn: "1 / -1" }}>
            <FormField label="Description des besoins *">
              <textarea required value={form.description_besoins} onChange={handleChange("description_besoins")} placeholder="Décrivez votre besoin en détail (infrastructure existante, nombre d'utilisateurs, objectifs...)" style={{ ...FORM_INPUT_STYLE, minHeight: 100, resize: "vertical" }} />
            </FormField>
          </div>
        </div>
        {error && <div style={{ color: "#FC5C65", fontSize: 14, marginTop: 16 }}>{error}</div>}
        <button type="submit" disabled={submitting} style={{
          marginTop: 28, background: submitting ? "rgba(79,142,247,0.5)" : SECONDARY_COLOR_ALT,
          color: "#fff", border: "none", padding: "14px 32px", borderRadius: 10,
          fontWeight: 700, fontSize: 15, cursor: submitting ? "not-allowed" : "pointer",
          boxShadow: "0 8px 30px rgba(79,142,247,0.25)", transition: "all 0.3s",
        }}>
          {submitting ? "Envoi en cours..." : "Soumettre la demande →"}
        </button>
      </form>
    </div>
  );
}

function PanneForm() {
  const [form, setForm] = useState({
    type_panne: "", niveau_urgence: "", localisation: "", equipement_concerne: "",
    nombre_utilisateurs_affectes: "", description_panne: "",
    nom_declarant: "", email_declarant: "", telephone_declarant: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: err } = await submitDeclarationPanne({
      ...form,
      nombre_utilisateurs_affectes: Number(form.nombre_utilisateurs_affectes) || null,
    });
    if (!err) {
      await sendEmailNotification(
        `[${form.niveau_urgence.toUpperCase()}] Panne signalée — ${form.type_panne}`,
        `Type de panne : ${form.type_panne}\nUrgence : ${form.niveau_urgence}\nLocalisation : ${form.localisation}\nÉquipement : ${form.equipement_concerne || "—"}\nUtilisateurs affectés : ${form.nombre_utilisateurs_affectes || "—"}\nDéclarant : ${form.nom_declarant}\nEmail : ${form.email_declarant}\nTéléphone : ${form.telephone_declarant || "—"}\n\nDescription :\n${form.description_panne}`,
        form.email_declarant
      );
      setSuccess(true);
    } else {
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
    setSubmitting(false);
  };
  if (success) return <SuccessMessage title="Panne signalée avec succès !" message="Votre déclaration de panne a été enregistrée. Nos équipes techniques interviendront selon le niveau d'urgence indiqué." />;
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ color: TEXT_COLOR, fontSize: 22, fontWeight: 800, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 10 }}>
          <AlertTriangle size={22} color="#FC5C65" strokeWidth={2} /> Déclaration de Panne Technique
        </h2>
        <p style={{ color: MUTED_TEXT, fontSize: 14, margin: 0 }}>Signalez une panne technique pour une prise en charge rapide par nos équipes spécialisées</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 20 }}>
          <FormField label="Type de panne *">
            <select required value={form.type_panne} onChange={handleChange("type_panne")} style={FORM_INPUT_STYLE}>
              <option value="">Sélectionnez...</option>
              <option value="Panne réseau">Panne réseau</option>
              <option value="Équipement défaillant">Équipement défaillant</option>
              <option value="Problème logiciel">Problème logiciel / Système</option>
              <option value="Problème de connectivité">Problème de connectivité Internet</option>
              <option value="Autre">Autre</option>
            </select>
          </FormField>
          <FormField label="Niveau d'urgence *">
            <select required value={form.niveau_urgence} onChange={handleChange("niveau_urgence")} style={FORM_INPUT_STYLE}>
              <option value="">Sélectionnez...</option>
              <option value="Normal">Normal — peut attendre</option>
              <option value="Urgent">Urgent — impact significatif</option>
              <option value="Critique">Critique — service totalement interrompu</option>
            </select>
          </FormField>
          <FormField label="Localisation *">
            <input type="text" required value={form.localisation} onChange={handleChange("localisation")} placeholder="Ville, quartier, bâtiment..." style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Équipement concerné">
            <input type="text" value={form.equipement_concerne} onChange={handleChange("equipement_concerne")} placeholder="Nom / référence de l'équipement" style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Nombre d'utilisateurs affectés">
            <input type="number" min="0" value={form.nombre_utilisateurs_affectes} onChange={handleChange("nombre_utilisateurs_affectes")} placeholder="Ex: 50" style={FORM_INPUT_STYLE} />
          </FormField>
          <div style={{ gridColumn: "1 / -1" }}>
            <FormField label="Description de la panne *">
              <textarea required value={form.description_panne} onChange={handleChange("description_panne")} placeholder="Décrivez précisément la panne : symptômes observés, depuis quand, ce qui a été tenté..." style={{ ...FORM_INPUT_STYLE, minHeight: 120, resize: "vertical" }} />
            </FormField>
          </div>
          <FormField label="Votre nom *">
            <input type="text" required value={form.nom_declarant} onChange={handleChange("nom_declarant")} placeholder="Nom et prénom" style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Votre email *">
            <input type="email" required value={form.email_declarant} onChange={handleChange("email_declarant")} placeholder="votre@email.com" style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Votre téléphone">
            <input type="tel" value={form.telephone_declarant} onChange={handleChange("telephone_declarant")} placeholder="+235 XX XX XX XX" style={FORM_INPUT_STYLE} />
          </FormField>
        </div>
        {error && <div style={{ color: "#FC5C65", fontSize: 14, marginTop: 16 }}>{error}</div>}
        <button type="submit" disabled={submitting} style={{
          marginTop: 28, background: submitting ? "rgba(252,92,101,0.5)" : "#FC5C65",
          color: "#fff", border: "none", padding: "14px 32px", borderRadius: 10,
          fontWeight: 700, fontSize: 15, cursor: submitting ? "not-allowed" : "pointer",
          boxShadow: "0 8px 30px rgba(252,92,101,0.25)", transition: "all 0.3s",
        }}>
          {submitting ? "Envoi en cours..." : "Signaler la panne →"}
        </button>
      </form>
    </div>
  );
}

function EmailForm() {
  const [form, setForm] = useState({
    nom_organisation: "", domaine_email: "", nombre_comptes: "",
    liste_utilisateurs: "", type_usage: "",
    nom_responsable: "", email_responsable: "", telephone_responsable: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError(null);
    const { error: err } = await submitDemandeEmail({
      ...form, nombre_comptes: Number(form.nombre_comptes) || 1,
    });
    if (!err) {
      await sendEmailNotification(
        `Demande création mails — ${form.nom_organisation}`,
        `Organisation : ${form.nom_organisation}\nDomaine : ${form.domaine_email}\nNombre de comptes : ${form.nombre_comptes}\nUsage : ${form.type_usage}\nResponsable : ${form.nom_responsable}\nEmail : ${form.email_responsable}\nTél : ${form.telephone_responsable}\n\nUtilisateurs :\n${form.liste_utilisateurs}`,
        form.email_responsable
      );
      setSuccess(true);
    } else { setError("Une erreur est survenue. Veuillez réessayer."); }
    setSubmitting(false);
  };
  if (success) return <SuccessMessage title="Demande soumise avec succès !" message="Votre demande de création de boîtes mail professionnelles a été enregistrée. Nos équipes vous contacteront dans les 48 heures ouvrables." />;
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ color: TEXT_COLOR, fontSize: 22, fontWeight: 800, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 10 }}>
          <Mail size={22} color="#A55EEA" strokeWidth={2} /> Création de Boîtes Mail Professionnelles
        </h2>
        <p style={{ color: MUTED_TEXT, fontSize: 14, margin: 0 }}>Demandez la création de comptes email professionnels sous votre nom de domaine</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 20 }}>
          <FormField label="Nom de l'organisation *">
            <input type="text" required value={form.nom_organisation} onChange={handleChange("nom_organisation")} placeholder="Nom de votre organisation" style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Nom de domaine *" hint="Ex : organisation.td">
            <input type="text" required value={form.domaine_email} onChange={handleChange("domaine_email")} placeholder="organisation.td" style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Nombre de comptes souhaités *">
            <input type="number" required min="1" value={form.nombre_comptes} onChange={handleChange("nombre_comptes")} placeholder="Ex : 5" style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Type d'usage *">
            <select required value={form.type_usage} onChange={handleChange("type_usage")} style={FORM_INPUT_STYLE}>
              <option value="">Sélectionnez...</option>
              <option value="Professionnel interne">Communication professionnelle interne</option>
              <option value="Communication externe">Communication externe / clients</option>
              <option value="Service citoyen">Service citoyen / public</option>
              <option value="Administration">Administration publique</option>
              <option value="Autre">Autre</option>
            </select>
          </FormField>
          <div style={{ gridColumn: "1 / -1" }}>
            <FormField label="Liste des utilisateurs" hint="Prénom Nom — un par ligne">
              <textarea value={form.liste_utilisateurs} onChange={handleChange("liste_utilisateurs")} placeholder={"Exemple :\nAli Hassan\nFatima Mahamat\nAdoum Ibrahim"} style={{ ...FORM_INPUT_STYLE, minHeight: 100, resize: "vertical" }} />
            </FormField>
          </div>
          <FormField label="Nom du responsable *">
            <input type="text" required value={form.nom_responsable} onChange={handleChange("nom_responsable")} placeholder="Nom et prénom" style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Email du responsable *">
            <input type="email" required value={form.email_responsable} onChange={handleChange("email_responsable")} placeholder="responsable@email.com" style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Téléphone">
            <input type="tel" value={form.telephone_responsable} onChange={handleChange("telephone_responsable")} placeholder="+235 XX XX XX XX" style={FORM_INPUT_STYLE} />
          </FormField>
        </div>
        {error && <div style={{ color: "#FC5C65", fontSize: 14, marginTop: 16 }}>{error}</div>}
        <button type="submit" disabled={submitting} style={{
          marginTop: 28, background: submitting ? "rgba(165,94,234,0.5)" : "#A55EEA",
          color: "#fff", border: "none", padding: "14px 32px", borderRadius: 10,
          fontWeight: 700, fontSize: 15, cursor: submitting ? "not-allowed" : "pointer",
          boxShadow: "0 8px 30px rgba(165,94,234,0.25)", transition: "all 0.3s",
        }}>
          {submitting ? "Envoi en cours..." : "Soumettre la demande →"}
        </button>
      </form>
    </div>
  );
}

function PlateformeForm() {
  const [form, setForm] = useState({
    nom_projet: "", type_plateforme: "", nom_organisation: "",
    description_besoins: "", fonctionnalites: "",
    budget_approximatif: "", delai_souhaite: "",
    nom_responsable: "", email_responsable: "", telephone_responsable: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError(null);
    const { error: err } = await submitDemandePlateforme(form);
    if (!err) {
      await sendEmailNotification(
        `Demande conception plateforme — ${form.nom_projet}`,
        `Projet : ${form.nom_projet}\nType : ${form.type_plateforme}\nOrganisation : ${form.nom_organisation}\nBudget : ${form.budget_approximatif}\nDélai : ${form.delai_souhaite}\nResponsable : ${form.nom_responsable}\nEmail : ${form.email_responsable}\n\nBesoins :\n${form.description_besoins}\n\nFonctionnalités :\n${form.fonctionnalites}`,
        form.email_responsable
      );
      setSuccess(true);
    } else { setError("Une erreur est survenue. Veuillez réessayer."); }
    setSubmitting(false);
  };
  if (success) return <SuccessMessage title="Demande soumise avec succès !" message="Votre demande de conception de plateforme numérique a été enregistrée. Nos équipes vous contacteront pour étudier votre projet." />;
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ color: TEXT_COLOR, fontSize: 22, fontWeight: 800, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 10 }}>
          <Layers size={22} color="#20BF6B" strokeWidth={2} /> Conception de Plateforme Numérique
        </h2>
        <p style={{ color: MUTED_TEXT, fontSize: 14, margin: 0 }}>Soumettez votre projet de plateforme ou application numérique — site web, portail, système de gestion</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 20 }}>
          <FormField label="Nom du projet *">
            <input type="text" required value={form.nom_projet} onChange={handleChange("nom_projet")} placeholder="Ex : Portail citoyen de N'Djaména" style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Type de plateforme *">
            <select required value={form.type_plateforme} onChange={handleChange("type_plateforme")} style={FORM_INPUT_STYLE}>
              <option value="">Sélectionnez...</option>
              <option value="Site web institutionnel">Site web institutionnel</option>
              <option value="Application web">Application web</option>
              <option value="Portail citoyen">Portail citoyen / e-gouvernement</option>
              <option value="Système de gestion">Système de gestion (ERP, CRM...)</option>
              <option value="Plateforme e-commerce">Plateforme e-commerce</option>
              <option value="Application mobile">Application mobile</option>
              <option value="Autre">Autre</option>
            </select>
          </FormField>
          <FormField label="Nom de l'organisation *">
            <input type="text" required value={form.nom_organisation} onChange={handleChange("nom_organisation")} placeholder="Ministère, entreprise, institution..." style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Budget approximatif">
            <select value={form.budget_approximatif} onChange={handleChange("budget_approximatif")} style={FORM_INPUT_STYLE}>
              <option value="">Non défini</option>
              <option value="< 1M FCFA">Moins de 1 million FCFA</option>
              <option value="1-5M FCFA">1 à 5 millions FCFA</option>
              <option value="5-20M FCFA">5 à 20 millions FCFA</option>
              <option value="> 20M FCFA">Plus de 20 millions FCFA</option>
            </select>
          </FormField>
          <FormField label="Délai souhaité">
            <input type="text" value={form.delai_souhaite} onChange={handleChange("delai_souhaite")} placeholder="Ex : 3 mois, fin 2026..." style={FORM_INPUT_STYLE} />
          </FormField>
          <div style={{ gridColumn: "1 / -1" }}>
            <FormField label="Description des besoins *">
              <textarea required value={form.description_besoins} onChange={handleChange("description_besoins")} placeholder="Décrivez votre projet, ses objectifs, le public cible et les problèmes qu'il doit résoudre..." style={{ ...FORM_INPUT_STYLE, minHeight: 110, resize: "vertical" }} />
            </FormField>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <FormField label="Fonctionnalités souhaitées" hint="Listez les fonctionnalités principales">
              <textarea value={form.fonctionnalites} onChange={handleChange("fonctionnalites")} placeholder={"Exemple :\n- Authentification des utilisateurs\n- Tableau de bord administrateur\n- Formulaires en ligne\n- Paiement électronique"} style={{ ...FORM_INPUT_STYLE, minHeight: 100, resize: "vertical" }} />
            </FormField>
          </div>
          <FormField label="Nom du responsable *">
            <input type="text" required value={form.nom_responsable} onChange={handleChange("nom_responsable")} placeholder="Nom et prénom" style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Email du responsable *">
            <input type="email" required value={form.email_responsable} onChange={handleChange("email_responsable")} placeholder="responsable@email.com" style={FORM_INPUT_STYLE} />
          </FormField>
          <FormField label="Téléphone">
            <input type="tel" value={form.telephone_responsable} onChange={handleChange("telephone_responsable")} placeholder="+235 XX XX XX XX" style={FORM_INPUT_STYLE} />
          </FormField>
        </div>
        {error && <div style={{ color: "#FC5C65", fontSize: 14, marginTop: 16 }}>{error}</div>}
        <button type="submit" disabled={submitting} style={{
          marginTop: 28, background: submitting ? "rgba(32,191,107,0.5)" : "#20BF6B",
          color: "#fff", border: "none", padding: "14px 32px", borderRadius: 10,
          fontWeight: 700, fontSize: 15, cursor: submitting ? "not-allowed" : "pointer",
          boxShadow: "0 8px 30px rgba(32,191,107,0.25)", transition: "all 0.3s",
        }}>
          {submitting ? "Envoi en cours..." : "Soumettre le projet →"}
        </button>
      </form>
    </div>
  );
}

function EServicesPage({ onBack }) {
  const [activeService, setActiveService] = useState(null);
  const eServices = [
    {
      id: "domaine", icon: Globe, title: "Nom de Domaine .td", subtitle: "Enregistrement",
      description: "Demandez l'enregistrement d'un nom de domaine sous l'extension nationale .td pour votre organisation.",
      color: "#00C9A7", bg: "rgba(0,201,167,0.08)",
    },
    {
      id: "equipement", icon: Monitor, title: "Installation d'Équipements", subtitle: "Réseau & Télécoms",
      description: "Soumettez une demande d'installation d'équipements réseau ou de télécommunications sur votre site.",
      color: "#4F8EF7", bg: "rgba(79,142,247,0.08)",
    },
    {
      id: "panne", icon: AlertTriangle, title: "Signalement de Panne", subtitle: "Support Technique",
      description: "Déclarez une panne technique pour une prise en charge rapide par nos équipes spécialisées.",
      color: "#FC5C65", bg: "rgba(252,92,101,0.08)",
    },
    {
      id: "email", icon: Mail, title: "Création de Mails", subtitle: "Messagerie Professionnelle",
      description: "Demandez la création de boîtes mail professionnelles sous votre nom de domaine institutionnel.",
      color: "#A55EEA", bg: "rgba(165,94,234,0.08)",
    },
    {
      id: "plateforme", icon: Layers, title: "Conception de Plateforme", subtitle: "Développement Numérique",
      description: "Soumettez votre projet de plateforme numérique : site web, portail citoyen, application ou système de gestion.",
      color: "#20BF6B", bg: "rgba(32,191,107,0.08)",
    },
  ];
  return (
    <div style={{ minHeight: "100vh", background: SITE_BG_COLOR }}>
      <div style={{
        background: "linear-gradient(135deg, #050A19 0%, #0d1a3d 100%)",
        padding: "100px 2rem 60px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "20%", right: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,201,167,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 400, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,142,247,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <button onClick={onBack} style={{
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff", padding: "8px 16px", borderRadius: 8, cursor: "pointer",
            fontSize: 13, fontWeight: 500, marginBottom: 32,
          }}>← Retour à l'accueil</button>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,201,167,0.15)", border: "1px solid rgba(0,201,167,0.3)",
            borderRadius: 100, padding: "6px 14px", marginBottom: 20,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: SECONDARY_COLOR, display: "block" }} />
            <span style={{ color: SECONDARY_COLOR, fontSize: 12, fontWeight: 600, letterSpacing: 1.5 }}>SERVICES EN LIGNE</span>
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 900, margin: "0 0 16px" }}>
            E-Services <span style={{ color: SECONDARY_COLOR }}>ADETIC</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, maxWidth: 560, margin: 0, lineHeight: 1.7 }}>
            Accédez à nos services administratifs et techniques en ligne. Soumettez vos demandes directement depuis cette plateforme, sans vous déplacer.
          </p>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 2rem" }}>
        {!activeService ? (
          <>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 style={{ color: TEXT_COLOR, fontSize: 24, fontWeight: 800, margin: "0 0 12px" }}>Choisissez un service</h2>
              <p style={{ color: MUTED_TEXT, fontSize: 15, margin: 0 }}>Sélectionnez le type de demande que vous souhaitez soumettre</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 24, marginBottom: 60 }}>
              {eServices.map(s => (
                <ServiceCard key={s.id} service={s} onClick={() => setActiveService(s.id)} />
              ))}
            </div>
            <div className="eservice-info-box">
              <div style={{ fontSize: 28, marginTop: 2 }}>ℹ️</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: TEXT_COLOR, fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>Comment ça marche ?</h3>
                <div className="eservice-info-steps">
                  {[
                    { step: "1", text: "Choisissez votre service" },
                    { step: "2", text: "Remplissez le formulaire" },
                    { step: "3", text: "Soumettez votre demande" },
                    { step: "4", text: "Réponse sous 48h ouvrables" },
                  ].map(item => (
                    <div key={item.step} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%", background: SECONDARY_COLOR,
                        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: 700, flexShrink: 0,
                      }}>{item.step}</div>
                      <span style={{ color: MUTED_TEXT, fontSize: 14 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>
            <button onClick={() => setActiveService(null)} style={{
              background: "transparent", border: "1px solid rgba(15,23,42,0.12)",
              color: TEXT_COLOR, padding: "8px 16px", borderRadius: 8, cursor: "pointer",
              fontSize: 13, fontWeight: 500, marginBottom: 36,
            }}>← Retour aux services</button>
            <div className="eservice-form-card">
              {activeService === "domaine" && <DomainForm />}
              {activeService === "equipement" && <EquipmentForm />}
              {activeService === "panne" && <PanneForm />}
              {activeService === "email" && <EmailForm />}
              {activeService === "plateforme" && <PlateformeForm />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EServicesBanner({ onNavigate }) {
  return (
    <section style={{ background: "linear-gradient(135deg, #050A19 0%, #0d1a3d 100%)", padding: "80px 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <AnimSection>
          <div style={{ marginBottom: 16 }}>
            <span style={{ color: SECONDARY_COLOR, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>💻 Services en ligne</span>
          </div>
          <h2 style={{ color: "#fff", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 900, margin: "0 0 16px" }}>
            Effectuez vos démarches en ligne
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 540, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Demande de nom de domaine .td, installation d'équipements, signalement de panne — tout depuis votre navigateur, sans déplacement.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
            {[
              { label: "Nom de domaine .td", icon: Globe },
              { label: "Installation équipements", icon: Monitor },
              { label: "Signaler une panne", icon: AlertTriangle },
            ].map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10, padding: "10px 18px",
                  display: "flex", alignItems: "center", gap: 8,
                  color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500,
                }}>
                  <ItemIcon size={15} strokeWidth={2} /> {item.label}
                </div>
              );
            })}
          </div>
          <button
            onClick={() => onNavigate("eservices")}
            style={{
              background: SECONDARY_COLOR, color: "#fff", border: "none",
              padding: "14px 36px", borderRadius: 10, fontWeight: 700, fontSize: 15,
              cursor: "pointer", boxShadow: "0 8px 30px rgba(0,201,167,0.3)",
              transition: "all 0.3s",
            }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 40px rgba(0,201,167,0.45)"; }}
            onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = "0 8px 30px rgba(0,201,167,0.3)"; }}
          >
            Accéder aux E-Services →
          </button>
        </AnimSection>
      </div>
    </section>
  );
}

function MissionsSection() {
  return (
    <section id="missions" className="section-pad" style={{ background: SITE_BG_COLOR }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <AnimSection>
          <div style={{ textAlign: "center", marginBottom: 70 }}>
            <span style={{ color: SECONDARY_COLOR, fontSize: 12, fontWeight: 700, letterSpacing: 3 }}>🚀 Nos engagements</span>
            <h2 style={{ color: BG_COLOR, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 900, margin: "12px 0 16px" }}>Solutions en télécommunication</h2>
            <p style={{ color: MUTED_TEXT, maxWidth: 540, margin: "0 auto", fontSize: 16 }}>Des missions sur mesure pour renforcer l'infrastructure numérique tchadienne et valoriser la présence digitale de l'État.</p>
          </div>
        </AnimSection>

        <div className="missions-grid">
          {MISSIONS.map((m, i) => (
            <AnimSection key={i} delay={i * 100}>
              <div style={{
                background: PANEL_BG,
                border: "1px solid rgba(15,23,42,0.08)",
                borderRadius: 20, padding: "36px",
                transition: "all 0.35s",
                position: "relative", overflow: "hidden",
                cursor: "default",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `rgba(${m.color === "#00C9A7" ? "0,201,167" : m.color === "#4F8EF7" ? "79,142,247" : m.color === "#F7B731" ? "247,183,49" : "165,94,234"},0.06)`;
                  e.currentTarget.style.borderColor = `${m.color}40`;
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 20px 50px ${m.color}15`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <div style={{
                  position: "absolute", top: -30, right: -30,
                  width: 120, height: 120, borderRadius: "50%",
                  background: `${m.color}08`,
                }} />
                <IconBadge
                  icon={m.icon}
                  size={54}
                  color={m.color}
                  bg={`${m.color}15`}
                />
                <h3 style={{ color: BG_COLOR, fontSize: 18, fontWeight: 800, marginBottom: 12, marginTop: 18 }}>{m.title}</h3>
                <p style={{ color: MUTED_TEXT, fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>{m.desc}</p>
                <div style={{
                  display: "flex", alignItems: "center", gap: 14,
                  paddingTop: 20, borderTop: "1px solid rgba(15,23,42,0.08)",
                }}>
                  <span style={{ color: m.color, fontWeight: 900, fontSize: 22 }}>{m.stat}</span>
                  <span style={{ color: "rgba(15,23,42,0.55)", fontSize: 13 }}>{m.statLabel}</span>
                </div>
              </div>
            </AnimSection>
          ))}
        </div>

        {/* Fibre optique highlight */}
        <AnimSection delay={200}>
          <div style={{
            marginTop: 40,
            background: "linear-gradient(135deg, rgba(0,201,167,0.08), rgba(79,142,247,0.08))",
            border: "1px solid rgba(0,201,167,0.2)",
            borderRadius: 20, padding: "40px",
          }} className="fibre-grid">
            <div>
              <h3 style={{ color: BG_COLOR, fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Réalisation en Fibre Optique</h3>
              <p style={{ color: MUTED_TEXT, lineHeight: 1.7, margin: 0, maxWidth: 600 }}>
                L'ADETIC a installé des infrastructures en fibre optique connectant plusieurs ministères et institutions publiques. Le projet est réalisé à près de <strong style={{ color: "#00C9A7" }}>80 %</strong>, et très bientôt, tout le Tchad sera connecté, marquant un pas vers une administration moderne et performante.
              </p>
            </div>
            <div className="fibre-chart" style={{ textAlign: "center" }}>
              <div style={{ position: "relative", width: 100, height: 100 }}>
                <svg viewBox="0 0 100 100" style={{ width: 100, height: 100, transform: "rotate(-90deg)" }}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="url(#grad)" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40 * 0.8} ${2 * Math.PI * 40}`}
                    strokeLinecap="round" />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00C9A7" />
                      <stop offset="100%" stopColor="#4F8EF7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#00C9A7", fontWeight: 900, fontSize: 18 }}>80%</div>
              </div>
              <div style={{ color: "rgba(15,23,42,0.6)", fontSize: 12, marginTop: 8 }}>Complété</div>
            </div>
          </div>
        </AnimSection>
      </div>
    </section>
  );
}

function DirectionSection() {
  return (
    <section id="direction" className="section-pad" style={{ background: SITE_BG_COLOR }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <AnimSection>
          <div style={{ textAlign: "center", marginBottom: 70 }}>
            <span style={{ color: "#F7B731", fontSize: 12, fontWeight: 700, letterSpacing: 3 }}>👤 Leadership</span>
            <h2 style={{ color: BG_COLOR, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 900, margin: "12px 0 16px" }}>Direction Générale</h2>
          </div>
        </AnimSection>

        <AnimSection delay={100}>
          <div className="direction-grid">
            {/* Photo DG */}
            <div className="direction-photo" style={{
              width: 260, height: 320, borderRadius: 20,
              overflow: "hidden", flexShrink: 0,
              boxShadow: "0 20px 60px rgba(0,201,167,0.18), 0 4px 16px rgba(15,23,42,0.1)",
              border: "3px solid rgba(0,201,167,0.25)",
              background: "#f8fafc",
            }}>
              <img src={dgAdoum} alt="Directeur Général - Adoum Djimet Saboun" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
            </div>

            {/* Texte */}
            <div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 18 }}>
                <span style={{
                  background: "rgba(0,201,167,0.12)", color: SECONDARY_COLOR,
                  fontSize: 11, fontWeight: 700, padding: "5px 14px",
                  borderRadius: 100, letterSpacing: 1.5, border: "1px solid rgba(0,201,167,0.25)",
                }}>DIRECTEUR GÉNÉRAL</span>
              </div>
              <h3 style={{ color: BG_COLOR, fontSize: 30, fontWeight: 900, marginBottom: 6, letterSpacing: -0.5 }}>Adoum Djimet Saboun</h3>
              <p style={{ color: SECONDARY_COLOR, fontSize: 15, fontWeight: 600, marginBottom: 22, letterSpacing: 0.3 }}>Directeur Général de l'ADETIC</p>
              <p style={{ color: MUTED_TEXT, fontSize: 15, lineHeight: 1.85, marginBottom: 28 }}>
                Nommé par décret N°0196/PT/PM/MTEN/2024 du 06 mars 2024, le Directeur Général pilote la stratégie nationale de développement des TIC au Tchad. Sous sa direction, l'ADETIC accélère la transformation numérique de l'État tchadien, du déploiement de la fibre optique à la mise en place du datacenter national.
              </p>
              <div className="direction-stats" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {[
                  { val: "2024", label: "Nomination" },
                  { val: "Décret", label: "N°0196/PT/PM" },
                  { val: ".td", label: "Domaine national" },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: i === 0 ? "rgba(0,201,167,0.08)" : PANEL_BG,
                    border: `1px solid ${i === 0 ? "rgba(0,201,167,0.25)" : "rgba(15,23,42,0.08)"}`,
                    borderRadius: 12, padding: "12px 20px", textAlign: "center",
                  }}>
                    <div style={{ color: i === 0 ? SECONDARY_COLOR : BG_COLOR, fontWeight: 900, fontSize: 16 }}>{item.val}</div>
                    <div style={{ color: MUTED_TEXT, fontSize: 11, marginTop: 3 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimSection>
      </div>
    </section>
  );
}

function ActivitesSection() {
  const items = [
    { icon: Network, title: "IXP National", desc: "Point d'Échange Internet permettant aux acteurs locaux d'échanger directement leur trafic pour une meilleure qualité et souveraineté.", color: "#00C9A7" },
    { icon: Building2, title: "Télécentres Provinciaux", desc: "Déploiement de télécentres dans les villes de Mongo, Abéché, Bongor, Doba, Biltine et Amdjarass pour réduire la fracture numérique.", color: "#4F8EF7" },
    { icon: Database, title: "Datacenter National", desc: "Construction et certification du datacenter national en cours, garantissant la souveraineté et la sécurité des données de l'État tchadien.", color: "#F7B731" },
    { icon: Globe, title: "Gestion Domaine .td", desc: "Politique et procédures d'enregistrement des noms de domaine .td, attribution d'agréments de registrars et administration des serveurs racine.", color: "#A55EEA" },
    { icon: Code2, title: "Développement des plateformes", desc: "Conception, développement et déploiement de plateformes numériques publiques (portails, services en ligne, APIs) pour faciliter l'accès aux services de l'État.", color: "#FC5C65" },
    { icon: Landmark, title: "Digitalisation de l'administration", desc: "Accompagnement à la digitalisation des processus administratifs, sécurisation des flux et formation pour une administration électronique efficace.", color: "#20BF6B" },
  ];

  return (
    <section id="activites" className="section-pad" style={{ background: SITE_BG_COLOR }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <AnimSection>
          <div style={{ textAlign: "center", marginBottom: 70 }}>
            <span style={{ color: "#A55EEA", fontSize: 12, fontWeight: 700, letterSpacing: 3 }}>⚙️ Ce que nous faisons</span>
            <h2 style={{ color: BG_COLOR, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 900, margin: "12px 0 16px" }}>Activités & Travaux</h2>
            <p style={{ color: MUTED_TEXT, maxWidth: 500, margin: "0 auto", fontSize: 16 }}>L'ADETIC, institution publique, est à la hauteur des enjeux numériques et des défis des TIC au Tchad.</p>
          </div>
        </AnimSection>

        <div className="activites-grid">
          {items.map((item, i) => (
            <AnimSection key={i} delay={i * 70}>
              <div style={{
                background: PANEL_BG, border: "1px solid rgba(15,23,42,0.08)",
                borderRadius: 16, padding: "30px",
                transition: "all 0.3s", cursor: "default",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = `${item.color}50`;
                  e.currentTarget.style.boxShadow = `0 16px 40px ${item.color}15`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.borderColor = "rgba(15,23,42,0.08)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <IconBadge
                  icon={item.icon}
                  size={54}
                  color={item.color}
                  bg={`${item.color}22`}
                />
                <h3 style={{ color: BG_COLOR, fontSize: 16, fontWeight: 800, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: MUTED_TEXT, fontSize: 13, lineHeight: 1.7 }}>{item.desc}</p>
                <div style={{ marginTop: 16, width: 30, height: 2, background: item.color, borderRadius: 2 }} />
              </div>
            </AnimSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [form, setForm] = useState({ nom: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState("");

  const handleSubmit = async () => {
    setFormErr("");
    if (!form.nom.trim() || !form.email.trim() || !form.message.trim()) {
      setFormErr("Veuillez remplir tous les champs avant d'envoyer.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFormErr("Adresse e-mail invalide.");
      return;
    }
    setSaving(true);
    const { error } = await addContactMessage(form);
    if (error) {
      setFormErr("Erreur lors de l'envoi. Veuillez réessayer.");
      setSaving(false);
      return;
    }
    await sendEmailNotification(
      `Nouveau message de contact — ${form.nom}`,
      `Nom : ${form.nom}\nEmail : ${form.email}\n\nMessage :\n${form.message}`,
      form.email
    );
    setSent(true);
    setSaving(false);
  };

  return (
    <section id="contact" className="section-pad" style={{ background: SITE_BG_COLOR }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <AnimSection>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ color: SECONDARY_COLOR, fontSize: 12, fontWeight: 700, letterSpacing: 3 }}>📬 Nous contacter</span>
            <h2 style={{ color: BG_COLOR, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 900, margin: "12px 0 16px" }}>Concrétisez votre transformation numérique</h2>
            <p style={{ color: MUTED_TEXT, fontSize: 16 }}>Les équipes de l'ADETIC sont à votre écoute pour toute demande de renseignement.</p>
          </div>
        </AnimSection>

        <div className="contact-grid">
          <AnimSection delay={100}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: "📍", label: "Adresse", val: "Avenue du Colonel Hassan Moursal Kourda, BP 240, N'Djamena — Tchad" },
                { icon: "📧", label: "Email", val: "adetic@adetic.td" },
                { icon: "🌐", label: "Site", val: "www.adetic.td" },
                { icon: "📱", label: "Facebook", val: "facebook.com/Adetic.td" },
              ].map((c, i) => (
                <div key={i} style={{
                  background: PANEL_BG, border: "1px solid rgba(15,23,42,0.08)",
                  borderRadius: 14, padding: "18px 20px",
                  display: "flex", alignItems: "flex-start", gap: 14,
                }}>
                  <IconBadge icon={c.icon} bg="rgba(15,23,42,0.08)" color="#0f172a" />
                  <div>
                    <div style={{ color: "#00C9A7", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>{c.label}</div>
                    <div style={{ color: MUTED_TEXT, fontSize: 14 }}>{c.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </AnimSection>

          <AnimSection delay={150}>
            {sent ? (
              <div style={{
                background: "linear-gradient(135deg, rgba(0,201,167,0.08), rgba(79,142,247,0.06))",
                border: "1px solid rgba(0,201,167,0.25)",
                borderRadius: 20, padding: "48px 32px", textAlign: "center",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                minHeight: 320,
              }}>
                <div style={{ fontSize: 52, marginBottom: 18 }}>✅</div>
                <h3 style={{ color: SECONDARY_COLOR, fontSize: 22, fontWeight: 800, margin: "0 0 10px" }}>Message envoyé !</h3>
                <p style={{ color: MUTED_TEXT, fontSize: 15, lineHeight: 1.6, maxWidth: 320 }}>Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.</p>
                <button onClick={() => { setSent(false); setForm({ nom: "", email: "", message: "" }); }} style={{
                  marginTop: 24, background: "transparent", border: `1px solid ${SECONDARY_COLOR}`,
                  color: SECONDARY_COLOR, borderRadius: 10, padding: "10px 24px",
                  cursor: "pointer", fontWeight: 700, fontSize: 14,
                }}>Envoyer un autre message</button>
              </div>
            ) : (
              <div className="contact-form-card" style={{
                background: "#ffffff", border: "1px solid rgba(15,23,42,0.1)",
                borderRadius: 20, padding: "32px",
                boxShadow: "0 4px 24px rgba(15,23,42,0.06)",
              }}>
                <h3 style={{ color: BG_COLOR, fontSize: 16, fontWeight: 800, margin: "0 0 22px" }}>Envoyer un message</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {["nom", "email"].map(field => (
                    <div key={field}>
                      <label style={{ color: TEXT_COLOR, fontSize: 13, fontWeight: 600, display: "block", marginBottom: 7 }}>
                        {field === "nom" ? "Votre nom *" : "Adresse e-mail *"}
                      </label>
                      <input
                        type={field === "email" ? "email" : "text"}
                        value={form[field]}
                        onChange={e => { setForm(f => ({ ...f, [field]: e.target.value })); setFormErr(""); }}
                        style={{
                          width: "100%", background: "#f8fafc",
                          border: "1px solid rgba(15,23,42,0.12)",
                          borderRadius: 10, padding: "12px 14px",
                          color: BG_COLOR, fontSize: 14,
                          outline: "none", boxSizing: "border-box",
                          transition: "border-color 0.2s",
                          fontFamily: "inherit",
                        }}
                        onFocus={e => e.target.style.borderColor = SECONDARY_COLOR}
                        onBlur={e => e.target.style.borderColor = "rgba(15,23,42,0.12)"}
                        placeholder={field === "nom" ? "Nom Prénom" : "email@exemple.com"}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ color: TEXT_COLOR, fontSize: 13, fontWeight: 600, display: "block", marginBottom: 7 }}>Message *</label>
                    <textarea
                      value={form.message}
                      onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setFormErr(""); }}
                      rows={5}
                      style={{
                        width: "100%", background: "#f8fafc",
                        border: "1px solid rgba(15,23,42,0.12)",
                        borderRadius: 10, padding: "12px 14px",
                        color: BG_COLOR, fontSize: 14,
                        outline: "none", resize: "vertical", boxSizing: "border-box",
                        fontFamily: "inherit",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={e => e.target.style.borderColor = SECONDARY_COLOR}
                      onBlur={e => e.target.style.borderColor = "rgba(15,23,42,0.12)"}
                      placeholder="Décrivez votre besoin..."
                    />
                  </div>
                  {formErr && (
                    <div style={{
                      background: "rgba(252,92,101,0.08)", border: "1px solid rgba(252,92,101,0.25)",
                      borderRadius: 8, padding: "10px 14px",
                      color: "#FC5C65", fontSize: 13, fontWeight: 600,
                    }}>⚠ {formErr}</div>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    style={{
                      background: saving ? "rgba(0,201,167,0.7)" : SECONDARY_COLOR,
                      color: "#fff", border: "none", borderRadius: 10,
                      padding: "14px", fontWeight: 800, fontSize: 15,
                      cursor: saving ? "not-allowed" : "pointer", transition: "all 0.3s",
                      boxShadow: "0 8px 30px rgba(0,201,167,0.25)",
                      width: "100%",
                    }}
                    onMouseEnter={e => { if (!saving) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,201,167,0.35)"; } }}
                    onMouseLeave={e => { if (!saving) { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,201,167,0.25)"; } }}
                  >{saving ? "Envoi en cours…" : "Envoyer le message →"}</button>
                </div>
              </div>
            )}
          </AnimSection>
        </div>
      </div>
    </section>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer style={{
      background: SITE_BG_COLOR,
      borderTop: "1px solid rgba(15,23,42,0.08)",
      padding: "50px 2rem 30px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 9,
                background: "linear-gradient(135deg, #00C9A7, #4F8EF7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, fontSize: 15, color: "#fff",
              }}>A</div>
              <div>
                <div style={{ color: BG_COLOR, fontWeight: 800, fontSize: 14, letterSpacing: 1 }}>ADETIC</div>
                <div style={{ color: SECONDARY_COLOR, fontSize: 8, letterSpacing: 2, fontWeight: 600 }}>TCHAD · NUMÉRIQUE</div>
              </div>
            </div>
            <p style={{ color: MUTED_TEXT, fontSize: 13, lineHeight: 1.7 }}>
              Agence de Développement des Technologies de l'Information et de la Communication. Institution publique tchadienne créée par la loi n° 012/PR/2014.
            </p>
          </div>
          {[
            { title: "Navigation", links: ["Accueil", "Actualités", "Direction Générale", "Activités", "Missions"] },
            { title: "Activités", links: ["Fibre Optique", "IXP National", "Télécentres", "Datacenter", "Cybersécurité"] },
            { title: "Contact", links: ["N'Djamena, Tchad", "adetic@adetic.td", "facebook.com/Adetic.td"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 style={{ color: BG_COLOR, fontSize: 13, fontWeight: 700, marginBottom: 14, letterSpacing: 1 }}>{col.title}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {col.links.map((l, j) => (
                  <span key={j} style={{ color: MUTED_TEXT, fontSize: 13, cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = SECONDARY_COLOR}
                    onMouseLeave={e => e.target.style.color = MUTED_TEXT}
                  >{l}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span style={{ color: "rgba(15,23,42,0.6)", fontSize: 12 }}>© 2026 ADETIC — Tous droits réservés</span>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ color: "rgba(15,23,42,0.6)", fontSize: 12 }}>Établissement public administratif · Loi n° 012/PR/2014</span>
            <button onClick={() => onNavigate("admin")} style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "rgba(15,23,42,0.25)", fontSize: 11, fontFamily: "inherit",
              transition: "color 0.2s", padding: 0,
            }}
              onMouseEnter={e => e.target.style.color = "#00C9A7"}
              onMouseLeave={e => e.target.style.color = "rgba(15,23,42,0.25)"}>
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [page, setPage] = useState(() =>
    window.location.hash === "#admin" ? "admin" : "home"
  );
  const [actualites, setActualites] = useState([]);
  const [loadingActualites, setLoadingActualites] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === "#admin") setPage("admin");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    async function loadActualites() {
      setLoadingActualites(true);
      setFetchError(null);
      try {
        const data = await fetchActualites();
        if (data?.length > 0) {
          const withImages = data
            .filter(item => IMAGE_MAP[item.image_url] || item.image_url?.startsWith("http"))
            .map(item => ({
              ...item,
              image: IMAGE_MAP[item.image_url] || item.image_url,
              icon: item.icon || null,
            }));
          setActualites(withImages.length > 0 ? withImages : ACTUALITES.filter(a => a.image));
        } else {
          setActualites(ACTUALITES.filter(a => a.image));
        }
      } catch {
        setActualites(ACTUALITES.filter(a => a.image));
      } finally {
        setLoadingActualites(false);
      }
    }
    loadActualites();
  }, []);

  const handleNavigate = (targetPage) => {
    if (targetPage === "admin") {
      window.location.hash = "admin";
    } else {
      window.location.hash = "";
    }
    setPage(targetPage);
    if (targetPage === "home" || targetPage === "eservices" || targetPage === "equipe") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (page === "admin") {
    return <AdminPage onBack={() => setPage("home")} />;
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", background: SITE_BG_COLOR, minHeight: "100vh", overflowX: "hidden", maxWidth: "100vw" }}>
      <Navbar scrolled={scrolled} activePage={page} onNavigate={handleNavigate} />
      {page === "articles" ? (
        <ArticlesPage actualites={actualites} loading={loadingActualites} fetchError={fetchError} onBack={() => setPage("home")} />
      ) : page === "eservices" ? (
        <EServicesPage onBack={() => setPage("home")} />
      ) : page === "equipe" ? (
        <EquipePage onBack={() => setPage("home")} />
      ) : (
        <>
          <HeroSection />
          <DirectionSection />
          <ActualitesSection actualites={actualites} loading={loadingActualites} fetchError={fetchError} onNavigate={handleNavigate} />
          <MissionsSection />
          <ActivitesSection />
          <EServicesBanner onNavigate={handleNavigate} />
          <ContactSection />
          <Footer onNavigate={handleNavigate} />
        </>
      )}
    </div>
  );
}
