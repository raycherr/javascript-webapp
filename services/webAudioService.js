function initialiseWebAudioApi() {
  var context;
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
    return context;
  } catch(err) {
    throw err;
  }
}

const audioClips = [
  {
    id: 0,
    name: 'New Wave Kit',
    url: 'https://static.bandlab.com/soundbanks/previews/new-wave-kit.ogg',
    isPlaying: false
  },
  {
    id: 1,
    name: 'Synth Organ',
    url: 'https://static.bandlab.com/soundbanks/previews/synth-organ.ogg',
    isPlaying: false
  }
];

var source;
var isPlaying;

async function fetchSound(url) {

  return fetch(url)
  .catch(error => {
    throw error;
  });

}
