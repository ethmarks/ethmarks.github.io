// Ethmarks Web Components

class EthmarksHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header>
          <a href="https://ethmarks.github.io/" id="title" tabindex="0" aria-label="Home">Ethan Marks</a>
          <nav>
              <a id="nav-home" class="staggered" href="https://ethmarks.github.io/">Home</a>
              <a id="nav-about" class="staggered" href="https://ethmarks.github.io/about/">About</a>
              <a id="nav-posts" class="staggered" href="https://ethmarks.github.io/posts/">Posts</a>
              <a id="nav-blips" class="staggered" href="https://ethmarks.github.io/blips/">Blips</a>
              <a id="nav-projects" class="staggered" href="https://ethmarks.github.io/tags/projects/">Projects</a>
          </nav>
      </header>`;

    const activeLink = this.getAttribute("active");
    if (activeLink) {
      const targetLink = this.querySelector("#nav-" + activeLink.toLowerCase());
      if (targetLink) {
        targetLink.classList.add("active");
      }
    }
  }
}

class EthmarksFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
          <span id="source">
              <a href="https://github.com/ethmarks/ethmarks.github.io" id="sourcelink">Website Source</a>
          </span>
          <span id="copyright"><a href="https://ethmarks.github.io/about/">Ethan Marks</a>, &copy;2026</span>
          <span id="email">
              <a href="mailto:ethmarks.dev@gmail.com">Contact</a>
          </span>
      </footer>`;

    const sourceLink = this.getAttribute("source");
    if (sourceLink) {
      const sourceAnchor = this.querySelector("a#sourcelink");
      if (sourceAnchor) {
        sourceAnchor.href = sourceLink;
      }
    }

    function updateOverflowClasses() {
      const heightOverflowClass = "height-overflow";
      const body = document.body;
      const containerHeight = window.innerHeight;
      const contentHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      );

      if (contentHeight === 0) {
        return;
      }

      if (contentHeight > containerHeight) {
        body.classList.add(heightOverflowClass);
      } else {
        body.classList.remove(heightOverflowClass);
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      updateOverflowClasses();
    });

    resizeObserver.observe(document.body);
    updateOverflowClasses();
  }
}

// Register the custom elements
customElements.define("ethmarks-header", EthmarksHeader);
customElements.define("ethmarks-footer", EthmarksFooter);
