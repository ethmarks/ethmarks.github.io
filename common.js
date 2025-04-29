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
                width: 90%;
                max-width: 500px;
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