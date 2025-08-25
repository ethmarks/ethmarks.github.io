// Handle short pages: fix footer, background, and anchor article
(function handleShortPage() {
    function updateShortPageElements() {
        const body = document.body;
        const footer = document.querySelector("footer");
        const article = document.querySelector("article");
        const tolerance = 4;
        const isShortPage =
            document.documentElement.scrollHeight <=
            window.innerHeight + tolerance;

        // Update footer position
        if (footer) {
            if (isShortPage) {
                footer.classList.add("fixed-bottom");
            } else {
                footer.classList.remove("fixed-bottom");
            }
        }

        // Update background attachment via class
        if (body) {
            if (isShortPage) {
                body.classList.add("background-fixed");
            } else {
                body.classList.remove("background-fixed");
            }
        }

        // Add or remove 'anchored' class to article
        if (article) {
            if (!isShortPage) {
                article.classList.add("anchored");
            } else {
                article.classList.remove("anchored");
            }
        }
    }

    window.addEventListener("DOMContentLoaded", updateShortPageElements);
    window.addEventListener("load", updateShortPageElements);
    window.addEventListener("resize", updateShortPageElements);
})();

// Generic function to add 'scroll' class to overflowing elements
function addScrollClassOnOverflow(selector) {
    function updateScrollClasses() {
        document.querySelectorAll(selector).forEach(function (el) {
            const parent = el.parentElement;
            const containerWidth = parent
                ? parent.clientWidth
                : window.innerWidth;
            if (el.scrollWidth > containerWidth) {
                el.classList.add("scroll");
            } else {
                el.classList.remove("scroll");
            }
        });
    }
    window.addEventListener("DOMContentLoaded", updateScrollClasses);
    window.addEventListener("resize", updateScrollClasses);
}

// Use the generic function for tables and pre elements
addScrollClassOnOverflow("table");
addScrollClassOnOverflow("pre");

// add 'lightmode' class to body if user prefers light color scheme
const allowLightMode = false;
const forceLightMode = false;
(function handleLightMode() {
    const lightQuery = window.matchMedia("(prefers-color-scheme: light)");
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function updateLightMode() {
        if ((lightQuery.matches && allowLightMode) || forceLightMode) {
            document.body.classList.add("lightmode");
        } else {
            document.body.classList.remove("lightmode");
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        updateLightMode();
        lightQuery.addEventListener("change", updateLightMode);
        darkQuery.addEventListener("change", updateLightMode);
    });
})();

// Properly size media elements according to sizing rules
(function handleMediaSizing() {
    function resizeMedia() {
        document.querySelectorAll('img.content-media, video.content-media').forEach(function(el) {
            // Get natural dimensions
            let naturalWidth, naturalHeight;

            if (el.tagName.toLowerCase() === 'img') {
                naturalWidth = el.naturalWidth || parseInt(el.getAttribute('width')) || 0;
                naturalHeight = el.naturalHeight || parseInt(el.getAttribute('height')) || 0;
            } else if (el.tagName.toLowerCase() === 'video') {
                naturalWidth = el.videoWidth || parseInt(el.getAttribute('width')) || 0;
                naturalHeight = el.videoHeight || parseInt(el.getAttribute('height')) || 0;
            } else {
                // For iframes, use attribute dimensions or defaults
                naturalWidth = parseInt(el.getAttribute('width')) || 800;
                naturalHeight = parseInt(el.getAttribute('height')) || 600;
            }

            if (naturalWidth === 0 || naturalHeight === 0) return;

            // Get CSS variables
            const computedStyle = getComputedStyle(el);
            const maxWidthValue = computedStyle.getPropertyValue('max-width');
            const maxHeightValue = computedStyle.getPropertyValue('max-height');

            // Parse CSS values (handle clamp, calc, etc.)
            const tempDiv = document.createElement('div');
            tempDiv.style.width = maxWidthValue;
            tempDiv.style.height = maxHeightValue;
            tempDiv.style.position = 'absolute';
            tempDiv.style.visibility = 'hidden';
            document.body.appendChild(tempDiv);

            const maxWidth = tempDiv.offsetWidth;
            const maxHeight = tempDiv.offsetHeight;

            document.body.removeChild(tempDiv);

            // Calculate aspect ratio
            const aspectRatio = naturalWidth / naturalHeight;

            // Rule 3: Try to make width equal to max-width (preferred width)
            let targetWidth = maxWidth;
            let targetHeight = targetWidth / aspectRatio;

            // Rule 2: Check if height exceeds max-height
            if (targetHeight > maxHeight) {
                // Scale based on height instead
                targetHeight = maxHeight;
                targetWidth = targetHeight * aspectRatio;
            }

            // Apply the calculated dimensions
            el.style.width = Math.round(targetWidth) + 'px';
            el.style.height = Math.round(targetHeight) + 'px';
        });
    }

    // Run on DOM ready and when images load
    function handleMediaLoad() {
        // Wait a bit for images to load their natural dimensions
        setTimeout(resizeMedia, 10);
    }

    window.addEventListener('DOMContentLoaded', resizeMedia);
    window.addEventListener('load', resizeMedia);
    window.addEventListener('resize', resizeMedia);

    // Also listen for image load events
    document.addEventListener('load', function(e) {
        if (e.target.tagName && ['IMG', 'VIDEO', 'IFRAME'].includes(e.target.tagName.toUpperCase())) {
            handleMediaLoad();
        }
    }, true);
})();
