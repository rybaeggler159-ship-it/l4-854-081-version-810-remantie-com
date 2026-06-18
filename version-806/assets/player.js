(function () {
  function setupPlayer(root) {
    var video = root.querySelector('video');
    var trigger = root.querySelector('[data-play-trigger]');
    var stream = root.getAttribute('data-stream');
    var loaded = false;
    var hls = null;

    function prepare() {
      if (loaded || !video || !stream) {
        return;
      }
      loaded = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
    }

    function play() {
      prepare();
      root.classList.add('is-playing');
      var result = video.play();
      if (result && result.catch) {
        result.catch(function () {});
      }
    }

    if (trigger) {
      trigger.addEventListener('click', play);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener('play', function () {
        root.classList.add('is-playing');
      });
      video.addEventListener('emptied', function () {
        if (hls) {
          hls.destroy();
          hls = null;
        }
        loaded = false;
        root.classList.remove('is-playing');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
  });
})();
