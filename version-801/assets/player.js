(function () {
    function startPlayer(block) {
        var video = block.querySelector('[data-player-video]');
        if (!video) {
            return;
        }

        var stream = video.getAttribute('data-stream');
        if (!stream) {
            return;
        }

        if (!block.playerReady) {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    maxBufferLength: 60
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                block.hlsPlayer = hls;
            } else {
                video.src = stream;
            }
            block.playerReady = true;
        }

        block.classList.add('player-started');
        video.setAttribute('controls', 'controls');
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {});
        }
    }

    document.querySelectorAll('[data-player]').forEach(function (block) {
        var cover = block.querySelector('[data-player-cover]');
        var button = block.querySelector('[data-player-button]');
        var video = block.querySelector('[data-player-video]');

        if (cover) {
            cover.addEventListener('click', function () {
                startPlayer(block);
            });
        }

        if (button) {
            button.addEventListener('click', function (event) {
                event.stopPropagation();
                startPlayer(block);
            });
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    startPlayer(block);
                }
            });
        }
    });
})();
