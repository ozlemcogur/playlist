const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const shuffleButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');
const audio = document.getElementById('audio');
const songImage = document.getElementById('song-image');
const songName = document.getElementById('song-name');
const songArtist = document.getElementById('song-artist');
const playlistButton = document.getElementById('playlist');
const maxDuration = document.getElementById('max-duration');
const currentTimeRef = document.getElementById('current-time');
const playListContainer = document.getElementById('playlist-container');
const closeButton = document.getElementById('close-button');
const progressBar = document.getElementById('progress-bar');
const currentProgress = document.getElementById('current-progress');
const playlistSongs = document.getElementById('playlist-songs');

//indis
let index;

//tekrarı
let loop;

//decode veya parse
const songsList = [
    {
        name: "Oblivion",
        link: "assets/Oblivion.mp3",
        artist: "Astor Piazzola",
        image: "assets/astor.jpg"
    },
    {
        name: "Dört Mevsim",
        link: "assets/dört-mevsim.mp3",
        artist: "Fazıl Say",
        image: "assets/fazıl-say.jpg"
    },
    {
        name: "Adagio",
        link: "assets/Adagio.mp3",
        artist: "Lara Fabian",
        image: "assets/lara-fabian.jpg"
    },
    {
        name: "Per Te",
        link: "assets/Per-Te.mp3",
        artist: "Josh Groban",
        image: "assets/josh-groban.jpg"
    },
    {
        name: "Nocturne",
        link: "assets/Nocturne.mp3",
        artist: "Chopin",
        image: "assets/chopin.jpg"
    }
]

//olaylar
let events = {
    mouse: {
        click: "click"

    },

    touch: {
        click: "touchstart"

    }


}

let deviceType = "";

const isTouchDevice = () => {
    try {
        document.createEvent('TouchEvent')
        deviceType = "touch"
        return true;

    } catch (error) {
        deviceType = " mouse"
        return false;

    }
}

// zaman formatlama
const timeFormatter = (timeInput) => {
    let minute = Math.floor(timeInput / 60);
    minute = minute < 10 ? "0" + minute : minute;
    let second = Math.floor(timeInput % 60);
    second = second < 10 ? "0" + second : second;
    return `${minute}:${second}`

}

//set song

const setSong = (arrayIndex) => {
    let { name, link, artist, image } = songsList[arrayIndex];
    audio.src = link;
    songName.innerHTML = name;
    songArtist.innerHTML = artist;
    songImage.src = image;

    //süreyi göster 
    audio.onloadedmetadata = () => {
        maxDuration.innerText = timeFormatter(audio.duration)

    }

    playListContainer.classList.add("hide")
    playAudio();

}

// sarkıyı oynat

const playAudio = () => {
    audio.play()
    pauseButton.classList.remove('hide');
    playButton.classList.add('hide');
}

//şarkıyı tekrar

repeatButton.addEventListener('click', () => {
    if (repeatButton.classList.contains('active')) {
        repeatButton.classList.remove("active")
        audio.loop = false
        

    } else {
        repeatButton.classList.add("active")
        audio.loop = true
       
    }
})

//sonraki şarkıya geç
const nextSong = () => {
    if (loop) {
        if (index == (songsList.length - 1)) {
            index = 0

        } else {
            index += 1
        }
        setSong(index);

    } else {
        let randIndex = Math.floor(Math.random() * songsList.length)
        setSong(randIndex);

    }
    playAudio();
}

//şarkıyı durdur

const pauseAudio = () => {
    audio.pause()
    pauseButton.classList.add("hide");
    playButton.classList.remove("hide");
}

//önceki şarkı
const previousSong = () => {
    if (index > 0) {
        pauseAudio();
        index -= 1
    } else {
        index = songsList.length - 1
    }
    setSong(index);
    playAudio();
}

//sıradakine geç
audio.onended = () => {
    nextSong();
}

//shuffle songs
shuffleButton.addEventListener("click", () => {
    if (shuffleButton.classList.contains("active")) {
        shuffleButton.classList.remove("active")
        loop = true;


    } else {
        shuffleButton.classList.add("active")
        loop = false;

    }
})

playButton.addEventListener("click", playAudio);
nextButton.addEventListener("click", nextSong);
pauseButton.addEventListener("click", pauseAudio);
prevButton.addEventListener("click", previousSong);

isTouchDevice()
progressBar.addEventListener(events.click, (event) => {
    //progress bari baslat
    let coordStart = progressBar.getBoundingClientRect().left;

    //fare ile dokunma
    let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX;
    let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

    //genisligi ata
    currentProgress.style.width = progress * 100 + "%";
    //zamani ata
    audio.currentTime = progress * audio.duration;

    //oynat
    audio.play()
    pauseButton.classList.remove('hide');
    playButton.classList.add('hide');
})

//zaman aktıkca güncelle
setInterval(() => {
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
    currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%"
}, 1000);

//zaman güncellemsi
audio.addEventListener("timeupdate", () => {
    currentTimeRef.innerText = timeFormatter(audio.currentTime);

})

window.onload = () => {
    index = 0
    setSong(index)
    initPlayList()
}

const initPlayList = () => {
    for (let i in songsList) {

        playlistSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container">
            <img src="${songsList[i].image}"/>
        </div>
        <div class="playlist-song-details">
            <span id="playlist-song-name">
                ${songsList[i].name}
            </span>
            <span id="playlist-song-album">
            ${songsList[i].artist}
            </span>
        </div>
        </li>
        `
    }

}

playlistButton.addEventListener("click", () => {
    playListContainer.classList.remove("hide");
})

closeButton.addEventListener("click", () => {
    playListContainer.classList.add("hide");
})