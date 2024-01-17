async function getSongs() {
  let a = await fetch('http://127.0.0.1:5500/songs/');
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  
  return songs;
}

async function main() {
  let songs = await getSongs();
  console.log(songs);

  let songUL = document.querySelector('.songList').getElementsByTagName("ul")[0];

  for (const song of songs) {
    songUL.innerHTML += `<li>
      <img class="invert" src="music.svg" alt="music">
      <div class="songInfo">
        <div class="songName">${song.replaceAll("_","")}</div>
        <div class="songArtist">Simpi</div>
      </div>
      <div class="playNow">
        <span>Play Now</span>
        <img class="invert" src="play1.svg" alt="play1">
      </div>
    </li>`;
  }

  let audio = new Audio(songs[0]);
  audio.play();
}

main();
