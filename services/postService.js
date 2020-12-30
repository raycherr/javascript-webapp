
async function getAllPosts() {
  try {
    return await fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json());
  } catch (err) {
    throw err;
  }
};
