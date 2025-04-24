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