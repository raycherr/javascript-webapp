const postsListTemplate = document.createElement('template');

function renderTemplate() {
  postsListTemplate.innerHTML = `
    <div>
      <h2>Posts</h2>
      <button id="loadPostsButton">Load posts</button>
      <div id="postListContainer"></div>

      <!-- TODO press button to request list of posts -->
      <!-- TODO sort alphabetically based on title -->
      <!-- TODO group posts by userID -->
    </div>
  `;
}


class PostsList extends HTMLElement {
  constructor() {
    super();
    console.log('loaded posts list');
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    const currentPage = this.getAttribute('page');
    renderTemplate(currentPage);
    shadowRoot.appendChild(postsListTemplate.content);

    const loadPostsButton = shadowRoot.querySelector('#loadPostsButton');
    loadPostsButton.addEventListener('click', () => this.triggerLoadPost(shadowRoot));
  }

  async triggerLoadPost(shadowRoot) {
    const postList = shadowRoot.querySelector('#postListContainer');

    try {
      const jsonRes = await getAllPosts();
      jsonRes.forEach(post => {
        postList.appendChild(this.buildPostDiv(post));
      });
    } catch(err) {
      const errorMessage = document.createElement('div');
      errorMessage.innerHTML = `
        Error occured. Please try again later.
      `;
      postList.appendChild(errorMessage);
    }
  }

  buildPostDiv(post) {
    // TODO style this like google material style
    const postDiv = document.createElement('div');
    postDiv.innerHTML = `
      <h4>${post.userId}</h4>
      <h4>${post.title}</h4>
      <p>${post.body}</p>
    `;
    return postDiv;
  }
}
customElements.define('posts-list-component', PostsList);
