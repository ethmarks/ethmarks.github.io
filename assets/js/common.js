(function handleOverflow() {
  function updateOverflowClasses() {
    const widthOverflowClass = "width-overflow";
    const heightOverflowClass = "height-overflow";

    const selectors = ["body", "pre", "table"];

    document.querySelectorAll(selectors).forEach(function (el) {
      const contentWidth = el.scrollWidth;
      let contentHeight = el.scrollHeight;

      let containerWidth, containerHeight;

      if (el.tagName.toLowerCase() === "body") {
        containerWidth = window.innerWidth;
        containerHeight = window.innerHeight;
        contentHeight = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
        );
      } else {
        const parent = el.parentElement;
        containerWidth = parent ? parent.clientWidth : window.innerWidth;
        containerHeight = parent ? parent.clientHeight : window.innerHeight;
      }

      if (contentHeight === 0 || contentWidth === 0) {
        return;
      }

      if (contentWidth > containerWidth) {
        el.classList.add(widthOverflowClass);
      } else {
        el.classList.remove(widthOverflowClass);
      }
      if (contentHeight > containerHeight) {
        el.classList.add(heightOverflowClass);
      } else {
        el.classList.remove(heightOverflowClass);
      }
    });
  }
  window.addEventListener("DOMContentLoaded", updateOverflowClasses);
  window.addEventListener("resize", updateOverflowClasses);
})();

(function handleBirthdayMode() {
  window.addEventListener("DOMContentLoaded", function () {
    const today = new Date();
    if (today.getMonth() === 8 && today.getDate() === 13) {
      // September 13th
      const header = document.querySelector("header");
      const title = header.querySelector("#title");

      function applyBirthdayMode() {
        header.classList.add("birthday-mode");
      }

      function applyBirthdayModeDelayed() {
        applyBirthdayMode();
        header.classList.add("birthday-mode-delayed");
      }

      // Check if title is visible (not still animating in)
      const titleStyles = getComputedStyle(title);
      const isVisible =
        titleStyles.opacity !== "0" && titleStyles.opacity !== "0.2";

      if (isVisible) {
        applyBirthdayMode();
      } else {
        setTimeout(applyBirthdayModeDelayed, 1000);
      }
    }
  });
})();
