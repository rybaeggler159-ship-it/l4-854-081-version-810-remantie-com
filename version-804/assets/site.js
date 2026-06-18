(function () {
    "use strict";

    var M3U8_SOURCES = [
        "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/e398cb38b257828eeedbcaa0ae2856da/manifest/video.m3u8",
        "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/77ae15566dde5cfb920bae4712a38399/manifest/video.m3u8",
        "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/41cb67b47a3668efaea014219666e659/manifest/video.m3u8",
        "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/31227358d3c181b7168e28ad248cfb4e/manifest/video.m3u8",
        "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/d0af4221b8947fda8c23f4955947cb58/manifest/video.m3u8",
        "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/e70b98acb53eb889d108057988609efb/manifest/video.m3u8",
        "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/86ea18f9954dbaf22eff5e16c41b4a25/manifest/video.m3u8",
        "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/2df81e778442675885257ce3e84c7173/manifest/video.m3u8",
        "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/af3d3f3b4940cee04efcd8ff2c9eef0a/manifest/video.m3u8",
        "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/60b4ddb3d166e1239abfc7adf611a6a3/manifest/video.m3u8",
        "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/a27121d514ff0079e1e81a6678f14e0c/manifest/video.m3u8",
        "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/f0d38b8679a1231eff816a8e04cc1a0c/manifest/video.m3u8",
        "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/c66b5309b3b64d15ed856810d6cc0b72/manifest/video.m3u8",
        "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/c99d86ece73a935b77e57d322461ddb5/manifest/video.m3u8",
        "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/fe0c41d994d01211debb24e84e3384a9/manifest/video.m3u8",
        "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/929fdb8e536c1fc43a83b32d1a838547/manifest/video.m3u8",
        "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/fbc04ae173a0e633458658e80ee78c2a/manifest/video.m3u8",
        "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/0ba4f146b0e6ea192526706f495d460f/manifest/video.m3u8",
        "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/1e53f0e1aef7ec2fb5f30ef5d309d69c/manifest/video.m3u8",
        "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/1116997bf50b78f22bbfaced8975a021/manifest/video.m3u8"
];

    function getSource(index) {
        var safeIndex = Number(index);
        if (!Number.isFinite(safeIndex) || safeIndex < 0) {
            safeIndex = 0;
        }
        return M3U8_SOURCES[safeIndex % M3U8_SOURCES.length];
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function initImageFallbacks() {
        document.querySelectorAll("img[data-fallback]").forEach(function (image) {
            image.addEventListener("error", function () {
                image.style.display = "none";
                if (image.parentElement) {
                    image.parentElement.classList.add("image-fallback");
                }
            });
        });
    }

    function initMobileNav() {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!toggle || !nav) {
            return;
        }

        toggle.addEventListener("click", function () {
            var isOpen = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }

        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
        var current = 0;
        var timer = null;

        function activate(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
                dot.setAttribute("aria-selected", String(dotIndex === current));
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                activate(current + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                activate(dotIndex);
                start();
            });
        });

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        activate(0);
        start();
    }

    function initSearchPanels() {
        document.querySelectorAll("[data-filter-root]").forEach(function (root) {
            var input = root.querySelector("[data-search-input]");
            var yearSelect = root.querySelector("[data-year-select]");
            var cards = Array.prototype.slice.call(root.querySelectorAll(".movie-card-item, .rank-filter-item"));
            var count = root.querySelector("[data-result-count]");

            function update() {
                var term = normalize(input ? input.value : "");
                var year = yearSelect ? yearSelect.value : "all";
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = normalize(card.getAttribute("data-search"));
                    var cardYear = card.getAttribute("data-year") || "";
                    var matchesTerm = !term || haystack.indexOf(term) !== -1;
                    var matchesYear = year === "all" || cardYear === year;
                    var shouldShow = matchesTerm && matchesYear;
                    card.hidden = !shouldShow;
                    if (shouldShow) {
                        visible += 1;
                    }
                });

                if (count) {
                    count.textContent = "显示 " + visible + " 条";
                }
            }

            if (input) {
                input.addEventListener("input", update);
            }
            if (yearSelect) {
                yearSelect.addEventListener("change", update);
            }
            update();
        });
    }

    function initPlayer() {
        document.querySelectorAll("video[data-m3u8-index]").forEach(function (video) {
            var source = video.getAttribute("data-m3u8-src") || getSource(video.getAttribute("data-m3u8-index"));
            var overlay = video.closest(".detail-player") ? video.closest(".detail-player").querySelector(".player-overlay") : null;
            var hlsInstance = null;

            function attachSource() {
                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(source);
                    hlsInstance.attachMedia(video);
                    hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
                        if (data && data.fatal) {
                            console.warn("HLS fatal error", data);
                        }
                    });
                } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = source;
                } else {
                    video.dataset.playbackNotice = "当前浏览器需要加载 HLS 播放库后播放 m3u8。";
                }
            }

            function updateOverlay() {
                if (!overlay) {
                    return;
                }
                if (video.paused) {
                    overlay.hidden = false;
                } else {
                    overlay.hidden = true;
                }
            }

            if (overlay) {
                overlay.addEventListener("click", function () {
                    var playPromise = video.play();
                    if (playPromise && typeof playPromise.catch === "function") {
                        playPromise.catch(function () {
                            overlay.hidden = false;
                        });
                    }
                });
            }

            video.addEventListener("play", updateOverlay);
            video.addEventListener("pause", updateOverlay);
            video.addEventListener("ended", updateOverlay);
            attachSource();
            updateOverlay();

            window.addEventListener("beforeunload", function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                }
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        initImageFallbacks();
        initMobileNav();
        initHero();
        initSearchPanels();
        initPlayer();
    });
}());
