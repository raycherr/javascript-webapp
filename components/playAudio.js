const playAudioTemplate = document.createElement('template');

function renderPlayAudioTemplate() {
  playAudioTemplate.innerHTML = `
    <h2>Audio</h2>
    <div id="audioListContainer"></div>
  `;
}

class PlayAudio extends HTMLElement {
  source;
  self;

  constructor() {
    super();
    console.log('loaded play audio component');
    self = this;
  }

  connectedCallback() {
    renderPlayAudioTemplate();
    this.innerHTML = playAudioTemplate.innerHTML;

    this.buildAudioListContainer();
  }

  buildAudioListContainer() {
    document.querySelector('#audioListContainer').innerHTML = '';
    audioClips.forEach(clip => {
      document.querySelector('#audioListContainer').appendChild(this.buildAudioDiv(clip));
      const button = document.querySelector('#'+clip.name.replace(/\s+/g, ''));
      button.addEventListener('click', () => this.playAudioClip(clip));
    });
  }

  buildAudioDiv(clip) {
    const audioDiv = document.createElement('div');
    audioDiv.innerHTML = `
      <h4>${clip.name}</h4>
      <button id="${clip.name.replace(/\s+/g, '')}"
        class="${clip.isPlaying ? 'selected' : 'non-selected'}">
        ${!clip.isPlaying ? '▶' : '⬤'}
      </button>
    `;
    return audioDiv;
  }

  async playAudioClip(audioClip) {
    var context;
    const URL = 'https://cors-anywhere.herokuapp.com/' + audioClip.url; // hack to easily bypass cors for now

    context = initialiseWebAudioApi();

    if (isPlaying) {
      this.stopAudioClip();
      audioClip.isPlaying = false;
    } else {

      // Load sound
      const reponse = await fetchSound(URL);
      const arrayBuffer = await reponse.arrayBuffer();
      const audioBuffer = await context.decodeAudioData(arrayBuffer);
      source = context.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(context.destination);
      isPlaying = true;
      audioClip.isPlaying = true;
      source.start(0);

      function endedHandler(event) {
        isPlaying = false;
        audioClip.isPlaying = false;
        self.buildAudioListContainer();
      }
      source.onended = endedHandler;
    }
    this.buildAudioListContainer();
  }

  stopAudioClip() {
    source.stop();
    isPlaying = false;
  }
}
customElements.define('play-audio-component', PlayAudio);
