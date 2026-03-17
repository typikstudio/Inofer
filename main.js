/* ═══════════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════════ */
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');

if (cur && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.style.width  = '5px';
      cur.style.height = '5px';
      ring.style.width   = '52px';
      ring.style.height  = '52px';
      ring.style.opacity = '.85';
    });
    el.addEventListener('mouseleave', () => {
      cur.style.width  = '11px';
      cur.style.height = '11px';
      ring.style.width   = '34px';
      ring.style.height  = '34px';
      ring.style.opacity = '.45';
    });
  });
}

/* ═══════════════════════════════════════════════
   PARTICLE BACKGROUND
═══════════════════════════════════════════════ */
const bgC = document.getElementById('bg-canvas');
const bgX = bgC.getContext('2d');

function resizeBg() {
  bgC.width  = window.innerWidth;
  bgC.height = window.innerHeight;
}
resizeBg();
window.addEventListener('resize', resizeBg);

const pts = Array.from({ length: 90 }, () => ({
  x:  Math.random() * window.innerWidth,
  y:  Math.random() * window.innerHeight,
  vx: (Math.random() - .5) * .25,
  vy: (Math.random() - .5) * .25,
  r:  Math.random() * 1.3 + .3,
  a:  Math.random() * .65 + .1,
}));

(function animBg() {
  bgC.width = bgC.width; // clear

  // grid lines
  bgX.strokeStyle = 'rgba(245,168,0,.032)';
  bgX.lineWidth   = 1;
  for (let x = 0; x < bgC.width;  x += 64) { bgX.beginPath(); bgX.moveTo(x, 0); bgX.lineTo(x, bgC.height); bgX.stroke(); }
  for (let y = 0; y < bgC.height; y += 64) { bgX.beginPath(); bgX.moveTo(0, y); bgX.lineTo(bgC.width, y);  bgX.stroke(); }

  // particles
  pts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0)           p.x = bgC.width;
    if (p.x > bgC.width)   p.x = 0;
    if (p.y < 0)           p.y = bgC.height;
    if (p.y > bgC.height)  p.y = 0;
    bgX.beginPath();
    bgX.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    bgX.fillStyle = `rgba(245,168,0,${p.a})`;
    bgX.fill();
  });

  // connections
  pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (d < 105) {
      bgX.beginPath();
      bgX.moveTo(a.x, a.y);
      bgX.lineTo(b.x, b.y);
      bgX.strokeStyle = `rgba(245,168,0,${(1 - d / 105) * .05})`;
      bgX.lineWidth   = 1;
      bgX.stroke();
    }
  }));

  requestAnimationFrame(animBg);
})();

/* ═══════════════════════════════════════════════
   ANIMATED GEAR
═══════════════════════════════════════════════ */
const gc = document.getElementById('gear-canvas');
const gx = gc.getContext('2d');

let gAngle  = 0;
let gSpeed  = .007;
let gTarget = .007;

function drawGear(a) {
  const W = gc.width, H = gc.height, cx = W / 2, cy = H / 2;
  gx.clearRect(0, 0, W, H);
  gx.save();
  gx.translate(cx, cy);
  gx.rotate(a);

const teeth = 10;   // moins de dents → plus massif
const oR = 110;     // rayon extérieur un peu plus grand
const iR = 90;      // creux de dent plus profond
const bR = 80;      // base légèrement ajustée
const hR = 22;      // centre un peu plus gros
  const step  = Math.PI * 2 / teeth;

  /* -- ambient glow ring -- */
  const ag = gx.createRadialGradient(0, 0, iR * .4, 0, 0, oR * 1.2);
  ag.addColorStop(0,   'rgba(245,168,0,0)');
  ag.addColorStop(.75, 'rgba(245,168,0,.03)');
  ag.addColorStop(1,   'rgba(245,168,0,.13)');
  gx.beginPath();
  gx.arc(0, 0, oR * 1.2, 0, Math.PI * 2);
  gx.fillStyle = ag;
  gx.fill();

  /* -- gear teeth body -- */
  gx.beginPath();
  for (let i = 0; i < teeth; i++) {
    const a0 = step * i - step / 2;
    const a1 = step * i - step * .20;
    const a2 = step * i + step * .20;
    const a3 = step * i + step / 2;
    gx.arc(0, 0, bR, a0, a0);
    gx.lineTo(Math.cos(a1) * iR, Math.sin(a1) * iR);
    gx.lineTo(Math.cos(a1) * oR, Math.sin(a1) * oR);
    gx.arc(0, 0, oR, a1, a2);
    gx.lineTo(Math.cos(a2) * iR, Math.sin(a2) * iR);
    gx.lineTo(Math.cos(a3) * bR, Math.sin(a3) * bR);
    gx.arc(0, 0, bR, a3, a3 + step / 30);
  }
  gx.closePath();

  const fg = gx.createRadialGradient(-14, -14, 4, 0, 0, oR);
  fg.addColorStop(0,  '#3e3e3e');
  fg.addColorStop(.5, '#222');
  fg.addColorStop(1,  '#121212');
  gx.fillStyle   = fg;
  gx.fill();
  gx.strokeStyle = '#F5A800';
  gx.lineWidth   = 2;
  gx.shadowColor = '#F5A800';
  gx.shadowBlur  = 11;
  gx.stroke();
  gx.shadowBlur  = 0;

  /* -- inner ring decoration -- */
  gx.beginPath();
  gx.arc(0, 0, iR - 5, 0, Math.PI * 2);
  gx.strokeStyle = 'rgba(245,168,0,.16)';
  gx.lineWidth   = 1;
  gx.stroke();

  /* -- 8 spokes -- */
  for (let i = 0; i < 8; i++) {
    gx.save();
    gx.rotate(Math.PI * 2 / 8 * i);
    gx.beginPath();
    gx.moveTo(0, hR + 5);
    gx.lineTo(0, bR - 7);
    gx.strokeStyle = 'rgba(170,170,170,.25)';
    gx.lineWidth   = 4;
    gx.lineCap     = 'round';
    gx.stroke();
    gx.restore();
  }

  /* -- bolt holes -- */
  for (let i = 0; i < 8; i++) {
    const bA = Math.PI * 2 / 8 * i + Math.PI / 8;
    const br = 56;
    gx.beginPath();
    gx.arc(Math.cos(bA) * br, Math.sin(bA) * br, 3.5, 0, Math.PI * 2);
    gx.fillStyle   = '#0c0c0c';
    gx.fill();
    gx.strokeStyle = 'rgba(245,168,0,.32)';
    gx.lineWidth   = .9;
    gx.stroke();
  }

  /* -- mid ring -- */
  gx.beginPath();
  gx.arc(0, 0, hR + 12, 0, Math.PI * 2);
  gx.strokeStyle = 'rgba(245,168,0,.42)';
  gx.lineWidth   = 1.2;
  gx.stroke();

  /* -- hub -- */
  const hg = gx.createRadialGradient(-4, -4, 2, 0, 0, hR);
  hg.addColorStop(0, '#484848');
  hg.addColorStop(1, '#131313');
  gx.beginPath();
  gx.arc(0, 0, hR, 0, Math.PI * 2);
  gx.fillStyle   = hg;
  gx.fill();
  gx.strokeStyle = '#F5A800';
  gx.lineWidth   = 2;
  gx.shadowColor = '#F5A800';
  gx.shadowBlur  = 9;
  gx.stroke();
  gx.shadowBlur  = 0;

  /* -- center hole -- */
  gx.beginPath();
  gx.arc(0, 0, 8, 0, Math.PI * 2);
  gx.fillStyle   = '#080A0C';
  gx.fill();
  gx.strokeStyle = 'rgba(245,168,0,.65)';
  gx.lineWidth   = 1.4;
  gx.stroke();

  gx.restore();
}

(function animGear() {
  gSpeed  += (gTarget - gSpeed) * .04;
  gAngle  += gSpeed;
  drawGear(gAngle);
  requestAnimationFrame(animGear);
})();

/* ═══════════════════════════════════════════════
   NODE HOVER — speed up gear + highlight lines
═══════════════════════════════════════════════ */
document.querySelectorAll('.node').forEach(n => {
  const lid  = n.getAttribute('data-line');
  const line = document.getElementById(lid);

  n.addEventListener('mouseenter', () => {
    gTarget = .042;
    if (line) {
      line.setAttribute('stroke',       'rgba(245,168,0,.95)');
      line.setAttribute('stroke-width', '1.8');
      line.setAttribute('filter',       'url(#lglow)');
    }
  });

  n.addEventListener('mouseleave', () => {
    gTarget = .007;
    if (line) {
      line.setAttribute('stroke',       'rgba(245,168,0,.22)');
      line.setAttribute('stroke-width', '1');
      line.removeAttribute('filter');
    }
  });
});

/* -- animated dash travel on connector lines -- */
let doff = 0;
setInterval(() => {
  doff -= 1;
  document.querySelectorAll('#node-svg line').forEach(l => {
    l.style.strokeDashoffset = doff;
  });
}, 38);

/* ═══════════════════════════════════════════════
   RESIZE GEAR CANVAS to match stage size
═══════════════════════════════════════════════ */
function resizeGear() {
  const stage = document.getElementById('gear-stage');
  const sz    = Math.min(stage.offsetWidth, stage.offsetHeight);
  const scale = sz / 560;
  gc.style.width  = (240 * scale) + 'px';
  gc.style.height = (240 * scale) + 'px';
}
resizeGear();
window.addEventListener('resize', resizeGear);
