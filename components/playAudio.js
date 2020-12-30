// const playAudioTemplate = document.createElement('template');

// playAudioTemplate.innerHTML = `
//   <h2>Audio</h2>
// `;

class PlayAudio extends HTMLElement {
  constructor() {
    super();
    console.log('loaded play audio component');
  }

  connectedCallback() {
    this.innerHTML = `
      <h2>Audio</h2>
    `;
  }
}
customElements.define('play-audio-component', PlayAudio);
