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

// Add 'tall' class to media elements exceeding --max-media-height
(function handleTallMedia() {
    function getMaxMediaHeight() {
        // Get the value of --max-media-height from the root element (in px)
        const root = document.documentElement;
        const value = getComputedStyle(root).getPropertyValue('--max-media-height').trim();
        // Parse value (assume px, fallback to 0 if not found)
        if (value.endsWith('px')) {
            return parseFloat(value);
        }
        return 0;
    }

    function updateTallMediaClasses() {
        const maxHeight = getMaxMediaHeight();
        if (!maxHeight) return;
        document.querySelectorAll('img, video, iframe').forEach(function (el) {
            // Use offsetHeight for rendered height
            if (el.offsetHeight > maxHeight) {
                el.classList.add('media-tall');
            } else {
                el.classList.remove('media-tall');
            }
        });
    }

    window.addEventListener("DOMContentLoaded", updateTallMediaClasses);
    window.addEventListener("load", updateTallMediaClasses);
    window.addEventListener("resize", updateTallMediaClasses);
})();
