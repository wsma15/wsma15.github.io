import { resumeData } from "../data/resume-data.js";

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const supportedLanguages = Object.keys(resumeData);
const resolveLanguage = () => {
  const stored = localStorage.getItem("proto-lang");
  if (stored && supportedLanguages.includes(stored)) return stored;
  const htmlLang = document.documentElement.lang;
  if (htmlLang && supportedLanguages.includes(htmlLang)) return htmlLang;
  return "ar";
};

let currentLang = resolveLanguage();
let activeData = resumeData[currentLang] || resumeData.ar || Object.values(resumeData)[0];
let heroRoles = [];
let labSteps = [];
let heroCycleId;
let contactSuccessTemplate = "";

const init = () => {
  if (!activeData) return;
  applyLanguageAttributes();
  renderBrand(activeData.hero);
  renderNav(activeData.copy?.nav);
  renderSectionCopy(activeData.copy?.sections);
  renderHero(activeData.hero);
  renderStats(activeData.stats);
  renderTimeline(activeData.experiences);
  renderSkills(activeData.skills);
  renderCaseStudies(activeData.caseStudies, activeData.copy?.sections?.work);
  renderLab(activeData.lab, activeData.copy?.labDetail);
  renderContact(activeData.contact);
  renderFooter(activeData.hero, activeData.copy?.footer);

  initThemeToggle();
  initLanguageToggle();
  initScrollProgress();
  initCounters();
  initSkillBars();
  initTiltCards();
  initCaseSlider();
  initActiveNav();
  initHeroWordCycler();
  initLabInteractions();
  initContactForm();
  initSmoothScroll();
};

const applyLanguageAttributes = () => {
  const isArabic = currentLang === "ar";
  document.documentElement.lang = isArabic ? "ar" : "en";
  document.documentElement.dir = isArabic ? "rtl" : "ltr";
  document.body.classList.toggle("lang-en", !isArabic);
  activeData = resumeData[currentLang] || resumeData.ar || Object.values(resumeData)[0];
  heroRoles = Array.isArray(activeData?.hero?.dynamicRoles) ? activeData.hero.dynamicRoles : [];
  labSteps = Array.isArray(activeData?.lab) ? activeData.lab : [];
};

const renderBrand = (hero = {}) => {
  const mark = $("[data-brand-mark]");
  if (mark) mark.textContent = hero.brandMark || hero.name?.[0] || "";

  const name = $("[data-brand-name]");
  if (name) name.textContent = hero.name || "";

  const tagline = $("[data-brand-tagline]");
  if (tagline) tagline.textContent = hero.brandTagline || hero.title || "";
};

const renderNav = (copy = {}) => {
  const navLinks = $$(".site-header__nav a[data-nav]");
  navLinks.forEach((link) => {
    const key = link.dataset.nav;
    if (copy[key]) link.textContent = copy[key];
  });

  const navCta = $("[data-nav-cta]");
  if (navCta) navCta.textContent = copy.cta || "";
};

const renderSectionCopy = (sections = {}) => {
  Object.entries(sections).forEach(([key, values]) => {
    const eyebrow = $(`[data-section-eyebrow="${key}"]`);
    const title = $(`[data-section-title="${key}"]`);
    const desc = $(`[data-section-desc="${key}"]`);
    if (eyebrow && values.eyebrow) eyebrow.textContent = values.eyebrow;
    if (title && values.title) title.textContent = values.title;
    if (desc && values.description) desc.textContent = values.description;
  });
};

const renderHero = (hero = {}) => {
  const heroName = $("[data-hero-name]");
  const heroTitle = $("[data-hero-title]");
  const heroBio = $("[data-hero-bio]");
  const heroLocation = $("[data-hero-location]");
  const heroAvailability = $("[data-hero-availability]");
  const heroDynamic = $("[data-hero-dynamic]");
  const heroChips = $("[data-hero-chips]");
  const heroClients = $("[data-hero-clients]");
  const heroClientsHeading = $("[data-hero-clients-heading]");
  const heroScore = $("[data-hero-score]");
  const heroScoreLabel = $("[data-hero-score-label]");
  const heroScoreCaption = $("[data-hero-score-caption]");
  const heroPhoto = $("[data-hero-photo]");
  const heroCv = $("[data-hero-cv]");
  const heroSecondary = $("[data-hero-secondary-cta]");

  if (heroName) heroName.textContent = hero.name || "";
  if (heroTitle) heroTitle.textContent = hero.title || "";
  if (heroBio) heroBio.textContent = hero.bio || "";

  const metaLocation = $(`[data-hero-meta="location"]`);
  const metaAvailability = $(`[data-hero-meta="availability"]`);
  if (metaLocation) metaLocation.textContent = hero.metaLabels?.location || "";
  if (metaAvailability) metaAvailability.textContent = hero.metaLabels?.availability || "";

  if (heroLocation) heroLocation.textContent = hero.location || "";
  if (heroAvailability) heroAvailability.textContent = hero.availability || "";
  if (heroDynamic) heroDynamic.textContent = hero.dynamicRoles?.[0] || "";
  heroRoles = Array.isArray(hero.dynamicRoles) ? hero.dynamicRoles : [];

  if (heroCv) {
    heroCv.href = hero.cvUrl || "#";
    heroCv.textContent = hero.ctas?.primary || "";
  }

  if (heroSecondary) {
    heroSecondary.textContent = hero.ctas?.secondary || "";
  }

  if (heroChips) {
    heroChips.innerHTML = (hero.chips || []).map((chip) => `<span class="chip">${chip}</span>`).join("");
  }

  if (heroClients) {
    heroClients.innerHTML = (hero.clients || []).map((client) => `<li>${client}</li>`).join("");
  }

  if (heroClientsHeading) heroClientsHeading.textContent = hero.clientsHeading || "";

  if (heroScore) {
    const suffix = hero.scoreSuffix ?? "%";
    heroScore.dataset.value = hero.score ?? 0;
    heroScore.dataset.suffix = suffix;
    heroScore.textContent = `${hero.score ?? 0}${suffix}`;
  }
  if (heroScoreLabel) heroScoreLabel.textContent = hero.scoreLabel || "";
  if (heroScoreCaption) heroScoreCaption.textContent = hero.scoreCaption || "";

  if (heroPhoto && hero.photo) {
    heroPhoto.src = hero.photo;
    heroPhoto.alt = hero.photoAlt || hero.name || "";
  }
};

const renderStats = (stats = []) => {
  const statsWrap = $("[data-stats]");
  if (!statsWrap) return;

  statsWrap.innerHTML = stats
    .map(
      (stat) => `
      <article class="stat-card">
        <span class="eyebrow">${stat.label ?? ""}</span>
        <strong data-countup data-value="${stat.value ?? 0}" data-suffix="${stat.suffix ?? ""}">
          0${stat.suffix ?? ""}
        </strong>
        <p>${stat.description ?? ""}</p>
      </article>
    `
    )
    .join("");
};

const renderTimeline = (experiences = []) => {
  const container = $("[data-experience]");
  if (!container) return;

  container.innerHTML = experiences
    .map(
      (exp) => `
      <article class="timeline-item tilt-card" data-tilt>
        <div class="timeline__meta">
          <span>${exp.period ?? ""}</span>
          <span>${exp.company ?? ""}</span>
        </div>
        <h3>${exp.title ?? ""}</h3>
        <p>${exp.description ?? ""}</p>
        <ul>
          ${(exp.highlights || []).map((item) => `<li>${item}</li>`).join("")}
        </ul>
        <div class="timeline__tags">
          ${(exp.stack || []).map((tag) => `<span class="chip">${tag}</span>`).join("")}
        </div>
      </article>
    `
    )
    .join("");
};

const renderSkills = (skills = {}) => {
  const wrap = $("[data-skills]");
  if (!wrap) return;

  const focusCard = `
    <article class="skill-card">
      <h3>${skills.focusTitle ?? "Focus"}</h3>
      <ul>${(skills.focus || []).map((item) => `<li>${item}</li>`).join("")}</ul>
    </article>
  `;

  const techCard = `
    <article class="skill-card tilt-card" data-tilt>
      <h3>${skills.technicalTitle ?? "Technical"}</h3>
      <div class="skill-bars">
        ${(skills.technical || [])
          .map(
            (skill) => `
              <div class="skill-bar">
                <div class="skill-bar__label">
                  <span>${skill.name}</span>
                  <span>${skill.level}%</span>
                </div>
                <div class="skill-bar__track">
                  <span class="skill-bar__value" data-skill-value="${skill.level}"></span>
                </div>
                <small>${skill.detail}</small>
              </div>
            `
          )
          .join("")}
      </div>
    </article>
  `;

  const mindsetCard = `
    <article class="skill-card">
      <h3>${skills.mindsetTitle ?? "Mindset"}</h3>
      <ul>${(skills.mindset || []).map((item) => `<li>${item}</li>`).join("")}</ul>
    </article>
  `;

  wrap.innerHTML = focusCard + techCard + mindsetCard;
};

const renderCaseStudies = (caseStudies = [], workCopy = {}) => {
  const track = $("[data-cases-track]");
  if (!track) return;
  track.innerHTML = caseStudies
    .map(
      (caseStudy) => `
        <article class="case-card tilt-card" data-tilt>
          <div class="case-card__head">
            <h3>${caseStudy.title ?? ""}</h3>
            <span class="meta-label">${caseStudy.period ?? ""}</span>
          </div>
          <p>${caseStudy.summary ?? ""}</p>
          <div class="case-card__tags">
            ${(caseStudy.tags || []).map((tag) => `<span class="chip">${tag}</span>`).join("")}
          </div>
          <div class="case-card__metrics">
            ${(caseStudy.metrics || [])
              .map(
                (metric) => `
                  <div>
                    <span class="meta-label">${metric.label}</span>
                    <strong>${metric.value}</strong>
                  </div>
                `
              )
              .join("")}
          </div>
        </article>
      `
    )
    .join("");

  updateCaseNavLabels(workCopy?.controls);
};

const updateCaseNavLabels = (controls = {}) => {
  const buttons = $$("[data-case-nav]");
  buttons.forEach((btn) => {
    const key = btn.dataset.caseNavLabel || btn.dataset.caseNav;
    if (controls?.[key]) {
      btn.setAttribute("aria-label", controls[key]);
    }
  });
};

const renderLab = (steps = [], labDetailCopy = {}) => {
  const cardsWrap = $("[data-lab-cards]");
  const detailEyebrow = $("[data-lab-detail-eyebrow]");
  if (detailEyebrow && labDetailCopy?.eyebrow) detailEyebrow.textContent = labDetailCopy.eyebrow;
  if (!cardsWrap) return;

  cardsWrap.innerHTML = steps
    .map(
      (step, index) => `
        <article class="lab-card ${index === 0 ? "is-active" : ""}" data-lab-card data-index="${index}">
          <h4>${step.title}</h4>
          <p>${step.description}</p>
        </article>
      `
    )
    .join("");

  labSteps = steps;
  updateLabDetail(0);
};

const updateLabDetail = (index = 0) => {
  const step = labSteps?.[index];
  const detailTitle = $("[data-lab-detail-title]");
  const detailDesc = $("[data-lab-detail-desc]");
  const actionsList = $("[data-lab-actions]");
  if (!step || !detailTitle || !detailDesc || !actionsList) return;
  detailTitle.textContent = step.title;
  detailDesc.textContent = step.description;
  actionsList.innerHTML = (step.actions || []).map((action) => `<li>${action}</li>`).join("");
};

const renderContact = (contact = {}) => {
  const info = $("[data-contact-info]");
  if (info) {
    info.innerHTML = `
      <div>
        <span class="meta-label">${contact.labels?.email ?? ""}</span>
        <p><a href="mailto:${contact.email}">${contact.email ?? ""}</a></p>
      </div>
      <div>
        <span class="meta-label">${contact.labels?.phone ?? ""}</span>
        <p><a href="tel:${contact.phone}">${contact.phone ?? ""}</a></p>
      </div>
      <div>
        <span class="meta-label">${contact.labels?.city ?? ""}</span>
        <p>${contact.city ?? ""}</p>
      </div>
      <div>
        <span class="meta-label">${contact.labels?.socials ?? ""}</span>
        <p>
          ${(contact.socials || [])
            .map((social) => `<a href="${social.url}" target="_blank" rel="noopener">${social.label}</a>`)
            .join(" • ")}
        </p>
      </div>
    `;
  }

  const form = $("[data-contact-form]");
  if (!form) return;

  $$("[data-contact-label]", form).forEach((label) => {
    const key = label.dataset.contactLabel;
    if (contact.form?.labels?.[key]) {
      label.textContent = contact.form.labels[key];
    }
  });

  $$("[data-contact-placeholder]", form).forEach((field) => {
    const key = field.dataset.contactPlaceholder;
    if (contact.form?.placeholders?.[key]) {
      field.placeholder = contact.form.placeholders[key];
    }
  });

  $$("[data-contact-option]", form).forEach((option) => {
    const key = option.dataset.contactOption;
    if (contact.form?.options?.[key]) {
      option.textContent = contact.form.options[key];
    }
  });

  const submitBtn = $("[data-contact-submit]", form);
  if (submitBtn) submitBtn.textContent = contact.form?.button || "";

  const note = $("[data-contact-note]");
  if (note) note.textContent = contact.form?.note || "";

  contactSuccessTemplate = contact.form?.success || "";
};

const renderFooter = (hero = {}, footerCopy = {}) => {
  const nameEl = $("[data-footer-name]");
  if (nameEl) nameEl.textContent = hero.name || "";
  const roleEl = $("[data-footer-role]");
  if (roleEl) roleEl.textContent = hero.footerRole || hero.brandTagline || hero.title || "";

  const copyEl = $("[data-footer-copy]");
  if (copyEl) {
    const template = footerCopy.note || "";
    const year = new Date().getFullYear();
    copyEl.textContent = template.replace("{year}", year);
  }
};

const initThemeToggle = () => {
  const toggle = $("[data-theme-toggle]");
  if (!toggle) return;

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.setProperty("color-scheme", theme);
    localStorage.setItem("proto-theme", theme);
  };

  const storedTheme = localStorage.getItem("proto-theme");
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const initialTheme = storedTheme || (media.matches ? "dark" : "light");
  applyTheme(initialTheme);

  toggle.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme || "light";
    applyTheme(current === "light" ? "dark" : "light");
  });
};

const initLanguageToggle = () => {
  const toggle = $("[data-lang-toggle]");
  if (!toggle) return;
  const isArabic = currentLang === "ar";
  toggle.textContent = isArabic ? "English" : "العربية";
  toggle.setAttribute("aria-label", isArabic ? "Switch to English" : "التبديل إلى العربية");
  toggle.addEventListener("click", () => {
    const nextLang = currentLang === "ar" ? "en" : "ar";
    localStorage.setItem("proto-lang", nextLang);
    window.location.reload();
  });
};

const initScrollProgress = () => {
  const progress = $(".scroll-progress");
  if (!progress) return;
  const updateProgress = () => {
    const total = document.body.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const value = total > 0 ? (scrolled / total) * 100 : 0;
    progress.style.width = `${Math.min(100, value)}%`;
  };
  document.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
};

const initCounters = () => {
  const counters = $$("[data-countup]");
  if (!counters.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((counter) => observer.observe(counter));
};

const animateCounter = (el) => {
  const target = Number(el.dataset.value || 0);
  const suffix = el.dataset.suffix || "";
  const duration = 1200;
  const start = performance.now();

  const step = (timestamp) => {
    const progress = Math.min(1, (timestamp - start) / duration);
    const value = Math.floor(progress * target);
    el.textContent = `${value}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = `${target}${suffix}`;
    }
  };
  requestAnimationFrame(step);
};

const initSkillBars = () => {
  const bars = $$("[data-skill-value]");
  if (!bars.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const value = Number(entry.target.dataset.skillValue);
          entry.target.style.transform = `scaleX(${value / 100})`;
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  bars.forEach((bar) => observer.observe(bar));
};

const initTiltCards = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;
  const cards = $$("[data-tilt]");
  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * -10;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
      card.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  });
};

const initCaseSlider = () => {
  const track = $("[data-cases-track]");
  const progress = $("[data-cases-progress]");
  const buttons = $$("[data-case-nav]");
  if (!track || !progress) return;

  const updateProgress = () => {
    const max = track.scrollWidth - track.clientWidth;
    const ratio = max > 0 ? track.scrollLeft / max : 0;
    progress.style.transform = `scaleX(${ratio || 0.05})`;
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const direction = btn.dataset.caseNav === "next" ? 1 : -1;
      track.scrollBy({
        left: direction * (track.clientWidth * 0.8),
        behavior: "smooth",
      });
    });
  });

  track.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
};

const initActiveNav = () => {
  const sections = $$("main section[id]");
  const navLinks = $$(".site-header__nav a");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove("is-active"));
          const activeLink = navLinks.find(
            (link) => link.getAttribute("href") === `#${entry.target.id}`
          );
          if (activeLink) activeLink.classList.add("is-active");
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => observer.observe(section));
};

const initHeroWordCycler = () => {
  const dynamicEl = $("[data-hero-dynamic]");
  if (!dynamicEl || heroRoles.length <= 1) return;
  if (heroCycleId) clearInterval(heroCycleId);
  let index = 0;
  heroCycleId = setInterval(() => {
    index = (index + 1) % heroRoles.length;
    dynamicEl.style.opacity = 0;
    dynamicEl.style.transform = "translateY(6px)";
    setTimeout(() => {
      dynamicEl.textContent = heroRoles[index];
      dynamicEl.style.opacity = 1;
      dynamicEl.style.transform = "translateY(0)";
    }, 250);
  }, 3200);
};

const initLabInteractions = () => {
  const cards = $$("[data-lab-card]");
  if (!cards.length) return;
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      cards.forEach((el) => el.classList.remove("is-active"));
      card.classList.add("is-active");
      updateLabDetail(Number(card.dataset.index));
    });
  });
};

const initContactForm = () => {
  const form = $("[data-contact-form]");
  const feedback = $("[data-contact-note]");
  if (!form || !feedback) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = (formData.get("name") || "").toString().trim() || (currentLang === "ar" ? "ضيف" : "Guest");
    const template = contactSuccessTemplate || feedback.textContent || "";
    feedback.textContent = template.replace("{{name}}", name);
    form.reset();
  });
};

const initSmoothScroll = () => {
  const links = $$("[data-scroll-to]");
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.dataset.scrollTo;
      const target = document.querySelector(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", init);
