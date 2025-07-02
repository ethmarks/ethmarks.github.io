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
        }

        connectedCallback() {
            this.innerHTML = `
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
            // Get references to the header and nav elements
            const headerElement = this.querySelector('header');
            const navElement = this.querySelector('nav');

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
        }
        connectedCallback() {
            this.innerHTML = `
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
                footer a {
                    color: inherit;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }
                footer a:hover {
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
            this.footer = this.querySelector('footer');
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