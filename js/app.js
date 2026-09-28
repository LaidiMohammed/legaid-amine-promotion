/* Legaid Amine — Frontend renderer */
(function () {
  const $ = (s) => document.querySelector(s);
  let DATA = window.LEGAID.load();
  let lang = window.LEGAID.getLang();
  let filter = "all";

  const T = {
    fr: { home: "Accueil", proj: "Projets", about: "À propos", contact: "Contact",
      all: "Tous", encours: "En cours", livre: "Livrés",
      details: "Détails + galerie", whatsapp: "WhatsApp", maps: "Maps",
      encoursLbl: "En cours", livreLbl: "Livré",
      tl1: "On visite le terrain ensemble, plans en main.",
      tl2: "Vidéos chantier chaque étape, groupe WhatsApp dédié.",
      tl3: "Acte, garanties, et SAV même après emménagement.",
      projSub: "Chaque projet avec photos réelles, plans lisibles et localisation Maps. Cliquez pour la galerie complète.",
      contactSub: "Appel, WhatsApp ou visite au bureau. Réponse le jour même, plans PDF sur demande." },
    ar: { home: "الرئيسية", proj: "مشاريعنا", about: "من نحن", contact: "اتصل بنا",
      all: "الكل", encours: "قيد الإنجاز", livre: "مسلّمة",
      details: "التفاصيل + الصور", whatsapp: "واتساب", maps: "الخريطة",
      encoursLbl: "قيد الإنجاز", livreLbl: "مسلّم",
      tl1: "نزور الأرض معًا والمخططات في اليد.",
      tl2: "فيديوهات لكل مرحلة ومجموعة واتساب خاصة.",
      tl3: "عقد وضمانات وخدمة حتى بعد السكن.",
      projSub: "كل مشروع بصور حقيقية ومخططات واضحة وموقع على الخريطة. اضغط للمعرض الكامل.",
      contactSub: "اتصال أو واتساب أو زيارة للمكتب. رد في نفس اليوم ومخططات PDF عند الطلب." }
  };
  const t = (k) => T[lang][k] || k;
  const pick = (fr, ar) => (lang === "ar" ? ar || fr : fr || ar);

  function applyColors() {
    const r = document.documentElement.style;
    r.setProperty("--bg", DATA.colors.bg);
    r.setProperty("--sand", DATA.colors.sand);
    r.setProperty("--gold", DATA.colors.gold);
    r.setProperty("--terra", DATA.colors.terra);
    r.setProperty("--ink", DATA.colors.ink);
  }

  function render() {
    DATA = window.LEGAID.load();
    lang = window.LEGAID.getLang();
    document.getElementById("htmlRoot").lang = lang;
    document.getElementById("htmlRoot").dir = lang === "ar" ? "rtl" : "ltr";
    applyColors();

    // brand
    $("#monogram").textContent = DATA.site.monogram || "LA";
    $("#brandName").textContent = pick(DATA.site.name_fr, DATA.site.name_ar);
    $("#brandBase").textContent = pick(DATA.site.baseline_fr, DATA.site.baseline_ar);
    $("#footName").textContent = pick(DATA.site.name_fr, DATA.site.name_ar);
    $("#footBase").textContent = pick(DATA.site.baseline_fr, DATA.site.baseline_ar);
    $("#year").textContent = new Date().getFullYear();
    $("#langBtn").textContent = lang === "fr" ? "عربية" : "Français";

    // nav labels
    document.querySelectorAll('[data-nav]').forEach(a => {
      const k = a.dataset.nav;
      const map = { accueil: t("home"), projets: t("proj"), apropos: t("about"), contact: t("contact") };
      if (a.tagName === "A" && a.closest("#deskNav")) a.textContent = map[k];
    });
    document.querySelectorAll('#bottomNav [data-lbl]').forEach(s => {
      const m = { home: t("home"), proj: t("proj"), about: t("about"), contact: t("contact") };
      s.textContent = m[s.dataset.lbl];
    });

    // hero
    const v = $("#heroVideo");
    v.poster = DATA.hero.poster;
    if (!v.querySelector("source")) {
      const s = document.createElement("source");
      s.src = DATA.hero.video; s.type = "video/mp4"; v.appendChild(s);
    } else v.querySelector("source").src = DATA.hero.video;
    v.load();
    $("#heroKicker").textContent = pick(DATA.hero.kicker_fr, DATA.hero.kicker_ar);
    const title = pick(DATA.hero.title_fr, DATA.hero.title_ar);
    // italicize last 3 words for style
    const words = title.split(" ");
    $("#heroTitle").innerHTML = words.length > 3
      ? words.slice(0, -3).join(" ") + " <em>" + words.slice(-3).join(" ") + "</em>"
      : title;
    $("#heroSub").textContent = pick(DATA.hero.sub_fr, DATA.hero.sub_ar);
    $("#ctaProjects").textContent = pick(DATA.hero.cta_projects_fr, DATA.hero.cta_projects_ar) + " →";
    const wa = `https://wa.me/${DATA.contact.whatsapp}?text=${encodeURIComponent(lang === "ar" ? "سلام، مهتم بمشاريعكم" : "Bonjour, je suis intéressé par vos projets")}`;
    $("#ctaWhatsapp").textContent = "💬 " + pick(DATA.hero.cta_contact_fr, DATA.hero.cta_contact_ar);
    $("#ctaWhatsapp").href = wa;
    $("#navWhatsapp").href = wa;
    $("#ssTiktok").href = DATA.socials.tiktok; $("#ssInsta").href = DATA.socials.instagram; $("#ssFb").href = DATA.socials.facebook;

    // stats
    $("#heroStats").innerHTML = DATA.stats.map(s =>
      `<span>✦ <b>${s.value}</b> ${pick(s.label_fr, s.label_ar)}</span>`).join("");

    // marquee
    const mtxt = pick(DATA.marquee.fr, DATA.marquee.ar);
    $("#marqueeTxt").textContent = (mtxt + " ").repeat(6);

    // projects head
    $("#projTitle").textContent = lang === "ar" ? "عناوين، لا وعود." : "Des adresses, pas des promesses.";
    $("#projSub").textContent = t("projSub");
    document.querySelectorAll("#filters button").forEach(b => {
      b.textContent = t(b.dataset.f);
      b.classList.toggle("on", b.dataset.f === filter);
    });

    renderProjects();
    renderAbout();
    renderContact(wa);
    observe();
  }

  function renderProjects() {
    const list = $("#projectsList");
    const items = DATA.projects.filter(p => filter === "all" || p.status === filter);
    list.innerHTML = items.map((p, i) => {
      const st = p.status === "livre" ? t("livreLbl") : t("encoursLbl");
      return `<article class="proj reveal">
        <div class="pmedia">
          <span class="pnum">0${i + 1}</span>
          <div class="arch"><img src="${p.images[0]}" alt="${pick(p.title_fr, p.title_ar)}" loading="lazy"></div>
          <span class="pill ${p.status}">${st}</span>
        </div>
        <div class="pbody">
          <span class="eyebrow">${pick(p.location_fr, p.location_ar)}</span>
          <h3 class="serif">${pick(p.title_fr, p.title_ar)}</h3>
          <div class="ptags"><span>${pick(p.type_fr, p.type_ar)}</span><span>${p.surface}</span><span>${p.price}</span></div>
          <p class="pdesc">${pick(p.desc_fr, p.desc_ar)}</p>
          <div class="thumbs">${p.images.slice(0, 3).map(im => `<img src="${im}" loading="lazy">`).join("")}</div>
          <div class="prow">
            <button class="btn dark" onclick="openProject('${p.id}')">◉ ${t("details")}</button>
            <a class="btn line" href="${p.mapsUrl}" target="_blank">📍 ${t("maps")}</a>
          </div>
        </div>
      </article>`;
    }).join("") || `<p style="opacity:.6">—</p>`;
  }

  function renderAbout() {
    $("#aboutTitle").textContent = pick(DATA.about.title_fr, DATA.about.title_ar);
    $("#aboutText").textContent = pick(DATA.about.text_fr, DATA.about.text_ar);
    $("#aboutImg").src = DATA.about.image;
    $("#aboutYears").textContent = DATA.about.years;
    $("#aboutYearsLbl").textContent = pick(DATA.about.years_label_fr, DATA.about.years_label_ar);
    const vals = lang === "ar" ? DATA.about.values_ar : DATA.about.values_fr;
    $("#aboutValues").innerHTML = (vals || []).map(v => `<div>✓ ${v}</div>`).join("");
    $("#tl1").textContent = t("tl1"); $("#tl2").textContent = t("tl2"); $("#tl3").textContent = t("tl3");
  }

  function renderContact(wa) {
    $("#contactTitle").textContent = lang === "ar" ? "لنتحدث عن بيتكم القادم." : "Parlons de votre futur chez-vous.";
    $("#contactSub").textContent = t("contactSub");
    $("#contactInfos").innerHTML = `
      <a href="tel:${DATA.contact.phone.replace(/\s/g, "")}"><span class="icon">📞</span><span><b>${DATA.contact.phone}</b><br><small>${pick(DATA.contact.hours_fr, DATA.contact.hours_ar)}</small></span></a>
      <a href="${wa}" target="_blank"><span class="icon">💬</span><span><b>WhatsApp direct</b><br><small>${DATA.contact.email}</small></span></a>
      <div class="item"><span class="icon">📍</span><span><b>${pick(DATA.contact.address_fr, DATA.contact.address_ar)}</b><br><small>Maps ↓</small></span></div>`;
    $("#socialBtns").innerHTML = `
      <a class="btn dark" href="${DATA.socials.tiktok}" target="_blank">TikTok ↗</a>
      <a class="btn dark" href="${DATA.socials.instagram}" target="_blank">Instagram ↗</a>
      <a class="btn line" href="${DATA.socials.facebook}" target="_blank">Facebook ↗</a>`;
    $("#mapFrame").src = DATA.contact.mapEmbed;
    $("#mapsLink").href = DATA.contact.mapsLink;
    $("#waLink2").href = wa;
  }

  // modal
  window.openProject = function (id) {
    const p = DATA.projects.find(x => x.id === id);
    if (!p) return;
    const st = p.status === "livre" ? t("livreLbl") : t("encoursLbl");
    $("#modalBody").innerHTML = `
      <div><div class="gal-main"><img id="galMain" src="${p.images[0]}"></div>
        <div class="gal-row">${p.images.map((im, i) => `<img src="${im}" class="${i === 0 ? "on" : ""}" onclick="document.getElementById('galMain').src='${im}';document.querySelectorAll('.gal-row img').forEach(x=>x.classList.remove('on'));this.classList.add('on')">`).join("")}</div></div>
      <div><span class="eyebrow">${pick(p.location_fr, p.location_ar)} • ${st}</span>
        <h2 style="margin:.4rem 0">${pick(p.title_fr, p.title_ar)}</h2>
        <div class="ptags"><span>${pick(p.type_fr, p.type_ar)}</span><span>${p.surface}</span></div>
        <p style="line-height:1.7;opacity:.85">${pick(p.desc_fr, p.desc_ar)}</p>
        <p><b>${p.price}</b></p>
        <div class="prow">
          <a class="btn gold" style="background:var(--gold)" target="_blank" href="https://wa.me/${DATA.contact.whatsapp}?text=${encodeURIComponent((lang === "ar" ? "مهتم بـ: " : "Intéressé par : ") + pick(p.title_fr, p.title_ar))}">💬 WhatsApp</a>
          <a class="btn line" target="_blank" href="${p.mapsUrl}">📍 Maps</a>
        </div></div>`;
    $("#modal").classList.add("open");
  };
  $("#modalX").onclick = () => $("#modal").classList.remove("open");
  $("#modalBg").onclick = () => $("#modal").classList.remove("open");

  // filters
  document.querySelectorAll("#filters button").forEach(b =>
    b.onclick = () => { filter = b.dataset.f; render(); });

  // lang
  $("#langBtn").onclick = () => {
    window.LEGAID.setLang(lang === "fr" ? "ar" : "fr");
    render();
  };

  // scrollspy
  const secs = ["accueil", "projets", "apropos", "contact"];
  window.addEventListener("scroll", () => {
    let cur = "accueil";
    secs.forEach(id => { const el = document.getElementById(id); if (el && window.scrollY > el.offsetTop - 200) cur = id; });
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle("active", a.dataset.nav === cur));
  }, { passive: true });

  function observe() {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add("in")), { threshold: .12 });
    document.querySelectorAll(".reveal:not(.in)").forEach(el => io.observe(el));
  }

  window.addEventListener("storage", render);
  render();
})();
