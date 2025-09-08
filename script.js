/* ========= Helpers ========= */
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const fmtDate = (iso) => new Date(iso);

/* ========= DOM Ready ========= */
window.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(()=> document.body.classList.remove('preload'));

  initHeroDoors();
  mountHero();
  mountInvitation();
  mountGallery();
  mountVideo();
  mountQRs();

  initRevealIO();
  initLightbox();
  initMusic();
  initFloatingMenu(); // <-- KHỞI TẠO nút nổi

  if (WEDDING_CONFIG.effectEnabled) initEffects();
});

/* ========= HERO / DOORS ========= */
function initHeroDoors(){
  const doorWrap = $('#doors');
  $('#door-left').src = WEDDING_CONFIG.doorLeft || '';
  $('#door-right').src = WEDDING_CONFIG.doorRight || '';
  setTimeout(()=>{
    doorWrap.classList.add('open');
    setTimeout(()=> doorWrap.style.display='none', 2200);
  }, 700);
}

function mountHero(){
  const couple = `${WEDDING_CONFIG.groomName} & ${WEDDING_CONFIG.brideName}`;
  $('#couple-names').textContent = couple;

  const d = fmtDate(WEDDING_CONFIG.weddingDate);
  $('#wedding-date').textContent = d.toLocaleDateString('vi-VN', {weekday:'long', day:'2-digit', month:'2-digit', year:'numeric'});
  $('#hero-bg').style.backgroundImage = `url(${WEDDING_CONFIG.heroImage || ''})`;
  $('#hero-photo').src = WEDDING_CONFIG.heroImage || '';
  setTimeout(()=> $('#hero-content').classList.add('in'), 1000);
}

/* ========= INVITATION ========= */
function mountInvitation(){
  const left = WEDDING_CONFIG.invitation?.groomSide || {};
  const right = WEDDING_CONFIG.invitation?.brideSide || {};

  $('#invite-left-img').src = left.avatar || '';
  $('#invite-right-img').src = right.avatar || '';

  $('#left-name').textContent = left.name || WEDDING_CONFIG.groomName;
  $('#right-name').textContent = right.name || WEDDING_CONFIG.brideName;
  $('#left-parents').innerHTML = left.parents || '';
  $('#right-parents').innerHTML = right.parents || '';
  $('#left-address').textContent = left.address || '';
  $('#right-address').textContent = right.address || '';

  const d = fmtDate(WEDDING_CONFIG.weddingDate);
  $('#invite-names').textContent = `${WEDDING_CONFIG.groomName} & ${WEDDING_CONFIG.brideName}`;


  // calendar line
  const cal = $('#date-calendar');
  if(cal){
    const long = d.toLocaleDateString('vi-VN', {weekday:'long', day:'2-digit', month:'long', year:'numeric'});
    const time = d.toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'});
    cal.innerHTML = `<span class="when">${long} — ${time}</span>`;
  }

  // countdown above map
  initCountdownFor('#countdown-box', WEDDING_CONFIG.weddingDate);

  // init map
  initMapEmbed();
}

/* ========= COUNTDOWN ========= */
function initCountdownFor(selector, targetIso){
  const container = document.querySelector(selector);
  if(!container) return;
  const target = fmtDate(targetIso).getTime();

  const makeUnit = (num,lbl) => `
    <div class="unit">
      <div class="num">${String(num).padStart(2,'0')}</div>
      <div class="lbl">${lbl}</div>
    </div>`;

  function tick(){
    const now = Date.now();
    let diff = Math.max(0, target - now);
    const d = Math.floor(diff/(1000*60*60*24));
    diff %= 1000*60*60*24;
    const h = Math.floor(diff/(1000*60*60));
    diff %= 1000*60*60;
    const m = Math.floor(diff/(1000*60));
    diff %= 1000*60;
    const s = Math.floor(diff/1000);
    container.innerHTML = makeUnit(d,'Ngày') + makeUnit(h,'Giờ') + makeUnit(m,'Phút') + makeUnit(s,'Giây');
  }

  tick();
  const tmr = setInterval(tick, 1000);
  return tmr;
}

/* ========= MAP EMBED ========= */
function buildEmbedSrc(mapUrl, mapEmbed){
  if(mapEmbed && mapEmbed.trim()) return mapEmbed;
  if(!mapUrl) return '';
  // Basic: use maps search query embed as fallback (works for addresses or place names)
  try{
    const q = encodeURIComponent(mapUrl);
    return `https://www.google.com/maps?q=${q}&output=embed`;
  }catch(e){
    return mapUrl;
  }
}
function initMapEmbed(){
  const iframe = $('#map-iframe');
  const overlay = $('#map-open-link');
  const mapUrl = WEDDING_CONFIG.mapUrl || '#';
  const embedSrc = buildEmbedSrc(mapUrl, WEDDING_CONFIG.mapEmbed || '');

  if(iframe) iframe.src = embedSrc || mapUrl;
  if(overlay){
    overlay.href = mapUrl;
    overlay.target = '_blank';
    overlay.rel = 'noopener';
  }
}

/* ========= VIDEO ========= */
function mountVideo(){
  $('#wedding-video').src = WEDDING_CONFIG.videoUrl || '';
}

/* ========= GALLERY ========= */
let galleryList=[], currentIndex=0;
function mountGallery(){
  const grid = $('#gallery-grid');
  grid.innerHTML = '';
  galleryList = WEDDING_CONFIG.gallery || [];
  galleryList.forEach((item,i)=>{
    const pic = document.createElement('button');
    pic.className = 'pic reveal';
    pic.innerHTML = `<img src="${item.src}" alt="Ảnh ${i+1}" loading="lazy">`;
    pic.addEventListener('click', ()=>openLightbox(i, true));
    grid.appendChild(pic);
  });
}

/* ========= LIGHTBOX ========= */
let lightboxMode = "gallery";
function initLightbox(){
  const dlg = $('#lightbox');
  if(!dlg) return;
  $('#lightbox-close')?.addEventListener('click', ()=>dlg.close());
  $('#lightbox-prev')?.addEventListener('click', ()=>navLightbox(-1));
  $('#lightbox-next')?.addEventListener('click', ()=>navLightbox(1));
  dlg.addEventListener('click', (e)=>{ if(e.target===dlg) dlg.close(); });
}
function openLightbox(idxOrSrc, isGallery){
  lightboxMode = isGallery ? "gallery" : "qr";
  if(isGallery){
    currentIndex = idxOrSrc;
    $('#lightbox-img').src = galleryList[currentIndex].src;
  } else {
    $('#lightbox-img').src = idxOrSrc;
  }
  toggleNavBtns();
  const dlg = $('#lightbox');
  try{ dlg.showModal(); }catch(e){ /* fallback if not supported */ $('body').appendChild(dlg); dlg.setAttribute('open',''); }
}
function navLightbox(step){
  if(lightboxMode !== "gallery") return;
  currentIndex = (currentIndex + step + galleryList.length) % galleryList.length;
  $('#lightbox-img').src = galleryList[currentIndex].src;
}
function toggleNavBtns(){
  const show = (lightboxMode === "gallery");
  $('#lightbox-prev').style.display = show ? 'block' : 'none';
  $('#lightbox-next').style.display = show ? 'block' : 'none';
}

/* ========= QRs ========= */
function mountQRs(){
  const wrap = $('#qr-grid'); if(!wrap) return;
  wrap.innerHTML='';
  (WEDDING_CONFIG.qr||[]).forEach(it=>{
    const c = document.createElement('div'); c.className='qr-card reveal';
    c.innerHTML = `<img src="${it.src}" alt="${it.title}"><div class="title">${it.title}</div><div class="info">${it.info}</div>`;
    c.addEventListener('click', ()=>openLightbox(it.src, false));
    wrap.appendChild(c);
  });
}

/* ========= Reveal In/Out ========= */
function initRevealIO(){
  const els = $$('.reveal, .reveal-left, .reveal-right');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting){
        ent.target.classList.add('in');
        ent.target.classList.remove('out');
      }else{
        ent.target.classList.remove('in');
        ent.target.classList.add('out');
      }
    });
  }, {threshold:.15});
  els.forEach(el=>io.observe(el));
}

/* ========= Music control: Auto-play ngay khi vào trang ========= */
function initMusic() {
  const audio = $('#bg-music');
  const btn = $('#music-toggle');
  if (!audio || !btn) return;

  audio.src = WEDDING_CONFIG.music || '';
  audio.volume = 0.6;
  audio.playsInline = true; // Giúp auto-play trên mobile
  audio.autoplay = true;

  const setIcon = () => btn.textContent = audio.paused ? '🔈' : '🔊';

  // Thử phát nhạc ngay khi load
  const tryPlay = () => {
    audio.play().then(setIcon).catch(() => {
      // Nếu bị chặn, chờ click đầu tiên rồi phát
      const unlock = () => {
        audio.play().then(setIcon);
        document.removeEventListener('click', unlock);
        document.removeEventListener('touchstart', unlock);
      };
      document.addEventListener('click', unlock, { once: true });
      document.addEventListener('touchstart', unlock, { once: true });
    });
  };
  tryPlay();

  // Nút bấm để bật/tắt nhạc
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused) audio.play(); else audio.pause();
    setIcon();
  });

  audio.addEventListener('play', setIcon);
  audio.addEventListener('pause', setIcon);
  setIcon();
}


/* ========= Effects (original behavior) ========= */
function initEffects(){
  const layer = $('#effect-layer');
  const imgSrc = WEDDING_CONFIG.effectImage;
  if(!layer || !imgSrc) return;

  const spawn = ()=>{
    const el = document.createElement('img');
    el.src = imgSrc;
    el.className = 'effect-piece';
    const left = Math.random()*100;
    el.style.left = left + 'vw';
    el.style.width = (28 + Math.random()*64) + 'px';
    el.style.animationDuration = (6 + Math.random()*6) + 's';
    el.style.opacity = (0.8 + Math.random()*0.2);
    layer.appendChild(el);
    setTimeout(()=> el.remove(), 12000);
  };

  setInterval(spawn, 700);
}

/* ========= Floating Menu init (bổ sung) ========= */
function initFloatingMenu() {
  const fab = document.querySelector('#fab');
  if (!fab) return;
  const main = fab.querySelector('.fab-main');
  const list = fab.querySelector('.fab-list');

  main.addEventListener('click', () => {
    fab.classList.toggle('open');
    const isOpen = fab.classList.contains('open');
    list.setAttribute('aria-hidden', String(!isOpen));
  });

  fab.querySelectorAll('.fab-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const sel = btn.getAttribute('data-target');
      const el = document.querySelector(sel);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      fab.classList.remove('open');
      list.setAttribute('aria-hidden', 'true');
    });
  });

  document.addEventListener('click', (e) => {
    if (!fab.contains(e.target)) {
      fab.classList.remove('open');
      list.setAttribute('aria-hidden', 'true');
    }
  });
}
