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

/*=============== DYNAMIC LOAD Doctors ===============*/

const projectsContainer = document.querySelector(".gallery");

async function fetchDoctors() {
  try {
    const response = await fetch("data/doctors.json");
    const doctors = await response.json();

    doctors.forEach((doctor) => {
      const projectElement = document.createElement("div");
      projectElement.classList.add("project-img");

      projectElement.innerHTML = `
        <img src="${doctor.img}" alt="${doctor.alt}">
        <div class="proj-overlay">
          <h4>Dr ${doctor.name} ${doctor.surname}</h4>
          <p><strong>${doctor.specialization}</strong></p>
          <div class="action-aria">
            <a href="${doctor.link}" class="btn btn-secondary" target="_blank">
            
                <span class="text text-1">Więcej informacji</span>

                <span class="text text-2" aria-hidden="true">Więcej informacji</span>
            
            </a>
          </div>
        </div>
      `;

      projectsContainer.appendChild(projectElement);
    });
  } catch (error) {
    console.error("Błąd wczytywania danych lekarzy:", error);
  }
}

fetchDoctors();

/*=============== Appointment - calendar ===============*/

let doctorsData = [];
let fp; // przenieśmy deklarację na wyższy poziom

document.addEventListener("DOMContentLoaded", () => {
  const doctorSelect = document.getElementById("doctor");
  const timeSelect = document.getElementById("appointment-time");
  const dateInput = document.getElementById("appointment-date");

  // 1) Flatpickr inline — najpierw inicjalizujemy fp
  fp = flatpickr("#calendar-inline", {
    inline: true,
    dateFormat: "Y-m-d",
    minDate: "today",
    locale: "pl",
    disable: [], // początkowo bez disable
    onChange(_, dateStr) {
      dateInput.value = dateStr;
      updateAvailableHours();
    },
  });

  // 2) Fetch doctors data
  fetch("data/doctors.json")
    .then((res) => res.json())
    .then((data) => {
      doctorsData = data;
      data.forEach((doc) => {
        const option = document.createElement("option");
        option.value = String(doc.id); // Upewnij się, że id jest stringiem
        option.textContent = `${doc.name} ${doc.surname} - ${doc.specialization}`;
        doctorSelect.appendChild(option);
      });

      // 3) Gdy zmieni się lekarz, ustaw nowe reguły dla fp
      doctorSelect.addEventListener("change", () => {
        const sel = doctorsData.find(
          (d) => String(d.id) === doctorSelect.value
        );

        // Resetowanie wartości
        dateInput.value = "";
        timeSelect.innerHTML = `<option selected disabled>Wybierz godzinę</option>`;

        if (!sel) {
          // Jeśli brak wybranego lekarza, resetuj
          fp.set("disable", []);
          fp.redraw();
          return;
        }

        // Ustawienie dni pracy lekarza
        const doctorWorkdays = sel.workdays;

        // Disable kalendarza, aby zaznaczyć tylko dni pracy
        fp.set("disable", [
          (date) => {
            const day = date
              .toLocaleDateString("en-US", { weekday: "long" })
              .trim();
            return !doctorWorkdays.includes(day); // Zablokuj dni, których lekarz nie pracuje
          },
        ]);

        // Zaktualizuj dostępne godziny
        updateAvailableHours();

        // Odśwież kalendarz po ustawieniu nowych dni
        fp.redraw();
      });
    })
    .catch(console.error);

  // 4) Funkcja do uzupełniania godzin
  function updateAvailableHours() {
    const doctorId = doctorSelect.value;
    const dateStr = dateInput.value;
    if (!doctorId || !dateStr) return;

    const selDoc = doctorsData.find((d) => String(d.id) === doctorId);
    if (!selDoc) return;

    const weekday = new Date(dateStr)
      .toLocaleDateString("en-US", { weekday: "long" })
      .trim();

    const availableHours = selDoc.hours[weekday] || [];

    if (!availableHours.length) {
      timeSelect.innerHTML = `<option disabled selected>Niepracujący dzień</option>`;
      return;
    }

    timeSelect.innerHTML = "";
    availableHours.forEach((h) => {
      const opt = document.createElement("option");
      opt.value = h;
      opt.textContent = h;
      timeSelect.appendChild(opt);
    });
  }
});

document.querySelector(".form").addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    id: document.getElementById("id").value,
    name: document.getElementById("name").value,
    surname: document.getElementById("surname").value,
    email: document.getElementById("email").value,
    telephone: document.getElementById("telephone").value,
    doctor: document.getElementById("doctor").value,
    appointmentDate: document.getElementById("appointment-date").value,
    appointmentTime: document.getElementById("appointment-time").value,
  };

  fetch("/api/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((resp) => {
      if (resp.error) {
        alert("Błąd: " + resp.error);
      } else {
        alert(resp.message);
        document.querySelector(".form").reset();
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Wystąpił błąd podczas zapisu rezerwacji.");
    });
});
