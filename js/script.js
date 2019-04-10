const switcher = document.querySelector("#cbx"),
      more = document.querySelector(".more"),
      modal = document.querySelector(".modal"),
      videos = document.querySelectorAll(".videos__item"),
      playlistId = "PLBVNJo7nhINSlFdfuI9l7OANWmZJD--zl";
let player,
    night = false;

//HAMBURGER

function bindSlideToggle(trigger, boxBody, content, openClass) {
    let button = {
        "element": document.querySelector(trigger),
        "active": false
    };

    const box = document.querySelector(boxBody),
          boxContent = document.querySelector(content);

    button.element.addEventListener("click", () => {
        if (button.active === false) {
            button.active = true;
            box.style.height = boxContent.clientHeight + "px";
            box.classList.add(openClass);
        } else {
            button.active = false;
            box.style.height = 0;
            box.classList.remove(openClass);
        }
    });
}

bindSlideToggle(".hamburger", '[data-slide="nav"]', ".header__menu", "slide-active");

//NIGHT MODE

function switchMode() {
    if (night === false) {
        night = true;
        document.body.classList.add("night");

        document.querySelectorAll(".hamburger > line").forEach(e => {
            e.style.stroke = "#fff";
        });

        document.querySelectorAll(".videos__item-descr").forEach(e => {
            e.style.color = "#fff";
        });

        document.querySelectorAll(".videos__item-views").forEach(e => {
            e.style.color = "#fff";
        });

        document.querySelector(".header__item-descr").style.color = "#fff";

        document.querySelector(".logo > img").src = "logo/youtube_night.svg";
    } else {
        night = false;
        document.body.classList.remove("night");

        document.querySelectorAll(".hamburger > line").forEach(e => {
            e.style.stroke = "#000";
        });

        document.querySelectorAll(".videos__item-descr").forEach(e => {
            e.style.color = "#000";
        });

        document.querySelectorAll(".videos__item-views").forEach(e => {
            e.style.color = "#000";
        });
        
        document.querySelector(".header__item-descr").style.color = "#000";

        document.querySelector(".logo > img").src = "logo/youtube.svg";
    }
}

switcher.addEventListener("change", () => {
    switchMode();
});

function VideoGen(items, mode) {
    const videosWrapper = document.querySelector(".videos__wrapper");
        items.forEach(e => {
            let card = document.createElement("a");

            card.classList.add("videos__item", "videos__item-active");

            if (mode == "search") 
                card.setAttribute("data-url", e.id.videoId);
            else if (mode == "more") 
                card.setAttribute("data-url", e.contentDetails.videoId);

            card.innerHTML = `
                <img src="${e.snippet.thumbnails.high.url}" alt="thumb">
                <div class="videos__item-descr">
                    ${e.snippet.title}
                 </div>
                 <div class="videos__item-views">
                     2.7 тыс просмотров
                 </div>
            `;
        
            videosWrapper.appendChild(card);

            if (night)
            {
                night = false;
                switchMode();
            }

            setTimeout(() => {
                card.classList.remove("videos__item-active");
            }, 10);
        });

    sliceTitle(".videos__item-descr", 100);
    bindModal(document.querySelectorAll(".videos__item"));
}

//YOUTUBE API

function load() {
    gapi.client.init({
        "apiKey": "AIzaSyDnSnWiy7diRnX6-SMZfoi1vpADgXWVF6I",
        "discoveryDocs": ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"]
    }).then(function() { //Request
        return gapi.client.youtube.playlistItems.list({
            "part": "snippet,contentDetails",
            "maxResults": "9",
            "playlistId": playlistId
        }).then(function(response) { //Response
            console.log(response.result.items);

            VideoGen(response.result.items, "more");
        }).catch(e => { //Error
            console.log(e);
        });
    });
}

more.addEventListener("click", () => {
    more.remove();
    gapi.load("client", load);
});

function search(target) {
    gapi.client.init({
        "apiKey": "AIzaSyDnSnWiy7diRnX6-SMZfoi1vpADgXWVF6I",
        "discoveryDocs": ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"]
    }).then(function() {
        return gapi.client.youtube.search.list({
            "part": "snippet",
            "maxResults": "9",
            "q": `${target.trim()}`,
            "type": ""
        });
    }).then(function(response) {
        console.log(response.result);

        document.querySelector(".videos__wrapper").innerHTML = "";
        VideoGen(response.result.items, "search");
    });
}

document.querySelector(".search").addEventListener("submit", (e) => {
    e.preventDefault();

    inputObj = document.querySelector(".search > input");
    gapi.load("client", () => { search(inputObj.value); });

    document.querySelector(".search > input").value = "";
});

//SLICE TITLES

function sliceTitle(selector, count) {
    document.querySelectorAll(selector).forEach(e => {
        e.textContent.trim();

        if (e.textContent.length > count) {
            const str = e.textContent.slice(0, count + 1) + "...";
            e.textContent = str;
        } else return;
    });
}

sliceTitle(".videos__item-descr", 100);

//MODAL

function openModal() {
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
    player.stopVideo();
}

function bindModal(cards) { //Bind modal for array
    cards.forEach(card => {
        card.addEventListener("click", (e) => {
            e.preventDefault();

            const id = card.getAttribute("data-url");
            loadVideo(id);

            openModal();
        });
    });
}

function bindNewModal(card) { //Bind modal for element
    card.addEventListener("click", (e) => {
        e.preventDefault();

        const id = card.getAtribute("data-url");
        loadVideo(id);

        openModal();
    });
}

modal.addEventListener("click", (e) => {
    if (!e.target.classList.contains("modal__body")) {
        closeModal();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.keyCode === 27) {
        closeModal();
    }
});

//VIDEO IFRAME

function createVideoPlayer() {
    let tag = document.createElement("script");

    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.querySelectorAll("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    setTimeout(() => {
        player = new YT.Player('frame', {
            height: '100%',
            width: '100%',
            videoId: 'M7lc1UVf-VE',
        });
    }, 700);
}

function loadVideo(id) {
    player.loadVideoById({'videoId': `${id}`});
}

createVideoPlayer();