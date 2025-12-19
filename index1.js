window.addEventListener('load', function () {
  const ticker = document.getElementById('quoteTicker');
  if (!ticker) return;
  
  const track = ticker.querySelector('.track');
  const items = track.querySelectorAll('.item');
  const count = items.length;
  let currentIndex = 0;
  const INTERVAL = 4000; 

  function getRowHeight() {
    return items[0].offsetHeight;
  }

  function nextSlide() {
    currentIndex++;
    track.classList.remove('no-transition');
    track.style.transform = `translateY(${-currentIndex * getRowHeight()}px)`;

    if (currentIndex === count - 1) {
      setTimeout(() => {
        track.classList.add('no-transition');
        currentIndex = 0;
        track.style.transform = `translateY(0px)`;
      }, 600);
    }
  }

  setInterval(nextSlide, INTERVAL);
});