const postsListTemplate = document.createElement('template');

function renderTemplate() {
  postsListTemplate.innerHTML = `
    <style>
      .title {
        font-weight: bold;
        font-size: 21px;
        padding-bottom: 10px;
      }
      .metadata {
        color: #232F34;
        font-size: 14px;
      }
      .body-text {
        color: #232F34;
        opacity: 0.9;
      }
      .header-section {
        margin-top: 10px;
        font-weight: bold;
        display: flex;
        flex-direction: row;
        align-items: center;
        background: #FEDBD0;
        color: #442C2E;
        padding: 16px 8px;
      }
    </style>
    <div>
      <h2>Posts</h2>
      <button id="loadPostsButton">Load posts</button>
      <br>
      <button class="secondary" id="sortButton">Sort alphabetically</button>
      <button class="secondary" id="groupButton">Group by userID</button>
      <div id="postListContainer"></div>
    </div>
  `;
}

class PostsList extends HTMLElement {

  jsonList;
  isLoaded;

  constructor() {
    super();
    console.log('loaded posts list');
    this.isLoaded = false;
  }

  connectedCallback() {
    renderTemplate();
    this.innerHTML = postsListTemplate.innerHTML;

    const loadPostsButton = document.querySelector('#loadPostsButton');
    loadPostsButton.addEventListener('click', () => this.triggerLoadPost());

    const sortButton = document.querySelector('#sortButton');
    sortButton.addEventListener('click', () => this.sortAlphabetically());
    this.checkDisabledButton('#sortButton');

    const groupButton = document.querySelector('#groupButton');
    groupButton.addEventListener('click', () => this.groupByUserId());
    this.checkDisabledButton('#groupButton')
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

  checkDisabledButton(id) {
    const checkingButton = document.querySelector(id);
    if (!this.isLoaded) {
      checkingButton.setAttribute('disabled', true); 
    } else {
      checkingButton.removeAttribute('disabled');
    }
  }

  buildPostDiv(post) {
    const postDiv = document.createElement('div');
    postDiv.setAttribute('class', 'card');
    postDiv.innerHTML = `
      <div class='metadata'>User Id: ${post.userId}</div>
      <div class='title'>${post.title}</div>
      <div class='body-text'>${post.body}</div>
    `;
    return postDiv;
  }

  buildPostsList(isSort = false) {
    this.isLoaded = true;
    this.checkDisabledButton('#sortButton');
    this.checkDisabledButton('#groupButton');
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
    const groupedList = this.jsonList.reduce((acc, value) => {
      if (!acc[value.userId]) {
        acc[value.userId] = [];
      }
      acc[value.userId].push(value);

      return acc;
    }, {});

    document.querySelector('#postListContainer').innerHTML = '';
    Object.entries(groupedList).forEach((userIdList) => {
      const userIdHeader = document.createElement('div');
      userIdHeader.setAttribute('class', 'header-section');
      userIdHeader.innerHTML = `
        <div>User Id: ${userIdList[0]}</div>
      `;
      document.querySelector('#postListContainer').appendChild(userIdHeader);

      userIdList[1].forEach(post => {
        document.querySelector('#postListContainer').appendChild(this.buildPostDiv(post));
      });
    });

  }
}
customElements.define('posts-list-component', PostsList);
