// Language toggle
function setLanguage(lang){
  localStorage.setItem('ime-lang', lang);
  document.documentElement.lang = lang;
  // Toggle all elements with data-lang attribute
  document.querySelectorAll('[data-lang]').forEach(el=>{
    const elLang = el.getAttribute('data-lang');
    if(elLang === lang){
      el.style.display = '';  // Remove inline display style
    } else {
      el.style.display = 'none';
    }
  });
  updateLanguageButtonState(lang);
}

function updateLanguageButtonState(lang){
  document.querySelectorAll('[data-lang-btn]').forEach(btn=>{
    if(btn.getAttribute('data-lang-btn') === lang){
      btn.classList.add('lang-btn--active');
    } else {
      btn.classList.remove('lang-btn--active');
    }
  });
}

function initializeLanguage(){
  // Set default language
  const savedLang = localStorage.getItem('ime-lang') || 'fr';
  setLanguage(savedLang);
  
  // Attach click handlers to language buttons
  document.querySelectorAll('[data-lang-btn]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      const lang = btn.getAttribute('data-lang-btn');
      setLanguage(lang);
    });
  });
}

// Initialize language immediately since script is at end of body
initializeLanguage();

document.addEventListener('DOMContentLoaded', ()=>{
  const btn = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  if(btn && nav){
    btn.addEventListener('click', ()=>{
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('nav--open');
    });

    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true'){
        btn.setAttribute('aria-expanded','false');
        nav.classList.remove('nav--open');
        btn.focus();
      }
    });
  }

  const focusable = document.querySelectorAll('a, button, input, textarea');
  focusable.forEach(el=>{
    el.addEventListener('focus', ()=> el.classList.add('is-focused'));
    el.addEventListener('blur', ()=> el.classList.remove('is-focused'));
  });

  // Utility: detect mostly-white images that need inversion
  function shouldInvertImage(img){
    return new Promise((resolve)=>{
      try{
        const w = 8, h = 8;
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const d = ctx.getImageData(0,0,w,h).data;
        let total = 0, count = 0;
        for(let i=0;i<d.length;i+=4){
          const r = d[i], g = d[i+1], b = d[i+2], a = d[i+3];
          if(a < 30) continue; // ignore mostly transparent pixels
          const l = 0.2126*r + 0.7152*g + 0.0722*b;
          total += l; count++;
        }
        if(count === 0) return resolve(false);
        const avg = total / count;
        resolve(avg > 200); // very light images -> invert
      }catch(e){ resolve(false); }
    });
  }

  // Initialize partners carousel (track/viewport approach)
  function initPartnersCarousel(){
    const slider = document.getElementById('partners-slider');
    if(!slider) return;
    const track = slider.querySelector('.partners-track');
    const viewport = slider.querySelector('.partners-viewport');
    const btnNext = document.getElementById('partners-next');
    const btnPrev = document.getElementById('partners-prev');
    if(!track || !viewport) return;
    let slides = Array.from(track.children);
    const visible = 1;
    const originalCount = slides.length;
    
    // Clone first and last slides for smooth infinite loop
    if(originalCount > 1){
      const firstClone = slides[0].cloneNode(true);
      const lastClone = slides[originalCount - 1].cloneNode(true);
      track.appendChild(firstClone);
      track.insertBefore(lastClone, slides[0]);
      slides = Array.from(track.children);
    }
    
    let index = originalCount > 1 ? 1 : 0; // Start at the real first slide (after clone)
    let timer = null;

    function getGap(){
      const style = getComputedStyle(track);
      return parseFloat(style.gap) || 0;
    }

    function slideTo(i, immediate = false){
      const gap = getGap();
      const slideWidth = slides[0].getBoundingClientRect().width + gap;
      if(immediate){
        track.style.transition = 'none';
        track.style.transform = `translateX(-${i * slideWidth}px)`;
        // Force reflow to ensure transition 'none' is applied
        void track.offsetHeight;
        track.style.transition = '';
      } else {
        track.style.transition = '';
        track.style.transform = `translateX(-${i * slideWidth}px)`;
      }
    }

    function nextGroup(){
      index += visible;
      slideTo(index);
      updateDots();
      
      // If we've reached the clone of the first slide, jump back seamlessly
      if(originalCount > 1 && index >= slides.length - (originalCount - 1)){
        setTimeout(() => {
          index = 1; // Jump to real first slide
          slideTo(index, true);
        }, 420); // Wait for transition to complete
      }
    }

    function prevGroup(){
      index -= visible;
      slideTo(index);
      updateDots();
      
      // If we've reached the clone of the last slide, jump back seamlessly
      if(originalCount > 1 && index < 1){
        setTimeout(() => {
          index = originalCount; // Jump to real last slide
          slideTo(index, true);
        }, 420); // Wait for transition to complete
      }
    }

    function startAuto(){
      stopAuto();
      timer = setInterval(nextGroup, 1000);
    }

    function stopAuto(){
      if(timer) { clearInterval(timer); timer = null; }
    }

    // Attach controls (if present) — user requested removal in some cases
    if(btnNext) btnNext.addEventListener('click', ()=>{ nextGroup(); startAuto(); });
    if(btnPrev) btnPrev.addEventListener('click', ()=>{ prevGroup(); startAuto(); });

    // Pause on hover / focus
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
    slider.addEventListener('focusin', stopAuto);
    slider.addEventListener('focusout', startAuto);

    // keyboard navigation for controls
    slider.addEventListener('keydown', (e)=>{
      if(e.key === 'ArrowRight') { nextGroup(); startAuto(); }
      if(e.key === 'ArrowLeft') { prevGroup(); startAuto(); }
    });

    // resize handling
    window.addEventListener('resize', ()=> slideTo(index));

    slides.forEach(slide=>{
      const img = slide.querySelector('img');
      if(!img) return;
      const check = ()=> shouldInvertImage(img).then(inv=>{ if(inv) img.classList.add('invert'); });
      if(img.complete) check(); else img.addEventListener('load', check);
    });

    // Touch / drag support
    let isDown = false, startX = 0, dx = 0;
    const trackStyle = track.style;
    function getSlideWidth(){ const gap = getGap(); return slides[0].getBoundingClientRect().width + gap; }

    function pointerDown(e){
      isDown = true; startX = (e.touches ? e.touches[0].clientX : e.clientX); dx = 0;
      trackStyle.transition = 'none';
      stopAuto();
    }

    function pointerMove(e){
      if(!isDown) return;
      const x = (e.touches ? e.touches[0].clientX : e.clientX);
      dx = x - startX;
      const base = - index * getSlideWidth();
      trackStyle.transform = `translateX(${base + dx}px)`;
    }
    function pointerUp(e){
      if(!isDown) return; isDown = false;
      trackStyle.transition = '';
      const threshold = Math.min(60, getSlideWidth() * 0.25);
      if(Math.abs(dx) > threshold){
        if(dx < 0) nextGroup(); else prevGroup();
      } else {
        slideTo(index);
      }
      // Restart auto after a short delay to avoid immediate jumps
      setTimeout(startAuto, 350);
    }

    // Pointer / touch events (add pointercancel/leave handlers for robustness)
    track.addEventListener('pointerdown', pointerDown, {passive:true});
    window.addEventListener('pointermove', pointerMove, {passive:true});
    window.addEventListener('pointerup', pointerUp);
    track.addEventListener('pointercancel', ()=>{ if(isDown) { isDown=false; slideTo(index); setTimeout(startAuto,350); } });
    track.addEventListener('pointerleave', ()=>{ if(isDown) { isDown=false; slideTo(index); setTimeout(startAuto,350); } });
    track.addEventListener('touchstart', pointerDown, {passive:true});
    track.addEventListener('touchmove', pointerMove, {passive:true});
    track.addEventListener('touchend', pointerUp);
    track.addEventListener('touchcancel', ()=>{ if(isDown) { isDown=false; slideTo(index); setTimeout(startAuto,350); } });

    // Pagination dots
    const dotsContainer = document.getElementById('carousel-dots');
    function updateDots(){
      if(!dotsContainer) return;
      const dots = Array.from(dotsContainer.querySelectorAll('.carousel-dot'));
      // Map current index to real slide index (accounting for clones)
      let realIndex = index;
      if(originalCount > 1){
        if(index === 0) realIndex = originalCount - 1; // Clone of last
        else if(index >= originalCount + 1) realIndex = 0; // Clone of first
        else realIndex = index - 1; // Real slides are offset by 1
      }
      dots.forEach((dot, i) => {
        if(i === realIndex) dot.classList.add('active');
        else dot.classList.remove('active');
      });
    }
    // Create dots (if container exists) — only for original slides, not clones
    if(dotsContainer){
      for(let i = 0; i < originalCount; i++){
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Partner ${i + 1}`);
        dot.addEventListener('click', () => { 
          index = originalCount > 1 ? i + 1 : i; // Account for clone offset
          slideTo(index);
          startAuto();
          updateDots();
        });
        dotsContainer.appendChild(dot);
      }
    }

    // initial layout
    slideTo(index);
    updateDots();
    startAuto();
  }
  initPartnersCarousel();

  // Auto-invert partner images on the partners page grid as well
  (function invertPartnersGrid(){
    const imgs = Array.from(document.querySelectorAll('.partners-grid img'));
    imgs.forEach(img=>{
      const check = ()=> shouldInvertImage(img).then(inv=>{ if(inv) img.classList.add('invert'); });
      if(img.complete) check(); else img.addEventListener('load', check);
      // ensure container is focusable
      const container = img.closest('.partner-item');
      if(container && !container.hasAttribute('tabindex')) container.setAttribute('tabindex','0');
    });
  })();

  // Ensure nav aria-hidden when closed (improve mobile behaviour)
  function syncNavAria(){
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('nav-toggle');
    if(!nav || !toggle) return;
    const opened = nav.classList.contains('nav--open');
    nav.setAttribute('aria-hidden', String(!opened));
  }
  // observe changes on nav class
  const navEl = document.getElementById('nav');
  if(navEl){
    const mo = new MutationObserver(syncNavAria);
    mo.observe(navEl, {attributes:true, attributeFilter:['class']});
    // initial sync
    syncNavAria();
  }
});
