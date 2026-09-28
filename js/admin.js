/* Admin pro — full control */
(function () {
  const $ = (s) => document.querySelector(s);
  let DATA = window.LEGAID.load();
  let tab = "general";
  let editingProject = null;

  const TABS = [
    ["general", "Général"], ["hero", "Accueil + Vidéo"], ["projects", "Projets"],
    ["about", "À propos"], ["contact", "Contact"], ["map", "Carte & Réseaux"],
    ["design", "Design"], ["security", "Sécurité"]
  ];

  function toast(m) {
    const t = $("#toast"); t.textContent = m; t.style.display = "block";
    setTimeout(() => t.style.display = "none", 2200);
  }
  function save(silent) {
    window.LEGAID.save(DATA);
    $("#sName").textContent = DATA.site.name_fr;
    if (!silent) toast("✅ Enregistré — visible sur le site");
  }
  const F = (label, key, obj, type = "text", ph = "") =>
    `<div class="field"><label>${label}</label>${type === "textarea"
      ? `<textarea data-k="${key}" data-o="${obj}">${DATA[obj][key] || ""}</textarea>`
      : `<input type="${type}" data-k="${key}" data-o="${obj}" value="${(DATA[obj][key] || "").replace(/"/g, "&quot;")}" placeholder="${ph}">`}</div>`;

  function renderTabs() {
    $("#tabs").innerHTML = TABS.map(([k, l]) =>
      `<button class="${k === tab ? "on" : ""}" data-tab="${k}">${l}</button>`).join("");
    document.querySelectorAll("#tabs button").forEach(b => b.onclick = () => { tab = b.dataset.tab; renderForm(); renderTabs(); });
  }

  function renderForm() {
    const B = $("#formBody");
    if (tab === "general") B.innerHTML = `
      <div class="grid2">${F("Nom (FR)", "name_fr", "site")}${F("Nom (AR)", "name_ar", "site")}
      ${F("Baseline (FR)", "baseline_fr", "site")}${F("Baseline (AR)", "baseline_ar", "site")}</div>
      ${F("Monogramme (2 lettres)", "monogram", "site")}
      <div class="field"><label>Texte défilant (FR)</label><textarea data-k="fr" data-o="marquee">${DATA.marquee.fr}</textarea></div>
      <div class="field"><label>Texte défilant (AR)</label><textarea data-k="ar" data-o="marquee">${DATA.marquee.ar}</textarea></div>
      <h3>Stats accueil (4)</h3>
      ${DATA.stats.map((s, i) => `<div class="grid2" style="border:1px solid rgba(239,230,211,.15);padding:.8rem;border-radius:14px">
        <div class="field"><label>Valeur ${i + 1}</label><input data-stat="${i}" data-sk="value" value="${s.value}"></div>
        <div class="field"><label>Label FR / AR</label><input data-stat="${i}" data-sk="label_fr" value="${s.label_fr}" style="margin-bottom:.4rem"><input data-stat="${i}" data-sk="label_ar" value="${s.label_ar}"></div>
      </div>`).join("")}`;

    if (tab === "hero") B.innerHTML = `
      ${F("Vidéo fond accueil (URL mp4)", "video", "hero")}<small class="hint">Ex: lien mp4 Pexels/Coverr ou votre fichier uploadé. Poster affiché si vidéo lente.</small>
      ${F("Image poster (URL)", "poster", "hero")}
      <div class="grid2">${F("Kicker FR", "kicker_fr", "hero")}${F("Kicker AR", "kicker_ar", "hero")}</div>
      <div class="grid2">${F("Titre FR", "title_fr", "hero", "textarea")}${F("Titre AR", "title_ar", "hero", "textarea")}</div>
      <div class="grid2">${F("Sous-titre FR", "sub_fr", "hero", "textarea")}${F("Sous-titre AR", "sub_ar", "hero", "textarea")}</div>
      <div class="grid2">${F("Bouton projets FR", "cta_projects_fr", "hero")}${F("Bouton projets AR", "cta_projects_ar", "hero")}</div>`;

    if (tab === "projects") {
      const list = DATA.projects.map(p => `
        <div class="prow-admin"><div style="display:flex;gap:.8rem;align-items:center">
          <img src="${p.images[0] || ""}"><div><b>${p.title_fr}</b><br><small>${p.location_fr} • ${p.status}</small></div></div>
          <div style="display:flex;gap:.4rem"><button class="btn-b" data-edit="${p.id}">✏</button>
          <button class="btn-danger" data-del="${p.id}">🗑</button></div></div>`).join("");
      let editor = `<button class="btn-a" id="newProj">+ Nouveau projet</button>`;
      if (editingProject) {
        const p = DATA.projects.find(x => x.id === editingProject);
        if (p) editor += `<div style="border:1px solid #c9a24b;border-radius:16px;padding:1rem;display:grid;gap:.8rem">
          <h3>Édition — ${p.title_fr}</h3>
          <div class="grid2">
            <div class="field"><label>Titre FR</label><input id="ep_title_fr" value="${p.title_fr}"></div>
            <div class="field"><label>Titre AR</label><input id="ep_title_ar" value="${p.title_ar}"></div>
            <div class="field"><label>Lieu FR</label><input id="ep_location_fr" value="${p.location_fr}"></div>
            <div class="field"><label>Lieu AR</label><input id="ep_location_ar" value="${p.location_ar}"></div>
            <div class="field"><label>Type FR</label><input id="ep_type_fr" value="${p.type_fr}"></div>
            <div class="field"><label>Type AR</label><input id="ep_type_ar" value="${p.type_ar}"></div>
            <div class="field"><label>Prix</label><input id="ep_price" value="${p.price}"></div>
            <div class="field"><label>Surface</label><input id="ep_surface" value="${p.surface}"></div>
          </div>
          <div class="field"><label>Statut</label><select id="ep_status"><option value="encours" ${p.status === "encours" ? "selected" : ""}>En cours</option><option value="livre" ${p.status === "livre" ? "selected" : ""}>Livré</option></select></div>
          <div class="grid2">
            <div class="field"><label>Description FR</label><textarea id="ep_desc_fr">${p.desc_fr}</textarea></div>
            <div class="field"><label>Description AR</label><textarea id="ep_desc_ar">${p.desc_ar}</textarea></div>
          </div>
          <div class="field"><label>Images (1 URL par ligne)</label><textarea id="ep_images" style="min-height:110px">${p.images.join("\n")}</textarea></div>
          <div class="field"><label>Lien Google Maps du projet</label><input id="ep_maps" value="${p.mapsUrl}"></div>
          <div class="abtns"><button class="btn-a" id="saveProj">💾 Sauver projet</button><button class="btn-b" id="closeProj">Fermer</button></div>
        </div>`;
      }
      B.innerHTML = list + `<div style="height:.6rem"></div>` + editor;
      B.querySelectorAll("[data-edit]").forEach(x => x.onclick = () => { editingProject = x.dataset.edit; renderForm(); });
      B.querySelectorAll("[data-del]").forEach(x => x.onclick = () => {
        if (!confirm("Supprimer ce projet ?")) return;
        DATA.projects = DATA.projects.filter(p => p.id !== x.dataset.del); save(true); renderForm(); toast("🗑 Projet supprimé");
      });
      const np = $("#newProj"); if (np) np.onclick = () => {
        const id = "p" + Date.now();
        DATA.projects.push({ id, title_fr: "Nouveau projet", title_ar: "مشروع جديد", location_fr: "Alger", location_ar: "الجزائر", status: "encours", type_fr: "F3 • F4", type_ar: "ش3 • ش4", price: "Prix sur demande", surface: "—", desc_fr: "", desc_ar: "", images: [DATA.hero.poster], mapsUrl: DATA.contact.mapsLink });
        editingProject = id; save(true); renderForm();
      };
      const sp = $("#saveProj");
      if (sp) sp.onclick = () => {
        const p = DATA.projects.find(x => x.id === editingProject);
        ["title_fr", "title_ar", "location_fr", "location_ar", "type_fr", "type_ar", "price", "surface", "desc_fr", "desc_ar"].forEach(k => p[k] = $("#ep_" + k).value);
        p.status = $("#ep_status").value; p.mapsUrl = $("#ep_maps").value;
        p.images = $("#ep_images").value.split("\n").map(s => s.trim()).filter(Boolean);
        save(); renderForm();
      };
      const cp = $("#closeProj"); if (cp) cp.onclick = () => { editingProject = null; renderForm(); };
    }

    if (tab === "about") B.innerHTML = `
      <div class="grid2">${F("Titre FR", "title_fr", "about", "textarea")}${F("Titre AR", "title_ar", "about", "textarea")}</div>
      <div class="grid2">${F("Texte FR", "text_fr", "about", "textarea")}${F("Texte AR", "text_ar", "about", "textarea")}</div>
      ${F("Photo (URL)", "image", "about")}
      <div class="grid2">${F("Années (chiffre)", "years", "about")}${F("Label années FR", "years_label_fr", "about")}</div>
      <div class="field"><label>Valeurs FR (1 par ligne)</label><textarea id="vals_fr">${DATA.about.values_fr.join("\n")}</textarea></div>
      <div class="field"><label>Valeurs AR (1 par ligne)</label><textarea id="vals_ar">${DATA.about.values_ar.join("\n")}</textarea></div>`;

    if (tab === "contact") B.innerHTML = `
      <div class="grid2">${F("Téléphone", "phone", "contact")}${F("WhatsApp (ex: 2135...)", "whatsapp", "contact")}
      ${F("Email", "email", "contact")}${F("Horaires FR", "hours_fr", "contact")}
      ${F("Horaires AR", "hours_ar", "contact")}${F("Adresse FR", "address_fr", "contact")}
      ${F("Adresse AR", "address_ar", "contact")}</div>`;

    if (tab === "map") B.innerHTML = `
      ${F("Lien Google Maps (bouton)", "mapsLink", "contact")}
      ${F("Embed OpenStreetMap (iframe src)", "mapEmbed", "contact")}
      <small class="hint">Pour changer le point : allez sur openstreetmap.org → Partager → HTML → copiez le lien src ici.</small>
      <div class="grid2">${F("Facebook", "facebook", "socials")}${F("Instagram", "instagram", "socials")}${F("TikTok", "tiktok", "socials")}</div>`;

    if (tab === "design") B.innerHTML = `
      <h3>Couleurs du site (aperçu live sur le site après save)</h3>
      <div class="colors">${["bg", "sand", "gold", "terra", "ink"].map(k =>
        `<label>${k}<input type="color" data-color="${k}" value="${DATA.colors[k]}"></label>`).join("")}</div>`;

    if (tab === "security") B.innerHTML = `
      ${F("Mot de passe admin", "password", "settings")}
      <div class="abtns"><button class="btn-danger" id="wipeBtn">Effacer toutes les données locales</button></div>`;

    bindInputs(B);
  }

  function bindInputs(root) {
    root.querySelectorAll("[data-k]").forEach(el => {
      el.oninput = () => { DATA[el.dataset.o][el.dataset.k] = el.value; };
    });
    root.querySelectorAll("[data-stat]").forEach(el => {
      el.oninput = () => { DATA.stats[+el.dataset.stat][el.dataset.sk] = el.value; };
    });
    root.querySelectorAll("[data-color]").forEach(el => {
      el.oninput = () => { DATA.colors[el.dataset.color] = el.value; };
    });
    const vf = $("#vals_fr"); if (vf) vf.oninput = () => DATA.about.values_fr = vf.value.split("\n").filter(Boolean);
    const va = $("#vals_ar"); if (va) va.oninput = () => DATA.about.values_ar = va.value.split("\n").filter(Boolean);
    const wb = $("#wipeBtn"); if (wb) wb.onclick = () => { if (confirm("Tout effacer ?")) { DATA = window.LEGAID.reset(); renderForm(); toast("Reset OK"); } };
  }

  // auth
  function check() {
    if (sessionStorage.getItem("legaid_admin") === "1") { $("#login").classList.add("hidden"); $("#panel").classList.remove("hidden"); }
  }
  $("#loginBtn").onclick = () => {
    if ($("#pwd").value === DATA.settings.password) {
      sessionStorage.setItem("legaid_admin", "1"); check(); toast("Bienvenue 👋");
    } else toast("❌ Mot de passe incorrect");
  };
  $("#logoutBtn").onclick = () => { sessionStorage.removeItem("legaid_admin"); location.reload(); };
  $("#saveBtn").onclick = () => save();
  $("#exportBtn").onclick = () => {
    const blob = new Blob([JSON.stringify(DATA, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "legaid-site.json"; a.click();
  };
  $("#importBtn").onclick = () => $("#importFile").click();
  $("#importFile").onchange = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { try { DATA = JSON.parse(r.result); save(); renderForm(); toast("✅ Importé"); } catch { toast("❌ Fichier invalide"); } };
    r.readAsText(f);
  };
  $("#resetBtn").onclick = () => { if (confirm("Revenir au contenu d'origine ?")) { DATA = window.LEGAID.reset(); renderForm(); toast("↺ Réinitialisé"); } };

  renderTabs(); renderForm(); check();
})();
