const wrappper = document.querySelector(".wrappper");
const carouselu = document.querySelector(".carouselu");
const firstCardWidth = carouselu.querySelector(".cardu").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrappper i");
const carouselChildrens = [...carouselu.children];

let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

// Get the number of cards that can fit in the carouselu at once
let cardPerView = Math.round(carouselu.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carouselu for infinite scrolling
carouselChildrens.slice(-cardPerView).reverse().forEach(cardu => {
    carouselu.insertAdjacentHTML("afterbegin", cardu.outerHTML);
});

// Insert copies of the first few cards to end of carouselu for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach(cardu => {
    carouselu.insertAdjacentHTML("beforeend", cardu.outerHTML);
});

// Scroll the carouselu at appropriate postition to hide first few duplicate cards on Firefox
carouselu.classList.add("no-transition");
carouselu.scrollLeft = carouselu.offsetWidth;
carouselu.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carouselu left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carouselu.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    carouselu.classList.add("dragging");
    // Records the initial cursor and scroll position of the carouselu
    startX = e.pageX;
    startScrollLeft = carouselu.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carouselu based on the cursor movement
    carouselu.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carouselu.classList.remove("dragging");
}

const infiniteScroll = () => {
    // If the carouselu is at the beginning, scroll to the end
    if(carouselu.scrollLeft === 0) {
        carouselu.classList.add("no-transition");
        carouselu.scrollLeft = carouselu.scrollWidth - (2 * carouselu.offsetWidth);
        carouselu.classList.remove("no-transition");
    }
    // If the carouselu is at the end, scroll to the beginning
    else if(Math.ceil(carouselu.scrollLeft) === carouselu.scrollWidth - carouselu.offsetWidth) {
        carouselu.classList.add("no-transition");
        carouselu.scrollLeft = carouselu.offsetWidth;
        carouselu.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carouselu
    clearTimeout(timeoutId);
    if(!wrappper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the carouselu after every 2500 ms
    timeoutId = setTimeout(() => carouselu.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

carouselu.addEventListener("mousedown", dragStart);
carouselu.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carouselu.addEventListener("scroll", infiniteScroll);
wrappper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrappper.addEventListener("mouseleave", autoPlay);