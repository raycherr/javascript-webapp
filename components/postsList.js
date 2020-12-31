const postsListTemplate = document.createElement('template');

function renderTemplate() {
  postsListTemplate.innerHTML = `
    <div>
      <h2>Posts</h2>
      <button id="loadPostsButton">Load posts</button>
      <button id="sortButton">Sort alphabetically</button>
      <button id="groupButton">Group by userID</button>
      <div id="postListContainer"></div>
    </div>
  `;
}

class PostsList extends HTMLElement {

  jsonList;

  constructor() {
    super();
    console.log('loaded posts list');
  }

  connectedCallback() {
    const currentPage = this.getAttribute('page');
    renderTemplate(currentPage);
    this.innerHTML = postsListTemplate.innerHTML;

    const loadPostsButton = document.querySelector('#loadPostsButton');
    loadPostsButton.addEventListener('click', () => this.triggerLoadPost());

    const sortButton = document.querySelector('#sortButton');
    sortButton.addEventListener('click', () => this.sortAlphabetically());

    const groupButton = document.querySelector('#groupButton');
    groupButton.addEventListener('click', () => this.groupByUserId());
  }

  async triggerLoadPost() {
    const postList = document.querySelector('#postListContainer');

    try {
      this.jsonList = await getAllPosts();
      this.buildPostsList();
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

  buildPostsList(isSort = false) {
    document.querySelector('#postListContainer').innerHTML = '';
    if (isSort) {
      this.jsonList.sort((a, b) => (a.title > b.title) ? 1 : -1);
    }
    this.jsonList.forEach(post => {
      document.querySelector('#postListContainer').appendChild(this.buildPostDiv(post));
    });
  }

  sortAlphabetically() {
    this.buildPostsList(true);
  }

  groupByUserId() {

  }
}
customElements.define('posts-list-component', PostsList);
