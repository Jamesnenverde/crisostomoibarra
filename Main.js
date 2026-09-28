const $ = s => document.querySelector(s);
const root = document.documentElement;

/* ---------- Data ---------- */
// Each colour: car image + two colours that are mixed into the background
const COLORS = [
  { name: 'SILVER & BLUE', img: 'Images/GTR-removebg-preview.png', c1: '#9aa3b5', c2: '#1e56d6', dot: '#aab2c2' },
  { name: 'PINK',          img: 'Images/GTRpink-removebg-preview.png',   c1: '#ff5fae', c2: '#7b1c66', dot: '#ff5fae' },
  { name: 'GREEN',         img: 'Images/GTRgreen-removebg-preview.png',  c1: '#2fd45a', c2: '#0a4d2c', dot: '#2fd45a' },
  { name: 'GOLD',          img: 'Images/GTRgold-removebg-preview.png',   c1: '#e2b445', c2: '#3a2a0c', dot: '#e2b445' },
  { name: 'BLACK',         img: 'Images/GTRblack-removebg-preview.png',  c1: '#4a4f60', c2: '#c8cede', dot: '#222' },
  { name: 'RED',           img: 'Images/GTRred-removebg-preview.png',    c1: '#e3243f', c2: '#2a4fb5', dot: '#e3243f' },
];
const VIEWS = [
  { name: '3/4 FRONT VIEW', img: 'Images/GTR-removebg-preview.png' },
  { name: 'SIDE VIEW',      img: 'Images/GTRposition1-removebg-preview.png' },
  { name: 'FRONT VIEW',     img: 'Images/GTRposition2-removebg-preview.png' },
  { name: 'REAR 3/4 VIEW',  img: 'Images/GTRposition3-removebg-preview.png' },
];
[...COLORS, ...VIEWS].forEach(o => { new Image().src = o.img; }); // preload

/* ---------- Theme (background colours) ---------- */
let chosen = COLORS[0];
const setTheme = c => { root.style.setProperty('--c1', c.c1); root.style.setProperty('--c2', c.c2); };

// Swap an <img> with a small fade animation
function swapImg(img, src) {
  img.classList.add('swap');
  setTimeout(() => { img.src = src; img.onload = () => img.classList.remove('swap'); }, 300);
}

/* ---------- Section 1 : slider ---------- */
let view = 0;
const hero = $('#heroCar'), dots = $('#dots');
VIEWS.forEach((_, i) => {
  const d = document.createElement('i');
  d.onclick = () => goView(i); dots.appendChild(d);
});
function goView(i) {
  view = (i + VIEWS.length) % VIEWS.length;
  swapImg(hero, VIEWS[view].img);
  $('#viewName').textContent = VIEWS[view].name;
  [...dots.children].forEach((d, n) => d.classList.toggle('on', n === view));
}
$('#prev').onclick = () => goView(view - 1);
$('#next').onclick = () => goView(view + 1);
goView(0);

/* ---------- Section 2 : colour buttons ---------- */
const sw = $('#swatches');
COLORS.forEach((c, i) => {
  const b = document.createElement('button');
  b.className = 'sw' + (i === 0 ? ' on' : '');
  b.innerHTML = `<i style="background:${c.dot}"></i>${c.name}`;
  b.onclick = () => {
    chosen = c;
    [...sw.children].forEach(x => x.classList.remove('on')); b.classList.add('on');
    swapImg($('#colorCar'), c.img);
    $('#colorName').textContent = c.name;
    setTheme(c);
  };
  sw.appendChild(b);
});

/* ---------- Scroll behaviour ---------- */
// Colour section uses the picked colour; every other section goes back to silver/blue
new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) setTheme(e.target.id === 'colors' ? chosen : COLORS[0]);
}), { threshold: 0.5 }).observe($('#colors'));
['#home', '#parts', '#history', '#developer'].forEach(id => new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) setTheme(COLORS[0]);
}), { threshold: 0.4 }).observe($(id)));

// Fade-in on scroll
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.2 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
setTimeout(() => $('h1').classList.add('in'), 100);

/* ---------- Subtle mouse tilt on the cars ---------- */
document.querySelectorAll('.stage').forEach(st => {
  const img = st.querySelector('img');
  st.addEventListener('mousemove', e => {
    const r = st.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    st.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 5}deg)`;
  });
  st.addEventListener('mouseleave', () => { st.style.transform = ''; });
});
