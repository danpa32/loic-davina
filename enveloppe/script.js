/* ============ À PERSONNALISER ============ */
const WEDDING = {
  date: "2027-06-12T14:00:00",       // date et heure de la cérémonie
  place: "",                        // lieu (vide = masqué), ex. "Aubonne, Suisse"
  photo: "photo.jpeg"
};
/* ========================================= */

const when = new Date(WEDDING.date);
const fmt = new Intl.DateTimeFormat("fr-CH", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
// « samedi 12 juin 2027 » sans la virgule, pour suivre « se diront OUI le »
document.getElementById("dateText").textContent = fmt.format(when).replace(",", "");
const placeText = document.getElementById("placeText");
if (WEDDING.place) placeText.textContent = WEDDING.place;
else placeText.remove();

// aperçu photo dans la mini-carte
const probe = new Image();
probe.onload = () => document.getElementById("miniPhoto").style.backgroundImage = `url("${WEDDING.photo}")`;
probe.src = WEDDING.photo;

/* ---------- Bouquets en SVG (hortensias, callas, amarante) ---------- */
function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }

function bouquet(seed) {
  const r = rng(seed * 9973 + 7);
  let delay = 1.2;
  const g = (inner, d = 0.08) => `<g class="grow" style="animation-delay:${(delay += d).toFixed(2)}s">${inner}</g>`;
  let out = "";

  // amarante retombante
  for (let i = 0; i < 4; i++) {
    const x0 = 92 + i * 6, y0 = 128;
    const x1 = 58 + i * 14 + r() * 10, y1 = 220 + r() * 40;
    const cx = x0 - 30 + r() * 20, cy = y0 + 40;
    let beads = "";
    for (let t = 0.15; t <= 1; t += 0.045) {
      const x = (1-t)*(1-t)*x0 + 2*(1-t)*t*cx + t*t*x1;
      const y = (1-t)*(1-t)*y0 + 2*(1-t)*t*cy + t*t*y1;
      const s = 2.6 - t * 1.2;
      beads += `<ellipse cx="${(x + (r()-.5)*3).toFixed(1)}" cy="${y.toFixed(1)}" rx="${s}" ry="${s*1.3}" fill="${r() > .5 ? '#8a9a52' : '#a2b06a'}"/>`;
    }
    out += g(`<path d="M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}" stroke="#6f7f3c" stroke-width="1.2" fill="none"/>${beads}`);
  }

  // callas
  const callas = [[40, 18, -32], [62, 6, -18], [28, 44, -48]];
  for (const [x, y, a] of callas) {
    out += g(`
      <path d="M108 120 Q${x + 30} ${y + 60} ${x + 8} ${y + 24}" stroke="#6d8a3a" stroke-width="2.2" fill="none"/>
      <g transform="translate(${x} ${y}) rotate(${a})">
        <path d="M0 0 C 10 -14 26 -16 30 -10 C 24 -6 18 2 14 16 C 9 12 3 7 0 0Z" fill="#fbfaf5" stroke="#d9d7cc" stroke-width=".6"/>
        <path d="M14 16 C 12 8 13 2 17 -3" stroke="#e8c96a" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M14 16 L 12 22" stroke="#6d8a3a" stroke-width="2.4"/>
      </g>`, 0.15);
  }

  // feuilles
  for (let i = 0; i < 4; i++) {
    const a = -70 + i * 45 + r() * 20;
    out += g(`<ellipse cx="0" cy="-22" rx="8" ry="24" fill="${i % 2 ? '#7b9150' : '#93a865'}" transform="translate(${104 + (r()-.5)*20} ${122}) rotate(${a})"/>`);
  }

  // hortensias : deux grappes de fleurettes
  const clusters = [[104, 100, 34, 46], [132, 124, 26, 30]];
  for (const [cx, cy, rad, n] of clusters) {
    let flor = "";
    for (let i = 0; i < n; i++) {
      const ang = r() * Math.PI * 2, d = Math.sqrt(r()) * rad;
      const x = cx + Math.cos(ang) * d, y = cy + Math.sin(ang) * d * .85;
      const shade = y > cy + rad * .3 ? "#e7e4d2" : (r() > .7 ? "#f1efe0" : "#fbfaf2");
      const rot = r() * 90, s = 4.4 + r() * 1.6;
      flor += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(0)})">
        ${[0, 90, 180, 270].map(p => `<ellipse cx="0" cy="${-s * .62}" rx="${s * .55}" ry="${s * .7}" fill="${shade}" stroke="#d6d3be" stroke-width=".35" transform="rotate(${p})"/>`).join("")}
        <circle r="${s * .22}" fill="#cfd3a6"/></g>`;
    }
    out += g(`<circle cx="${cx}" cy="${cy}" r="${rad + 4}" fill="#e3e1cf" opacity=".55"/>${flor}`, 0.2);
  }

  return `<svg viewBox="0 0 200 270" aria-hidden="true"><g class="sway" style="animation-delay:-${(r()*6).toFixed(1)}s">${out}</g></svg>`;
}
document.querySelectorAll("[data-bouquet]").forEach(el => el.innerHTML = bouquet(+el.dataset.bouquet));

/* ---------- Ouverture ---------- */
const body = document.body, stage = document.getElementById("stage"), wrap = document.getElementById("wrap");
let opened = false;

function petals() {
  for (let i = 0; i < 28; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    p.style.left = Math.random() * 100 + "vw";
    p.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");
    p.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
    p.style.animationDuration = 3.5 + Math.random() * 3 + "s";
    p.style.animationDelay = Math.random() * 1.5 + "s";
    document.body.appendChild(p);
    p.addEventListener("animationend", () => p.remove());
  }
}

function openEnvelope() {
  if (opened) return;
  opened = true;
  stage.classList.add("opening");
  setTimeout(() => wrap.classList.add("opened-flap"), 450);
  setTimeout(() => wrap.classList.add("card-out"), 1400);
  setTimeout(() => {
    stage.classList.add("gone");
    body.classList.add("opened");
    petals();
    requestAnimationFrame(() => requestAnimationFrame(() => body.classList.add("shown")));
  }, 2700);
  setTimeout(() => stage.remove(), 3700);
}
document.getElementById("envelope").addEventListener("click", openEnvelope);
document.getElementById("cta").addEventListener("click", openEnvelope);

/* ---------- Compte à rebours ---------- */
const cells = {};
document.querySelectorAll("#countdown b").forEach(b => cells[b.dataset.k] = b);
function tick() {
  let s = Math.max(0, Math.floor((when - Date.now()) / 1000));
  const d = Math.floor(s / 86400); s -= d * 86400;
  const h = Math.floor(s / 3600);  s -= h * 3600;
  const m = Math.floor(s / 60);    s -= m * 60;
  cells.d.textContent = d;
  cells.h.textContent = String(h).padStart(2, "0");
  cells.m.textContent = String(m).padStart(2, "0");
  cells.s.textContent = String(s).padStart(2, "0");
}
tick(); setInterval(tick, 1000);

/* ---------- Ajouter au calendrier (.ics) ---------- */
document.getElementById("calBtn").addEventListener("click", () => {
  const pad = n => String(n).padStart(2, "0");
  const day = `${when.getFullYear()}${pad(when.getMonth() + 1)}${pad(when.getDate())}`;
  const next = new Date(when); next.setDate(next.getDate() + 1);
  const end = `${next.getFullYear()}${pad(next.getMonth() + 1)}${pad(next.getDate())}`;
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Loic-Davina//Save the date//FR",
    "BEGIN:VEVENT", `UID:loic-davina-${day}`, `DTSTART;VALUE=DATE:${day}`, `DTEND;VALUE=DATE:${end}`,
    "SUMMARY:Mariage de Loïc & Davina", ...(WEDDING.place ? [`LOCATION:${WEDDING.place}`] : []), "END:VEVENT", "END:VCALENDAR"
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = "mariage-loic-davina.ics";
  a.click();
});
