(function () {
  const ticker = document.getElementById('quoteTicker');
  if (!ticker) return;
  const track = ticker.querySelector('.track');
  const items = track.querySelectorAll('.item');
  const count = items.length;          // includes duplicate
  let i = 0;

  function row() {
    // lock to actual pixel height for perfect alignment
    return items[0].getBoundingClientRect().height | 0; // integer px
  }

  function step() {
    i += 1;
    track.classList.add('is-animating');
    track.style.transform = `translateY(${-i * row()}px)`;
  }

  track.addEventListener('transitionend', () => {
    // reached the duplicate? snap back without animation
    if (i === count - 1) {
      track.classList.remove('is-animating');
      i = 0;
      track.style.transform = 'translateY(0)';
      // force reflow so next add of class animates
      void track.offsetHeight;
      track.classList.add('is-animating');
    }
  });

  // initial position
  track.style.transform = 'translateY(0)';

  // run
  const INTERVAL = 4000; // ms per quote
  setInterval(step, INTERVAL);
})();