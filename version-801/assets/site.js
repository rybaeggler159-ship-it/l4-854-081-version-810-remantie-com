(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-hero-carousel]').forEach(function (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        var prev = carousel.querySelector('[data-hero-prev]');
        var next = carousel.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function play() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                play();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                play();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                play();
            });
        }

        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', play);
        show(0);
        play();
    });

    function normalize(value) {
        return String(value || '').toLowerCase().replace(/\s+/g, '');
    }

    function filterCards(scope, query) {
        var root = scope || document;
        var key = normalize(query);
        var cards = Array.prototype.slice.call(root.querySelectorAll('.searchable-card'));

        cards.forEach(function (card) {
            var haystack = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-year'),
                card.getAttribute('data-type'),
                card.textContent
            ].join(' '));
            card.classList.toggle('is-hidden', key && haystack.indexOf(key) === -1);
        });
    }

    document.querySelectorAll('[data-filter-input]').forEach(function (input) {
        var selector = input.getAttribute('data-filter-scope');
        var scope = selector ? document.querySelector(selector) : document;
        input.addEventListener('input', function () {
            filterCards(scope, input.value);
            document.querySelectorAll('[data-quick-filter]').forEach(function (button) {
                button.classList.remove('is-active');
            });
        });
    });

    document.querySelectorAll('[data-quick-filter]').forEach(function (button) {
        button.addEventListener('click', function () {
            var query = button.getAttribute('data-quick-filter') || '';
            var input = document.querySelector('[data-filter-input]');
            if (input) {
                input.value = query;
            }
            document.querySelectorAll('[data-quick-filter]').forEach(function (item) {
                item.classList.toggle('is-active', item === button);
            });
            filterCards(document, query);
        });
    });
})();
