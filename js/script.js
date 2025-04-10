"use strict";

/**
 * PRELOAD
 *
 * loading will be end after document is loaded
 */

const preloader = document.querySelector("[data-preaload]");

window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});

/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};

/**
 * NAVBAR
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
};

addEventOnElements(navTogglers, "click", toggleNavbar);

//HEADER

const header = document.querySelector("[data-header]");

let lastScrollPos = 0;

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollPos = window.scrollY;
};

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
  }
});

// HERO SLIDER

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

const updatesSliderPos = function () {
  lastActiveSliderItem.classList.remove("active");
  heroSliderItems[currentSlidePos].classList.add("active");
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
};
const slideNext = function () {
  if (currentSlidePos >= heroSliderItems.length - 1) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }
  updatesSliderPos();
};
heroSliderNextBtn.addEventListener("click", slideNext);
const slidePrev = function () {
  if (currentSlidePos <= 0) {
    currentSlidePos = heroSliderItems.length - 1;
  } else {
    currentSlidePos--;
  }

  updatesSliderPos();
};
heroSliderPrevBtn.addEventListener("click", slidePrev);

// Auto slide

let autoSlideInterval;

const autoSlide = function () {
  autoSlideInterval = setInterval(function () {
    slideNext();
  }, 7000);
};
addEventOnElements(
  [heroSliderNextBtn, heroSliderPrevBtn],
  "mouseover",
  function () {
    clearInterval(autoSlideInterval);
  }
);
addEventOnElements(
  [heroSliderNextBtn, heroSliderPrevBtn],
  "mouseover",
  autoSlide
);
window.addEventListener("load", autoSlide);

// PARALLAX EFFECT

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

// Dodajemy nasłuchiwanie na zdarzenie `mousemove` na obiekcie `window`,
// aby wykrywać ruchy myszki na całej stronie.
window.addEventListener("mousemove", function (event) {
  // Obliczamy wartości `x` i `y` na podstawie aktualnej pozycji kursora.
  // Dzielimy pozycję `clientX` przez szerokość okna i skalujemy wynik do wartości od -5 do 5.
  x = (event.clientX / window.innerWidth) * 10 - 5;
  y = (event.clientY / window.innerHeight) * 10 - 5;

  // Odwracamy wartości `x` i `y`, aby ruch był w przeciwnym kierunku.
  x = x - x * 2;
  y = y - y * 2;

  // Iterujemy przez wszystkie elementy z `parallaxItems`.
  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    // Mnożymy `x` i `y` przez wartość `parallaxSpeed`, pobraną z atrybutu `data-parallax-speed` elementu.
    // Dzięki temu elementy mogą poruszać się z różnymi prędkościami w zależności od ustawionego atrybutu.
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);

    // Ustawiamy transformację `translate3d` dla aktualnego elementu, przesuwając go o obliczone wartości `x` i `y`.
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }
});

const projects = [
  {
    img: "images/hero-slider-1.jpg",
    alt: "Web project 1",
    dataName: "website",
    p: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate animi atque rem.",
    a: "https://example.com/website1",
    github: "https://github.com/example/website1",
  },
  {
    img: "images/hero-slider-2.jpg",
    alt: "Mobile project 1",
    dataName: "android", // Możliwe dodanie android/website/ios
    p: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime distinctio nostrum.",
    a: "https://example.com/android1",
    github: "https://github.com/example/android1",
  },
];

/*=============== DYNAMIC LOAD PROJECTS ===============*/

// Wybieramy kontener, do którego wstawimy projekty
const projectsContainer = document.querySelector(".gallery");

// Funkcja renderująca projekty
function renderProjects() {
  // Iterujemy po projektach i tworzymy HTML dla każdego projektu
  projects.forEach((project) => {
    const projectElement = document.createElement("div");
    projectElement.classList.add("project-img");
    projectElement.setAttribute("data-name", project.dataName);

    projectElement.innerHTML = `
            <img src="${project.img}" alt="${project.alt}">
            <div class="proj-overlay">
                <h4>${capitalizeFirstLetter(project.dataName)} Projects</h4>
                <p>${project.p}</p>
                <div class="action-aria">
                    <a href="${
                      project.liveDemo
                    }" class="btn" target="_blank">Live Demo</a>
                    <a href="${
                      project.github
                    }" class="btn btn-light" target="_blank">Github</a>
                </div>
            </div>
        `;

    // Dodajemy stworzony element do kontenera
    projectsContainer.appendChild(projectElement);
  });
}

// Funkcja, aby ładnie wyświetlić nazwę kategorii projektu (np. 'website' => 'Website')
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Wywołanie funkcji renderującej projekty
renderProjects();

// Funkcja, aby ładnie wyświetlić nazwę platformy (np. 'website' => 'Website')
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
