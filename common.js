(function loadQuicklink() {
    if (typeof quicklink === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/quicklink@2.2.0/dist/quicklink.umd.js';
        script.onload = () => {
            quicklink.listen();
        };
        document.head.appendChild(script);
    } else {
        quicklink.listen();
    }
})();

customElements.define('ethan-header',
    class EthanHeader extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = `
            <style>
            header {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(-20px) translate3d(0,0,0);
                width: 100vw;
                max-width: 1000px;
                padding: 10px 15px;
                background: rgba(30, 30, 30, 0.2);
                border: 1.5px solid rgba(255, 255, 255, 0.03);
                border-radius: 40px;
                backdrop-filter: blur(20px) saturate(0.8);
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: white;
                box-sizing: border-box;
                z-index: 1000;
                overflow: hidden;
                /* Header itself still animates in */
                animation: flyInFromTop 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }

            @keyframes flyInFromTop {
                to {
                    transform: translateX(-50%) translateY(0) translate3d(0,0,0);
                }
            }

            .title-container {
                background: linear-gradient(135deg, #ffffff, #8fdfd4);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                flex-shrink: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                transform: translateX(-300px);
                animation: flyInFromLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                opacity: 0.2;
                cursor: pointer;
                border: none;
                outline: none;
                text-decoration: none;
                display: inline-block;
            }

            .title-container:focus-visible {
                outline: 2px solid var(--color-focus-outline, #8fdfd4);
                outline-offset: 2px;
            }

            .title-item:nth-child(2) { animation: increaseLeftMargin 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
            
            @keyframes flyInFromLeft {
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes increaseLeftMargin {
                from {
                    margin-left: -20px;
                }
                to {
                    margin-left: 10px;
                }
            }

            .title-item {
                font-family: "Sen", sans-serif;
                font-size: clamp(1rem, 4vw, 2rem);
            }
            nav {
                display: flex;
                gap: 8px;
                flex-shrink: 0;
            }
            nav a {
                background: rgba(60, 60, 60, 0.1);
                color: white;
                border: 2px solid rgba(255, 255, 255, 0.03);
                border-radius: 20px;
                padding: 6px 12px;
                font-family: "Sen", sans-serif;
                font-size: clamp(0.75rem, 3vw, 1rem);
                cursor: pointer;
                transition: background-color 0.2s ease, transform 0.2s ease;
                white-space: nowrap;
                text-decoration: none;
                transform: translateX(350px); /* Initial state for nav links */
                opacity: 0; /* Initial state for nav links */
                animation: flyInFromRight 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
            
            /* Staggered animation delays for each button */
            nav a:nth-child(1) { animation-delay: 0.1s; }
            nav a:nth-child(2) { animation-delay: 0.2s; }
            nav a:nth-child(3) { animation-delay: 0.3s; }
            nav a:nth-child(4) { animation-delay: 0.4s; }

            @keyframes flyInFromRight {
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            nav a:hover {
                background-color: rgba(80, 80, 80, 0.7);
                transform: translateY(-1px) scale(1.02);
            }

            @media (max-width: 768px) {
                header {
                    max-width: 100vw;
                    border-radius: 0;
                    top: 0;
                }
                nav {
                    gap: 4px;
                }
                .title-item:nth-child(2) {
                    animation: none;
                }
            }

            /* New styles to skip nav animations when the 'nav-animations-skipped' class is applied to header */
            header.nav-animations-skipped {
                animation-duration: 0s;
                transform: translateX(-50%) translateY(0) translate3d(0,0,0);
            }
            header.nav-animations-skipped nav a {
                animation-duration: 0s;
                animation-delay: 0s; /* Crucial to override staggered delays */
                /* Ensure they jump to their final state */
                transform: translateX(0);
                opacity: 1;
            }
            </style>
            <header>
                <a href="/" class="title-container" tabindex="0" aria-label="Home">
                    <span class="title-item">Ethan</span>
                    <span class="title-item"> Marks</span>
                </a>
                <nav>
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/blog">Blog</a>
                    <a href="/tag/projects">Projects</a>
                </nav>
            </header>
        `;
        }

        connectedCallback() {
            // Get references to the header and nav elements within the shadow DOM
            const headerElement = this.shadowRoot.querySelector('header');
            const navElement = this.shadowRoot.querySelector('nav');

            if (headerElement && navElement) {
                // Function to add the 'nav-animations-skipped' class and clean up listeners
                const skipNavAnimations = () => {
                    headerElement.classList.add('nav-animations-skipped');
                    // Once nav animations are skipped, remove event listeners.
                    // The "fly-in" effects are meant to run once or be instantly skipped.
                    headerElement.removeEventListener('mouseenter', handleHeaderEnter);
                    headerElement.removeEventListener('focusin', handleHeaderFocusIn);
                };

                // Event handler for mouse entering the entire header area
                const handleHeaderEnter = () => {
                    skipNavAnimations();
                };

                // Event handler for keyboard focus entering anywhere within the header
                // This covers accessibility for keyboard users by checking if focus lands inside <header>
                const handleHeaderFocusIn = (event) => {
                    if (headerElement.contains(event.target)) { // Ensure focus is truly within the header
                        skipNavAnimations();
                    }
                };

                // Attach event listeners to the header element
                headerElement.addEventListener('mouseenter', handleHeaderEnter);
                headerElement.addEventListener('focusin', handleHeaderFocusIn);
            }
        }
    }
);

customElements.define('ethan-footer',
    class EthanFooter extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });

            this.shadowRoot.innerHTML = `
            <style>
                footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    margin-top: 40px;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    transform: translate3d(0,0,0); /* Force GPU rendering */
                    border-top: 1px solid rgba(255, 255, 255, 0.18);
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                    border-radius: 0px;
                    padding: 10px 30px;
                    box-sizing: border-box;
                    color: #eee;
                    z-index: 9999;
                    position: static;
                    left: unset;
                    bottom: unset;
                    transition: position 0.2s;
                }
                footer.fixed-bottom {
                    position: fixed;
                    left: 0;
                    bottom: 0;
                    margin-top: 0;
                    width: 100vw;
                    max-width: 100vw;
                }
                a {
                    color: inherit;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }
                a:hover {
                    color: #fff;
                    text-decoration: underline;
                }
                .copyright {
                   font-style: italic;
                }
                .sitemap {
                    align-self: flex-end;
                }
            </style>
            <footer>
                <span class="copyright">Ethan Marks, &copy;2025</span>
                <span class="sitemap"><a href="/sitemap.html">Sitemap</a></span>
            </footer>
          `;
        }
        connectedCallback() {
            this.footer = this.shadowRoot.querySelector('footer');
            this.updateFooterPosition = this.updateFooterPosition.bind(this);
            this._footerAnimationFrame = null;
            this._footerLoop = () => {
                this.updateFooterPosition();
                this._footerAnimationFrame = requestAnimationFrame(this._footerLoop);
            };
            window.addEventListener('resize', this.updateFooterPosition);
            this._footerLoop();
        }
        disconnectedCallback() {
            window.removeEventListener('resize', this.updateFooterPosition);
            if (this._footerAnimationFrame) {
                cancelAnimationFrame(this._footerAnimationFrame);
                this._footerAnimationFrame = null;
            }
        }
        updateFooterPosition() {
            // Check if the document is shorter than the viewport
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;
            if (docHeight <= winHeight + 1) {
                this.footer.classList.add('fixed-bottom');
            } else {
                this.footer.classList.remove('fixed-bottom');
            }
        }
    }
);

customElements.define('external-link',
    class ExternalLink extends HTMLElement {
        static icons = {
            github: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
            itchio: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M71.92 34.77C50.2 47.67 7.4 96.84 7 109.73v21.34c0 27.06 25.29 50.84 48.25 50.84 27.57 0 50.54-22.85 50.54-50 0 27.12 22.18 50 49.76 50s49-22.85 49-50c0 27.12 23.59 50 51.16 50h.5c27.57 0 51.16-22.85 51.16-50 0 27.12 21.47 50 49 50s49.76-22.85 49.76-50c0 27.12 23 50 50.54 50 23 0 48.25-23.78 48.25-50.84v-21.34c-.4-12.9-43.2-62.07-64.92-75C372.56 32.4 325.76 32 256 32S91.14 33.1 71.92 34.77zm132.32 134.39c-22 38.4-77.9 38.71-99.85.25-13.17 23.14-43.17 32.07-56 27.66-3.87 40.15-13.67 237.13 17.73 269.15 80 18.67 302.08 18.12 379.76 0 31.65-32.27 21.32-232 17.75-269.15-12.92 4.44-42.88-4.6-56-27.66-22 38.52-77.85 38.1-99.85-.24-7.1 12.49-23.05 28.94-51.76 28.94a57.54 0 0 1-51.75-28.94zm-41.58 53.77c16.47 0 31.09 0 49.22 19.78a436.91 436.91 0 0 1 88.18 0C318.22 223 332.85 223 349.31 223c52.33 0 65.22 77.53 83.87 144.45 17.26 62.15-5.52 63.67-33.95 63.73-42.15-1.57-65.49-32.18-65.49-62.79-39.25 6.43-101.93 8.79-155.55 0 0 30.61-23.34 61.22-65.49 62.79-28.42-.06-51.2-1.58-33.94-63.73 18.67-67 31.56-144.45 83.88-144.45zM256 270.79s-44.38 40.77-52.35 55.21l29-1.17v25.32c0 1.55 21.34.16 23.33.16 11.65.54 23.31 1 23.31-.16v-25.28l29 1.17c-8-14.48-52.35-55.24-52.35-55.24z"/></svg>`,
            email: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
            colab: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" role="img"><path d="M16.9414 4.9757a7.033 7.033 0 0 0-4.9308 2.0646 7.033 7.033 0 0 0-.1232 9.8068l2.395-2.395a3.6455 3.6455 0 0 1 5.1497-5.1478l2.397-2.3989a7.033 7.033 0 0 0-4.8877-1.9297zM7.07 4.9855a7.033 7.033 0 0 0-4.8878 1.9316l2.3911 2.3911a3.6434 3.6434 0 0 1 5.0227.1271l1.7341-2.9737-.0997-.0802A7.033 7.033 0 0 0 7.07 4.9855zm15.0093 2.1721l-2.3892 2.3911a3.6455 3.6455 0 0 1-5.1497 5.1497l-2.4067 2.4068a7.0362 7.0362 0 0 0 9.9456-9.9476zM1.932 7.1674a7.033 7.033 0 0 0-.002 9.6816l2.397-2.397a3.6434 3.6434 0 0 1-.004-4.8916zm7.664 7.4235c-1.38 1.3816-3.5863 1.411-5.0168.1134l-2.397 2.395c2.4693 2.3328 6.263 2.5753 9.0072.5455l.1368-.1115z"/></svg>`,
            link: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`
        };

        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });

            shadow.innerHTML = `
                <style>
                    :host {
                        align-items: center;
                        font-family: var(--font-primary, sans-serif);
                        display: flex;
                        flex-wrap: wrap;
                        gap: var(--spacing-md);
                        justify-content: center; /* Center links if they wrap */
                        margin-bottom: var(--spacing-md);
                    }

                    .icon {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 24px;
                        height: 24px;
                    }

                    .link {
                        text-decoration: none;
                        color: var(--color-button-text);
                        font-weight: var(--font-weight-semibold, 600);
                    }

                    .link:hover {
                        color: var(--color-link-hover, white);
                    }

                    a {
                        padding: clamp(0.5rem, 1vw, 1rem) clamp(0.8rem, 2vw, 2rem);
                        background: linear-gradient(135deg, var(--color-accent-light), var(--color-accent));
                        color: var(--color-button-text);
                        font-weight: var(--font-weight-semibold);
                        text-decoration: none;
                        border-radius: var(--radius-md);
                        font-size: var(--font-size-md);
                        display: inline-flex;
                        align-items: center;
                        gap: var(--spacing-sm);
                        box-shadow: var(--shadow-button);
                        position: relative;
                        overflow: hidden;
                        transition: transform 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
                        animation: externalLinkReveal 1s var(--transition-timing) forwards;
                    }

                    @keyframes externalLinkReveal {
                        from {
                            transform: translateX(-30px) scale(0.9);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0) scale(1);
                            opacity: 1;
                        }
                    }

                    a:hover {
                        transform: translateY(-3px);
                        box-shadow: var(--shadow-button-hover);
                    }

                    a:focus-visible {
                        outline: 2px solid var(--color-focus-outline);
                        outline-offset: 3px;
                        box-shadow: var(--shadow-button-hover);
                    }

                    a::after { /* Shimmer effect */
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 50%;
                        height: 100%;
                        background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
                        transform: translateX(-100%) skewX(-20deg); /* Start off-screen */
                        transition: transform 0.5s ease; /* Slower shimmer transition */
                        opacity: 0.8;
                    }

                    a:hover::after {
                        transform: translateX(250%) skewX(-20deg);
                    }

                    svg {
                        transition: var(--transition-transform);
                        width: 1.2em;
                        height: 1.2em;
                    }

                    a:hover svg {
                        transform: rotate(10deg) scale(1.1);
                    }
            </style>

            <a class="link" id="link" target="_blank">
                <div class="icon" id="icon"></div>
                <slot name="title">Default Title</slot>
            </a>
            `;

            this.iconElement = shadow.getElementById('icon');
            this.linkElement = shadow.getElementById('link');

            if (this.hasAttribute('icon')) {
                const iconName = this.getAttribute('icon');
                if (ExternalLink.icons[iconName]) {
                    this.iconElement.innerHTML = ExternalLink.icons[iconName];
                } else {
                    this.iconElement.textContent = iconName;
                }
            }

            if (this.hasAttribute('href')) {
                this.linkElement.setAttribute('href', this.getAttribute('href'));
            }
        }

        static get observedAttributes() {
            return ['icon', 'href'];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (name === 'icon') {
                if (ExternalLink.icons[newValue]) {
                    this.iconElement.innerHTML = ExternalLink.icons[newValue];
                } else {
                    this.iconElement.textContent = newValue;
                }
            } else if (name === 'href') {
                this.linkElement.setAttribute('href', newValue);
            }
        }
    }
);

customElements.define('scroll-indicator',
    class ScrollIndicator extends HTMLElement {

        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        position: fixed;
                        top: 0;
                        width: 3px;
                        height: 100vh;
                        z-index: 10;
                    }
                    .track {
                        width: 100%;
                        height: 100%;
                        background-color: rgba(255, 255, 255, 0.05);
                        border-radius: 4px;
                        position: relative;
                    }
                    .indicator {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 120px;
                        background: linear-gradient(
                            180deg, 
                            rgba(102, 252, 241, 0) 0%,
                            rgba(102, 252, 241, 0.8) 50%,
                            rgba(102, 252, 241, 0) 100%
                        );
                        border-radius: 4px;
                        transform: translateY(0);
                    }
                </style>
                <div class="track">
                    <div class="indicator"></div>
                </div>
            `;
        }

        connectedCallback() {
            this.indicator = this.shadowRoot.querySelector('.indicator');
            this.mainContent = document.querySelector('main.article-content');
            this.targetY = 0;
            this.currentY = 0;
            this.smoothing = 0.1;
            this.lastScrollY = window.scrollY;
            this.animationFrameId = null;
            this.handleScroll = this.handleScroll.bind(this);
            this.setTargetPosition = this.setTargetPosition.bind(this);
            this.updateHorizontalPosition = this.updateHorizontalPosition.bind(this);
            this.animate = this.animate.bind(this);
            this.setTargetPosition();
            this.updateHorizontalPosition();
            window.addEventListener('resize', this.setTargetPosition);
            window.addEventListener('resize', this.updateHorizontalPosition);
            window.addEventListener('scroll', this.handleScroll, { passive: true });
            this.animate();
        }

        disconnectedCallback() {
            window.removeEventListener('resize', this.setTargetPosition);
            window.removeEventListener('resize', this.updateHorizontalPosition);
            window.removeEventListener('scroll', this.handleScroll);
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }
        }

        setTargetPosition() {
            const indicatorHeight = this.indicator.offsetHeight;
            this.targetY = (window.innerHeight / 2) - (indicatorHeight / 2);
            this.currentY = this.targetY;
            this.indicator.style.transform = `translateY(${this.currentY}px)`;
        }

        updateHorizontalPosition() {
            if (this.mainContent) {
                const mainRect = this.mainContent.getBoundingClientRect();
                this.style.left = `${mainRect.left - 20}px`;
            }
        }

        handleScroll() {
            const scrollDelta = window.scrollY - this.lastScrollY;
            this.currentY -= scrollDelta;
            this.lastScrollY = window.scrollY;
        }

        animate() {
            const dy = (this.targetY - this.currentY) * this.smoothing;
            this.currentY += dy;
            this.indicator.style.transform = `translateY(${this.currentY}px)`;
            this.animationFrameId = requestAnimationFrame(this.animate);
        }
    }
);

/*
(function addScrollIndicatorIfTall() {
  window.addEventListener('DOMContentLoaded', function() {
    if (window.ENABLE_SCROLL_INDICATOR === false) return;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    if (docHeight >= winHeight * 2) {
      if (!document.body.querySelector('scroll-indicator')) {
        const indicator = document.createElement('scroll-indicator');
        document.body.insertBefore(indicator, document.body.firstChild);
      }
    }
  });
})();
*/

// Inject Juxtapose resources if a div with class "juxtapose" exists
(function injectJuxtaposeIfPresent() {
    window.addEventListener('DOMContentLoaded', function () {
        var juxtaposeDiv = document.querySelector('div.juxtapose');
        if (juxtaposeDiv) {
            // Create script tag
            var script = document.createElement('script');
            script.src = 'https://cdn.knightlab.com/libs/juxtapose/latest/js/juxtapose.min.js';
            // Create link tag
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.knightlab.com/libs/juxtapose/latest/css/juxtapose.css';
            // Insert after the juxtapose div
            juxtaposeDiv.insertAdjacentElement('afterend', script);
            juxtaposeDiv.insertAdjacentElement('afterend', link);
        }
    });
})();

// Set background-attachment: fixed if scroll height is less than viewport height
(function setBackgroundAttachmentFixedIfShortPage() {
    window.addEventListener('DOMContentLoaded', function () {
        if (document.documentElement.scrollHeight <= window.innerHeight) {
            document.body.style.backgroundAttachment = 'fixed';
        }
    });
})();

// Add 'scroll' class to tables wider than 90vw
(function addScrollClassToWideTables() {
    window.addEventListener('DOMContentLoaded', function () {
        var vw90 = window.innerWidth * 0.9;
        document.querySelectorAll('table').forEach(function (table) {
            if (table.scrollWidth > vw90) {
                table.classList.add('scroll');
            }
        });
    });
})();

// Inject copy-to-clipboard button into .codehilite blocks
// Inject copy-to-clipboard button and theme for .codehilite blocks
(function injectCodehiliteAssets() {
    window.addEventListener('DOMContentLoaded', function () {
        var codeBlocks = document.querySelectorAll('.codehilite');
        if (codeBlocks.length === 0) return;

        // Inject stylesheet for syntax highlighting if it's not already present.
        var stylesheetId = 'codehilite-theme';
        if (!document.getElementById(stylesheetId)) {
            var link = document.createElement('link');
            link.id = stylesheetId;
            link.rel = 'stylesheet';
            link.href = '/codehilite.css';
            document.head.appendChild(link);
        }

        codeBlocks.forEach(function (block) {
            // Avoid double-injecting button
            if (block.querySelector('.copy-code-btn')) return;
            // Create button
            var btn = document.createElement('button');
            btn.className = 'copy-code-btn';
            btn.type = 'button';
            btn.title = 'Copy code to clipboard';
            btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                var code = block.querySelector('pre') ? block.querySelector('pre').innerText : block.innerText;
                navigator.clipboard.writeText(code).then(function () {
                    btn.classList.add('copied');
                    btn.title = 'Copied!';
                    // Tooltip logic
                    var tooltip = document.createElement('span');
                    tooltip.className = 'copy-tooltip';
                    tooltip.textContent = 'Copied!';
                    btn.appendChild(tooltip);
                    setTimeout(function () {
                        tooltip.classList.add('visible');
                    }, 10);
                    setTimeout(function () {
                        tooltip.classList.remove('visible');
                        setTimeout(function () {
                            if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
                        }, 200);
                    }, 1100);
                    setTimeout(function () {
                        btn.classList.remove('copied');
                        btn.title = 'Copy code to clipboard';
                    }, 1200);
                });
            });
            // Insert button as first child (so it appears in header)
            block.insertBefore(btn, block.firstChild);
        });
    });
})();