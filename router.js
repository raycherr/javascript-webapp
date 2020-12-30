
const PostsComponent = {
  render: () => {
    return `<posts-list-component></posts-list-component>`;
  }
}

const AudioComponent = {
  render: () => {
    return `<play-audio-component></play-audio-component>`;
  }
}

const routes = [
  { path: '/', component: PostsComponent },
  { path: '/posts', component: PostsComponent },
  { path: '/audio', component: AudioComponent }
]

const router = () => {
  const path = parseLocation();
  const {component} = findComponentByPath(path, routes) || {};
  document.getElementById('main').innerHTML = component.render();
  document.getElementById('header').setAttribute('page', path);
}

const parseLocation = () => {
  return location.hash.slice(1).toLowerCase() || '/';
}

const findComponentByPath = (path, routes) => routes.find(r => r.path.match(new RegExp(`^\\${path}$`, 'gm'))) || undefined;
