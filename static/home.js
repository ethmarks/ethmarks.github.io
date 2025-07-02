function isMobileDevice() {
    return window.matchMedia("(pointer: coarse)").matches;
}
if (!isMobileDevice()) {
    const script = document.createElement("script");
    script.src =
        "https://cdn.jsdelivr.net/npm/vanilla-tilt@1.8.1/dist/vanilla-tilt.min.js";
    script.onload = function () {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
    };
    document.head.appendChild(script);
}
