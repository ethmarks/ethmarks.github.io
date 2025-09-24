// Ethmarks Web Components
// Generated automatically from Hugo partials

class EthmarksHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = {{ partial "header.html" . | jsonify }};
  }
}

class EthmarksFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = {{ partial "footer.html" . | jsonify }};
  }
}

// Register the custom elements
customElements.define('ethmarks-header', EthmarksHeader);
customElements.define('ethmarks-footer', EthmarksFooter);