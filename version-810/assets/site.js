(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-nav-toggle]");
        var mobileNav = document.querySelector("[data-mobile-nav]");
        if (toggle && mobileNav) {
            toggle.addEventListener("click", function () {
                mobileNav.classList.toggle("open");
            });
        }

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var index = 0;
            var show = function (next) {
                index = (next + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("active", i === index);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("active", i === index);
                });
            };
            dots.forEach(function (dot, i) {
                dot.addEventListener("click", function () {
                    show(i);
                });
            });
            if (slides.length > 1) {
                window.setInterval(function () {
                    show(index + 1);
                }, 5200);
            }
        }

        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get("q") || "";
        var scopes = document.querySelectorAll("[data-filter-scope]");
        scopes.forEach(function (scope) {
            var list = document.querySelector("[data-card-list]");
            var input = scope.querySelector("[data-filter-input]");
            var regionSelect = scope.querySelector("[data-region-filter]");
            var kindSelect = scope.querySelector("[data-kind-filter]");
            var clear = scope.querySelector("[data-clear-filter]");
            var empty = document.querySelector("[data-empty-state]");
            if (!list || !input) {
                return;
            }
            var cards = Array.prototype.slice.call(list.querySelectorAll("[data-card]"));
            var regions = [];
            var kinds = [];
            cards.forEach(function (card) {
                var region = card.getAttribute("data-region") || "";
                var kind = card.getAttribute("data-kind") || "";
                if (region && regions.indexOf(region) === -1) {
                    regions.push(region);
                }
                if (kind && kinds.indexOf(kind) === -1) {
                    kinds.push(kind);
                }
            });
            regions.sort().forEach(function (value) {
                var option = document.createElement("option");
                option.value = value;
                option.textContent = value;
                regionSelect.appendChild(option);
            });
            kinds.sort().forEach(function (value) {
                var option = document.createElement("option");
                option.value = value;
                option.textContent = value;
                kindSelect.appendChild(option);
            });
            var apply = function () {
                var query = input.value.trim().toLowerCase();
                var region = regionSelect.value;
                var kind = kindSelect.value;
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute("data-title") || "",
                        card.getAttribute("data-region") || "",
                        card.getAttribute("data-kind") || "",
                        card.getAttribute("data-year") || "",
                        card.getAttribute("data-genre") || ""
                    ].join(" ").toLowerCase();
                    var matchQuery = !query || haystack.indexOf(query) !== -1;
                    var matchRegion = !region || card.getAttribute("data-region") === region;
                    var matchKind = !kind || card.getAttribute("data-kind") === kind;
                    var ok = matchQuery && matchRegion && matchKind;
                    card.hidden = !ok;
                    if (ok) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.hidden = visible !== 0;
                }
            };
            if (initialQuery) {
                input.value = initialQuery;
            }
            input.addEventListener("input", apply);
            regionSelect.addEventListener("change", apply);
            kindSelect.addEventListener("change", apply);
            clear.addEventListener("click", function () {
                input.value = "";
                regionSelect.value = "";
                kindSelect.value = "";
                apply();
            });
            apply();
        });
    });
})();
