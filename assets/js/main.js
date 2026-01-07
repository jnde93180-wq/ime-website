// Language toggle
function setLanguage(lang){
  localStorage.setItem('ime-lang', lang);
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-lang]').forEach(el=>{
    el.style.display = el.getAttribute('data-lang') === lang ? 'block' : 'none';
  });
  document.querySelectorAll('[data-lang-inline]').forEach(el=>{
    el.textContent = el.getAttribute(`data-${lang}`) || el.textContent;
  });
  updateLanguageButtonState(lang);
}

function updateLanguageButtonState(lang){
  document.querySelectorAll('.lang-btn').forEach(btn=>{
    btn.classList.toggle('lang-btn--active', btn.getAttribute('data-lang') === lang);
  });
}

function initializeLanguage(){
  const savedLang = localStorage.getItem('ime-lang') || 'en';
  setLanguage(savedLang);
  document.querySelectorAll('.lang-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> setLanguage(btn.getAttribute('data-lang')));
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  initializeLanguage();

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
