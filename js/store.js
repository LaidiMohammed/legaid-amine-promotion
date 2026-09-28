/* Legaid Amine — Central Store (shared front + admin) */
(function () {
  const KEY = "legaid_site_v1";
  const LANG_KEY = "legaid_lang";

  const DEFAULT = {
    site: {
      name_fr: "Legaid Amine",
      name_ar: "لقايد أمين",
      baseline_fr: "Promotion Immobilière",
      baseline_ar: "ترقية عقارية",
      monogram: "LA"
    },
    colors: {
      bg: "#0c1a15",
      sand: "#efe6d3",
      gold: "#c9a24b",
      terra: "#c96f4a",
      ink: "#101613"
    },
    hero: {
      video: "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4",
      poster: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1920&auto=format&fit=crop",
      kicker_fr: "Promotion immobilière — Alger",
      kicker_ar: "ترقية عقارية — الجزائر",
      title_fr: "On ne vend pas des murs, on livre des adresses.",
      title_ar: "لا نبيع الجدران، بل نسلّم عناوين.",
      sub_fr: "Résidences soignées, plans lisibles, chantier suivi en vidéo. Découvrez nos projets, visitez, puis décidez.",
      sub_ar: "إقامات متقنة، مخططات واضحة، ومتابعة الورش بالفيديو. اكتشف مشاريعنا، قم بالزيارة، ثم قرر.",
      cta_projects_fr: "Voir nos projets",
      cta_projects_ar: "شاهد مشاريعنا",
      cta_contact_fr: "Parler sur WhatsApp",
      cta_contact_ar: "تحدث عبر واتساب"
    },
    marquee: {
      fr: "Résidences • Plans • Chantier suivi • Livraison garantie • Alger •",
      ar: "إقامات • مخططات • متابعة الورش • تسليم مضمون • الجزائر •"
    },
    stats: [
      { value: "12+", label_fr: "Résidences livrées", label_ar: "إقامة مسلّمة" },
      { value: "340+", label_fr: "Logements remis", label_ar: "سكن مسلّم" },
      { value: "100%", label_fr: "Actes & garanties", label_ar: "عقود وضمانات" },
      { value: "24/7", label_fr: "Suivi chantier vidéo", label_ar: "متابعة بالفيديو" }
    ],
    projects: [
      {
        id: "yasmine",
        title_fr: "Résidence El Yasmine",
        title_ar: "إقامة الياسمين",
        location_fr: "Draria, Alger",
        location_ar: "درارية، الجزائر",
        status: "encours",
        type_fr: "F3 • F4 • Duplex",
        type_ar: "ش3 • ش4 • دوبلكس",
        price: "À partir de 14.5 MDA",
        surface: "78 — 142 m²",
        desc_fr: "Petite résidence de 3 blocs, parking sous-sol, ascenseur, façade ventilée. Plans en L très lumineux, cuisine équipée en option.",
        desc_ar: "إقامة صغيرة من 3 عمارات، مرآب تحت الأرض، مصعد، واجهة عصرية. مخططات مضيئة ومطبخ مجهز اختياري.",
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200&auto=format&fit=crop"
        ],
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Draria+Alger"
      },
      {
        id: "oliviers",
        title_fr: "Résidence Les Oliviers",
        title_ar: "إقامة الزيتون",
        location_fr: "Birkhadem, Alger",
        location_ar: "بير خادم، الجزائر",
        status: "livre",
        type_fr: "F2 • F3 • F4",
        type_ar: "ش2 • ش3 • ش4",
        price: "Livré — derniers lots",
        surface: "62 — 118 m²",
        desc_fr: "Projet livré en 2024. Cours plantée d'oliviers, gardiennage, bâche à eau + groupe. Idéal primo-accédants et investissement locatif.",
        desc_ar: "مشروع مسلّم سنة 2024. ساحة مغروسة بأشجار الزيتون، حراسة، خزان ماء ومولد. مثالي للسكن الأول والاستثمار.",
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop"
        ],
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Birkhadem+Alger"
      },
      {
        id: "baraka",
        title_fr: "Dar El Baraka — Villas",
        title_ar: "دار البركة — فيلات",
        location_fr: "Baba Hassen, Alger",
        location_ar: "بابا حسن، الجزائر",
        status: "encours",
        type_fr: "Villas 5P + jardin",
        type_ar: "فيلات 5 غرف + حديقة",
        price: "Sur plan — paiement échelonné",
        surface: "180 — 240 m²",
        desc_fr: "8 villas individuelles, jardin privatif, patio, double mur + isolation thermique. Gros œuvre terminé, second œuvre en cours — visites chantier chaque samedi.",
        desc_ar: "8 فيلات فردية، حديقة خاصة، فناء، عزل حراري مزدوج. الهيكل منتهي، التشطيبات جارية — زيارات الورش كل سبت.",
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200&auto=format&fit=crop"
        ],
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Baba+Hassen+Alger"
      }
    ],
    about: {
      title_fr: "Zaouche & Amine — bâtisseurs, pas vendeurs.",
      title_ar: "زاوش وأمين — بنّاؤون، لا بائعون.",
      text_fr: "Legaid Amine Promotion, c'est une équipe familiale d'Alger. On choisit peu de projets, on les suit nous-mêmes, on filme le chantier et on reste joignable après la remise des clés. Nos plans sont affichés, nos prix sont écrits, nos délais sont tenus.",
      text_ar: "لقايد أمين للترقية العقارية فريق عائلي من الجزائر. نختار مشاريع قليلة، نتابعها بأنفسنا، نوثق الورش بالفيديو ونبقى متاحين بعد تسليم المفاتيح. مخططات معلنة، أسعار مكتوبة، وآجال محترمة.",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop",
      years: "15",
      years_label_fr: "ans de chantier",
      years_label_ar: "سنة خبرة",
      values_fr: ["Plans affichés", "Paiement échelonné", "Suivi vidéo", "SAV après clés"],
      values_ar: ["مخططات معلنة", "دفع بالتقسيط", "متابعة بالفيديو", "خدمة بعد التسليم"]
    },
    contact: {
      phone: "+213 550 00 00 00",
      whatsapp: "213550000000",
      email: "contact@legaid-amine.dz",
      address_fr: "Rue principale, Draria — Alger",
      address_ar: "الشارع الرئيسي، درارية — الجزائر",
      hours_fr: "Sam – Jeu • 9h → 18h",
      hours_ar: "السبت – الخميس • 9 → 18",
      mapsLink: "https://www.google.com/maps/search/?api=1&query=Draria+Alger",
      mapEmbed: "https://www.openstreetmap.org/export/embed.html?bbox=2.85%2C36.68%2C3.15%2C36.82&layer=mapnik&marker=36.750%2C3.000"
    },
    socials: {
      facebook: "https://www.facebook.com/share/1Da7GwLqFg/",
      instagram: "https://www.instagram.com/legaid.amine.promotions",
      tiktok: "https://www.tiktok.com/@legaid_amine_immobilier"
    },
    settings: {
      password: "amine2026"
    }
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT));
      const parsed = JSON.parse(raw);
      // shallow-merge top keys to survive updates
      return Object.assign(JSON.parse(JSON.stringify(DEFAULT)), parsed);
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT));
    }
  }
  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }
  function reset() {
    localStorage.removeItem(KEY);
    return JSON.parse(JSON.stringify(DEFAULT));
  }
  function getLang() {
    return localStorage.getItem(LANG_KEY) || "fr";
  }
  function setLang(l) {
    localStorage.setItem(LANG_KEY, l);
  }

  window.LEGAID = { DEFAULT, load, save, reset, getLang, setLang, KEY };
})();
