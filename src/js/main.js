"use strict";

// TEXT ANIMATION

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var phrases = ['скорочтение 2.0', 'скорочтение 2.0', 'скрчт 2.0'];

var TextScramble = function () {
  function TextScramble(el) {
    _classCallCheck(this, TextScramble);

    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }

  _createClass(TextScramble, [{
    key: 'setText',
    value: function setText(newText) {
      var _this = this;

      if (newText) {
        var oldText = this.el.innerText;
        var length = Math.max(oldText.length, newText.length);
        var promise = new Promise(function (resolve) {
          return _this.resolve = resolve;
        });
        this.queue = [];

        for (var i = 0; i < length; i++) {
          var from = oldText[i] || '';
          var to = newText[i] || '';
          var start = Math.floor(Math.random() * 40);
          var end = start + Math.floor(Math.random() * 40);
          this.queue.push({
            from: from,
            to: to,
            start: start,
            end: end
          });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
      }
    }
  }, {
    key: 'update',
    value: function update() {
      var output = '';
      var complete = 0;

      for (var i = 0, n = this.queue.length; i < n; i++) {
        var _queue$i = this.queue[i];
        var from = _queue$i.from;
        var to = _queue$i.to;
        var start = _queue$i.start;
        var end = _queue$i.end;
        var char = _queue$i.char;


        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }

          output += '<span class="dud">' + char + '</span>';
        } else {
          output += from;
        }
      }

      this.el.innerHTML = output;

      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
  }, {
    key: 'randomChar',
    value: function randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }]);

  return TextScramble;
}();

var el = document.querySelector('.skr4t-information__subtitle');
var fx = new TextScramble(el);
var counter = 0;

var next = function next() {
  if (phrases[counter]) {
    fx.setText(phrases[counter]).then(function () {
      setTimeout(next, 1000);
      if (counter === phrases.length) {
        document.querySelector('.skr4t-start').style.opacity = '1';
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  counter++;
};

next();

// MODE

function mode() {
  const navigationElements = document.querySelector('.header-navigation');
  const modeElements = document.querySelectorAll('.mode');
  modeElements.forEach(element => {
    if (element.classList.contains('light-mode')) {
      element.classList.remove('light-mode');
    }
    if (element.classList.contains('dark-mode')) {
      element.classList.remove('dark-mode');
      navigationElements.classList.add('light-mode');
    } else {
      element.classList.add('dark-mode');
    }
  })
}

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
  } else {
    document.querySelector('.range-wrapper__value').style.opacity = '1';
    document.querySelector('.reading-speed__number').style.opacity = '1';
    document.querySelector('.reading-speed__stop').style.opacity = '1';
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

let clickEvent = 0;
function scrollToElement(element) {
  if (element === '.main' && clickEvent === 0) {
    clickEvent = 1;
    document.querySelectorAll('.video-clip')[0].play()
    document.querySelector('.main').setAttribute(
      'style',
      'position: relative; height: auto; overflow: auto;');
    // INIT SWIPER JS
    const videoSwiper = new Swiper('.swiper-container', {
      direction: 'horizontal',
      loop: false,
      slidesPerView: 'auto',
      resistance: true,
      resistanceRatio: 0,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        320: {
          autoHeight: true
        },
        768: {
          autoHeight: false
        },
      }
    })
    videoSwiper.on('transitionStart', function (event) {
      const videoElement = document.querySelectorAll('.video-clip');
      videoElement.forEach(el => {
        el.pause();
        el.currentTime = 0;
      })
      videoElement[event.snapIndex].play();
    });
  }
  document.querySelector(element).scrollIntoView({
    behavior: 'smooth'
  });
}

// FORM
const telInput = document.querySelector('#inputPhone');
const emailInput = document.querySelector('#inputEmail');
const nameInput = document.querySelector('#inputName');
const radioInput = document.querySelectorAll('input[type="radio"]');

const iti = window.intlTelInput(telInput, {
  utilsScript: 'libs/intlTelInput/utils.js',
  initialCountry: 'ru'
})

const submitButton = document.querySelector('button[type="submit"]');
submitButton.classList.add('disabled');

const form = document.querySelector('form');
let rbValid = false
form.addEventListener('input', function () {
  for (const rb of radioInput) {
    if (rb.checked) {
      rbValid = true;
      break;
    }
  }
  if (iti.isValidNumber() && validator.isEmail(emailInput.value) && nameInput.value && rbValid) {
    submitButton.classList.remove('disabled');
  } else {
    submitButton.classList.add('disabled');
  }
});

telInput.addEventListener('keypress', (event) => {
  const pattern = /[0-9]/;
  const inputChar = String.fromCharCode(event.charCode);
  if (event.keyCode !== 8 && !pattern.test(inputChar)) {
    event.preventDefault();
  }
})

window.addEventListener('scroll', (event) => {
  if (this.scrollY > document.querySelector('.header').offsetHeight) {
    document.querySelector('.header-navigation').style.transform = 'translateY(0)'
  } else {
    document.querySelector('.header-navigation').style.transform = 'translateY(-100%)'
  }
})