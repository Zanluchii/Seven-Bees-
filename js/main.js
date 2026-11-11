/* =========================================================
   Seven Bees English School — interações do site
   ---------------------------------------------------------
   👉 Para editar preços, cursos, WhatsApp e unidades,
      altere apenas o objeto CONFIG abaixo.
   ========================================================= */
const CONFIG = {
  whatsapp: "5543988417010",

  // Promoção: primeira mensalidade do Plano Grupo
  promoFirstMonth: 34.90,

  // Cursos exibidos na loja.
  // price.grupo / price.vip = mensalidade em R$. Use null para "valor sob consulta".
  courses: [
    {
      id: "kids", cat: "kids", emoji: "🧸", tag: "Crianças",
      name: "Seven Bees Kids",
      bullets: ["Aprendizado lúdico e natural", "Turmas por faixa etária", "Música, jogos e histórias"],
      price: { grupo: 249, vip: null },
    },
    {
      id: "teens", cat: "teens", emoji: "🎧", tag: "Adolescentes",
      name: "Seven Bees Teens",
      bullets: ["Conversação desde a 1ª aula", "Filmes, séries e games", "Turmas por nível"],
      price: { grupo: 249, vip: null },
    },
    {
      id: "adults", cat: "adults", emoji: "☕", tag: "Adultos",
      name: "Seven Bees Adults",
      bullets: ["Inglês para o dia a dia e viagens", "Foco total em conversação", "Turmas reduzidas"],
      price: { grupo: 249, vip: null },
    },
    {
      id: "entrepreneurs", cat: "adults business", emoji: "🚀", tag: "Empreendedores",
      name: "Inglês para Empreendedores",
      bullets: ["Reuniões, negociações e pitch", "Vocabulário de negócios", "Situações reais do trabalho"],
      price: { grupo: 249, vip: null },
    },
    {
      id: "company", cat: "business", emoji: "🏢", tag: "In Company",
      name: "Seven Bees Business",
      bullets: ["Capacitação da sua equipe", "Atendimento internacional", "Programa sob medida"],
      price: { grupo: null, vip: null },
      quoteOnly: true,
    },
  ],

  units: [
    { name: "Unidade Zona Norte", address: "Av. Alexandre Santoro, 1051 - Jardim dos Estados, Londrina - PR, 86082-000" },
    { name: "Unidade Iate Clube", address: "Av. Higienópolis, 2135 - Higienópolis, Londrina - PR" },
  ],
};

/* ---------- Utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
const store = {
  get(k, fallback) { try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sem storage */ } },
};

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("is-on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("is-on"), 2800);
}

/* ---------- Header / menu ---------- */
const header = $(".header");
addEventListener("scroll", () => header.classList.toggle("is-scrolled", scrollY > 10), { passive: true });

const burger = $("#burger"), nav = $("#nav");
burger.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", open);
});
$$("#nav a").forEach((a) => a.addEventListener("click", () => {
  nav.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
}));

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
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    "Turmas reduzidas: todo mundo fala, todo aula",
    "Turmas por faixa etária e nível de inglês",
    "Você usa o inglês de verdade, com confiança",
  ],
};
const compare = $(".compare"), compareList = $("#compareList");
function renderCompare(mode) {
  compare.classList.toggle("is-trad", mode === "trad");
  $$(".switch__btn").forEach((b) => {
    const on = b.dataset.mode === mode;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-selected", on);
  });
  compareList.innerHTML = compareData[mode]
    .map((t, i) => `<li style="animation-delay:${i * 70}ms"><b>${mode === "trad" ? "✕" : "✓"}</b><span>${t}</span></li>`)
    .join("");
}
$$(".switch__btn").forEach((b) => b.addEventListener("click", () => renderCompare(b.dataset.mode)));
renderCompare("seven");

/* ---------- Loja de cursos ---------- */
const mode = {}; // modalidade selecionada por curso
function priceHTML(c, m) {
  const p = c.price[m];
  if (c.quoteOnly || p == null) {
    return `<div class="price"><div class="price__main" style="font-size:1.4rem">Sob consulta</div></div>`;
  }
  const promo = m === "grupo" ? `<span class="price__promo">🐝 1ª mensalidade por ${brl(CONFIG.promoFirstMonth)}</span>` : "";
  return `<div class="price"><div class="price__main">${brl(p)} <small>/mês</small></div>${promo}</div>`;
}
function renderCourses(filter = "all") {
  const wrap = $("#courses");
  wrap.innerHTML = CONFIG.courses
    .filter((c) => filter === "all" || c.cat.split(" ").includes(filter))
    .map((c, i) => {
      const m = mode[c.id] || "grupo";
      const p = c.price[m];
      const buyable = !c.quoteOnly && p != null;
      const cls = c.cat.split(" ")[0];
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
          <div class="modes" role="group" aria-label="Modalidade">
            <button data-mode="grupo" class="${m === "grupo" ? "is-active" : ""}">Plano Grupo</button>
            <button data-mode="vip" class="${m === "vip" ? "is-active" : ""}">VIP Individual</button>
          </div>`}
          ${priceHTML(c, m)}
          ${buyable
            ? `<button class="btn btn--blue btn--block" data-add>Adicionar ao carrinho</button>`
            : `<a class="btn btn--outline btn--block" target="_blank" rel="noopener" href="${waLink(`Olá! Gostaria de saber valores do curso ${c.name}${c.quoteOnly ? "" : ` (${m === "vip" ? "VIP Individual" : "Plano Grupo"})`}.`)}">Consultar no WhatsApp</a>`}
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
    return;
  }
  if (e.target.closest("[data-add]")) {
    addToCart(id, mode[id] || "grupo", e.target.closest("[data-add]"));
  }
});
$$(".chip").forEach((chip) => chip.addEventListener("click", () => {
  $$(".chip").forEach((c) => c.classList.toggle("is-active", c === chip));
  renderCourses(chip.dataset.filter);
}));
renderCourses();

$("[data-scroll-courses]").addEventListener("click", (e) => {
  e.preventDefault();
  $(".chip[data-filter=all]").click();
  $("#cursos").scrollIntoView();
});

/* ---------- Carrinho ---------- */
let cart = store.get("sb-cart", []);
const cartEl = $("#cart"), overlay = $("#overlay");

function findCourse(id) { return CONFIG.courses.find((c) => c.id === id); }
function cartLines() {
  return cart
    .map((it) => {
      const c = findCourse(it.id);
      if (!c || c.price[it.mode] == null) return null;
      const monthly = c.price[it.mode];
      const first = it.mode === "grupo" ? CONFIG.promoFirstMonth : monthly;
      return { ...it, course: c, monthly, first, label: it.mode === "grupo" ? "Plano Grupo" : "VIP Individual" };
    })
    .filter(Boolean);
}
function cartTotals() {
  const lines = cartLines();
  const monthly = lines.reduce((s, l) => s + l.monthly, 0);
  const first = lines.reduce((s, l) => s + l.first, 0);
  return { lines, monthly, first, discount: monthly - first };
}
function saveCart() { store.set("sb-cart", cart); renderCart(); }

function addToCart(id, m, fromBtn) {
  if (cart.some((it) => it.id === id && it.mode === m)) {
    toast("Esse curso já está no seu carrinho 🐝");
    openCart();
    return;
  }
  cart.push({ id, mode: m });
  saveCart();
  flyBee(fromBtn);
  toast(`${findCourse(id).name} adicionado ao carrinho!`);
}
function removeFromCart(idx) { cart.splice(idx, 1); saveCart(); }

function renderCart() {
  const { lines, monthly, first, discount } = cartTotals();
  $("#cartCount").textContent = lines.length;
  const body = $("#cartItems");
  if (!lines.length) {
    body.innerHTML = `<div class="cart-empty"><div>🐝</div><p><b>Seu carrinho está vazio.</b><br>Escolha um curso e comece sua jornada no inglês!</p><a href="#cursos" class="btn btn--blue" data-close-cart>Ver cursos</a></div>`;
    $("#cartTotals").innerHTML = "";
    $("#checkoutBtn").disabled = true;
    $("#checkoutBtn").style.opacity = .5;
    return;
  }
  $("#checkoutBtn").disabled = false;
  $("#checkoutBtn").style.opacity = 1;
  body.innerHTML = lines.map((l, i) => `
    <div class="cart-item">
      <div class="cart-item__icon">${l.course.emoji}</div>
      <div><h4>${l.course.name}</h4><p>${l.label} · ${brl(l.monthly)}/mês</p></div>
      <div class="cart-item__price">${brl(l.first)}<br><button class="cart-item__remove" data-remove="${i}">Remover</button></div>
    </div>`).join("");
  $("#cartTotals").innerHTML = `
    <div><span>Mensalidade(s)</span><span>${brl(monthly)}</span></div>
    ${discount > 0 ? `<div class="discount"><span>Promo 1ª mensalidade</span><span>− ${brl(discount)}</span></div>` : ""}
    <div class="total"><span>Total hoje</span><span>${brl(first)}</span></div>
    <small>A partir do 2º mês: ${brl(monthly)}/mês</small>`;
}
$("#cartItems").addEventListener("click", (e) => {
  const r = e.target.closest("[data-remove]");
  if (r) removeFromCart(+r.dataset.remove);
  if (e.target.closest("[data-close-cart]")) closeCart();
});

function openCart() {
  cartEl.classList.add("is-open");
  cartEl.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeCart() {
  cartEl.classList.remove("is-open");
  cartEl.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
  document.body.style.overflow = "";
}
$("#cartOpen").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!$("#checkout").hidden) closeCheckout(); else closeCart();
});

function flyBee(fromEl) {
  const btn = $("#cartOpen");
  btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
  if (!fromEl || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const a = fromEl.getBoundingClientRect(), b = btn.getBoundingClientRect();
  const bee = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  bee.setAttribute("viewBox", "0 0 64 64");
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
renderCart();

/* ---------- Checkout ---------- */
const checkout = $("#checkout"), cform = $("#checkoutForm");
let step = 1;

function goStep(n) {
  step = n;
  $$(".step", cform).forEach((s) => s.classList.toggle("is-active", +s.dataset.step === n));
  $$(".steps span").forEach((s, i) => s.classList.toggle("is-active", i < n));
  if (n === 2) renderSummary();
  $(".modal__box").scrollTop = 0;
}
function openCheckout() {
  if (!cartLines().length) return;
  closeCart();
  checkout.hidden = false;
  document.body.style.overflow = "hidden";
  goStep(1);
  setTimeout(() => cform.aluno.focus(), 50);
}
function closeCheckout() {
  checkout.hidden = true;
  document.body.style.overflow = "";
}
$("#checkoutBtn").addEventListener("click", openCheckout);
checkout.addEventListener("click", (e) => {
  if (e.target === checkout || e.target.closest("[data-close]")) closeCheckout();
});

function validate(container) {
  let ok = true;
  $$("input[required], select[required]", container).forEach((f) => {
    let valid = f.type === "checkbox" ? f.checked : f.value.trim() !== "";
    if (valid && f.type === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value);
    if (valid && f.dataset.mask === "phone") valid = f.value.replace(/\D/g, "").length >= 10;
    f.classList.toggle("is-invalid", !valid);
    if (!valid) ok = false;
  });
  return ok;
}
$("[data-next]", cform).addEventListener("click", () => {
  const s1 = $('[data-step="1"]', cform);
  if (validate(s1)) goStep(2);
  else toast("Preencha os campos destacados 🙂");
});
$("[data-prev]", cform).addEventListener("click", () => goStep(1));

function renderSummary() {
  const { lines, monthly, first, discount } = cartTotals();
  $("#checkoutSummary").innerHTML = `
    ${lines.map((l) => `<div><span>${l.course.emoji} ${l.course.name} · ${l.label}</span><span>${brl(l.monthly)}</span></div>`).join("")}
    ${discount > 0 ? `<div style="color:var(--green);font-weight:700"><span>Desconto promocional</span><span>− ${brl(discount)}</span></div>` : ""}
    <div class="total"><span>Total da 1ª mensalidade</span><span>${brl(first)}</span></div>
    <div><small>Depois: ${brl(monthly)}/mês</small></div>`;
}

cform.addEventListener("submit", (e) => {
  e.preventDefault();
  const s2 = $('[data-step="2"]', cform);
  const msg = $(".form__msg", s2);
  if (!validate(s2)) { msg.textContent = "Para continuar, aceite as condições de matrícula."; return; }
  msg.textContent = "";

  const d = Object.fromEntries(new FormData(cform));
  const { lines, monthly, first } = cartTotals();
  const orderId = "SB" + Date.now().toString(36).toUpperCase().slice(-6);
  const text =
`🐝 *Nova matrícula pelo site - Pedido ${orderId}*

*Aluno:* ${d.aluno}${d.responsavel ? `\n*Responsável:* ${d.responsavel}` : ""}
*WhatsApp:* ${d.tel}
*E-mail:* ${d.email}
*Unidade:* ${d.unidade}
*Período:* ${d.periodo}

*Cursos:*
${lines.map((l) => `• ${l.course.name} (${l.label}) — ${brl(l.monthly)}/mês`).join("\n")}

*1ª mensalidade:* ${brl(first)}
*Demais meses:* ${brl(monthly)}/mês
*Pagamento:* ${d.pagamento}`;

  const url = waLink(text);
  const orders = store.get("sb-orders", []);
  orders.push({ orderId, date: new Date().toISOString(), ...d, cart: lines.map((l) => ({ id: l.id, mode: l.mode })) });
  store.set("sb-orders", orders);

  window.open(url, "_blank", "noopener");
  $("#orderId").textContent = orderId;
  $("#orderWa").href = url;
  goStep(3);
  cart = [];
  saveCart();
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
$("#trialForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.currentTarget, msg = $(".form__msg", f);
  if (!validate(f)) { msg.className = "form__msg"; msg.textContent = "Preencha os campos destacados."; return; }
  const d = Object.fromEntries(new FormData(f));
  const text =
`Olá, Seven Bees! 🐝 Quero agendar uma *aula demonstrativa gratuita*.

*Nome:* ${d.nome}
*WhatsApp:* ${d.tel}
*Para:* ${d.publico}
*Período:* ${d.periodo}
*Unidade:* ${d.unidade}`;
  window.open(waLink(text), "_blank", "noopener");
  msg.className = "form__msg is-ok";
  msg.textContent = "Perfeito! Abrimos o WhatsApp para confirmar seu horário. 🐝";
  f.reset();
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

function quizStart() {
  quiz.audience = null; quiz.i = 0; quiz.score = 0;
  quizBar.style.width = "0%";
  quizBody.innerHTML = `
    <div class="quiz__step">
      <span class="quiz__count">Antes de começar</span>
      <h3 class="quiz__q">Para quem é o curso?</h3>
      <div class="quiz__opts quiz__opts--grid">
        ${audiences.map((a, i) => `<button class="opt" data-aud="${a.key}"><span class="opt__key">${keys[i]}</span>${a.label}</button>`).join("")}
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
        ${q.opts.map((o, i) => `<button class="opt" data-opt="${i}"><span class="opt__key">${keys[i]}</span>${o}</button>`).join("")}
      </div>
      <p class="quiz__feedback" aria-live="polite"></p>
    </div>`;
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
  } else {
    const lvl = [...levels].reverse().find((l) => quiz.score >= l.min);
    badge = `${quiz.score}/${quizQuestions.length}<small>acertos</small>`;
    title = `Nível ${lvl.pt} <span class="script" style="color:var(--blue)">${lvl.name}</span>`;
    text = `${lvl.text} Curso recomendado: <b>${course.name}</b>.`;
  }
  quizBody.innerHTML = `
    <div class="quiz__result">
      <div class="quiz__badge">${quiz.audience === "kids" ? badge : `<div>${badge}</div>`}</div>
      <h3>${title}</h3>
      <p>${text}</p>
      <div class="quiz__actions">
        <button class="btn btn--blue btn--lg" data-quiz-add="${course.id}">Matricular no ${course.name}</button>
        <a href="#aula-gratis" class="btn btn--yellow btn--lg">Agendar aula grátis</a>
      </div>
      <p style="margin-top:16px"><button class="chip" data-quiz-restart>↺ Refazer o teste</button></p>
    </div>`;
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
    if (chosen === q.a) { quiz.score++; fb.textContent = ["Great job! 🎉", "Correct! 🐝", "Well done! ✨", "Nice! 👏"][quiz.i % 4]; fb.style.color = "var(--green)"; }
    else { opt.classList.add("is-wrong"); fb.textContent = "Quase! A resposta certa está em verde."; fb.style.color = "#E5484D"; }
    setTimeout(() => { quiz.i++; quiz.i < quizQuestions.length ? quizQuestion() : quizResult(); }, 1100);
    return;
  }
  const add = e.target.closest("[data-quiz-add]");
  if (add) {
    addToCart(add.dataset.quizAdd, "grupo", add);
    const card = $(`.course[data-id="${add.dataset.quizAdd}"]`);
    if (card) { card.classList.add("is-highlight"); setTimeout(() => card.classList.remove("is-highlight"), 3000); }
    return;
  }
  if (e.target.closest("[data-quiz-restart]")) quizStart();
});
quizStart();

/* ---------- Unidades ---------- */
function showUnit(i) {
  const u = CONFIG.units[i];
  $$(".unit-tab").forEach((t, k) => { t.classList.toggle("is-active", k === i); t.setAttribute("aria-selected", k === i); });
  $("#unitMap").src = `https://maps.google.com/maps?q=${encodeURIComponent(u.address)}&z=16&output=embed`;
  $("#unitMap").title = `Mapa - ${u.name}`;
  $("#unitRoute").href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(u.address)}`;
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
  <button class="flip reveal" aria-label="Virar card: ${f.front.replace(/[“”"]/g, "")}">
    <div class="flip__inner">
      <div class="flip__face flip__front">
        <small>${f.tag}</small>
        <h3>${f.front}</h3>
        <span class="flip__hint">Toque para descobrir ↻</span>
      </div>
      <div class="flip__face flip__back">
        <strong>${f.back}</strong>
        <p>${f.more}</p>
      </div>
    </div>
  </button>`).join("");
$$(".flip").forEach((f) => { io.observe(f); f.addEventListener("click", () => f.classList.toggle("is-flipped")); });

/* ---------- Calculadora "Quanto custa não falar inglês?" ---------- */
const ops = $("#calcOps"), val = $("#calcVal");
function calc() {
  $("#calcOpsOut").textContent = ops.value;
  $("#calcValOut").textContent = brl(+val.value).replace(",00", "");
  $("#calcResult").textContent = brl(ops.value * val.value * 12).replace(",00", "");
}
ops.addEventListener("input", calc);
val.addEventListener("input", calc);
calc();
