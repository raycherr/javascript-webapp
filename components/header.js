const headerTemplate = document.createElement('template');

function renderHeaderTemplate(currentPage) {
  headerTemplate.innerHTML = `
    <style>
      nav {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: lightsalmon;
        font-family: sans-serif;
      }
      
      a {
        font-weight: 700;
        padding: 0 10px;
        margin: 0 25px;
        color: #0A0200;
        text-decoration: none;
        height: 100%;
        display: flex;
        align-items: center;
      }
      
      a:hover {
        padding-bottom: 2px;
      }

      .selected {
        color: black;
        box-shadow: inset 0 -2px 0 0 #cc592d;
      }

      .non-selected {
        color: #4c1500;
      }
    </style>
    <header>
      <nav>
        <a href="#/posts" class="${currentPage === '/posts' ? 'selected' : 'non-selected'}">Posts</a>
        <a href="#/audio" class="${currentPage === '/audio' ? 'selected' : 'non-selected'}">Audio</a>
      </nav>
    </header>
  `;
}


class Header extends HTMLElement {
  constructor() {
    super();
    console.log('loaded header');
  }

  connectedCallback() {
    let currentPage = this.getAttribute('page');
    renderHeaderTemplate(currentPage);
    this.innerHTML = headerTemplate.innerHTML;
  }

  static get observedAttributes() { return ['page']; }

  attributeChangedCallback(page, oldVal, newVal) {
    console.log('page changed', newVal);
    if (newVal === '/') {
      newVal = '/posts';
    }
    renderHeaderTemplate(newVal);
    this.innerHTML = headerTemplate.innerHTML;
  }
}
customElements.define('header-component', Header);
