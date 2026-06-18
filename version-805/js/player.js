(function () {
  window.setupMoviePlayer = function (movieUrl) {
    const video = document.getElementById('movieVideo');
    const playButton = document.getElementById('playButton');
    let hlsInstance = null;

    if (!video || !movieUrl) {
      return;
    }

    function attachSource() {
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(movieUrl);
        hlsInstance.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = movieUrl;
      } else {
        video.src = movieUrl;
      }
    }

    function hideCover() {
      if (playButton) {
        playButton.classList.add('is-hidden');
      }
    }

    function showCover() {
      if (playButton && video.paused) {
        playButton.classList.remove('is-hidden');
      }
    }

    function startPlayback() {
      hideCover();
      const result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {
          showCover();
        });
      }
    }

    attachSource();

    if (playButton) {
      playButton.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      }
    });

    video.addEventListener('play', hideCover);
    video.addEventListener('pause', showCover);
    video.addEventListener('ended', showCover);

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
