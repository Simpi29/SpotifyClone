let currentSong = new Audio();
let songs;
let currFolder;
function convertSecondsToMinutesAndSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = Math.floor(seconds % 60);

  // Add leading zeros if necessary
  var formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  var formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  return formattedMinutes + ":" + formattedSeconds;
}

async function getSongs(folder) {
  currFolder = folder;

  let a = await fetch(`http://127.0.0.1:5500/songs/${currFolder}/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];

  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`${currFolder}/`)[1]);
    }
  }

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML += `<li>
      <img class="invert" src="music.svg" alt="music">
      <div class="songInfo">
        <div class="songName">${song.replaceAll("_", "").replaceAll("%20","")}</div>
        <div class="songArtist">Simpi</div>
      </div>
      <div class="playNow">
        <span>Play Now</span>
        <img class="invert" src="play1.svg" alt="play1">
      </div>
    </li>`;
  }

  //attach event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".songInfo").firstElementChild.innerHTML);
      playMusic(
        e.querySelector(".songInfo").firstElementChild.innerHTML.trim()
      );
    });
  });
  return songs;
}

const playMusic = (track, pause = false) => {
  //let audio = new Audio("http://127.0.0.1:5500/songs/" + track);
  currentSong.src = `http://127.0.0.1:5500/songs/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songInformation").innerHTML = track;

  document.querySelector(".songTimer").innerHTML = "0:00/0:00";
};

//Display albums dynamically
async function displayAlbums() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");

  let array = Array.from(anchors);
  for (let i = 0; i < array.length; i++) {
    const e = array[i];
    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-1)[0];
      console.log(folder);
      //get meta data of the folder
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();
      console.log(response);

      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder = "${folder}" class="card">
<div class="play">
  <img src="play.svg" alt="play">
</div>
<img src="songs/${folder}/cover.jpg" alt="This Is Home">
<h3>${response.title}</h3>
<p>${response.description}</p>
</div>

`;
    }
  }

  //load the playlist
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      console.log("Fetching songs")
      songs = await getSongs(`${item.currentTarget.dataset.folder}`);
      playMusic(songs[0])
    });
  });
}

async function main() {
  await getSongs("abc");
  playMusic(songs[0], true);

  displayAlbums();

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play1.svg";
    }
  });
  //Event listener for time update
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(
      ".songTimer"
    ).innerHTML = `${convertSecondsToMinutesAndSeconds(
      currentSong.currentTime
    )}/${convertSecondsToMinutesAndSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //Event listener for seekbar
  document.querySelector(".seekBar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //event listener for hamburger
  document.querySelector(".hamBurger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  //event listener for close
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  //event listener for previous
  document.querySelector("#previous").addEventListener("click", () => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  //event listener for next
  document.querySelector("#next").addEventListener("click", () => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  //event listener for volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

//event listener to mute the volume
document.querySelector(".volume>img").addEventListener("click",e=>{
  
  
  if(e.target.src.includes("volume.svg")){
    e.target.src = e.target.src.replace("volume.svg","mute.svg")
    currentSong.volume =  0;
   console.log(document.querySelector(".range").getElementsByTagName("input")[0]);
   document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  }else{
    e.target.src = e.target.src.replace("mute.svg","volume.svg")
    currentSong.volume = 0.10
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0.1;
  }


})
  
}

main();
