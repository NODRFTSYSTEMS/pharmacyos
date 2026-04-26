/* ========================================
   Apple Passion Hardware & Construction
   Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  var menuBtn = document.getElementById('menuBtn');
  var closeBtn = document.getElementById('closeBtn');
  var mobileNav = document.getElementById('mobileNav');

  function getFocusable() {
    if (!mobileNav) return [];
    return [closeBtn].concat(Array.from(mobileNav.querySelectorAll('a')));
  }

  function openNav() {
    if (!mobileNav) return;
    mobileNav.classList.add('open');
    mobileNav.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    setTimeout(function() { if (closeBtn) closeBtn.focus(); }, 50);
  }

  function closeNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  }

  // Set initial aria-hidden state
  if (mobileNav) mobileNav.setAttribute('aria-hidden', 'true');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', openNav);
  }

  if (closeBtn && mobileNav) {
    closeBtn.addEventListener('click', function() {
      closeNav();
      if (menuBtn) menuBtn.focus();
    });
  }

  // Close on nav link click
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', closeNav);
    });
  }

  document.addEventListener('keydown', function(e) {
    if (!mobileNav || !mobileNav.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeNav();
      if (menuBtn) menuBtn.focus();
      return;
    }

    if (e.key === 'Tab') {
      var focusable = getFocusable();
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  // Active nav link — supplements hardcoded class="active" in HTML
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-desktop a, .mobile-nav a').forEach(function(link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});
