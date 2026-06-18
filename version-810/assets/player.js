(function () {
    window.SitePlayer = {
        start: function (url) {
            var bind = function () {
                var video = document.querySelector("[data-player-video]");
                var cover = document.querySelector("[data-player-cover]");
                var button = document.querySelector("[data-player-button]");
                var started = false;
                var hls = null;
                if (!video || !button) {
                    return;
                }
                var play = function () {
                    if (!started) {
                        started = true;
                        if (video.canPlayType("application/vnd.apple.mpegurl")) {
                            video.src = url;
                        } else if (window.Hls && window.Hls.isSupported()) {
                            hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                            hls.loadSource(url);
                            hls.attachMedia(video);
                        } else {
                            video.src = url;
                        }
                        video.setAttribute("controls", "controls");
                    }
                    if (cover) {
                        cover.classList.add("is-hidden");
                    }
                    var promise = video.play();
                    if (promise && promise.catch) {
                        promise.catch(function () {});
                    }
                };
                button.addEventListener("click", play);
                if (cover && cover !== button) {
                    cover.addEventListener("click", play);
                }
                video.addEventListener("click", function () {
                    if (!started || video.paused) {
                        play();
                    } else {
                        video.pause();
                    }
                });
                window.addEventListener("beforeunload", function () {
                    if (hls && hls.destroy) {
                        hls.destroy();
                    }
                });
            };
            if (document.readyState !== "loading") {
                bind();
            } else {
                document.addEventListener("DOMContentLoaded", bind);
            }
        }
    };
})();
