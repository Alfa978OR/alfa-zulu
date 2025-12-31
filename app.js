const audio = document.getElementById("radio");
const button = document.getElementById("playBtn");

let playing = false;

button.addEventListener("click", () => {
  if (!playing) {
    audio.play();
    button.textContent = "Misa kancane / Pause";
  } else {
    audio.pause();
    button.textContent = "Dlala / Play";
  }
  playing = !playing;
});

