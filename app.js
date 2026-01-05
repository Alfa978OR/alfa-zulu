document.addEventListener("DOMContentLoaded", () => {

  const audio = document.getElementById("radio");
  const button = document.getElementById("playBtn");
  const statusEl = document.getElementById("audioStatus");

  let retryTimer = null;

  /* =========================
     Status helper
  ========================= */
  function setStatus(state) {
    statusEl.className = "audio-status " + state;

    if (state === "live") {
      statusEl.textContent = "🔴 LIVE";
    } else if (state === "paused") {
      statusEl.textContent = "⏸️ PAUSED";
    } else if (state === "connecting") {
      statusEl.textContent = "⏳ CONNECTING…";
    } else if (state === "error") {
      statusEl.textContent = "⚠️ ERROR";
    }
  }

  /* Initial state */
  setStatus("paused");

  /* =========================
     Core controls
  ========================= */
  async function startStream() {
    button.disabled = true;
    setStatus("connecting");

    try {
      await audio.play();
    } catch {
      scheduleRetry();
    }
  }

  function stopStream() {
    audio.pause();
    button.textContent = "Dlala ▶️ Play";
    button.disabled = false;
    setStatus("paused");
  }

  function scheduleRetry() {
    setStatus("connecting");
    retryTimer = setTimeout(startStream, 3000);
  }

  /* =========================
     Button click handler
  ========================= */
  button.addEventListener("click", () => {
    if (audio.paused) {
      startStream();
    } else {
      stopStream();
    }
  });

  /* =========================
     Audio event listeners
  ========================= */
  audio.addEventListener("playing", () => {
    clearTimeout(retryTimer);
    button.disabled = false;
    button.textContent = "Misa kancane ⏸️ Pause";
    setStatus("live");
    setMediaSession();
  });

  audio.addEventListener("pause", () => {
    if (!audio.ended) {
      setStatus("paused");
    }
  });

  audio.addEventListener("error", () => {
    scheduleRetry();
  });

  /* =========================
     Media Session API
  ========================= */
  function setMediaSession() {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: "Alfa Online Radio",
      artist: "Live Broadcast",
      artwork: [
        { src: "icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "icon-512.png", sizes: "512x512", type: "image/png" }
      ]
    });

    navigator.mediaSession.setActionHandler("play", async () => {
      await startStream();
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      stopStream();
    });
  }

});
