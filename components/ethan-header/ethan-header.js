class EthanHeader extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });

      shadow.innerHTML = `
        <style>
          .container {
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
          }

          .nav-buttons {
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
            .container {
              border-radius: 25px;
              padding: 8px 12px;
            }
            
            .nav-buttons {
              gap: 5px;
            }
            
            a {
              padding: 5px 10px;
            }
          }
        </style>

        <div class="container">
          <div class="title">Ethan Marks</div>
          <div class="nav-buttons">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/blog">Blog</a>
          </div>
        </div>
      `;
    }
  }

  customElements.define('ethan-header', EthanHeader);