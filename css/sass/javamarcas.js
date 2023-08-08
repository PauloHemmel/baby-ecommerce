const wraper = document.querySelector(".wraper");
const carosso = document.querySelector(".carosso");
const firstCardsWidth = carosso.querySelector(".cardume").offsetWidth;
const arrowsBtns = document.querySelectorAll(".wraper i");
const carouseluChildrens = [...carosso.children];

let issDragging = false, isAutosPlay = true, startXs, startsScrollLeft, timesoutId;

// Get the number of cards that can fit in the carosso at once
let cardsPerView = Math.round(carosso.offsetWidth / firstCardsWidth);

// Insert copies of the last few cards to beginning of carosso for infinite scrolling
carouseluChildrens.slice(-cardsPerView).reverse().forEach(cardume => {
    carosso.insertAdjacentHTML("afterbegin", cardume.outerHTML);
});

// Insert copies of the first few cards to end of carosso for infinite scrolling
carouseluChildrens.slice(0, cardsPerView).forEach(cardume => {
    carosso.insertAdjacentHTML("beforeend", cardume.outerHTML);
});

// Scroll the carosso at appropriate postition to hide first few duplicate cards on Firefox
carosso.classList.add("no-transition");
carosso.scrollLeft = carosso.offsetWidth;
carosso.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carosso left and right
arrowsBtns.forEach(btns => {
    btns.addEventListener("click", () => {
        carosso.scrollLeft += btns.id == "left" ? -firstCardsWidth : firstCardsWidth;
    });
});

const dragStart = (e) => {
    issDragging = true;
    carosso.classList.add("dragging");
    // Records the initial cursor and scroll position of the carosso
    startXs = e.pageX;
    startsScrollLeft = carosso.scrollLeft;
}

const dragging = (e) => {
    if(!issDragging) return; // if issDragging is false return from here
    // Updates the scroll position of the carosso based on the cursor movement
    carosso.scrollLeft = startsScrollLeft - (e.pageX - startXs);
}

const dragStop = () => {
    issDragging = false;
    carosso.classList.remove("dragging");
}

const infiniteScroll = () => {
    // If the carosso is at the beginning, scroll to the end
    if(carosso.scrollLeft === 0) {
        carosso.classList.add("no-transition");
        carosso.scrollLeft = carosso.scrollWidth - (2 * carosso.offsetWidth);
        carosso.classList.remove("no-transition");
    }
    // If the carosso is at the end, scroll to the beginning
    else if(Math.ceil(carosso.scrollLeft) === carosso.scrollWidth - carosso.offsetWidth) {
        carosso.classList.add("no-transition");
        carosso.scrollLeft = carosso.offsetWidth;
        carosso.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carosso
    clearTimeout(timesoutId);
    if(!wraper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 800 || !isAutosPlay) return; // Return if window is smaller than 800 or isAutosPlay is false
    // Autoplay the carosso after every 2500 ms
    timesoutId = setTimeout(() => carosso.scrollLeft += firstCardsWidth, 2500);
}
autoPlay();

carosso.addEventListener("mousedown", dragStart);
carosso.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carosso.addEventListener("scroll", infiniteScroll);
wraper.addEventListener("mouseenter", () => clearTimeout(timesoutId));
wraper.addEventListener("mouseleave", autoPlay);