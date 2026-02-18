const video = document.getElementById('webcam');
const detectBtn = document.getElementById('detect-btn');
const loading = document.getElementById('loading');
const moodText = document.getElementById('mood-text');
const playerContainer = document.getElementById('player-container');


navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream)
  .catch(err => alert('Camera access denied: ' + err));

  detectBtn.addEventListener('click', detectMood);

async function detectMood() {
  loading.style.display = 'block';
  playerContainer.innerHTML = '';
  moodText.textContent = '--';


   const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  const imageData = canvas.toDataURL('image/jpeg');

      try {
    const response = await fetch('http://127.0.0.1:5000/detect-mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageData })
    });

    const data = await response.json();
    loading.style.display = 'none';

    if (data.mood) {
      moodText.textContent = data.mood;
      renderSongs(data.songs);
    } else {
      moodText.textContent = 'No face detected';
    }

  } catch (err) {
    loading.style.display = 'none';
    moodText.textContent = 'Error connecting to server';
  }
}

function renderSongs(songs) {
  songs.forEach(song => {
    const card = document.createElement('div');
    card.className = 'song-card';
    card.innerHTML = `
      <p>🎵 ${song.title}</p>
      <iframe src="${song.url}" allow="autoplay"></iframe>
    `;
    playerContainer.appendChild(card);
  });
}
