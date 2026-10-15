/* =========================================================
   EDIT THIS SECTION ONLY
   ========================================================= */
const CONFIG = {
  name: "Haripriya",
  from: "your brother",              // used on the button: "Message your brother on WhatsApp"
  whatsapp: "13138885733",           // your number: digits only, with country code, no + or spaces
  code: "HARI-BDAY-2026",
  expiry: "October 16, 2027",
  maxValue: "$100 each",
  photos: [                          // delete a line to remove a photo, or use [] to hide all
    { src: "images/then.jpg", caption: "Your 1st birthday 🎂" },
    { src: "images/now.jpg",  caption: "Now ✨" }
  ],
  message: "Happy Birthday, Haripriya! 🎉 Issued by your younger brother, this voucher book is good for the real-life support you can call on any time. Open a voucher, tap Redeem, and I'll get your message.",
  vouchers: [
    {
      emoji: "🛡️",
      title: "The Family Debate Wildcard",
      subtitle: "Unconditional Verbal Back-Up",
      value: "1 Total & Undivided Loyalty Pass",
      desc: "Redeemable during any family gathering, group chat, or phone call. Presenting this voucher obligates me to immediately agree with your stance, validate your point, and provide supportive evidence against any opposition, regardless of personal opinion, logic, or basic facts.",
      fine: "Valid against all family members. No questions asked. Instant activation."
    },
    {
      emoji: "💻",
      title: "Remote Tech & Logistics Support",
      subtitle: "Emergency Remote Heavy Lifting",
      value: "1 Problem-Solving Intervention",
      desc: "Redeemable for any task requiring online research, booking coordination, tech troubleshooting, or organizing something frustrating from afar so you don't have to deal with it.",
      fine: "Includes 1 full hour of active problem-solving without heavy sighing."
    },
    {
      emoji: "🍕",
      title: "The \"I'll Order It For You\" Pass",
      subtitle: "Emergency Comfort Food Delivery",
      value: "1 DoorDash / UberEats Rescue Mission (up to $100)",
      desc: "Redeemable on a rough day. Text me your order (or just your craving), and a full meal or dessert will show up at your doorstep in your city, courtesy of your brother.",
      fine: "No occasion required. Includes delivery tip. Order total up to $100."
    },
    {
      emoji: "📞",
      title: "The Escape Hatch",
      subtitle: "The Fake Emergency Call",
      value: "1 Timed Exit Strategy",
      desc: "Send a pre-arranged code word via text, and I will immediately call you with a plausible, urgent reason why you need to step away or leave an awkward social situation.",
      fine: "Available 24/7. Script can be customized upon request."
    },
    {
      emoji: "🍽️",
      title: "Dinner of Your Choice",
      subtitle: "Birthday Treat",
      value: "1 Dinner (up to $100)",
      desc: "Pick any restaurant you like, and dinner is on me.",
      fine: "Total up to $100. Dessert is always included."
    },
    {
      emoji: "🛍️",
      title: "Shopping Treat",
      subtitle: "Pick Something You Love",
      value: "1 Gift (up to $100)",
      desc: "Choose something you've had your eye on, and I'll get it for you.",
      fine: "Total up to $100. No questions about whether you need it."
    }
  ],
  terms: [
    "Each voucher can be redeemed once.",
    "Gift value is capped at $100 per voucher.",
    "Zero refunds. No exchange for cash.",
    "Extension available on request, with a smile."
  ]
};
/* ========================================================= */

const $ = id => document.getElementById(id);
const STORE_KEY = "voucher-book-" + CONFIG.code;

/* Safe localStorage helpers (can fail in private mode) */
function load() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; } }
function save(data) { try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) {} }
let redeemed = load();   // { "0": "Thu Oct 16 2026", ... }

/* Fill in text */
document.title = "A Birthday Gift for " + CONFIG.name;
$("coverTitle").textContent = "A gift for " + CONFIG.name + " 🎂";
$("vName").textContent = CONFIG.name;
$("vMessage").textContent = CONFIG.message;
$("vCode").textContent = CONFIG.code;
$("vExpiry").textContent = CONFIG.expiry;
$("vMax").textContent = CONFIG.maxValue;
/* Photos: each one only appears if its file actually loads */
(CONFIG.photos || []).forEach(p => {
  const img = new Image();
  img.alt = p.caption || CONFIG.name;
  img.onload = () => {
    const fig = document.createElement("figure");
    fig.className = "polaroid";
    fig.appendChild(img);
    if (p.caption) {
      const cap = document.createElement("figcaption");
      cap.textContent = p.caption;
      fig.appendChild(cap);
    }
    $("vPhotos").appendChild(fig);
    $("vPhotos").classList.remove("hidden");
  };
  img.src = p.src;
});
CONFIG.terms.forEach(t => { const li = document.createElement("li"); li.textContent = t; $("terms").appendChild(li); });

/* Build the voucher list */
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function whatsappLink(i) {
  const v = CONFIG.vouchers[i];
  const text = "Hi! 🎉 I'd like to redeem voucher #" + (i + 1) + " (" + v.title + ") from my birthday voucher book " + CONFIG.code + ". When can we do this?";
  return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(text);
}

function renderVoucher(v, i) {
  const item = el("article", "v-item");
  const done = Object.prototype.hasOwnProperty.call(redeemed, i);
  if (done) item.classList.add("done");

  const head = el("button", "v-head");
  head.type = "button";
  head.setAttribute("aria-expanded", "false");
  head.appendChild(el("span", "v-emoji", v.emoji));
  const titles = el("span", "v-titles");
  titles.appendChild(el("span", "v-num", "Voucher #" + (i + 1)));
  titles.appendChild(el("strong", "v-title", v.title));
  titles.appendChild(el("span", "v-value", v.value));
  head.appendChild(titles);
  if (done) head.appendChild(el("span", "badge", "REDEEMED ✓"));
  head.appendChild(el("span", "v-chev", "⌄"));

  const body = el("div", "v-body hidden");
  body.appendChild(el("p", "v-sub", v.subtitle));
  body.appendChild(el("p", "v-desc", v.desc));
  body.appendChild(el("p", "v-fine", v.fine));

  const btn = el("button", "redeem", done ? "Message " + CONFIG.from + " on WhatsApp 💬" : "Redeem this voucher 🎁");
  btn.type = "button";
  if (done) btn.classList.add("again");
  const status = el("p", "v-status", done ? "Redeemed on " + redeemed[i] + ". Tap above if the chat didn't open." : "");

  btn.addEventListener("click", () => {
    if (!Object.prototype.hasOwnProperty.call(redeemed, i)) {
      redeemed[i] = new Date().toDateString();
      save(redeemed);
      confetti();
    }
    window.location.href = whatsappLink(i);
    // refresh the card so the stamp shows
    setTimeout(render, 150);
  });

  body.appendChild(btn);
  body.appendChild(status);

  head.addEventListener("click", () => {
    const open = item.classList.toggle("open");
    body.classList.toggle("hidden", !open);
    head.setAttribute("aria-expanded", open ? "true" : "false");
  });

  item.appendChild(head);
  item.appendChild(body);
  return item;
}

function render() {
  // remember which voucher was open so a re-render doesn't collapse it
  const openIdx = Array.from(document.querySelectorAll(".v-item")).findIndex(x => x.classList.contains("open"));
  const wrap = $("vouchers");
  wrap.innerHTML = "";
  CONFIG.vouchers.forEach((v, i) => {
    const node = renderVoucher(v, i);
    wrap.appendChild(node);
    if (i === openIdx) node.querySelector(".v-head").click();
  });
}
render();

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

/* Skip the cover if she has already redeemed something */
if (Object.keys(redeemed).length) {
  $("cover").classList.add("hidden");
  $("voucher").classList.remove("hidden");
}

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
