(function loadQuicklink() {
    window.addEventListener("load", () => {
        quicklink.listen();
    });
})();

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

// Add 'scroll' class to tables wider than 90vw
(function addScrollClassToWideTables() {
    function updateTableScrollClasses() {
        var vw90 = window.innerWidth * 0.9;
        document.querySelectorAll("table").forEach(function (table) {
            if (table.scrollWidth > vw90) {
                table.classList.add("scroll");
            } else {
                table.classList.remove("scroll");
            }
        });
    }
    window.addEventListener("DOMContentLoaded", updateTableScrollClasses);
    window.addEventListener("resize", updateTableScrollClasses);
})();

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
