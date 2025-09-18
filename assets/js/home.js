(function textShimmer() {
  'use strict';

  // Inject required styles
  const styles = `
        .text-shimmer-char {
            display: inline-block;
            opacity: 0;
            transform: translateY(-3px);
            filter: blur(2px);
            transition: all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
        }
        .text-shimmer-char.in {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
        }
    `;

  function injectStyles() {
    if (!document.getElementById('text-shimmer-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'text-shimmer-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }
  }

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
    injectStyles();
    document.querySelectorAll('.text-shimmer').forEach(processElement);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      init();
    }
  });
})();

(function tiltCard() {
  document.addEventListener("DOMContentLoaded", function () {
    if (window.matchMedia("(pointer: fine)").matches && window.VanillaTilt) {
      VanillaTilt.init(document.querySelectorAll(".tilt-card"));
    }
  });
})();
