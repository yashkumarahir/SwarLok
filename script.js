let currentSong = new Audio();  
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <img class="invert" width="34" src="img/music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div></div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="img/play.svg" alt="">
                </div>
            </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelectorAll(".songList li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info").firstElementChild.innerText.trim());
        });
    });

    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
    console.log("Displaying albums");
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");

    for (let e of anchors) {
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0];

            try {
                let a = await fetch(`/songs/${folder}/info.json`);
                let response = await a.json();
                console.log("Fetching JSON from:", `/songs/${folder}/info.json`);
                cardContainer.innerHTML += `
                    <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`;
            } catch (err) {
                console.warn(`Error loading info.json for folder: ${folder}`, err);
            }
        }
    }

    // Load playlist on card click
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        });
    });
}

async function main() {
    await getSongs("songs/ncs");
    playMusic(songs[0], true);
    await displayAlbums();

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    previous.addEventListener("click", () => {
        currentSong.pause();
        if (songs.length && songs[0] instanceof File) {
            if (currentIndex > 0) {
                playLocalMusic(songs[currentIndex - 1], currentIndex - 1);
            }
        } else {
            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
            if ((index - 1) >= 0) playMusic(songs[index - 1]);
        }
    });
    
    next.addEventListener("click", () => {
        currentSong.pause();
        if (songs.length && songs[0] instanceof File) {
            if (currentIndex < songs.length - 1) {
                playLocalMusic(songs[currentIndex + 1], currentIndex + 1);
            }
        } else {
            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
            if ((index + 1) < songs.length) playMusic(songs[index + 1]);
        }
    });
    

    document.querySelector(".range input").addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
        }
    });

    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range input").value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = 0.10;
            document.querySelector(".range input").value = 10;
        }
    });
}

main();

// Select Folder Integration
const folderInput = document.getElementById("folderInput");
const selectFolderLi = document.querySelector("li:nth-child(3)"); // "Select Folder" list item

selectFolderLi.addEventListener("click", () => {
    folderInput.click(); // Hidden folder input trigger
});

folderInput.addEventListener("change", async (e) => {
    const files = Array.from(e.target.files);
    const songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";
    songs = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("audio/")) {
            songs.push(file);
            const li = document.createElement("li");
            li.innerHTML = `
                <img class="invert" width="34" src="img/music.svg" alt="">
                <div class="info">
                    <div>${file.name}</div>
                    <div></div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="img/play.svg" alt="">
                </div>
            `;
            li.addEventListener("click", () => {
                playLocalMusic(file, i);
            });
            songUL.appendChild(li);
        }
    }

    // Auto play first song
    if (songs.length > 0) {
        playLocalMusic(songs[0], 0);
    }
});


function playLocalMusic(file, index = 0) {
    currentIndex = index;
    const objectUrl = URL.createObjectURL(file);
    currentSong.src = objectUrl;
    currentSong.play();
    play.src = "img/pause.svg";

    document.querySelector(".songinfo").innerHTML = file.name;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}
