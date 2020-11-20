"use strict";



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
