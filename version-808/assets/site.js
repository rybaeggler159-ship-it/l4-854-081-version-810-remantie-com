(function () {
  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(
      hero.querySelectorAll("[data-hero-slide]"),
    );
    var dots = Array.prototype.slice.call(
      hero.querySelectorAll("[data-hero-dot]"),
    );
    var active = 0;
    var timer = null;

    var showSlide = function (index) {
      if (!slides.length) {
        return;
      }

      active = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === active);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === active);
      });
    };

    var schedule = function () {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    };

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-hero-dot") || 0));
        schedule();
      });
    });

    schedule();
  }

  var searchAreas = Array.prototype.slice.call(
    document.querySelectorAll("[data-search-area]"),
  );

  searchAreas.forEach(function (area) {
    var input = area.querySelector("[data-filter-input]");
    var pageRoot = area.parentElement || document;
    var cards = Array.prototype.slice.call(
      pageRoot.querySelectorAll("[data-card]"),
    );
    var empty = pageRoot.querySelector("[data-empty-state]");
    var buttons = Array.prototype.slice.call(
      area.querySelectorAll("[data-filter-value]"),
    );
    var activeValue = "all";

    var normalize = function (value) {
      return String(value || "")
        .toLowerCase()
        .trim();
    };

    var applyFilter = function () {
      var query = normalize(input ? input.value : "");
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(
          [
            card.getAttribute("data-title"),
            card.getAttribute("data-tags"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-year"),
          ].join(" "),
        );
        var matchQuery = !query || text.indexOf(query) !== -1;
        var matchChip =
          activeValue === "all" || text.indexOf(normalize(activeValue)) !== -1;
        var show = matchQuery && matchChip;

        card.classList.toggle("is-hidden", !show);

        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    };

    if (input) {
      input.addEventListener("input", applyFilter);
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeValue = button.getAttribute("data-filter-value") || "all";
        buttons.forEach(function (item) {
          item.classList.toggle("is-active", item === button);
        });
        applyFilter();
      });
    });
  });

  var playerBlocks = Array.prototype.slice.call(
    document.querySelectorAll("[data-player]"),
  );

  playerBlocks.forEach(function (block) {
    var video = block.querySelector("video");
    var button = block.querySelector("[data-play]");
    var message = block.querySelector("[data-player-message]");
    var source = block.getAttribute("data-src");
    var prepared = false;
    var hls = null;

    if (!video || !button || !source) {
      return;
    }

    var showMessage = function (text) {
      if (message) {
        message.textContent = text;
        message.hidden = false;
      }
    };

    var hideMessage = function () {
      if (message) {
        message.textContent = "";
        message.hidden = true;
      }
    };

    var runPlay = function () {
      hideMessage();
      video.controls = true;
      button.classList.add("is-hidden");

      var request = video.play();

      if (request && typeof request.catch === "function") {
        request.catch(function () {
          button.classList.remove("is-hidden");
        });
      }
    };

    var prepare = function () {
      if (prepared) {
        runPlay();
        return;
      }

      prepared = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        video.addEventListener("loadedmetadata", runPlay, { once: true });
        video.load();
        window.setTimeout(runPlay, 420);
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });

        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, runPlay);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            showMessage("视频暂时无法播放");
            button.classList.remove("is-hidden");
          }
        });
        return;
      }

      prepared = false;
      showMessage("视频暂时无法播放");
    };

    button.addEventListener("click", prepare);

    video.addEventListener("click", function () {
      if (video.paused) {
        prepare();
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  });
})();
