(function () {
  function selectAll(root, selector) {
    return Array.prototype.slice.call(root.querySelectorAll(selector));
  }

  function setupMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = selectAll(hero, '[data-hero-slide]');
    var dots = selectAll(hero, '[data-hero-dot]');
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function start() {
      if (timer || slides.length < 2) {
        return;
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        window.clearInterval(timer);
        timer = null;
        start();
      });
    });

    show(0);
    start();
  }

  function setupCatalogFilters() {
    selectAll(document, '[data-catalog]').forEach(function (catalog) {
      var search = catalog.querySelector('[data-catalog-search]');
      var year = catalog.querySelector('[data-catalog-year]');
      var cards = selectAll(catalog, '[data-card]');

      function apply() {
        var query = search ? search.value.trim().toLowerCase() : '';
        var yearValue = year ? year.value : '';
        cards.forEach(function (card) {
          var text = [
            card.getAttribute('data-title') || '',
            card.getAttribute('data-region') || '',
            card.getAttribute('data-tags') || '',
            card.getAttribute('data-type') || ''
          ].join(' ').toLowerCase();
          var matchesQuery = !query || text.indexOf(query) !== -1;
          var matchesYear = !yearValue || card.getAttribute('data-year') === yearValue;
          card.classList.toggle('hidden-card', !(matchesQuery && matchesYear));
        });
      }

      if (search) {
        search.addEventListener('input', apply);
      }
      if (year) {
        year.addEventListener('change', apply);
      }

      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q && search) {
        search.value = q;
      }
      apply();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupCatalogFilters();
  });
})();
