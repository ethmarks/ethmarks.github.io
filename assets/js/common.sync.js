(function handleOverflow() {
  function updateOverflowClasses() {
    const widthOverflowClass = "width-overflow";
    const heightOverflowClass = "height-overflow";

    const tolerance = 0;

    const selectors = ["body", "pre", "table"]

    document.querySelectorAll(selectors).forEach(function (el) {
      const parent = el.parentElement;
      const contentWidth = el.scrollWidth;
      const contentHeight = el.scrollHeight;
      const containerWidth = parent
        ? parent.clientWidth
        : window.innerWidth;
      const containerHeight = parent
        ? parent.clientHeight
        : window.innerHeight

      if (contentHeight == 0 || contentWidth == 0 || el.tagName === "HTML") {
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

(function handleMediaSizing() {
  function resizeMedia() {
    document.querySelectorAll('.responsive').forEach(function (el) {
      let naturalWidth, naturalHeight;

      if (el.tagName.toLowerCase() === 'img') {
        naturalWidth = el.naturalWidth || parseInt(el.getAttribute('width')) || 0;
        naturalHeight = el.naturalHeight || parseInt(el.getAttribute('height')) || 0;
      } else if (el.tagName.toLowerCase() === 'video') {
        naturalWidth = el.videoWidth || parseInt(el.getAttribute('width')) || 0;
        naturalHeight = el.videoHeight || parseInt(el.getAttribute('height')) || 0;
      } else {
        naturalWidth = parseInt(el.getAttribute('width')) || 800;
        naturalHeight = parseInt(el.getAttribute('height')) || 600;
      }

      if (naturalWidth === 0 || naturalHeight === 0) return;

      const computedStyle = getComputedStyle(el);
      const maxWidthValue = computedStyle.getPropertyValue('max-width');
      const maxHeightValue = computedStyle.getPropertyValue('max-height');

      if (maxWidthValue === '100%') return;

      const tempDiv = document.createElement('div');
      tempDiv.style.width = maxWidthValue;
      tempDiv.style.height = maxHeightValue;
      tempDiv.style.position = 'absolute';
      tempDiv.style.visibility = 'hidden';
      document.body.appendChild(tempDiv);
      const maxWidth = tempDiv.offsetWidth;
      const maxHeight = tempDiv.offsetHeight;
      document.body.removeChild(tempDiv);

      const aspectRatio = naturalWidth / naturalHeight;

      let targetWidth = maxWidth;
      let targetHeight = targetWidth / aspectRatio;

      if (targetHeight > maxHeight) {
        targetHeight = maxHeight;
        targetWidth = targetHeight * aspectRatio;
      }

      el.style.width = Math.round(targetWidth) + 'px';
      el.style.height = Math.round(targetHeight) + 'px';
    });
  }

  function handleMediaLoad() {setTimeout(resizeMedia, 10);}

  window.addEventListener('DOMContentLoaded', resizeMedia);
  window.addEventListener('load', resizeMedia);
  window.addEventListener('resize', resizeMedia);
  document.addEventListener('load', function (e) {
    if (e.target.tagName && ['IMG', 'VIDEO', 'IFRAME'].includes(e.target.tagName.toUpperCase())) {
      handleMediaLoad();
    }
  }, true);
})();

(function handleBirthdayMode() {
  window.addEventListener('DOMContentLoaded', function () {
    const today = new Date();
    if (today.getMonth() === 8 && today.getDate() === 13) { // September 13th
      const header = document.querySelector('header');
      const title = header.querySelector('#title');

      function applyBirthdayMode() {
        header.classList.add('birthday-mode');
      }

      function applyBirthdayModeDelayed() {
        applyBirthdayMode();
        header.classList.add('birthday-mode-delayed');
      }

      // Check if title is visible (not still animating in)
      const titleStyles = getComputedStyle(title);
      const isVisible = titleStyles.opacity !== '0' && titleStyles.opacity !== '0.2';

      if (isVisible) {
        applyBirthdayMode();
      } else {
        setTimeout(applyBirthdayModeDelayed, 1000);
      }
    }
  });
})();
