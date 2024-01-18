let currentSong = new Audio();
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

const playMusic = (track)=>{
  //let audio = new Audio("http://127.0.0.1:5500/songs/" + track);
  currentSong.src = "http://127.0.0.1:5500/songs/" + track;

  currentSong.play();
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

  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(
    e=>{
      e.addEventListener("click",element=>{

console.log(e.querySelector(".songInfo").firstElementChild.innerHTML)
playMusic(e.querySelector(".songInfo").firstElementChild.innerHTML.trim())
      })

    }
  )
    

}

main();
