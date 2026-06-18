(function () {
  const toggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('is-open');
      mobileNav.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let active = 0;

    function showSlide(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const index = Number(dot.getAttribute('data-hero-dot'));
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(active + 1);
      }, 5000);
    }
  }

  const panels = Array.from(document.querySelectorAll('[data-filter-panel]'));

  panels.forEach(function (panel) {
    const input = panel.querySelector('[data-filter-input]');
    const year = panel.querySelector('[data-year-filter]');
    const region = panel.querySelector('[data-region-filter]');
    const counter = panel.querySelector('[data-result-counter]');
    const cards = Array.from(document.querySelectorAll('[data-movie-card]'));

    if (panel.hasAttribute('data-read-query') && input) {
      const params = new URLSearchParams(window.location.search);
      const query = params.get('q');
      if (query) {
        input.value = query;
      }
    }

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function applyFilter() {
      const keyword = normalize(input ? input.value : '');
      const selectedYear = year ? year.value : '';
      const selectedRegion = region ? region.value : '';
      let visible = 0;

      cards.forEach(function (card) {
        const haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-type')
        ].join(' '));
        const matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        const matchYear = !selectedYear || card.getAttribute('data-year') === selectedYear;
        const matchRegion = !selectedRegion || card.getAttribute('data-region') === selectedRegion;
        const matched = matchKeyword && matchYear && matchRegion;

        card.classList.toggle('is-hidden-card', !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (counter) {
        counter.textContent = '当前显示 ' + visible + ' 部影片';
      }
    }

    [input, year, region].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    applyFilter();
  });
})();
