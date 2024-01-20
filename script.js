let currentSong = new Audio();

function convertSecondsToMinutesAndSeconds(seconds) {
  

  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = Math.floor(seconds % 60);

  // Add leading zeros if necessary
  var formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  var formattedSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  return formattedMinutes + ":" + formattedSeconds;
}


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

const playMusic = (track,pause = false)=>{
  //let audio = new Audio("http://127.0.0.1:5500/songs/" + track);
  currentSong.src = "http://127.0.0.1:5500/songs/" + track;
if(!pause){
  currentSong.play();
  play.src = "pause.svg";
}
  document.querySelector(".songInformation").innerHTML = track;

  document.querySelector(".songTimer").innerHTML = "0:00/0:00";
}


async function main() {
  let songs = await getSongs();
  playMusic(songs[0],true)

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
    

  play.addEventListener("click",()=>{
    if(currentSong.paused){
      currentSong.play();
      play.src = "pause.svg";
    }
    else{
      currentSong.pause();
      play.src = "play1.svg";
    }
  })
//Event listener for time update
  currentSong.addEventListener("timeupdate",()=>{
    console.log(currentSong.currentTime,currentSong.duration);
    document.querySelector(".songTimer").innerHTML = `${convertSecondsToMinutesAndSeconds(currentSong.currentTime)}/${convertSecondsToMinutesAndSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 + "%";
  })

  
  //Event listener for seekbar
  document.querySelector(".seekBar").addEventListener("click",e=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime  = ((currentSong.duration) * percent) /100;
  })

  //event listener for hamburger
  document.querySelector(".hamBurger").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "0";
  })
}

main();
