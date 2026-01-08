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

  // Initialize partners carousel (track/viewport approach)
  function initPartnersCarousel(){
    const slider = document.getElementById('partners-slider');
    if(!slider) return;
    const track = slider.querySelector('.partners-track');
    const viewport = slider.querySelector('.partners-viewport');
    const btnNext = document.getElementById('partners-next');
    const btnPrev = document.getElementById('partners-prev');
    if(!track || !viewport) return;
    const slides = Array.from(track.children);
    const visible = 3;
    let index = 0;
    let timer = null;

    function getGap(){
      const style = getComputedStyle(track);
      return parseFloat(style.gap) || 0;
    }

    function slideTo(i){
      const gap = getGap();
      const slideWidth = slides[0].getBoundingClientRect().width + gap;
      track.style.transform = `translateX(-${i * slideWidth}px)`;
    }

    function nextGroup(){
      const maxIndex = Math.max(0, slides.length - visible);
      index += visible;
      if(index > maxIndex) index = 0;
      slideTo(index);
    }

    function prevGroup(){
      const maxIndex = Math.max(0, slides.length - visible);
      index -= visible;
      if(index < 0) index = maxIndex;
      slideTo(index);
    }

    function startAuto(){
      stopAuto();
      timer = setInterval(nextGroup, 3000);
    }

    function stopAuto(){
      if(timer) { clearInterval(timer); timer = null; }
    }

    // Attach controls
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

    // initial layout
    slideTo(index);
    startAuto();
  }
  initPartnersCarousel();

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
