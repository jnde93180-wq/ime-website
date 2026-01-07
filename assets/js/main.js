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
  const savedLang = localStorage.getItem('ime-lang') || 'en';
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
});
