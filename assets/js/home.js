(function textShimmer() {
  'use strict';

  function processElement(element) {
    const text = element.textContent;
    const delay = parseInt(element.dataset.shimmerDelay || '0', 10);
    const speed = parseInt(element.dataset.shimmerSpeed || '50', 10);
    const inverse = element.dataset.shimmerInverse === '';

    element.innerHTML = '';

    // Create character spans
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const span = document.createElement('span');
      span.className = 'text-shimmer-char';
      span.innerHTML = char === ' ' ? '&nbsp;' : char;
      element.appendChild(span);
    }

    // Animate characters in sequence
    const chars = element.querySelectorAll('.text-shimmer-char');
    chars.forEach((char, index) => {
      const animationIndex = inverse ? chars.length - 1 - index : index;
      setTimeout(() => {
        char.classList.add('in');
      }, delay + (animationIndex * speed));
    });
  }

  function init() {
    document.querySelectorAll('.text-shimmer').forEach(processElement);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      init();
    }
  });
})();

(function expandChatClick() {
  'use strict';

  let charExpanded = false;

  function toggleExpandChar() {
    const textElements = document.querySelectorAll('#intro #text .text-shimmer');

    textElements.forEach(element => {
      const chars = element.querySelectorAll('.text-shimmer-char');

      chars.forEach((char, index) => {
        setTimeout(() => {
          if (!charExpanded) {
            char.classList.remove('expand-char');
          } else {
            char.classList.add('expand-char');
          }
        }, index * 15);
      });
    });

    charExpanded = !charExpanded;
  }

  function init() {
    const pfp = document.getElementById('pfp');
    if (pfp) {
      pfp.addEventListener('click', toggleExpandChar);
    }
  }
  document.addEventListener('DOMContentLoaded', init);
})();
