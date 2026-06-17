import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function seed() {
  try {
    // Actualités (news)
    const actualites = [
      {
        category: "Forum",
        date: "16–21 Fév 2026",
        title: "Participation stratégique du Tchad au Forum sur la Gouvernance de l'Internet de l'Afrique Centrale",
        excerpt: "Du 16 au 21 février 2026, le Tchad a pris une part active au Forum sur la Gouvernance de l'Internet, renforçant sa position comme acteur clé du numérique africain.",
        color: "#00C9A7",
        icon: "🌐",
        image_url: "images/igf-reunion.jpg",
      },
      {
        category: "Coopération",
        date: "Fév 2026",
        title: "Coopération numérique : des experts azerbaïdjanais en visite de travail à l'ADETIC",
        excerpt: "Dans le cadre du renforcement de la coopération internationale en matière de transformation digitale, une délégation d'experts azerbaïdjanais a effectué une visite officielle.",
        color: "#4F8EF7",
        icon: "🤝",
        image_url: "images/rencontre-dg-et-smart.jpg",
      },
      {
        category: "Data Center",
        date: "Fév 2026",
        title: "Audit et certification du Data Center national : l'ADETIC, l'ANSICE et TECHSO-GROUP en mission conjointe",
        excerpt: "Dans le cadre de la mise en œuvre de l'accord tripartite, l'ADETIC s'engage pour la certification du datacenter national tchadien.",
        color: "#F7B731",
        icon: "🖥️",
        image_url: "images/fond-humain-de-poignee-de-main-de-robot-ere-numerique-futuriste-2048x1365.jpg",
      },
      {
        category: "Intelligence Artificielle",
        date: "2025",
        title: "Formation de haut niveau sur l'Intelligence Artificielle",
        excerpt: "L'ADETIC, en collaboration avec l'UNESCO et l'ENASTIC, organise une formation d'excellence sur l'IA pour les cadres nationaux.",
        color: "#FC5C65",
        icon: "🤖",
        image_url: "images/pexels-photo-1054397-1.jpeg",
      },
    ];

    console.log('Seeding actualites...');
    let { data: newsData, error: newsError } = await supabase.from('actualites').insert(actualites);
    if (newsError) throw newsError;
    console.log(`Inserted ${newsData.length} actualites`);

    // Activites (from ActivitesSection)
    const activites = [
      { icon: "📡", title: "IXP National", description: "Point d'Échange Internet permettant aux acteurs locaux d'échanger directement leur trafic pour une meilleure qualité et souveraineté.", color: "#00C9A7" },
      { icon: "🏢", title: "Télécentres Provinciaux", description: "Déploiement de télécentres dans les villes de Mongo, Abéché, Bongor, Doba, Biltine et Amdjarass pour réduire la fracture numérique.", color: "#4F8EF7" },
      { icon: "🗄️", title: "Datacenter National", description: "Construction et certification du datacenter national en cours, garantissant la souveraineté et la sécurité des données de l'État tchadien.", color: "#F7B731" },
      { icon: "🌐", title: "Gestion Domaine .td", description: "Politique et procédures d'enregistrement des noms de domaine .td, attribution d'agréments de registrars et administration des serveurs racine.", color: "#A55EEA" },
      { icon: "🛠️", title: "Développement des plateformes", description: "Conception, développement et déploiement de plateformes numériques publiques (portails, services en ligne, APIs) pour faciliter l'accès aux services de l'État.", color: "#FC5C65" },
      { icon: "🏛️", title: "Digitalisation de l'administration", description: "Accompagnement à la digitalisation des processus administratifs, sécurisation des flux et formation pour une administration électronique efficace.", color: "#20BF6B" },
    ];

    console.log('Seeding activites...');
    let { data: actData, error: actError } = await supabase.from('activites').insert(activites);
    if (actError) throw actError;
    console.log(`Inserted ${actData.length} activites`);

    // Missions (we'll insert into activites table as well to keep schema simple)
    const missions = [
      { icon: "⚡", title: "Infrastructures Numériques", description: "Mise en place et maintenance d'infrastructures solides et sécurisées pour un accès fiable aux services numériques de l'État.", color: "#00C9A7" },
      { icon: "🔗", title: "Systèmes d'Information Publics", description: "Coordination des systèmes gouvernementaux pour leur interopérabilité, leur sécurité et une gestion efficace des données.", color: "#4F8EF7" },
      { icon: "🎓", title: "Formation & Accompagnement", description: "Montée en compétences digitales des administrations avec des formations adaptées pour une utilisation optimale des outils.", color: "#F7B731" },
      { icon: "🛡️", title: "Sécurité & Veille Technologique", description: "Veille technologique permanente et recommandations en matière de sécurité des réseaux et certification numérique.", color: "#A55EEA" },
    ];

    console.log('Seeding missions into activites...');
    let { data: missionsData, error: missionsError } = await supabase.from('activites').insert(missions);
    if (missionsError) throw missionsError;
    console.log(`Inserted ${missionsData.length} missions (as activites)`);

    // Chiffres
    const chiffres = [
      { val: "80%", label: "Réseau fibre complété", icon: "📡" },
      { val: "6+", label: "Télécentres provinciaux", icon: "🏢" },
      { val: "2014", label: "Année de création", icon: "📅" },
      { val: "IXP", label: "Internet Exchange Point", icon: "🌍" },
    ];

    console.log('Seeding chiffres...');
    let { data: chiffresData, error: chiffresError } = await supabase.from('chiffres').insert(chiffres);
    if (chiffresError) throw chiffresError;
    console.log(`Inserted ${chiffresData.length} chiffres`);

    // Direction (DG)
    const direction = [
      {
        name: "M. ADOUM",
        title: "Directeur Général de l'ADETIC",
        bio: "Nommé par décret N°0196/PT/PM/MTEN/2024 du 06 mars 2024, le Directeur Général pilote la stratégie nationale de développement des TIC au Tchad. Sous sa direction, l'ADETIC accélère la transformation numérique de l'État tchadien.",
        photo_url: "images/dg-adoum-djimet1.jpg",
      }
    ];

    console.log('Seeding direction...');
    let { data: dirData, error: dirError } = await supabase.from('direction').insert(direction);
    if (dirError) throw dirError;
    console.log(`Inserted ${dirData.length} direction entries`);

    console.log('Seeding complete.');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
