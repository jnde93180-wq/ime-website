document.addEventListener('DOMContentLoaded', ()=>{
  const btn = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  if(btn && nav){
    btn.addEventListener('click', ()=>{
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('nav--open');
    });

    // Close menu with Escape key for accessibility
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true'){
        btn.setAttribute('aria-expanded','false');
        nav.classList.remove('nav--open');
        btn.focus();
      }
    });
  }

  // Improve focus visibility for keyboard users
  const focusable = document.querySelectorAll('a, button, input, textarea');
  focusable.forEach(el=>{
    el.addEventListener('focus', ()=> el.classList.add('is-focused'));
    el.addEventListener('blur', ()=> el.classList.remove('is-focused'));
  });
});
