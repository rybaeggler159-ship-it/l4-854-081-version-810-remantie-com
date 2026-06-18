(function () {
  function initMenu() {
    var button = document.querySelector('[data-menu-button]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var track = hero.querySelector('[data-hero-track]');
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function go(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + current * 100 + '%)';
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
        slide.setAttribute('aria-hidden', slideIndex === current ? 'false' : 'true');
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        go(current + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        go(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        go(current + 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        go(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    if (slides.length > 1) {
      restart();
    }
  }

  function initFilters() {
    var input = document.querySelector('[data-search-input]');
    var select = document.querySelector('[data-genre-select]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    if (!cards.length || (!input && !select)) {
      return;
    }

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function applyFilter() {
      var keyword = normalize(input ? input.value : '');
      var genre = normalize(select ? select.value : '');
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-year'),
          card.textContent
        ].join(' '));
        var show = (!keyword || haystack.indexOf(keyword) !== -1) && (!genre || haystack.indexOf(genre) !== -1);
        card.classList.toggle('is-hidden-card', !show);
      });
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    if (select) {
      select.addEventListener('change', applyFilter);
    }

    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q && input) {
      input.value = q;
      applyFilter();
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHero();
    initFilters();
  });
})();
