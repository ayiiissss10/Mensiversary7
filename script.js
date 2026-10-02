(function(){
  var book   = document.getElementById('book');
  var leaves = Array.prototype.slice.call(book.querySelectorAll('.leaf'));
  var prevB  = document.getElementById('prev');
  var nextB  = document.getElementById('next');
  var count  = document.getElementById('count');
  var N = leaves.length;
  var cur = 0;                    // jumlah lembar yang sudah dibuka
  var timers = [];

  function render(){
    leaves.forEach(function(l, i){
      clearTimeout(timers[i]);
      if (i < cur){
        l.classList.add('flipped');
        l.style.zIndex = 100 + i;
      } else {
        var wasFlipped = l.classList.contains('flipped');
        l.classList.remove('flipped');
        if (wasFlipped){
          l.style.zIndex = 100 + i;                       // tetap di atas saat berbalik
          timers[i] = setTimeout(function(){ l.style.zIndex = 100 - i; }, 900);
        } else {
          l.style.zIndex = 100 - i;
        }
      }
    });
    prevB.disabled = cur === 0;
    nextB.disabled = cur === N - 1;
    count.textContent = cur === 0 ? 'Ketuk buku' : cur + ' / ' + (N - 1);
  }

  function next(){ if (cur < N - 1){ cur++; render(); } }
  function prev(){ if (cur > 0){ cur--; render(); } }

  prevB.addEventListener('click', function(e){ e.stopPropagation(); prev(); });
  nextB.addEventListener('click', function(e){ e.stopPropagation(); next(); });

  // ketuk buku: kiri = mundur, selain itu = maju
  document.addEventListener('click', function(e){
    if (e.target.closest('.nav')) return;
    var r = book.getBoundingClientRect();
    if (e.clientX < r.left + r.width * 0.12) prev(); else next();
  });

  // geser jari
  var sx = null, sy = null;
  document.addEventListener('touchstart', function(e){
    sx = e.touches[0].clientX; sy = e.touches[0].clientY;
  }, {passive:true});
  document.addEventListener('touchend', function(e){
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    var dy = e.changedTouches[0].clientY - sy;
    sx = sy = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)){
      e.preventDefault();
      if (dx < 0) next(); else prev();
    }
  }, {passive:false});

  document.addEventListener('keydown', function(e){
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
  });

  render();
})();
