/* =========================================================
   Seven Bees English School — interações do site
   ---------------------------------------------------------
   👉 WhatsApp, Instagram, promoção, cursos, unidades e dados
      da empresa ficam SÓ no objeto CONFIG abaixo.
      (A única cópia fora daqui é o bloco "schema.org" no
      <head> do index.html, que o Google lê; ver README.)
   ========================================================= */
const CONFIG = {
  // Número que recebe pré-matrículas e agendamentos: 55 + DDD + número, só dígitos. [CONFIRMAR]
  whatsapp: "5543988417010",
  whatsappLabel: "(43) 98841-7010",
  instagram: "sevenbees_english", // [CONFIRMAR]

  // A escola pediu para NÃO mostrar preços no site. A chamada é esta:
  promo: {
    tag: "40% OFF",
    short: "40% de desconto no Plano Grupo",
    waText: "Olá! Vi o site da Seven Bees e quero garantir os 40% de desconto no Plano Grupo. 🐝",
  },

  // Cursos. minor: true = curso para menores (pede o nome do responsável).
  // quoteOnly: true = só "Solicitar proposta" (sem lista de interesse).
  courses: [
    {
      id: "kids", cat: "kids", emoji: "🧸", tag: "Crianças", minor: true,
      name: "Seven Bees Kids",
      bullets: ["Aprendizado lúdico e natural", "Turmas por faixa etária", "Música, jogos e histórias"],
    },
    {
      id: "teens", cat: "teens", emoji: "🎧", tag: "Adolescentes", minor: true,
      name: "Seven Bees Teens",
      bullets: ["Conversação desde a 1ª aula", "Filmes, séries e games", "Turmas por nível"],
    },
    {
      id: "adults", cat: "adults", emoji: "☕", tag: "Adultos",
      name: "Seven Bees Adults",
      bullets: ["Inglês para o dia a dia e viagens", "Foco total em conversação", "Turmas reduzidas"],
    },
    {
      id: "entrepreneurs", cat: "adults business", emoji: "🚀", tag: "Empreendedores",
      name: "Inglês para Empreendedores",
      bullets: ["Reuniões, negociações e pitch", "Vocabulário de negócios", "Situações reais do trabalho"],
    },
    {
      id: "company", cat: "business", emoji: "🏢", tag: "In Company",
      name: "Seven Bees Business",
      bullets: ["Capacitação da sua equipe", "Atendimento internacional", "Programa sob medida"],
      quoteOnly: true,
    },
  ],

  // Depoimentos escritos: um objeto por depoimento (foto opcional).
  // A seção só aparece quando houver pelo menos 1.
  testimonials: [
    // { nome: "Paulo", papel: "Aluno · Teens", texto: "Escreva aqui o depoimento.", foto: "" },
  ],

  // Unidades. hours vazio = aparece "[CONFIRMAR]" no site.
  units: [
    {
      id: "zona-norte", name: "Unidade Zona Norte", short: "Zona Norte",
      street: "Av. Alexandre Santoro, 1051", district: "Jardim dos Estados", city: "Londrina/PR", cep: "86082-000",
      hours: "", // [CONFIRMAR] ex.: "Seg a sex, 8h às 21h · Sáb, 8h às 12h"
    },
    {
      id: "iate-clube", name: "Unidade Iate Clube", short: "Iate Clube",
      street: "Av. Higienópolis, 2135", district: "Higienópolis", city: "Londrina/PR", cep: "", // CEP [CONFIRMAR]
      hours: "", // [CONFIRMAR]
    },
  ],

  // Rodapé (Decreto 7.962/2013). Preencher com os dados da escola. [CONFIRMAR]
  company: { legalName: "", cnpj: "" },
};

/* ---------- Utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const confirmar = (what) => `<span class="confirmar">[CONFIRMAR ${what}]</span>`;
const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const store = {
  get(k, fallback) { try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sem storage */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* sem storage */ } },
};
// Versões antigas do site guardavam pedidos com dados pessoais aqui. Apaga.
store.del("sb-orders");
store.del("sb-guide-muted");

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("is-on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("is-on"), 2800);
}

/* Foco preso dentro de janelas (carrinho e pré-matrícula) */
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])';
function trapTab(container, e) {
  if (e.key !== "Tab") return;
  const items = $$(FOCUSABLE, container).filter((el) => el.offsetParent !== null);
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/* ---------- Dados do CONFIG espalhados pela página ---------- */
$$("[data-wa]").forEach((a) => {
  a.href = waLink(a.dataset.wa === "promo" ? CONFIG.promo.waText : a.dataset.wa);
  a.target = "_blank";
  a.rel = "noopener";
});
$$("[data-wa-label]").forEach((el) => (el.textContent = `WhatsApp ${CONFIG.whatsappLabel}`));
$$("[data-ig]").forEach((a) => {
  a.href = `https://www.instagram.com/${CONFIG.instagram}/`;
  a.textContent = `@${CONFIG.instagram}`;
});
$$("[data-promo-short]").forEach((el) => (el.textContent = CONFIG.promo.short));

const unitAddress = (u) => `${u.street} - ${u.district}, ${u.city.replace("/", " - ")}${u.cep ? `, ${u.cep}` : ""}`;
const unitHours = (u) => (u.hours ? esc(u.hours) : confirmar("horário"));
$("#footerUnits").innerHTML = CONFIG.units.map((u) => `
  <p><b>${esc(u.short)}</b><br>${esc(u.street)}<br>${esc(u.district)} · ${esc(u.city)}${u.cep ? ` · CEP ${esc(u.cep)}` : ` · ${confirmar("CEP")}`}<br><small>${unitHours(u)}</small></p>`).join("");
const unitRadios = (name) => CONFIG.units.map((u, i) => `
  <label><input type="radio" name="${name}" value="${esc(u.short)}"${i === 0 ? " checked" : ""}><span>📍 ${esc(u.short)}<small>${esc(u.district)}</small></span></label>`).join("");
$("#trialUnits").insertAdjacentHTML("beforeend", unitRadios("unidade"));
$("#coUnits").insertAdjacentHTML("beforeend", unitRadios("unidade"));

const co = CONFIG.company;
$("#legal").innerHTML = `Seven Bees English School · ${co.legalName ? esc(co.legalName) : confirmar("razão social")} · CNPJ ${co.cnpj ? esc(co.cnpj) : confirmar("")}`;

/* ---------- Header / menu ---------- */
const header = $(".header");
addEventListener("scroll", () => header.classList.toggle("is-scrolled", scrollY > 10), { passive: true });

const burger = $("#burger"), nav = $("#nav");
function setMenu(open) {
  nav.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
}
burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
$$("#nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
// fecha o menu ao tocar fora dele
document.addEventListener("click", (e) => {
  if (nav.classList.contains("is-open") && !e.target.closest("#nav, #burger")) setMenu(false);
});

$("#year").textContent = new Date().getFullYear();

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
}, { threshold: 0.12 });
$$(".reveal").forEach((el) => io.observe(el));

/* ---------- Chat animado do hero ---------- */
const chatScript = [
  ["teacher", "Teacher", "Hi! Tell me about yourself 😊"],
  ["student", "Arthur", "Hello! My name is Arthur."],
  ["teacher", "Teacher", "Nice to meet you, Arthur! What do you like to do?"],
  ["student", "Arthur", "I love playing soccer and video games! ⚽🎮"],
  ["teacher", "Teacher", "Awesome! Why do Americans say “soccer”? 🤔"],
  ["student", "Arthur", "I don't know… tell me!"],
  ["teacher", "Teacher", "Let's find out together. That's how we learn here! 🐝"],
];
(function runChat() {
  const chat = $("#chat"), typing = $("#typing");
  let i = 0;
  const reduce = reduceMotion();
  function next() {
    if (i >= chatScript.length) {
      setTimeout(() => { chat.innerHTML = ""; i = 0; next(); }, 4000);
      return;
    }
    const [who, name, text] = chatScript[i++];
    typing.classList.add("is-on");
    setTimeout(() => {
      typing.classList.remove("is-on");
      const m = document.createElement("div");
      m.className = `msg msg--${who}`;
      m.innerHTML = `<small>${name}</small>`;
      m.append(text);
      chat.append(m);
      while (chat.children.length > 5) chat.firstElementChild.remove();
      setTimeout(next, reduce ? 300 : 900);
    }, reduce ? 200 : 1100);
  }
  next();
})();

/* ---------- Comparativo tradicional x Seven Bees ---------- */
const compareData = {
  trad: [
    "Muita gramática no quadro e pouca fala",
    "Turmas cheias, pouco tempo para cada aluno",
    "Alunos de idades e níveis misturados",
    "Você estuda inglês, mas trava na hora de falar",
  ],
  seven: [
    "Conversação desde a primeira aula",
    "Turmas reduzidas: todo mundo fala, toda aula",
    "Turmas por faixa etária e nível de inglês",
    "Você usa o inglês de verdade, com confiança",
  ],
};
const compare = $(".compare"), compareList = $("#compareList");
function renderCompare(m) {
  compare.classList.toggle("is-trad", m === "trad");
  $$(".switch__btn").forEach((b) => {
    const on = b.dataset.mode === m;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on);
  });
  compareList.innerHTML = compareData[m]
    .map((t, i) => `<li style="animation-delay:${i * 70}ms"><b aria-hidden="true">${m === "trad" ? "✕" : "✓"}</b><span>${t}</span></li>`)
    .join("");
}
$$(".switch__btn").forEach((b) => b.addEventListener("click", () => renderCompare(b.dataset.mode)));
renderCompare("seven");

/* ---------- Cursos (sem preço) ---------- */
const MODES = { grupo: "Plano Grupo", vip: "VIP Individual" };
const MODE_BTN = { grupo: "Plano Grupo", vip: "VIP" }; // rótulo curto do botão
const mode = {}; // modalidade escolhida em cada curso
function findCourse(id) { return CONFIG.courses.find((c) => c.id === id); }

function renderCourses(filter = "all") {
  const wrap = $("#courses");
  wrap.innerHTML = CONFIG.courses
    .filter((c) => filter === "all" || c.cat.split(" ").includes(filter))
    .map((c, i) => {
      const m = mode[c.id] || "grupo";
      const cls = c.cat.split(" ")[0];
      const deal = c.quoteOnly
        ? `<p class="course__deal course__deal--plain">Programa montado para a rotina da sua empresa.</p>`
        : m === "grupo"
          ? `<p class="course__deal"><b>🐝 ${CONFIG.promo.tag}</b> no Plano Grupo</p>`
          : `<p class="course__deal course__deal--plain">Aulas individuais, no seu ritmo e no seu horário.</p>`;
      return `
      <article class="course" data-id="${c.id}" style="animation-delay:${i * 60}ms">
        <div class="course__top course__top--${cls}">
          <span class="course__emoji" aria-hidden="true">${c.emoji}</span>
          <span class="course__tag">${c.tag}</span>
          <h3>${c.name}</h3>
        </div>
        <div class="course__body">
          <ul>${c.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
          ${c.quoteOnly ? "" : `
          <div class="modes" role="group" aria-label="Modalidade do ${c.name}">
            ${Object.entries(MODE_BTN).map(([k, label]) => `<button type="button" data-mode="${k}" class="${m === k ? "is-active" : ""}" aria-pressed="${m === k}">${label}</button>`).join("")}
          </div>`}
          ${deal}
          ${c.quoteOnly
            ? `<a class="btn btn--outline btn--block" target="_blank" rel="noopener" href="${waLink(`Olá! Tenho interesse no ${c.name} (inglês para empresas) da Seven Bees.`)}">Solicitar proposta</a>`
            : `<button type="button" class="btn btn--blue btn--block" data-add>Tenho interesse</button>`}
        </div>
      </article>`;
    })
    .join("");
}
$("#courses").addEventListener("click", (e) => {
  const card = e.target.closest(".course");
  if (!card) return;
  const id = card.dataset.id;
  const mBtn = e.target.closest("[data-mode]");
  if (mBtn) {
    mode[id] = mBtn.dataset.mode;
    renderCourses($(".chip.is-active").dataset.filter);
    $(`.course[data-id="${id}"] [data-mode="${mode[id]}"]`)?.focus();
    return;
  }
  if (e.target.closest("[data-add]")) addToList(id, mode[id] || "grupo", e.target.closest("[data-add]"));
});
$$(".chip").forEach((chip) => chip.addEventListener("click", () => {
  $$(".chip").forEach((c) => { c.classList.toggle("is-active", c === chip); c.setAttribute("aria-pressed", c === chip); });
  renderCourses(chip.dataset.filter);
}));
renderCourses();

/* ---------- Lista "Meus cursos de interesse" ---------- */
// Guarda só os cursos escolhidos (nada de dados pessoais).
const keyOf = (it) => `${it.id}:${it.mode}`;
function cleanList(raw) {
  const seen = new Set();
  return (Array.isArray(raw) ? raw : [])
    .map((it) => ({ id: it && it.id, mode: it && it.mode, qty: Math.min(5, Math.max(1, parseInt(it && it.qty, 10) || 1)) }))
    .filter((it) => {
      const c = findCourse(it.id);
      if (!c || c.quoteOnly || !MODES[it.mode] || seen.has(keyOf(it))) return false;
      seen.add(keyOf(it));
      return true;
    });
}
let list = cleanList(store.get("sb-cart", []));
const cartEl = $("#cart"), overlay = $("#overlay");
let lastFocus = null;

function saveList() { store.set("sb-cart", list); renderList(); }
const hasMinor = () => list.some((it) => findCourse(it.id).minor);
const hasGroup = () => list.some((it) => it.mode === "grupo");

function addToList(id, m, fromBtn) {
  const found = list.find((it) => it.id === id && it.mode === m);
  if (found) {
    toast("Esse curso já está na sua lista. Ajuste a quantidade de alunos por lá 🐝");
    openCart();
    return;
  }
  list.push({ id, mode: m, qty: 1 });
  saveList();
  flyBee(fromBtn);
  toast(`${findCourse(id).name} está na sua lista!`);
}

function renderList() {
  const students = list.reduce((s, it) => s + it.qty, 0);
  $("#cartCount").textContent = list.length;
  $("#cartOpen").setAttribute("aria-label", `Meus cursos de interesse (${list.length})`);
  const body = $("#cartItems");
  if (!list.length) {
    body.innerHTML = `<div class="cart-empty"><div aria-hidden="true">🐝</div><p><b>Sua lista está vazia.</b><br>Toque em “Tenho interesse” no curso que combina com você.</p><a href="#cursos" class="btn btn--blue" data-close-cart>Ver cursos</a></div>`;
    $("#cartTotals").innerHTML = "";
    $("#checkoutBtn").disabled = true;
    return;
  }
  $("#checkoutBtn").disabled = false;
  body.innerHTML = list.map((it) => {
    const c = findCourse(it.id), k = keyOf(it);
    return `
    <div class="cart-item">
      <div class="cart-item__icon" aria-hidden="true">${c.emoji}</div>
      <div>
        <h4>${c.name}</h4>
        <p>${MODES[it.mode]}${it.mode === "grupo" ? ` · <b class="cart-item__deal">${CONFIG.promo.tag}</b>` : ""}</p>
        <div class="qty" role="group" aria-label="Quantidade de alunos no ${c.name}">
          <button type="button" data-qty="-1" data-key="${k}" aria-label="Menos um aluno"${it.qty <= 1 ? " disabled" : ""}>−</button>
          <span>${it.qty} ${it.qty > 1 ? "alunos" : "aluno"}</span>
          <button type="button" data-qty="1" data-key="${k}" aria-label="Mais um aluno"${it.qty >= 5 ? " disabled" : ""}>+</button>
        </div>
      </div>
      <button type="button" class="cart-item__remove" data-remove="${k}" aria-label="Remover ${c.name} da lista">Remover</button>
    </div>`;
  }).join("");
  $("#cartTotals").innerHTML = `
    <p>${students} ${students > 1 ? "alunos" : "aluno"} · ${list.length} ${list.length > 1 ? "cursos" : "curso"}</p>
    ${hasGroup() ? `<p class="totals__deal">🐝 Garanta <b>${CONFIG.promo.short}</b> enviando sua pré-matrícula.</p>` : ""}
    <small>Nada é cobrado pelo site. A equipe confirma turma, horário e valores com você pelo WhatsApp.</small>`;
}
$("#cartItems").addEventListener("click", (e) => {
  const r = e.target.closest("[data-remove]");
  if (r) {
    list = list.filter((it) => keyOf(it) !== r.dataset.remove);
    saveList();
    $("#cartClose").focus();
    return;
  }
  const q = e.target.closest("[data-qty]");
  if (q) {
    const it = list.find((x) => keyOf(x) === q.dataset.key);
    if (it) { it.qty = Math.min(5, Math.max(1, it.qty + +q.dataset.qty)); saveList(); }
    $(`[data-qty="${q.dataset.qty}"][data-key="${q.dataset.key}"]`)?.focus();
    return;
  }
  if (e.target.closest("[data-close-cart]")) closeCart();
});

function openCart() {
  lastFocus = document.activeElement;
  cartEl.classList.add("is-open");
  cartEl.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
  document.documentElement.style.overflow = "hidden";
  setTimeout(() => $("#cartClose").focus(), 50);
}
function closeCart() {
  if (!cartEl.classList.contains("is-open")) return;
  cartEl.classList.remove("is-open");
  cartEl.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
  document.documentElement.style.overflow = "";
  lastFocus?.focus?.();
}
$("#cartOpen").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
cartEl.addEventListener("keydown", (e) => trapTab(cartEl, e));
addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!$("#checkout").hidden) closeCheckout();
  else if (cartEl.classList.contains("is-open")) closeCart();
  else if (nav.classList.contains("is-open")) { setMenu(false); burger.focus(); }
});

function flyBee(fromEl) {
  const btn = $("#cartOpen");
  btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
  if (!fromEl || reduceMotion()) return;
  const a = fromEl.getBoundingClientRect(), b = btn.getBoundingClientRect();
  const bee = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  bee.setAttribute("viewBox", "0 0 64 64");
  bee.setAttribute("aria-hidden", "true");
  bee.classList.add("fly-bee");
  bee.innerHTML = '<use href="#bee"/>';
  bee.style.left = `${a.left + a.width / 2 - 18}px`;
  bee.style.top = `${a.top + a.height / 2 - 18}px`;
  document.body.append(bee);
  requestAnimationFrame(() => {
    bee.style.transform = `translate(${b.left - a.left - a.width / 2 + 23}px, ${b.top - a.top - a.height / 2 + 23}px) scale(.5) rotate(20deg)`;
    bee.style.opacity = ".2";
  });
  setTimeout(() => bee.remove(), 850);
}
renderList();

/* ---------- Pré-matrícula (2 etapas + WhatsApp) ---------- */
const checkout = $("#checkout"), cform = $("#checkoutForm");
let step = 1;
let lastQuiz = null; // resultado do teste de nível (só nesta visita)

function goStep(n) {
  step = n;
  $$(".step", cform).forEach((s) => s.classList.toggle("is-active", +s.dataset.step === n));
  $$(".steps span").forEach((s, i) => s.classList.toggle("is-active", i < n));
  if (n === 2) renderSummary();
  $(".modal__box").scrollTop = 0;
  const first = $(`[data-step="${n}"] h3`, cform);
  if (first) { first.setAttribute("tabindex", "-1"); first.focus(); }
}
function syncMinor() {
  const minor = hasMinor();
  $("#coResp").hidden = !minor;
  $("#coAlunoLabel").textContent = minor ? "Nome do aluno (criança ou adolescente)" : "Nome do aluno";
}
function openCheckout() {
  if (!list.length) return;
  closeCart();
  lastFocus = $("#cartOpen");
  checkout.hidden = false;
  document.documentElement.style.overflow = "hidden";
  syncMinor();
  goStep(1);
  setTimeout(() => cform.aluno.focus(), 50);
}
function closeCheckout() {
  checkout.hidden = true;
  document.documentElement.style.overflow = "";
  if (step === 3) goStep(1);
  lastFocus?.focus?.();
}
$("#checkoutBtn").addEventListener("click", openCheckout);
checkout.addEventListener("click", (e) => {
  if (e.target === checkout || e.target.closest("[data-close]")) closeCheckout();
});
checkout.addEventListener("keydown", (e) => trapTab($(".modal__box"), e));

// Valida só os campos visíveis do bloco.
function validate(container) {
  let ok = true;
  $$("input, select", container).forEach((f) => {
    if (f.closest("[hidden]") || f.type === "radio" || f.type === "hidden") return;
    const v = f.type === "checkbox" ? "" : f.value.trim();
    let valid = true;
    if (f.required) valid = f.type === "checkbox" ? f.checked : v !== "";
    if (valid && v && f.type === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    if (valid && v && f.dataset.mask === "phone") valid = v.replace(/\D/g, "").length >= 10;
    if (valid && v && f.dataset.min) valid = v.length >= +f.dataset.min;
    f.classList.toggle("is-invalid", !valid);
    f.setAttribute("aria-invalid", !valid);
    if (!valid) ok = false;
  });
  return ok;
}
function focusFirstInvalid(container) { $(".is-invalid", container)?.focus(); }

$("[data-prev]", cform).addEventListener("click", () => goStep(1));

function renderSummary() {
  $("#checkoutSummary").innerHTML = `
    <strong>Cursos de interesse</strong>
    ${list.map((it) => { const c = findCourse(it.id); return `<div><span>${c.emoji} ${c.name} · ${MODES[it.mode]}</span><span>${it.qty} ${it.qty > 1 ? "alunos" : "aluno"}</span></div>`; }).join("")}
    ${hasGroup() ? `<p class="summary__deal">🐝 Pré-matrícula com <b>${CONFIG.promo.short}</b>.</p>` : ""}`;
}

function preMatriculaText(d) {
  const lines = list.map((it) => { const c = findCourse(it.id); return `• ${c.name} (${MODES[it.mode]})${it.qty > 1 ? ` — ${it.qty} alunos` : ""}`; });
  // null = linha omitida; "" = linha em branco de propósito
  return [
    "🐝 *Pré-matrícula pelo site*",
    hasGroup() ? "Quero garantir os *40% de desconto no Plano Grupo*." : null,
    "",
    `*Aluno:* ${d.aluno.trim()}`,
    hasMinor() && d.responsavel ? `*Responsável:* ${d.responsavel.trim()}` : null,
    `*WhatsApp:* ${d.tel}`,
    d.email ? `*E-mail:* ${d.email.trim()}` : null,
    `*Unidade:* ${d.unidade}`,
    `*Período:* ${d.periodo}`,
    "",
    "*Cursos de interesse:*",
    ...lines,
    lastQuiz ? "" : null,
    lastQuiz ? `*Teste de nível no site:* ${lastQuiz}` : null,
  ].filter((l) => l !== null).join("\n");
}

cform.addEventListener("submit", (e) => {
  e.preventDefault();
  const s1 = $('[data-step="1"]', cform), s2 = $('[data-step="2"]', cform);
  const msg2 = $(".form__msg", s2), msg1 = $(".form__msg", s1);
  if (!list.length) { closeCheckout(); return; }

  // Etapa 1 (inclusive quando a pessoa aperta Enter): só valida e avança.
  if (step === 1) {
    if (validate(s1)) { msg1.textContent = ""; goStep(2); }
    else { msg1.textContent = "Preencha os campos destacados."; focusFirstInvalid(s1); }
    return;
  }
  if (step !== 2) return;

  // Etapa 2: confere tudo de novo antes de montar a mensagem.
  if (!validate(s1)) { goStep(1); msg1.textContent = "Faltou algum dado aqui."; focusFirstInvalid(s1); return; }
  if (!validate(s2)) {
    msg2.textContent = $('[name="aceite"]', s2).checked ? "Escolha o melhor período." : "Para enviar, aceite as condições e a política de privacidade.";
    focusFirstInvalid(s2);
    return;
  }
  msg2.textContent = "";

  const url = waLink(preMatriculaText(Object.fromEntries(new FormData(cform))));
  window.open(url, "_blank", "noopener");
  $("#orderWa").href = url;
  goStep(3);
  list = [];
  saveList();
  cform.reset();
  $$(".is-invalid", cform).forEach((f) => f.classList.remove("is-invalid"));
});

/* ---------- Máscara de telefone ---------- */
$$("[data-mask=phone]").forEach((inp) => inp.addEventListener("input", () => {
  let v = inp.value.replace(/\D/g, "").slice(0, 11);
  if (v.length > 6) v = `(${v.slice(0, 2)}) ${v.slice(2, v.length - 4)}-${v.slice(-4)}`;
  else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
  else if (v.length) v = `(${v}`;
  inp.value = v;
}));

/* ---------- Aula grátis ---------- */
const trialForm = $("#trialForm");
const trialMinor = () => /Criança|Adolescente/.test(trialForm.publico.value);
trialForm.publico.addEventListener("change", () => {
  $("#trialAluno").hidden = !trialMinor();
});
trialForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = $(".form__msg", trialForm);
  if (!validate(trialForm)) { msg.className = "form__msg"; msg.textContent = "Preencha os campos destacados."; focusFirstInvalid(trialForm); return; }
  const d = Object.fromEntries(new FormData(trialForm));
  const text = [
    "Olá, Seven Bees! 🐝 Quero agendar uma *aula demonstrativa gratuita*.",
    "",
    `*Nome:* ${d.nome.trim()}`,
    trialMinor() && d.aluno ? `*Aluno:* ${d.aluno.trim()}` : null,
    `*WhatsApp:* ${d.tel}`,
    `*Para:* ${d.publico}`,
    `*Período:* ${d.periodo}`,
    `*Unidade:* ${d.unidade}`,
    lastQuiz ? `*Teste de nível no site:* ${lastQuiz}` : null,
  ].filter((l) => l !== null).join("\n");
  window.open(waLink(text), "_blank", "noopener");
  msg.className = "form__msg is-ok";
  msg.textContent = "Abrimos o WhatsApp com a sua mensagem. Toque em Enviar por lá para confirmar o horário. 🐝";
  trialForm.reset();
  $("#trialAluno").hidden = true;
});

/* ---------- Teste de nível ---------- */
const quizQuestions = [
  { q: "___ you like coffee?", hl: "___", opts: ["Do", "Does", "Are"], a: 0 },
  { q: "She ___ to school every day.", hl: "___", opts: ["go", "goes", "going"], a: 1 },
  { q: "Yesterday I ___ a great movie.", hl: "___", opts: ["watch", "watched", "have watched"], a: 1 },
  { q: "I ___ in Londrina since 2020.", hl: "___", opts: ["live", "am living", "have lived"], a: 2 },
  { q: "“It's raining cats and dogs” significa…", hl: "", opts: ["Está chovendo muito", "Tem animais na rua", "Está um dia bonito"], a: 0 },
  { q: "If I ___ more time, I would travel the world.", hl: "___", opts: ["have", "had", "will have"], a: 1 },
  { q: "By next year, I ___ my degree.", hl: "___", opts: ["will finish", "will have finished", "finish"], a: 1 },
];
const audiences = [
  { key: "kids", label: "🧸 Uma criança", course: "kids" },
  { key: "teens", label: "🎧 Um adolescente", course: "teens" },
  { key: "adults", label: "☕ Eu (adulto)", course: "adults" },
  { key: "biz", label: "🚀 Para o meu trabalho", course: "entrepreneurs" },
];
const levels = [
  { min: 0, name: "Starter", pt: "Iniciante", text: "Você está começando, e esse é o melhor momento! Com conversação desde a 1ª aula, você vai se surpreender com a rapidez da evolução." },
  { min: 3, name: "Basic", pt: "Básico", text: "Você já tem uma base. Agora é hora de destravar a fala e ganhar confiança para usar o inglês de verdade." },
  { min: 5, name: "Intermediate", pt: "Intermediário", text: "Muito bem! Você entende bastante. Nas nossas turmas de conversação você vai ganhar fluência e naturalidade." },
  { min: 7, name: "Advanced", pt: "Avançado", text: "Uau! Seu inglês está ótimo. Vamos lapidar a fluência com conversação avançada e situações reais." },
];
const quiz = { audience: null, i: 0, score: 0 };
const quizBody = $("#quizBody"), quizBar = $("#quizBar");
const keys = ["A", "B", "C", "D"];

function quizFocus() { const h = $("h3", quizBody); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); } }
function quizStart() {
  quiz.audience = null; quiz.i = 0; quiz.score = 0;
  quizBar.style.width = "0%";
  quizBody.innerHTML = `
    <div class="quiz__step">
      <span class="quiz__count">Antes de começar</span>
      <h3 class="quiz__q">Para quem é o curso?</h3>
      <div class="quiz__opts quiz__opts--grid">
        ${audiences.map((a, i) => `<button type="button" class="opt" data-aud="${a.key}"><span class="opt__key" aria-hidden="true">${keys[i]}</span>${a.label}</button>`).join("")}
      </div>
    </div>`;
}
function quizQuestion() {
  const total = quizQuestions.length;
  const q = quizQuestions[quiz.i];
  quizBar.style.width = `${(quiz.i / total) * 100}%`;
  const qText = q.hl ? q.q.replace(q.hl, `<mark>${q.hl}</mark>`) : q.q;
  quizBody.innerHTML = `
    <div class="quiz__step">
      <span class="quiz__count">Pergunta ${quiz.i + 1} de ${total}</span>
      <h3 class="quiz__q">${qText}</h3>
      <div class="quiz__opts">
        ${q.opts.map((o, i) => `<button type="button" class="opt" data-opt="${i}"><span class="opt__key" aria-hidden="true">${keys[i]}</span>${o}</button>`).join("")}
      </div>
      <p class="quiz__feedback" aria-live="polite"></p>
    </div>`;
  quizFocus();
}
function quizResult() {
  quizBar.style.width = "100%";
  const aud = audiences.find((a) => a.key === quiz.audience);
  const course = findCourse(aud.course);
  let title, text, badge;
  if (quiz.audience === "kids") {
    badge = `🧸`;
    title = "Seven Bees Kids é para ele(a)!";
    text = "Para os pequenos, o nivelamento é feito de forma leve, durante a aula demonstrativa. Agende uma aula grátis e veja seu filho falando inglês desde o primeiro dia!";
    lastQuiz = "Kids (nivelamento na aula demonstrativa)";
  } else {
    const lvl = [...levels].reverse().find((l) => quiz.score >= l.min);
    badge = `${quiz.score}/${quizQuestions.length}<small>acertos</small>`;
    title = `Nível ${lvl.pt} <span class="script" style="color:var(--blue)">${lvl.name}</span>`;
    text = `${lvl.text} Curso recomendado: <b>${course.name}</b>.`;
    lastQuiz = `${lvl.pt} (${quiz.score}/${quizQuestions.length} acertos) · indicado: ${course.name}`;
  }
  quizBody.innerHTML = `
    <div class="quiz__result">
      <div class="quiz__badge">${quiz.audience === "kids" ? badge : `<div>${badge}</div>`}</div>
      <h3>${title}</h3>
      <p>${text}</p>
      <div class="quiz__actions">
        <button type="button" class="btn btn--blue btn--lg" data-quiz-add="${course.id}">Quero o ${course.name} com ${CONFIG.promo.tag}</button>
        <a href="#aula-gratis" class="btn btn--yellow btn--lg">Agendar aula grátis</a>
      </div>
      <p style="margin-top:16px"><button type="button" class="chip" data-quiz-restart>↺ Refazer o teste</button></p>
    </div>`;
  quizFocus();
}
quizBody.addEventListener("click", (e) => {
  const aud = e.target.closest("[data-aud]");
  if (aud) {
    quiz.audience = aud.dataset.aud;
    if (quiz.audience === "kids") quizResult(); else quizQuestion();
    return;
  }
  const opt = e.target.closest("[data-opt]");
  if (opt && !opt.disabled) {
    const q = quizQuestions[quiz.i];
    const chosen = +opt.dataset.opt;
    const btns = $$("[data-opt]", quizBody);
    btns.forEach((b) => (b.disabled = true));
    btns[q.a].classList.add("is-right");
    const fb = $(".quiz__feedback", quizBody);
    if (chosen === q.a) { quiz.score++; fb.textContent = ["Great job! 🎉", "Correct! 🐝", "Well done! ✨", "Nice! 👏"][quiz.i % 4]; fb.className = "quiz__feedback is-right"; }
    else { opt.classList.add("is-wrong"); fb.textContent = "Quase! A resposta certa está em verde."; fb.className = "quiz__feedback is-wrong"; }
    setTimeout(() => { quiz.i++; quiz.i < quizQuestions.length ? quizQuestion() : quizResult(); }, 1100);
    return;
  }
  const add = e.target.closest("[data-quiz-add]");
  if (add) {
    addToList(add.dataset.quizAdd, "grupo", add);
    const card = $(`.course[data-id="${add.dataset.quizAdd}"]`);
    if (card) { card.classList.add("is-highlight"); setTimeout(() => card.classList.remove("is-highlight"), 3000); }
    return;
  }
  if (e.target.closest("[data-quiz-restart]")) { quizStart(); quizFocus(); }
});
quizStart();

/* ---------- Unidades ---------- */
$("#unitTabs").innerHTML = CONFIG.units.map((u, i) => `
  <button type="button" class="unit-tab${i === 0 ? " is-active" : ""}" data-unit="${i}" aria-pressed="${i === 0}">
    <strong>${esc(u.name)}</strong>
    <span>${esc(u.street)} · ${esc(u.district)}</span>
    <small class="unit-tab__hours">🕘 ${unitHours(u)}</small>
  </button>`).join("");
function showUnit(i) {
  const u = CONFIG.units[i];
  $$(".unit-tab").forEach((t, k) => { t.classList.toggle("is-active", k === i); t.setAttribute("aria-pressed", k === i); });
  $("#unitMap").src = `https://maps.google.com/maps?q=${encodeURIComponent(unitAddress(u))}&z=16&output=embed`;
  $("#unitMap").title = `Mapa - ${u.name}`;
  $("#unitRoute").href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(unitAddress(u))}`;
}
$$(".unit-tab").forEach((t) => t.addEventListener("click", () => showUnit(+t.dataset.unit)));
showUnit(0);

/* ---------- Bee Curious (flip cards) ---------- */
const facts = [
  { tag: "Expressão", front: "“It's raining cats and dogs”", back: "Está chovendo muito!", more: "Ninguém está vendo gatos e cachorros caindo do céu 😅 É só uma chuva forte." },
  { tag: "Curiosidade", front: "Por que os EUA chamam futebol de “soccer”?", back: "Vem da Inglaterra!", more: "“Soccer” é um apelido de “association football”, criado pelos próprios ingleses no século XIX." },
  { tag: "Filmes", front: "“Home Alone”", back: "Esqueceram de Mim", more: "O título original significa literalmente “Sozinho em Casa”." },
  { tag: "Expressão", front: "“Break a leg!”", back: "Boa sorte!", more: "Muito usado antes de apresentações e provas. Ninguém quer que você quebre a perna 😉" },
  { tag: "Filmes", front: "“The Hangover”", back: "Se Beber, Não Case!", more: "No original, “hangover” quer dizer “ressaca”." },
  { tag: "Expressão", front: "“It's a piece of cake”", back: "É moleza!", more: "Literalmente “é um pedaço de bolo”. Usado quando algo é muito fácil." },
];
$("#flips").innerHTML = facts.map((f) => `
  <button type="button" class="flip reveal" aria-pressed="false">
    <div class="flip__inner">
      <div class="flip__face flip__front">
        <small>${f.tag}</small>
        <h3>${f.front}</h3>
        <span class="flip__hint" aria-hidden="true">Toque para descobrir ↻</span>
      </div>
      <div class="flip__face flip__back">
        <strong>${f.back}</strong>
        <p>${f.more}</p>
      </div>
    </div>
  </button>`).join("");
$$(".flip").forEach((f) => {
  io.observe(f);
  f.addEventListener("click", () => f.setAttribute("aria-pressed", f.classList.toggle("is-flipped")));
});

/* ---------- Calculadora "Quanto custa não falar inglês?" ---------- */
const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace(",00", "");
const ops = $("#calcOps"), val = $("#calcVal");
function calc() {
  $("#calcOpsOut").textContent = ops.value;
  $("#calcValOut").textContent = brl(+val.value);
  $("#calcResult").textContent = brl(ops.value * val.value * 12);
}
ops.addEventListener("input", calc);
val.addEventListener("input", calc);
calc();

/* ---------- Abelhas voando pelas seções ---------- */
(function flyingBees() {
  if (reduceMotion()) return;
  const small = innerWidth < 600;
  const swarms = [];
  let mouse = { x: -9999, y: -9999 };
  addEventListener("pointermove", (e) => { mouse = { x: e.clientX, y: e.clientY }; }, { passive: true });

  $$("[data-bees]").forEach((section) => {
    let n = +section.dataset.bees || 1;
    if (small) n = n >= 2 ? 1 : 0; // no celular: no máximo 1 abelha por seção
    if (!n) return;
    const layer = document.createElement("div");
    layer.className = "bee-layer";
    layer.setAttribute("aria-hidden", "true");
    section.prepend(layer);
    const bees = [];
    for (let i = 0; i < n; i++) {
      const el = document.createElement("div");
      el.className = "bee-fly" + (i % 2 ? " bee-fly--sm" : "");
      el.innerHTML = '<svg viewBox="0 0 64 64"><use href="#bee"/></svg>';
      layer.append(el);
      bees.push({
        el, x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.7 + 0.15,
        a: Math.random() * Math.PI * 2, speed: 55 + Math.random() * 45,
        turn: 0, face: 1, trailT: 0,
      });
    }
    const swarm = { section, layer, bees, visible: false, rect: null };
    swarms.push(swarm);
    new IntersectionObserver(([e]) => { swarm.visible = e.isIntersecting; }).observe(section);
  });
  if (!swarms.length) return;

  let last = performance.now();
  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (document.hidden) { requestAnimationFrame(tick); return; }
    swarms.forEach((s) => {
      if (!s.visible) return;
      const r = s.layer.getBoundingClientRect();
      const W = r.width, H = r.height;
      s.bees.forEach((b) => {
        b.turn += (Math.random() - 0.5) * 6 * dt;
        b.turn *= 0.96;
        b.a += b.turn * dt * 3;
        let px = b.x * W, py = b.y * H;
        const dx = px + r.left - mouse.x, dy = py + r.top - mouse.y;
        let boost = 1;
        if (Math.hypot(dx, dy) < 130) {
          const flee = Math.atan2(dy, dx);
          b.a += Math.atan2(Math.sin(flee - b.a), Math.cos(flee - b.a)) * 0.25;
          boost = 3;
        }
        const margin = 40;
        if (px < margin || px > W - margin || py < margin || py > H - margin) {
          const toCenter = Math.atan2(H / 2 - py, W / 2 - px);
          b.a += Math.atan2(Math.sin(toCenter - b.a), Math.cos(toCenter - b.a)) * 0.08;
        }
        px += Math.cos(b.a) * b.speed * boost * dt;
        py += Math.sin(b.a) * b.speed * boost * dt + Math.sin(now / 180 + b.speed) * 0.6;
        b.x = Math.max(0, Math.min(1, px / W));
        b.y = Math.max(0, Math.min(1, py / H));
        const vx = Math.cos(b.a);
        if (Math.abs(vx) > 0.2) b.face = vx > 0 ? 1 : -1;
        b.el.style.transform = `translate(${px - 19}px, ${py - 19}px) scaleX(${b.face})`;
        if (small) return; // sem rastro no celular
        b.trailT += dt;
        if (b.trailT > 0.12) {
          b.trailT = 0;
          const t = document.createElement("span");
          t.className = "bee-trail";
          t.style.left = `${px - b.face * 16}px`;
          t.style.top = `${py + 4}px`;
          s.layer.append(t);
          setTimeout(() => t.remove(), 1100);
        }
      });
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

/* ---------- Abelha guia ----------
   Na primeira visita, só um "Oi" pequeno ao lado da abelha (na faixa de baixo,
   sem cobrir botão nem preço), que some ao rolar. As dicas só abrem ao toque. */
(function guideBee() {
  const tips = {
    inicio: { text: "Oi! Eu sou a <b>Bee</b> 🐝 Toque em mim quando quiser uma dica. Que tal descobrir seu nível de inglês?", label: "Fazer o teste", href: "#teste" },
    metodo: { text: "Toque em <b>Tradicional</b> e <b>Seven Bees</b> para ver a diferença das nossas turmas!", label: "Comparar turmas", href: ".compare" },
    teste: { text: "Responda as perguntas e eu te indico o <b>curso ideal</b>. Leva só 1 minuto!", label: "Começar", href: "#quiz" },
    cursos: { text: "Escolha <b>Plano Grupo</b> ou <b>VIP</b> e toque em <b>Tenho interesse</b>. No Grupo você garante <b>40% de desconto</b>!", label: "Ver a promoção", href: ".promo-banner" },
    "aula-gratis": { text: "A primeira aula é por nossa conta! Preencha e a gente confirma pelo <b>WhatsApp</b>.", label: "Preencher", href: "#trialForm" },
    unidades: { text: "Temos <b>2 unidades</b> em Londrina. Toque em uma para ver no mapa 📍", label: "Ver unidades", href: ".units" },
    curiosidades: { text: "Toque nos cards para <b>virar</b> e aprender expressões do dia a dia!", label: "Virar um card", href: "#flips", flip: true },
    "primeira-aula": { text: "Medo da primeira aula? Relaxa! Dá o <b>play</b> nas dicas 😉", label: "Assistir o vídeo", href: "#primeira-aula .vcard", play: true },
    depoimentos: { text: "Assista a <b>professora Tália</b> e o <b>aluno Paulo</b> contando como é a Seven Bees 💛", label: "Assistir depoimento", href: "#depoimentos .vcard", play: true },
    empresas: { text: "Arraste as barrinhas e veja <b>quanto custa não falar inglês</b> 💸", label: "Simular", href: ".calc" },
    faq: { text: "Ficou com dúvida? Chama no <b>WhatsApp</b> que a equipe responde!", label: "Chamar no WhatsApp", href: "wa" },
    final: { text: "Pronto para entrar na colmeia? 🐝 Garanta seus <b>40% de desconto</b> no Plano Grupo!", label: "Quero meu desconto", href: "promo" },
  };
  const bubble = $("#guideBubble"), bee = $("#guideBee"), text = $("#guideText"), action = $("#guideAction"), hello = $("#guideHello");
  let current = "inicio";
  const external = (h) => h === "wa" || h === "promo";

  function hide() { bubble.classList.remove("is-on"); bee.setAttribute("aria-expanded", "false"); }
  function show(id) {
    const tip = tips[id];
    if (!tip) return;
    text.innerHTML = tip.text;
    action.textContent = tip.label + " →";
    if (external(tip.href)) {
      action.href = waLink(tip.href === "promo" ? CONFIG.promo.waText : "Olá! Vim pelo site da Seven Bees e tenho uma dúvida.");
      action.target = "_blank"; action.rel = "noopener";
    } else { action.href = "#"; action.removeAttribute("target"); }
    bubble.classList.add("is-on");
    bee.setAttribute("aria-expanded", "true");
  }

  action.addEventListener("click", (e) => {
    const tip = tips[current];
    if (!tip || external(tip.href)) { hide(); return; }
    e.preventDefault();
    const target = $(tip.href);
    hide();
    if (!target) return;
    // o play precisa acontecer no mesmo toque (senão o iPhone toca sem som)
    if (tip.play) { const c = $(".vcard__cover", target); c && c.click(); }
    target.scrollIntoView({ block: "center" });
    target.classList.remove("bee-target"); void target.offsetWidth; target.classList.add("bee-target");
    if (tip.flip) setTimeout(() => { const f = $(".flip"); f && f.click(); }, 600);
  });
  bee.addEventListener("click", () => {
    hello.hidden = true;
    if (bubble.classList.contains("is-on")) { hide(); return; }
    bee.classList.remove("is-flying"); void bee.offsetWidth; bee.classList.add("is-flying");
    show(current);
  });
  $("#guideClose").addEventListener("click", () => { hide(); bee.focus(); });

  // Só acompanha em que seção a pessoa está (não abre nada sozinho).
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) current = e.target.id; });
  }, { rootMargin: "-45% 0px -45% 0px" });
  Object.keys(tips).forEach((id) => { const el = document.getElementById(id); if (el) secObs.observe(el); });

  // Primeira visita: um "Oi" só, quando a pessoa chega no Método (lá embaixo
  // da tela só tem texto). Some em 6 s ou quando ela rola mais um pouco.
  if (!store.get("sb-guide-seen", false) && $("#metodo")) {
    const once = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      once.disconnect();
      store.set("sb-guide-seen", true);
      hello.hidden = false;
      bee.classList.remove("is-flying"); void bee.offsetWidth; bee.classList.add("is-flying");
      const y0 = scrollY;
      const onScroll = () => { if (Math.abs(scrollY - y0) > 300) off(); };
      const off = () => { hello.hidden = true; removeEventListener("scroll", onScroll); };
      addEventListener("scroll", onScroll, { passive: true });
      setTimeout(off, 6000);
    }, { rootMargin: "-40% 0px -40% 0px" });
    once.observe($("#metodo"));
  }
})();

/* ---------- Depoimentos ---------- */
(function testimonials() {
  const items = CONFIG.testimonials || [];
  if (!items.length) return;
  $("#testiText").hidden = false;
  $("#testiDots").hidden = false;
  const track = $("#testiTrack"), dots = $("#testiDots");
  track.innerHTML = items.map((t) => `
    <article class="testi-card">
      <div class="testi-card__stars" aria-label="5 estrelas">★★★★★</div>
      <blockquote>${esc(t.texto)}</blockquote>
      <footer>
        ${t.foto ? `<img class="testi-card__avatar" src="${esc(t.foto)}" alt="${esc(t.nome)}" loading="lazy">`
                 : `<span class="testi-card__avatar" aria-hidden="true">${esc(t.nome.trim()[0] || "🐝")}</span>`}
        <div><strong>${esc(t.nome)}</strong><small>${esc(t.papel || "")}</small></div>
      </footer>
    </article>`).join("");

  const cards = $$(".testi-card", track);
  dots.innerHTML = cards.map((_, i) => `<button type="button" aria-label="Ir para depoimento ${i + 1}"></button>`).join("");
  const dotBtns = $$("button", dots);
  const prev = $(".testi__arrow--prev"), next = $(".testi__arrow--next");
  const stepW = () => cards[0].getBoundingClientRect().width + 20;
  const index = () => Math.round(track.scrollLeft / stepW());
  function update() {
    const i = index(), max = track.scrollWidth - track.clientWidth - 2;
    dotBtns.forEach((d, k) => d.classList.toggle("is-active", k === i));
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
    const fits = max <= 0;
    prev.hidden = next.hidden = dots.hidden = fits;
  }
  prev.addEventListener("click", () => track.scrollBy({ left: -stepW() }));
  next.addEventListener("click", () => track.scrollBy({ left: stepW() }));
  dotBtns.forEach((d, k) => d.addEventListener("click", () => track.scrollTo({ left: k * stepW() })));
  track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  addEventListener("resize", update);
  update();

  let paused = false;
  ["pointerenter", "focusin", "touchstart"].forEach((ev) => track.addEventListener(ev, () => (paused = true), { passive: true }));
  track.addEventListener("pointerleave", () => (paused = false));
  setInterval(() => {
    if (paused || document.hidden || reduceMotion()) return;
    const max = track.scrollWidth - track.clientWidth - 2;
    if (track.scrollLeft >= max) track.scrollTo({ left: 0 }); else track.scrollBy({ left: stepW() });
  }, 6000);
})();

/* ---------- Vídeos (dicas e depoimentos) ---------- */
(function videos() {
  const cards = $$(".vcard");
  cards.forEach((card) => {
    const video = $("video", card), cover = $(".vcard__cover", card);
    cover.addEventListener("click", () => {
      cards.forEach((c) => { if (c !== card) $("video", c).pause(); });
      video.controls = true;
      video.muted = false;
      card.classList.add("is-playing");
      video.play().catch(() => {
        // o navegador bloqueou o som: toca mudo e avisa
        video.muted = true;
        video.play().then(() => toast("O vídeo começou sem som. Toque no 🔊 para ouvir.")).catch(() => {});
      });
    });
    video.addEventListener("ended", () => { card.classList.remove("is-playing"); video.controls = false; video.load(); });
  });
  const vio = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (!e.isIntersecting) e.target.pause(); });
  }, { threshold: 0.2 });
  cards.forEach((c) => vio.observe($("video", c)));
})();
