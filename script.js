/* =========================================================
   EDIT THIS SECTION ONLY
   ========================================================= */
const CONFIG = {
  name: "Haripriya",
  from: "Your Name",                 // how she knows you, e.g. "Anna" / "Your brother"
  whatsapp: "1XXXXXXXXXX",           // your number: digits only, with country code, no + or spaces
  code: "HARI-BDAY-2026",
  expiry: "October 16, 2027",
  photo: "images/haripriya.jpg",     // leave "" to hide the photo
  message: "Happy Birthday, Haripriya! 🎉 Here is a little something to make your day (and the year ahead) special. Choose one gift below and redeem it whenever you like.",
  gifts: [
    { emoji: "🍽️", title: "Dinner of your choice",   desc: "Any restaurant, my treat" },
    { emoji: "🛍️", title: "Shopping trip",           desc: "A day out, with a surprise budget" },
    { emoji: "✨", title: "One wish, no questions",  desc: "Within reason, but I'll try!" }
  ],
  terms: [
    "Valid for one gift only.",
    "Cannot be exchanged for cash.",
    "Can be redeemed on any day I'm free (I'll make myself free).",
    "Extension available on request, with a smile."
  ]
};
/* ========================================================= */

const $ = id => document.getElementById(id);
const STORE_KEY = "voucher-" + CONFIG.code;
let selected = null;

/* Safe localStorage helpers (can fail in private mode) */
function load() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; } }
function save(data) { try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) {} }

/* Fill in text */
document.title = "A Birthday Gift for " + CONFIG.name;
$("coverTitle").textContent = "A gift for " + CONFIG.name + " 🎂";
$("vName").textContent = CONFIG.name;
$("vMessage").textContent = CONFIG.message;
$("vCode").textContent = CONFIG.code;
$("vExpiry").textContent = CONFIG.expiry;
if (CONFIG.photo) {
  const img = $("vPhoto");
  img.onload = () => img.classList.remove("hidden");
  img.src = CONFIG.photo;            // if the file is missing, it just stays hidden
}
CONFIG.terms.forEach(t => { const li = document.createElement("li"); li.textContent = t; $("terms").appendChild(li); });

/* Gift options */
CONFIG.gifts.forEach((g, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "gift-opt";
  b.innerHTML = '<span class="emoji"></span><span><strong></strong><small></small></span>';
  b.querySelector(".emoji").textContent = g.emoji;
  b.querySelector("strong").textContent = g.title;
  b.querySelector("small").textContent = g.desc;
  b.addEventListener("click", () => chooseGift(i));
  $("gifts").appendChild(b);
});

function chooseGift(i) {
  const state = load();
  if (state.redeemed) return;        // locked once redeemed
  selected = i;
  document.querySelectorAll(".gift-opt").forEach((el, idx) => el.classList.toggle("selected", idx === i));
  $("redeemBtn").disabled = false;
  $("redeemBtn").textContent = "Redeem: " + CONFIG.gifts[i].title + " 🎁";
  $("status").textContent = "";
}

/* Unwrap */
function unwrap() {
  $("giftBox").classList.add("open");
  setTimeout(() => {
    $("cover").classList.add("hidden");
    $("voucher").classList.remove("hidden");
    confetti();
  }, 450);
}
$("giftBox").addEventListener("click", unwrap);
$("giftBox").addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); unwrap(); } });

/* Redeem */
function whatsappLink(giftTitle) {
  const text = "Hi! 🎉 I'd like to redeem my birthday voucher " + CONFIG.code + ": " + giftTitle + ". When are you free?";
  return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(text);
}

$("redeemBtn").addEventListener("click", () => {
  const state = load();
  const idx = state.redeemed ? state.giftIndex : selected;
  if (idx === null || idx === undefined) return;
  const gift = CONFIG.gifts[idx];

  if (!state.redeemed) {
    save({ redeemed: true, giftIndex: idx, date: new Date().toDateString() });
    showRedeemed(idx, new Date().toDateString());
    confetti();
  }
  window.location.href = whatsappLink(gift.title);
});

function showRedeemed(idx, date) {
  document.querySelectorAll(".gift-opt").forEach((el, i) => {
    el.classList.toggle("selected", i === idx);
    el.disabled = true;
    el.style.opacity = i === idx ? "1" : ".45";
  });
  $("stamp").classList.remove("hidden");
  $("redeemBtn").disabled = false;
  $("redeemBtn").textContent = "Message " + CONFIG.from + " on WhatsApp 💬";
  $("status").textContent = "Redeemed on " + date + ". Tap above if the chat didn't open.";
}

/* Restore state on reload */
(function init() {
  const state = load();
  if (state.redeemed) {
    $("cover").classList.add("hidden");
    $("voucher").classList.remove("hidden");
    showRedeemed(state.giftIndex, state.date);
  }
})();

/* Confetti (no libraries) */
function confetti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = $("confetti"), ctx = c.getContext("2d");
  c.width = innerWidth; c.height = innerHeight;
  const colors = ["#e0457b", "#ffb703", "#8ecae6", "#9b5de5", "#52b788", "#ff6b6b"];
  const parts = Array.from({ length: 150 }, () => ({
    x: Math.random() * c.width,
    y: -20 - Math.random() * c.height * 0.6,
    w: 6 + Math.random() * 6,
    h: 8 + Math.random() * 8,
    vx: -2 + Math.random() * 4,
    vy: 2 + Math.random() * 4,
    rot: Math.random() * Math.PI,
    vr: -0.2 + Math.random() * 0.4,
    col: colors[Math.floor(Math.random() * colors.length)]
  }));
  let frames = 0;
  (function tick() {
    ctx.clearRect(0, 0, c.width, c.height);
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.col;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (++frames < 240) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, c.width, c.height);
  })();
}
