(function(){
  var toggles=document.querySelectorAll('[data-nav-toggle]');
  toggles.forEach(function(btn){btn.addEventListener('click',function(){var panel=document.querySelector('[data-mobile-panel]');if(panel){panel.classList.toggle('open');}})});
  var hero=document.querySelector('[data-hero]');
  if(hero){
    var slides=Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots=Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current=0;
    var show=function(i){current=(i+slides.length)%slides.length;slides.forEach(function(s,n){s.classList.toggle('active',n===current)});dots.forEach(function(d,n){d.classList.toggle('active',n===current)})};
    dots.forEach(function(d,n){d.addEventListener('click',function(){show(n)})});
    show(0);
    if(slides.length>1){setInterval(function(){show(current+1)},5200)}
  }
  document.querySelectorAll('[data-search-scope]').forEach(function(scope){
    var input=scope.querySelector('[data-search-input]');
    if(!input){return}
    var cards=Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
    var empty=scope.querySelector('[data-empty]');
    var run=function(){
      var q=input.value.trim().toLowerCase();
      var visible=0;
      cards.forEach(function(card){
        var text=(card.getAttribute('data-text')||card.textContent||'').toLowerCase();
        var ok=!q||text.indexOf(q)>-1;
        card.style.display=ok?'':'none';
        if(ok){visible++}
      });
      if(empty){empty.classList.toggle('show',visible===0)}
    };
    input.addEventListener('input',run);
    run();
  });
  document.querySelectorAll('img').forEach(function(img){img.addEventListener('error',function(){var p=img.closest('.poster,.rank-cover,.detail-poster,.detail-bg,.hero-slide');if(p){p.classList.add('image-missing')}})});
  var frame=document.querySelector('.player-frame');
  if(frame){
    var video=frame.querySelector('video');
    var cover=frame.querySelector('.player-cover');
    var src=video?video.getAttribute('data-m3u8'):'';
    var ready=false;
    var boot=function(){
      if(!video||!src){return Promise.resolve()}
      if(ready){return Promise.resolve()}
      ready=true;
      if(video.canPlayType('application/vnd.apple.mpegurl')){video.src=src;return Promise.resolve()}
      if(window.Hls&&window.Hls.isSupported()){
        return new Promise(function(resolve){var hls=new Hls({enableWorker:true,lowLatencyMode:true});hls.loadSource(src);hls.attachMedia(video);hls.on(Hls.Events.MANIFEST_PARSED,function(){resolve()});hls.on(Hls.Events.ERROR,function(){resolve()})})
      }
      video.src=src;
      return Promise.resolve()
    };
    var start=function(){if(cover){cover.classList.add('is-hidden')}boot().then(function(){var p=video.play();if(p&&p.catch){p.catch(function(){})}})};
    if(cover){cover.addEventListener('click',start)}
    frame.querySelectorAll('[data-play-button]').forEach(function(btn){btn.addEventListener('click',start)});
    if(video){video.addEventListener('click',function(){if(video.paused){start()}})}
  }
})();
