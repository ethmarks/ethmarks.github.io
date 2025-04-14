// Define the custom element
class EthanFooter extends HTMLElement {
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
  
          @media (max-width: 600px) {
          }
      </style>
      
      <footer>
        
      </footer>
      `;
    }
  }
  
  // Register the custom element
  customElements.define('ethan-footer', EthanFooter);