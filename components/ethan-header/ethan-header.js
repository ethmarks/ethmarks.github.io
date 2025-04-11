// Define the custom element
class EthanHeader extends HTMLElement {
    constructor() {
      super();
      // Create a shadow DOM
      this.attachShadow({ mode: 'open' });
  
      // Create the header content
      this.shadowRoot.innerHTML = `
      <style>
          :host {
              display: block;
              width: 100%;
              z-index: 3;
          }
          
          nav {
              display: flex;
              justify-content: center;
              padding: 1rem 0;
          }
          
          ul {
              display: flex;
              list-style: none;
              padding: 0;
              margin: 0;
              gap: 1rem;
              flex-wrap: wrap;
              justify-content: center;
              align-items: center;
          }
  
          li {
              display: flex;
          }
          
          a {
              display: block;
              padding: 0.8rem 1rem;
              text-decoration: none;
              background-color: rgba(255, 255, 255, 0.07);
              backdrop-filter: blur(5px);
              border-radius: 2rem;
              transition: all 0.2s ease;
              font-size: 1rem;
              color: white;
              font-family: "Tomorrow", sans-serif;
              font-weight: 400;
              line-height: 1;
          }
          
          a:hover {
              background-color: rgba(255, 255, 255, 0.14);
              transform: translateY(-2px);
          }
          
          a:active {
              transform: translateY(0);
          }
  
          #home-link {
              padding: 0;
              width: 3rem;
              height: 3rem;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
          }
  
          #home-link img {
              display: block;
              width: 1.5rem; 
              height: 1.5rem;
          }
  
          @media (max-width: 600px) {
            ul {
              flex-direction: column;
              align-items: center;
            }
            
            li:not(:has(#home-link)) a {
              visibility: hidden;
              position: absolute;
            }
           
            #home-link {
               width: 2.5rem; 
               height: 2.5rem;
            }
  
           
            a:not(#home-link) {
              width: auto;
              min-width: 150px;
              text-align: center;
            }
          }
      </style>
      
      <header>
          <nav aria-label="Main Navigation">
              <ul>
                  <li><a href="/blog">Blog</a></li>
                  <li><a href="/portfolio">Portfolio</a></li>
                  <li><a href="/" id="home-link"><img src="components/ethan-header/home.svg" alt="Home"></a></li> 
                  <li><a href="/about">About Me</a></li>
                  <li><a href="/contact">Contact</a></li>
              </ul>
          </nav>
      </header>
      `;
    }
  }
  
  // Register the custom element
  customElements.define('ethan-header', EthanHeader);