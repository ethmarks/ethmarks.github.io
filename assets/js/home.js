(function textShimmer() {
  "use strict";

  function processElement(element) {
    const text = element.textContent;
    const delay = parseInt(element.dataset.shimmerDelay || "0", 10);
    const speed = parseInt(element.dataset.shimmerSpeed || "50", 10);
    const inverse = element.dataset.shimmerInverse === "";

    element.innerHTML = "";

    // Split text into words
    const words = text.split(" ");
    const allChars = [];

    words.forEach((word) => {
      // Create word wrapper span
      const wordSpan = document.createElement("span");
      wordSpan.className = "text-shimmer-word";

      // Create character spans within the word
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const charSpan = document.createElement("span");
        charSpan.className = "text-shimmer-char";
        charSpan.textContent = char;
        wordSpan.appendChild(charSpan);
        allChars.push(charSpan);
      }

      element.appendChild(wordSpan);
    });

    // Animate characters in sequence
    allChars.forEach((char, index) => {
      const animationIndex = inverse ? allChars.length - 1 - index : index;
      setTimeout(
        () => {
          char.classList.add("in");
        },
        delay + animationIndex * speed,
      );
    });
  }

  function init() {
    document.querySelectorAll(".text-shimmer").forEach(processElement);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      init();
    }
  });
})();

(function expandChatClick() {
  "use strict";

  let charExpanded = false;

  function toggleExpandChar() {
    const textElements = document.querySelectorAll(
      "#intro #text .text-shimmer",
    );

    textElements.forEach((element) => {
      const chars = element.querySelectorAll(".text-shimmer-char");

      chars.forEach((char, index) => {
        setTimeout(() => {
          if (!charExpanded) {
            char.classList.remove("expand-char");
          } else {
            char.classList.add("expand-char");
          }
        }, index * 15);
      });
    });

    charExpanded = !charExpanded;
  }

  function init() {
    const pfp = document.getElementById("pfp");
    if (pfp) {
      pfp.addEventListener("click", toggleExpandChar);
    }
  }
  document.addEventListener("DOMContentLoaded", init);
})();
