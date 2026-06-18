
import { H as Hls } from "./hls-vendor.js";

const ready = (fn) => {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fn);
    } else {
        fn();
    }
};

ready(() => {
    const toggle = document.querySelector(".mobile-toggle");
    const mobileNav = document.querySelector(".mobile-nav");
    if (toggle && mobileNav) {
        toggle.addEventListener("click", () => {
            mobileNav.classList.toggle("is-open");
        });
    }

    document.querySelectorAll("[data-hero]").forEach((hero) => {
        const slides = Array.from(hero.querySelectorAll(".hero-slide"));
        const dots = Array.from(hero.querySelectorAll(".hero-dot"));
        const prev = hero.querySelector(".hero-arrow--prev");
        const next = hero.querySelector(".hero-arrow--next");
        let index = 0;
        let timer = null;

        const activate = (nextIndex) => {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
            dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
        };

        const start = () => {
            stop();
            timer = window.setInterval(() => activate(index + 1), 5200);
        };

        const stop = () => {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        };

        prev?.addEventListener("click", () => {
            activate(index - 1);
            start();
        });

        next?.addEventListener("click", () => {
            activate(index + 1);
            start();
        });

        dots.forEach((dot, i) => {
            dot.addEventListener("click", () => {
                activate(i);
                start();
            });
        });

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        start();
    });

    document.querySelectorAll("[data-catalog]").forEach((catalog) => {
        const input = catalog.querySelector(".js-search");
        const type = catalog.querySelector(".js-type-filter");
        const year = catalog.querySelector(".js-year-filter");
        const cards = Array.from(catalog.querySelectorAll(".movie-card"));

        const apply = () => {
            const query = (input?.value || "").trim().toLowerCase();
            const typeValue = type?.value || "";
            const yearValue = year?.value || "";

            cards.forEach((card) => {
                const haystack = [
                    card.dataset.title,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.genre,
                    card.dataset.year
                ].join(" ").toLowerCase();
                const matchQuery = !query || haystack.includes(query);
                const matchType = !typeValue || (card.dataset.type || "").includes(typeValue);
                const matchYear = !yearValue || card.dataset.year === yearValue;
                card.hidden = !(matchQuery && matchType && matchYear);
            });
        };

        input?.addEventListener("input", apply);
        type?.addEventListener("change", apply);
        year?.addEventListener("change", apply);
    });

    document.querySelectorAll("[data-player]").forEach((player) => {
        const video = player.querySelector(".js-video");
        const button = player.querySelector(".js-play");
        const stream = player.getAttribute("data-stream");
        let initialized = false;
        let hls = null;

        const begin = () => {
            if (!video || !stream) {
                return;
            }

            button?.classList.add("is-hidden");

            if (!initialized) {
                initialized = true;

                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = stream;
                } else if (Hls && Hls.isSupported()) {
                    hls = new Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        video.play().catch(() => {});
                    });
                }
            }

            video.play().catch(() => {});
        };

        button?.addEventListener("click", begin);
        video?.addEventListener("click", () => {
            if (video.paused) {
                begin();
            }
        });
        window.addEventListener("pagehide", () => {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    });
});
