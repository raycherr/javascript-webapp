async function onLoad() {
  router();
  window.addEventListener('load', router);
  window.addEventListener('hashchange', router);
}

