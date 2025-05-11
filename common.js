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
                transform: translateX(-50%);
                width: 100vw;
                max-width: 700px;
                padding: 10px 15px;
                background: rgba(30, 30, 30, 0.2);
                border-radius: 40px;
                backdrop-filter: blur(20px) saturate(0.8);
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: white;
                box-sizing: border-box;
                z-index: 1000;
            }

            @media (max-width: 768px) {
                header {
                    max-width: 100vw;
                    border-radius: 0;
                }
            }

            .title {
                font-family: "Sen", sans-serif;
                font-size: clamp(1rem, 4vw, 2rem);
                flex-shrink: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-right: 10px;
                background: linear-gradient(135deg, #ffffff, #8fdfd4);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            nav {
                display: flex;
                gap: 8px;
                flex-shrink: 0;
            }

            a {
                background: rgba(60, 60, 60, 0.2);
                backdrop-filter: blur(10px);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.03);
                border-radius: 20px;
                padding: 6px 12px;
                font-family: "Sen", sans-serif;
                font-size: clamp(0.75rem, 3vw, 1rem);
                cursor: pointer;
                transition: background-color 0.2s ease;
                white-space: nowrap;
                text-decoration:none;
            }

            a:hover {
                background-color: rgba(80, 80, 80, 0.7);
            }
            
            @media (max-width: 400px) {
                header {
                    border-radius: 25px;
                    padding: 8px 12px;
                }
                
                nav {
                    gap: 5px;
                }
                
                a {
                    padding: 5px 10px;
                }
            }
            </style>

            <header>
                <span class="title">Ethan Marks</span>
                <nav>
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/blog">Blog</a>
                    <a href="/projects">Projects</a>
                </nav>
            </header>
        `;
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
                    border: 1px solid rgba(255, 255, 255, 0.18);
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                    border-radius: 12px;
                    padding: 10px 30px;
                    box-sizing: border-box;
                    color: #eee;
                    z-index: 9999;
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
    }
);

customElements.define('button-link',
    class ButtonLink extends HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
  
        shadow.innerHTML = `
          <style>
            /* Import necessary fonts */
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Sen:wght@700&display=swap');
  
            :host {
              display: block;
              width: 100%;
              box-sizing: border-box;
              margin-bottom: 1rem;
            }
  
            a {
              display: block;
              padding: 1rem 1.5rem;
              background: rgba(30, 30, 30, 0.6);
              border-radius: 12px;
              backdrop-filter: blur(8px);
              -webkit-backdrop-filter: blur(8px);
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
              border: 1px solid rgba(255, 255, 255, 0.08);
              text-decoration: none;
              color: white;
              transition: all 0.3s ease;
              width: 100%;
              box-sizing: border-box;
              overflow: hidden;
            }
  
            a:hover {
              background: rgba(45, 45, 45, 0.75);
              border-color: rgba(143, 223, 212, 0.3);
              transform: translateY(-3px);
              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            }

            slot[name="title"]::slotted(*) {
              font-family: "Sen", sans-serif;
              font-size: 1.1rem;
              font-weight: 700;
              display: block;
              color: #ffffff;
              margin-bottom: 0;
              transition: color 0.3s ease;
            }
  
            slot[name="description"]::slotted(*) {
              font-family: "Poppins", sans-serif;
              font-size: 0.9rem;
              color: #c0c0c0;
              line-height: 1.4;
              display: block;
              margin-top: 0.25rem;
            }
  
            a:hover slot[name="title"]::slotted(*) {
               color: #8fdfd4;
            }
          </style>
  
          <a id="link-wrapper" href="#">
            <span class="title">
              <slot name="title">Default Link Title</slot>
            </span>
            <span class="description">
              <slot name="description"></slot>
            </span>
          </a>
        `;
  
        this.linkElement = shadow.getElementById('link-wrapper');
      }
  
      connectedCallback() {
        if (this.hasAttribute('href')) {
          this.linkElement.setAttribute('href', this.getAttribute('href'));
        } else {
          this.linkElement.setAttribute('href', '#');
          console.warn('button-link element created without an href attribute.');
        }
  
        if (this.hasAttribute('target')) {
          this.linkElement.setAttribute('target', this.getAttribute('target'));
        }
  
        // Check if description slot is empty and potentially add a class for styling
        // This is less reliable than CSS-only solutions usually
        // const descriptionSlot = this.shadowRoot.querySelector('slot[name="description"]');
        // if (descriptionSlot && descriptionSlot.assignedNodes().length === 0) {
        //    this.linkElement.classList.add('no-description');
        // }
      }
  
      // Optional: Observe attribute changes if needed
      // static get observedAttributes() { return ['href', 'target']; }
      // attributeChangedCallback(name, oldValue, newValue) { ... }
    }
);

customElements.define('external-link',
    class ExternalLink extends HTMLElement {
        static icons = {
            github: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
            itchio: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M71.92 34.77C50.2 47.67 7.4 96.84 7 109.73v21.34c0 27.06 25.29 50.84 48.25 50.84 27.57 0 50.54-22.85 50.54-50 0 27.12 22.18 50 49.76 50s49-22.85 49-50c0 27.12 23.59 50 51.16 50h.5c27.57 0 51.16-22.85 51.16-50 0 27.12 21.47 50 49 50s49.76-22.85 49.76-50c0 27.12 23 50 50.54 50 23 0 48.25-23.78 48.25-50.84v-21.34c-.4-12.9-43.2-62.07-64.92-75C372.56 32.4 325.76 32 256 32S91.14 33.1 71.92 34.77zm132.32 134.39c-22 38.4-77.9 38.71-99.85.25-13.17 23.14-43.17 32.07-56 27.66-3.87 40.15-13.67 237.13 17.73 269.15 80 18.67 302.08 18.12 379.76 0 31.65-32.27 21.32-232 17.75-269.15-12.92 4.44-42.88-4.6-56-27.66-22 38.52-77.85 38.1-99.85-.24-7.1 12.49-23.05 28.94-51.76 28.94a57.54 57.54 0 0 1-51.75-28.94zm-41.58 53.77c16.47 0 31.09 0 49.22 19.78a436.91 436.91 0 0 1 88.18 0C318.22 223 332.85 223 349.31 223c52.33 0 65.22 77.53 83.87 144.45 17.26 62.15-5.52 63.67-33.95 63.73-42.15-1.57-65.49-32.18-65.49-62.79-39.25 6.43-101.93 8.79-155.55 0 0 30.61-23.34 61.22-65.49 62.79-28.42-.06-51.2-1.58-33.94-63.73 18.67-67 31.56-144.45 83.88-144.45zM256 270.79s-44.38 40.77-52.35 55.21l29-1.17v25.32c0 1.55 21.34.16 23.33.16 11.65.54 23.31 1 23.31-.16v-25.28l29 1.17c-8-14.48-52.35-55.24-52.35-55.24z"/></svg>`,
            email: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
            colab: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" role="img"><path d="M16.9414 4.9757a7.033 7.033 0 0 0-4.9308 2.0646 7.033 7.033 0 0 0-.1232 9.8068l2.395-2.395a3.6455 3.6455 0 0 1 5.1497-5.1478l2.397-2.3989a7.033 7.033 0 0 0-4.8877-1.9297zM7.07 4.9855a7.033 7.033 0 0 0-4.8878 1.9316l2.3911 2.3911a3.6434 3.6434 0 0 1 5.0227.1271l1.7341-2.9737-.0997-.0802A7.033 7.033 0 0 0 7.07 4.9855zm15.0093 2.1721l-2.3892 2.3911a3.6455 3.6455 0 0 1-5.1497 5.1497l-2.4067 2.4068a7.0362 7.0362 0 0 0 9.9456-9.9476zM1.932 7.1674a7.033 7.033 0 0 0-.002 9.6816l2.397-2.397a3.6434 3.6434 0 0 1-.004-4.8916zm7.664 7.4235c-1.38 1.3816-3.5863 1.411-5.0168.1134l-2.397 2.395c2.4693 2.3328 6.263 2.5753 9.0072.5455l.1368-.1115z"/></svg>`
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
                        margin-top: var(--spacing-lg);
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
                        padding: var(--spacing-sm) var(--spacing-lg);
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