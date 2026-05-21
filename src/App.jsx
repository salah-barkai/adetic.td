import { useState, useEffect, useRef } from "react";
// Images from project `images/` folder
import heroImg from "../images/fond-humain-de-poignee-de-main-de-robot-ere-numerique-futuriste-2048x1365.jpg";
import act1 from "../images/act1.jpg";
import act2 from "../images/act2.jpg";
import act3 from "../images/act3.jpg";
import act4 from "../images/act4.jpg";
import dgAdoum from "../images/dg-adoum-djimet1.jpg";
import igfReunion from "../images/igf-reunion.jpg";
import rencontreDgSmart from "../images/rencontre-dg-et-smart.jpg";
import aiTraining from "../images/pexels-photo-1054397-1.jpeg";
import tdLogo from "../images/td.png";
import siteLogo from "../images/logo.jpg";

const NAV_LINKS = [
  { label: "Accueil", href: "#hero" },
  { label: "Actualités", href: "#actualites" },
  { label: "Direction Générale", href: "#direction" },
  { label: "Activités", href: "#activites" },
  { label: "Missions", href: "#missions" },
  { label: "Contact", href: "#contact" },
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
const HERO_TEXT_COLOR = "#0f172a";
const HERO_SUBTEXT_COLOR = "rgba(15,23,42,0.7)";

const ACTUALITES = [
  {
    category: "Forum",
    date: "16–21 Fév 2026",
    title: "Participation stratégique du Tchad au Forum sur la Gouvernance de l'Internet de l'Afrique Centrale",
    excerpt: "Du 16 au 21 février 2026, le Tchad a pris une part active au Forum sur la Gouvernance de l'Internet, renforçant sa position comme acteur clé du numérique africain.",
    color: "#00C9A7",
    icon: "🌐",
    image: igfReunion,
  },
  {
    category: "Coopération",
    date: "Fév 2026",
    title: "Coopération numérique : des experts azerbaïdjanais en visite de travail à l'ADETIC",
    excerpt: "Dans le cadre du renforcement de la coopération internationale en matière de transformation digitale, une délégation d'experts azerbaïdjanais a effectué une visite officielle.",
    color: "#4F8EF7",
    icon: "🤝",
    image: rencontreDgSmart,
  },
  {
    category: "Data Center",
    date: "Fév 2026",
    title: "Audit et certification du Data Center national : l'ADETIC, l'ANSICE et TECHSO-GROUP en mission conjointe",
    excerpt: "Dans le cadre de la mise en œuvre de l'accord tripartite, l'ADETIC s'engage pour la certification du datacenter national tchadien.",
    color: "#F7B731",
    icon: "🖥️",
    image: heroImg,
  },
  {
    category: "Intelligence Artificielle",
    date: "2025",
    title: "Formation de haut niveau sur l'Intelligence Artificielle",
    excerpt: "L'ADETIC, en collaboration avec l'UNESCO et l'ENASTIC, organise une formation d'excellence sur l'IA pour les cadres nationaux.",
    color: "#FC5C65",
    icon: "🤖",
    image: aiTraining,
  },
];

const MISSIONS = [
  {
    icon: "⚡",
    title: "Infrastructures Numériques",
    desc: "Mise en place et maintenance d'infrastructures solides et sécurisées pour un accès fiable aux services numériques de l'État.",
    stat: "80%",
    statLabel: "Réseau fibre optique déployé",
    color: "#00C9A7",
  },
  {
    icon: "🔗",
    title: "Systèmes d'Information Publics",
    desc: "Coordination des systèmes gouvernementaux pour leur interopérabilité, leur sécurité et une gestion efficace des données.",
    stat: "IXP",
    statLabel: "Point d'échange internet souverain",
    color: "#4F8EF7",
  },
  {
    icon: "🎓",
    title: "Formation & Accompagnement",
    desc: "Montée en compétences digitales des administrations avec des formations adaptées pour une utilisation optimale des outils.",
    stat: "6+",
    statLabel: "Télécentres déployés en province",
    color: "#F7B731",
  },
  {
    icon: "🛡️",
    title: "Sécurité & Veille Technologique",
    desc: "Veille technologique permanente et recommandations en matière de sécurité des réseaux et certification numérique.",
    stat: ".td",
    statLabel: "Gestionnaire domaine national",
    color: "#A55EEA",
  },
];

const CHIFFRES = [
  { val: "80%", label: "Réseau fibre complété", icon: "📡" },
  { val: "6+", label: "Télécentres provinciaux", icon: "🏢" },
  { val: "2014", label: "Année de création", icon: "📅" },
  { val: "IXP", label: "Internet Exchange Point", icon: "🌍" },
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

function Navbar({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(255,255,255,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(15,23,42,0.08)" : "none",
      transition: "all 0.4s ease",
      padding: "0 2rem",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10,
            overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(0,0,0,0.05)",
            background: "transparent",
          }}>
            <img src={siteLogo} alt="ADETIC logo" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div>
            <div style={{ color: scrolled ? PRIMARY_COLOR : HERO_TEXT_COLOR, fontWeight: 800, fontSize: 15, letterSpacing: 1, lineHeight: 1 }}>ADETIC</div>
            <div style={{ color: scrolled ? SECONDARY_COLOR : HERO_TEXT_COLOR, fontSize: 9, letterSpacing: 2, fontWeight: 600 }}>TCHAD · NUMÉRIQUE</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} style={{
              color: scrolled ? "rgba(255,255,255,0.75)" : "rgba(15,23,42,0.8)", textDecoration: "none",
              fontSize: 13, fontWeight: 500, padding: "6px 10px",
              borderRadius: 6, transition: "all 0.2s",
              display: window.innerWidth < 900 ? "none" : "block",
            }}
              onMouseEnter={e => { e.target.style.color = "#00C9A7"; e.target.style.background = "rgba(0,201,167,0.1)"; }}
              onMouseLeave={e => { e.target.style.color = scrolled ? "rgba(255,255,255,0.75)" : "rgba(15,23,42,0.8)"; e.target.style.background = "transparent"; }}
            >{l.label}</a>
          ))}
          <a href="#contact" style={{
            background: "rgba(255,255,255,0.12)",
            color: PRIMARY_COLOR, textDecoration: "none",
            padding: "8px 18px", borderRadius: 8,
            fontSize: 13, fontWeight: 700,
            boxShadow: "0 4px 15px rgba(255,255,255,0.12)",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.target.style.background = `linear-gradient(135deg, ${SECONDARY_COLOR}, ${SECONDARY_COLOR_ALT})`; e.target.style.color = PRIMARY_COLOR; }}
            onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.12)"; e.target.style.color = PRIMARY_COLOR; }}
          >Contactez-nous</a>
        </div>
      </div>
    </nav>
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

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 1, paddingTop: 100 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
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

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
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

          {/* Right: Tech visual */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {/* Decorative hero image (replaced with td logo) */}
            <img src={tdLogo} alt="TD" style={{
              position: "absolute",
              right: -10,
              width: 420,
              height: 420,
              objectFit: "contain",
              borderRadius: 24,
              boxShadow: "0 20px 50px rgba(15,23,42,0.08)",
              zIndex: 0,
              opacity: 0.98,
              background: "#fff",
              padding: 24,
            }} />
            <div style={{
              width: 320, height: 320, borderRadius: "50%",
              border: "1px solid rgba(0,201,167,0.2)",
              position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: 240, height: 240, borderRadius: "50%",
                border: "1px dashed rgba(79,142,247,0.3)",
                position: "absolute",
                animation: "spin 20s linear infinite",
              }} />
              <div style={{
                width: 160, height: 160, borderRadius: "50%",
                border: "2px solid rgba(0,201,167,0.4)",
                position: "absolute",
                animation: "spin 10s linear infinite reverse",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  width: 90, height: 90, borderRadius: "50%",
                  background: "linear-gradient(135deg, #00C9A7, #4F8EF7)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 40px rgba(0,201,167,0.5)",
                  fontSize: 36,
                }}>🇹🇩</div>
              </div>
              {/* Orbiting dots */}
              {["💻", "📡", "🔒", "📊"].map((em, i) => {
                const angle = (i / 4) * 2 * Math.PI + tick * 0.01;
                const r = 150;
                return (
                  <div key={i} style={{
                    position: "absolute",
                    left: `calc(50% + ${Math.cos(angle) * r}px - 18px)`,
                    top: `calc(50% + ${Math.sin(angle) * r}px - 18px)`,
                    width: 36, height: 36,
                    background: "rgba(0,0,0,0.6)",
                    border: "1px solid rgba(0,201,167,0.3)",
                    borderRadius: 8,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18,
                  }}>{em}</div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          marginTop: 80,
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
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
              <div style={{ fontSize: 24, marginBottom: 6 }}>{c.icon}</div>
              <div style={{ color: "#00C9A7", fontWeight: 900, fontSize: 26 }}>{c.val}</div>
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
      `}</style>
    </section>
  );
}

function ActualitesSection() {
  const [actualites, setActualites] = useState(ACTUALITES);
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    async function loadActualites() {
      const data = await fetchActualites();
      if (data && data.length > 0) {
        setActualites(data);
        setActive(0);
      }
    }
    loadActualites();
  }, []);

  return (
    <section id="actualites" ref={ref} style={{
      background: SITE_BG_COLOR, padding: "100px 2rem",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <AnimSection>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ color: SECONDARY_COLOR, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>📰 Dernières nouvelles</span>
            <h2 style={{ color: BG_COLOR, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 900, margin: "12px 0 16px" }}>Actualités</h2>
            <p style={{ color: MUTED_TEXT, maxWidth: 500, margin: "0 auto", fontSize: 16 }}>Restez informé des dernières avancées de la transformation numérique du Tchad.</p>
          </div>
        </AnimSection>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
          {/* Left: list */}
          <div style={{ background: PANEL_BG }}>
            {actualites.map((a, i) => (
              <AnimSection key={i} delay={i * 80}>
                <div
                  onClick={() => setActive(i)}
                  style={{
                    padding: "24px 28px",
                    cursor: "pointer",
                    borderLeft: `3px solid ${i === active ? a.color : "transparent"}`,
                    background: i === active ? `rgba(${a.color === "#00C9A7" ? "0,201,167" : a.color === "#4F8EF7" ? "79,142,247" : a.color === "#F7B731" ? "247,183,49" : "252,92,101"},0.08)` : "transparent",
                    transition: "all 0.25s",
                    borderBottom: "1px solid rgba(15,23,42,0.08)",
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 22, marginTop: 6 }}>{a.icon}</span>
                    {a.image && (
                      <img src={a.image} alt={a.title} loading="lazy" style={{ width: 84, height: 56, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                    )}
                    <div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: a.color, letterSpacing: 1, textTransform: "uppercase" }}>{a.category}</span>
                        <span style={{ color: "rgba(15,23,42,0.55)", fontSize: 11 }}>• {a.date}</span>
                      </div>
                      <p style={{ color: i === active ? BG_COLOR : MUTED_TEXT, fontSize: 14, fontWeight: i === active ? 600 : 400, lineHeight: 1.5, margin: 0 }}>{a.title}</p>
                    </div>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>

          {/* Right: detail */}
          <div style={{
            padding: "40px",
            background: `linear-gradient(135deg, rgba(${actualites[active].color === "#00C9A7" ? "0,201,167" : actualites[active].color === "#4F8EF7" ? "79,142,247" : actualites[active].color === "#F7B731" ? "247,183,49" : "252,92,101"},0.08) 0%, #f8fafc 100%)`,
            transition: "all 0.4s",
            display: "flex", flexDirection: "column", justifyContent: "center",
            border: "1px solid rgba(15,23,42,0.08)",
            borderRadius: 20,
          }}>
            {/* Image preview for the selected news */}
            {actualites[active].image && (
              <img src={actualites[active].image} alt={actualites[active].title} style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 12, marginBottom: 18 }} />
            )}
            <div style={{ fontSize: 48, marginBottom: 20 }}>{actualites[active].icon}</div>
            <span style={{ fontSize: 11, color: actualites[active].color, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12, display: "block" }}>
              {actualites[active].category} — {actualites[active].date}
            </span>
            <h3 style={{ color: BG_COLOR, fontSize: 22, fontWeight: 800, lineHeight: 1.4, marginBottom: 16 }}>{actualites[active].title}</h3>
            <p style={{ color: MUTED_TEXT, fontSize: 15, lineHeight: 1.7 }}>{actualites[active].excerpt}</p>
            <a href="#contact" style={{
              marginTop: 28, display: "inline-flex", alignItems: "center", gap: 8,
              color: ACTUALITES[active].color, textDecoration: "none",
              fontSize: 14, fontWeight: 700,
              transition: "gap 0.2s",
            }}>Lire la suite <span>→</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionsSection() {
  return (
    <section id="missions" style={{ background: SITE_BG_COLOR, padding: "100px 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <AnimSection>
          <div style={{ textAlign: "center", marginBottom: 70 }}>
            <span style={{ color: SECONDARY_COLOR, fontSize: 12, fontWeight: 700, letterSpacing: 3 }}>🚀 Nos engagements</span>
            <h2 style={{ color: BG_COLOR, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 900, margin: "12px 0 16px" }}>Solutions en télécommunication</h2>
            <p style={{ color: MUTED_TEXT, maxWidth: 540, margin: "0 auto", fontSize: 16 }}>Des missions sur mesure pour renforcer l'infrastructure numérique tchadienne et valoriser la présence digitale de l'État.</p>
          </div>
        </AnimSection>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
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
                <div style={{ fontSize: 36, marginBottom: 20 }}>{m.icon}</div>
                <h3 style={{ color: BG_COLOR, fontSize: 18, fontWeight: 800, marginBottom: 12 }}>{m.title}</h3>
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
            display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center",
          }}>
            <div>
              <h3 style={{ color: BG_COLOR, fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Réalisation en Fibre Optique</h3>
              <p style={{ color: MUTED_TEXT, lineHeight: 1.7, margin: 0, maxWidth: 600 }}>
                L'ADETIC a installé des infrastructures en fibre optique connectant plusieurs ministères et institutions publiques. Le projet est réalisé à près de <strong style={{ color: "#00C9A7" }}>80 %</strong>, et très bientôt, tout le Tchad sera connecté, marquant un pas vers une administration moderne et performante.
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
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
    <section id="direction" style={{ background: SITE_BG_COLOR, padding: "100px 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <AnimSection>
          <div style={{ textAlign: "center", marginBottom: 70 }}>
            <span style={{ color: "#F7B731", fontSize: 12, fontWeight: 700, letterSpacing: 3 }}>👤 Leadership</span>
            <h2 style={{ color: BG_COLOR, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 900, margin: "12px 0 16px" }}>Direction Générale</h2>
          </div>
        </AnimSection>

        <AnimSection delay={100}>
          <div style={{
            background: "linear-gradient(135deg, rgba(247,183,49,0.08), rgba(0,0,0,0))",
            border: "1px solid rgba(247,183,49,0.2)",
            borderRadius: 24, padding: "50px",
            display: "grid", gridTemplateColumns: "auto 1fr", gap: 50, alignItems: "center",
          }}>
            <div style={{
              width: 140, height: 140, borderRadius: "50%",
              overflow: "hidden", flexShrink: 0,
              boxShadow: "0 8px 40px rgba(15,23,42,0.08)",
              border: "1px solid rgba(15,23,42,0.06)",
              background: "#fff",
            }}>
              <img src={dgAdoum} alt="Directeur Général - M. Adoum" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
                <span style={{ background: "rgba(247,183,49,0.15)", color: "#F7B731", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100, letterSpacing: 1 }}>DIRECTEUR GÉNÉRAL</span>
              </div>
              <h3 style={{ color: BG_COLOR, fontSize: 26, fontWeight: 900, marginBottom: 8 }}>M. ADOUM</h3>
              <p style={{ color: "#F7B731", fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Directeur Général de l'ADETIC</p>
              <p style={{ color: MUTED_TEXT, fontSize: 15, lineHeight: 1.8 }}>
                Nommé par décret N°0196/PT/PM/MTEN/2024 du 06 mars 2024, le Directeur Général pilote la stratégie nationale de développement des TIC au Tchad. Sous sa direction, l'ADETIC accélère la transformation numérique de l'État tchadien, du déploiement de la fibre optique à la mise en place du datacenter national.
              </p>
              <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                <div style={{ background: PANEL_BG, border: "1px solid rgba(15,23,42,0.08)", borderRadius: 10, padding: "12px 20px", textAlign: "center" }}>
                  <div style={{ color: "#F7B731", fontWeight: 900, fontSize: 18 }}>2024</div>
                  <div style={{ color: "rgba(15,23,42,0.6)", fontSize: 11, marginTop: 2 }}>Nomination</div>
                </div>
              </div>
            </div>
          </div>
        </AnimSection>

        {/* IGF Event */}
        <AnimSection delay={200}>
          <div style={{
            marginTop: 30,
            background: PANEL_BG, border: "1px solid rgba(15,23,42,0.08)",
            borderRadius: 20, padding: "36px",
            display: "grid", gridTemplateColumns: "1fr auto", gap: 30, alignItems: "center",
          }}>
            <div>
              <span style={{ color: "#4F8EF7", fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>ÉVÉNEMENT · IGF 2025</span>
              <h3 style={{ color: BG_COLOR, fontSize: 20, fontWeight: 800, margin: "10px 0 12px" }}>IGF 2025 : Une délégation tchadienne unie autour des priorités nationales</h3>
              <p style={{ color: MUTED_TEXT, fontSize: 14, lineHeight: 1.7 }}>
                En marge des travaux du Forum sur la Gouvernance de l'Internet en Norvège, le Ministre Dr Boukar Michel a présidé une réunion de coordination stratégique avec les entités sous tutelle et la société civile tchadienne.
              </p>
            </div>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 48 }}>🇳🇴</div>
              <div style={{ color: "rgba(15,23,42,0.6)", fontSize: 12, marginTop: 8 }}>Norvège · 2025</div>
            </div>
          </div>
        </AnimSection>
      </div>
    </section>
  );
}

function ActivitesSection() {
  const items = [
    { icon: "📡", title: "IXP National", desc: "Point d'Échange Internet permettant aux acteurs locaux d'échanger directement leur trafic pour une meilleure qualité et souveraineté.", color: "#00C9A7" },
    { icon: "🏢", title: "Télécentres Provinciaux", desc: "Déploiement de télécentres dans les villes de Mongo, Abéché, Bongor, Doba, Biltine et Amdjarass pour réduire la fracture numérique.", color: "#4F8EF7" },
    { icon: "🗄️", title: "Datacenter National", desc: "Construction et certification du datacenter national en cours, garantissant la souveraineté et la sécurité des données de l'État tchadien.", color: "#F7B731" },
    { icon: "🌐", title: "Gestion Domaine .td", desc: "Politique et procédures d'enregistrement des noms de domaine .td, attribution d'agréments de registrars et administration des serveurs racine.", color: "#A55EEA" },
    { icon: "🛠️", title: "Développement des plateformes", desc: "Conception, développement et déploiement de plateformes numériques publiques (portails, services en ligne, APIs) pour faciliter l'accès aux services de l'État.", color: "#FC5C65" },
    { icon: "🏛️", title: "Digitalisation de l'administration", desc: "Accompagnement à la digitalisation des processus administratifs, sécurisation des flux et formation pour une administration électronique efficace.", color: "#20BF6B" },
  ];

  return (
    <section id="activites" style={{ background: SITE_BG_COLOR, padding: "100px 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <AnimSection>
          <div style={{ textAlign: "center", marginBottom: 70 }}>
            <span style={{ color: "#A55EEA", fontSize: 12, fontWeight: 700, letterSpacing: 3 }}>⚙️ Ce que nous faisons</span>
            <h2 style={{ color: BG_COLOR, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 900, margin: "12px 0 16px" }}>Activités & Travaux</h2>
            <p style={{ color: MUTED_TEXT, maxWidth: 500, margin: "0 auto", fontSize: 16 }}>L'ADETIC, institution publique, est à la hauteur des enjeux numériques et des défis des TIC au Tchad.</p>
          </div>
        </AnimSection>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
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
                <div style={{
                  width: 50, height: 50, borderRadius: 12,
                  background: `${item.color}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, marginBottom: 16,
                }}>{item.icon}</div>
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

  const handleSubmit = async () => {
    if (!form.nom || !form.email || !form.message) return;
    setSaving(true);
    const { error } = await addContactMessage(form);
    setSaving(false);
    if (!error) setSent(true);
  };

  return (
    <section id="contact" style={{ background: SITE_BG_COLOR, padding: "100px 2rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <AnimSection>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ color: SECONDARY_COLOR, fontSize: 12, fontWeight: 700, letterSpacing: 3 }}>📬 Nous contacter</span>
            <h2 style={{ color: BG_COLOR, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 900, margin: "12px 0 16px" }}>Concrétisez votre transformation numérique</h2>
            <p style={{ color: MUTED_TEXT, fontSize: 16 }}>Les équipes de l'ADETIC sont à votre écoute pour toute demande de renseignement.</p>
          </div>
        </AnimSection>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
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
                  <span style={{ fontSize: 22 }}>{c.icon}</span>
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
                background: "rgba(0,201,167,0.08)", border: "1px solid rgba(0,201,167,0.3)",
                borderRadius: 20, padding: "40px", textAlign: "center",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                minHeight: 320,
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ color: "#00C9A7", fontSize: 20, fontWeight: 800 }}>Message envoyé !</h3>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 8 }}>Nous vous répondrons dans les plus brefs délais.</p>
              </div>
            ) : (
              <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20, padding: "32px",
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {["nom", "email"].map(field => (
                    <div key={field}>
                      <label style={{ color: MUTED_TEXT, fontSize: 12, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>
                        {field === "nom" ? "Votre nom" : "Adresse e-mail"}
                      </label>
                      <input
                        type={field === "email" ? "email" : "text"}
                        value={form[field]}
                        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                        style={{
                          width: "100%", background: "rgba(15,23,42,0.05)",
                          border: "1px solid rgba(15,23,42,0.1)",
                          borderRadius: 10, padding: "12px 14px",
                          color: BG_COLOR, fontSize: 14,
                          outline: "none", boxSizing: "border-box",
                          transition: "border-color 0.2s",
                        }}
                        onFocus={e => e.target.style.borderColor = "rgba(0,201,167,0.5)"}
                        onBlur={e => e.target.style.borderColor = "rgba(15,23,42,0.1)"}
                        placeholder={field === "nom" ? "Nom Prénom" : "email@exemple.com"}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ color: MUTED_TEXT, fontSize: 12, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>Message</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      rows={4}
                      style={{
                        width: "100%", background: "rgba(15,23,42,0.05)",
                        border: "1px solid rgba(15,23,42,0.1)",
                        borderRadius: 10, padding: "12px 14px",
                        color: BG_COLOR, fontSize: 14,
                        outline: "none", resize: "vertical", boxSizing: "border-box",
                        fontFamily: "inherit",
                      }}
                      onFocus={e => e.target.style.borderColor = "rgba(0,201,167,0.5)"}
                      onBlur={e => e.target.style.borderColor = "rgba(15,23,42,0.1)"}
                      placeholder="Décrivez votre besoin..."
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    style={{
                      background: SECONDARY_COLOR,
                      color: PRIMARY_COLOR, border: "none", borderRadius: 10,
                      padding: "14px", fontWeight: 800, fontSize: 15,
                      cursor: saving ? "not-allowed" : "pointer", transition: "all 0.3s",
                      boxShadow: "0 8px 30px rgba(0,201,167,0.25)",
                      opacity: saving ? 0.7 : 1,
                    }}
                    onMouseEnter={e => { if (!saving) { e.target.style.transform = "translateY(-2px)"; e.target.style.background = `linear-gradient(135deg, ${SECONDARY_COLOR}, ${SECONDARY_COLOR_ALT})`; e.target.style.color = PRIMARY_COLOR; e.target.style.boxShadow = "0 12px 40px rgba(0,201,167,0.35)"; } }}
                    onMouseLeave={e => { if (!saving) { e.target.style.transform = ""; e.target.style.background = SECONDARY_COLOR; e.target.style.color = PRIMARY_COLOR; e.target.style.boxShadow = "0 8px 30px rgba(0,201,167,0.25)"; } }}
                  >{saving ? "Envoi en cours..." : "Envoyer le message →"}</button>
                </div>
              </div>
            )}
          </AnimSection>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      background: SITE_BG_COLOR,
      borderTop: "1px solid rgba(15,23,42,0.08)",
      padding: "50px 2rem 30px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 50 }}>
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
        <div style={{ borderTop: "1px solid rgba(15,23,42,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "rgba(15,23,42,0.6)", fontSize: 12 }}>© 2026 ADETIC — Tous droits réservés</span>
          <span style={{ color: "rgba(15,23,42,0.6)", fontSize: 12 }}>Établissement public administratif · Loi n° 012/PR/2014</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", background: SITE_BG_COLOR, minHeight: "100vh" }}>
      <Navbar scrolled={scrolled} />
      <HeroSection />
      <ActualitesSection />
      <MissionsSection />
      <ActivitesSection />
      <DirectionSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
