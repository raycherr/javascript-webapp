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
    Object.entries(groupedList).forEach((userIdList, index) => {
      const groupedPostsContainer = document.createElement('div');
      groupedPostsContainer.innerHTML = `
        <div class='collapsible'>User Id: ${userIdList[0]}</div>
        <div class='collapsible-content'></div>
      `;
      document.querySelector('#postListContainer').appendChild(groupedPostsContainer);
      document.getElementsByClassName('collapsible')[index].addEventListener('click', (event) => {
        event.target.classList.toggle('active');
        var content = event.target.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });

      userIdList[1].forEach(post => {
        const groupedList = document.getElementsByClassName('collapsible-content')[index];
        groupedList.appendChild(this.buildPostDiv(post));
      });
    });

  }
}
customElements.define('posts-list-component', PostsList);
