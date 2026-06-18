(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        mobileNav.classList.toggle('is-open');
      });
    }

    document.querySelectorAll('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = form.querySelector('input[name="q"]');
        var query = input ? input.value.trim() : '';
        if (query) {
          event.preventDefault();
          window.location.href = 'search.html?q=' + encodeURIComponent(query);
        }
      });
    });

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    var filterPanel = document.querySelector('[data-filter-panel]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.filter-movie-card'));

    if (filterPanel && cards.length) {
      var params = new URLSearchParams(window.location.search);
      var input = filterPanel.querySelector('[data-filter-input]');
      var typeSelect = filterPanel.querySelector('[data-filter-type]');
      var yearSelect = filterPanel.querySelector('[data-filter-year]');
      var categorySelect = filterPanel.querySelector('[data-filter-category]');
      var reset = filterPanel.querySelector('[data-filter-reset]');
      var status = document.querySelector('[data-filter-status]');

      if (input && params.get('q')) {
        input.value = params.get('q');
      }

      function normalize(value) {
        return String(value || '').toLowerCase();
      }

      function applyFilters() {
        var keyword = normalize(input ? input.value : '');
        var type = typeSelect ? typeSelect.value : '';
        var year = yearSelect ? yearSelect.value : '';
        var category = categorySelect ? categorySelect.value : '';
        var shown = 0;

        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-year'),
            card.getAttribute('data-type'),
            card.getAttribute('data-category')
          ].join(' '));
          var matched = true;

          if (keyword && haystack.indexOf(keyword) === -1) {
            matched = false;
          }
          if (type && card.getAttribute('data-type') !== type) {
            matched = false;
          }
          if (year && card.getAttribute('data-year') !== year) {
            matched = false;
          }
          if (category && card.getAttribute('data-category') !== category) {
            matched = false;
          }

          card.style.display = matched ? '' : 'none';
          if (matched) {
            shown += 1;
          }
        });

        if (status) {
          status.textContent = shown ? '正在显示匹配影片' : '没有匹配影片，请调整关键词或筛选条件';
        }
      }

      [input, typeSelect, yearSelect, categorySelect].forEach(function (control) {
        if (control) {
          control.addEventListener('input', applyFilters);
          control.addEventListener('change', applyFilters);
        }
      });

      if (reset) {
        reset.addEventListener('click', function () {
          if (input) {
            input.value = '';
          }
          if (typeSelect) {
            typeSelect.value = '';
          }
          if (yearSelect) {
            yearSelect.value = '';
          }
          if (categorySelect) {
            categorySelect.value = '';
          }
          applyFilters();
        });
      }

      applyFilters();
    }
  });
})();
