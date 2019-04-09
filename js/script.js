const switcher = document.querySelector("#cbx"),
      more = document.querySelector(".more"),
      modal = document.querySelector(".modal"),
      videos = document.querySelectorAll(".videos__item");
let player,
    night = false;

//HAMBURGER

function bindSlideToggle(trigger, boxBody, content, openClass) {
    let button = {
        "element": document.querySelector(trigger),
        "active": false
    }

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

//TEMP

const data = [
    ['img/thumb_3.webp', 'img/thumb_4.webp', 'img/thumb_5.webp'],
    ['#3 Верстка на flexbox CSS | Блок преимущества и галерея | Марафон верстки | Артем Исламов',
        '#2 Установка spikmi и работа с ветками на Github | Марафон вёрстки  Урок 2',
        '#1 Верстка реального заказа landing Page | Марафон вёрстки | Артём Исламов'],
    ['3,6 тыс. просмотров', '4,2 тыс. просмотров', '28 тыс. просмотров'],
    ['X9SmcY3lM-U', '7BvHoh0BrMw', 'mC8JW_aG2EM']
];

//MORE BUTTON

more.addEventListener("click", () => {
    const videosWrapper = document.querySelector(".videos__wrapper");
    more.remove();

    for (let i = 0; i < data[0].length; i++) {
        let card = document.createElement("a");

        card.classList.add("videos__item", "videos__item-active");
        card.setAttribute("data-url", data[3][i]);

        card.innerHTML = `
            <img src="${data[0][i]}" alt="thumb">
            <div class="videos__item-descr">
                ${data[1][i]}
            </div>
            <div class="videos__item-views">
                ${data[2][i]}
            </div>
        `;

        bindNewModal(card);
        
        videosWrapper.appendChild(card);

        if (night)
        {
            night = false;
            switchMode();
        }

        setTimeout(() => {
            card.classList.remove("videos__item-active");
        }, 10);
    }

    sliceTitle(".videos__item-descr", 100);
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

bindModal(videos);

modal.addEventListener("click", (e) => {
    if (!e.target.classList.contains("modal__body")) {
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