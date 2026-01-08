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

  // Initialize partners carousel (simple rotate)
  function initPartnersCarousel(){
    const container = document.querySelector('#partners-slider .partners-carousel');
    if(!container) return;
    // move first child to end every 3s
    setInterval(()=>{
      if(container.children.length <= 4) {
        // rotate only if more than visible
        const first = container.firstElementChild;
        if(first) container.appendChild(first);
      } else {
        const first = container.firstElementChild;
        if(first) container.appendChild(first);
      }
    }, 3000);
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
