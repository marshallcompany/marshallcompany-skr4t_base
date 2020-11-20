'use strict'

// MARQUEE AND RANGE
const range = document.getElementById('range');
$('#range').ionRangeSlider({
  skin: "big",
  grid: true,
  min: 0,
  step: 150,
  max: 600,
  from: 0
});

const rangeChange = range.onchange = () => {
  document.querySelector('.range-wrapper__value').innerHTML = `~${range.value} слов/минута`;
  if (Number(range.value) < 1) {
    document.querySelector('.range-wrapper__value').style.opacity = '0';
    document.querySelector('.reading-speed__number').style.opacity = '0';
    document.querySelector('.reading-speed__stop').style.opacity = '0';
    document.querySelector('.reading-speed__information').style.opacity = '1';
  } else {
    document.querySelector('.range-wrapper__value').style.opacity = '1';
    document.querySelector('.reading-speed__number').style.opacity = '1';
    document.querySelector('.reading-speed__stop').style.opacity = '1';
    document.querySelector('.reading-speed__information').style.opacity = '0';
  }
  if (Number(range.value) === 150) {
    handleMarquee(3);
  } else if (Number(range.value) === 300) {
    handleMarquee(4);
  } else if (Number(range.value) === 450) {
    handleMarquee(5);
  } else if (Number(range.value) === 600) {
    handleMarquee(6);
  } else if (Number(range.value) === 0) {
    handleMarquee(Number(range.value));
  }
}

function handleMarquee(speedNumber) {
  const marquee = document.querySelectorAll('.marquee');
  const marqueeElement = document.getElementById('marquee');
  let speed = speedNumber;
  if (speed !== 0) {
    marqueeElement.classList.add('active');
  } else {
    marqueeElement.classList.remove('active');
  }
  marquee.forEach(function (el) {
    const container = el.querySelector('.marquee__wrapper');
    const content = el.querySelector('.marquee__wrapper > *');
    const elWidth = content.offsetWidth;
    let progress;
    if (speedNumber === 0) {
      progress = 0;
    } else {
      progress = window.innerWidth;
    }
    function loop() {
      progress = progress - speed;
      if (progress <= elWidth * -1) { progress = window.innerWidth; }
      container.style.transform = 'translateX(' + progress + 'px)';
      window.requestAnimationFrame(loop);
    }
    loop();
  });
};

function marqueeStop() {
  const slider = $("#range").data("ionRangeSlider");
  handleMarquee(0);
  slider.update({
    from: 0
  });
}