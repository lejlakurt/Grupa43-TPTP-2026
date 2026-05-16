/* ┌────────────────────────────────────────────────────────┐ */
/* │                  1. GLAVNE PROMJENJIVE                 │ */
/* └────────────────────────────────────────────────────────┘ */
/* Elementi sa stranice koje ćemo kontrolisatipomoću JavaScripta i postavljamo početne brojače za slajdere */

const slider = document.querySelector(".kartice-kontejner");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");
const filterButtons = document.querySelectorAll("[data-filter]");
const themeToggle = document.querySelector("#theme-toggle");

let index = 0;       // Prati poziciju velikog slajdera sa karticama
let slideIndex = 0;  // Prati poziciju za slajder sa komentarima građana


/* ┌────────────────────────────────────────────────────────┐ */
/* │                  2. SLIDER SA KARTICAMA                │ */
/* └────────────────────────────────────────────────────────┘ */
/* Logika koja omogućava da se kartice uredno pomijeraju lijevo-desno i prilagođavaju širini ekrana (telefon/kompjuter) */

// Određuje koliko se kartica vidi odjednom zavisno od veličine ekrana
function brojVidljivihKartica() {
  if (window.innerWidth <= 600) return 1;  // Na telefonu samo 1
  if (window.innerWidth <= 900) return 4;  // Na tabletu 4
  return 6;                                // Na računaru 6 kartica
}

// Pronalazi sve kartice unutar kontejnera
function sveKartice() {
  return Array.from(document.querySelectorAll(".kartice-kontejner article"));
}

// Izdvaja samo one kartice koje nisu sakrivene filterom
function vidljiveKartice() {
  return sveKartice().filter(kartica => kartica.style.display !== "none");
}

// Računa dokle slajder smije ići, da ne ode u prazan prostor
function maksimalniIndex() {
  return Math.max(0, vidljiveKartice().length - brojVidljivihKartica());
}

// Pokreće fizičko pomijeranje slajdera na ekranu
function pomjeriSlider() {
  if (!slider) return;
  const sirinaStranice = slider.parentElement.offsetWidth + 30;
  const stranica = Math.floor(index / brojVidljivihKartica());
  slider.style.transform = `translateX(-${stranica * sirinaStranice}px)`;
}

// Klik na desnu strelicu (idemo naprijed)
next?.addEventListener("click", function () {
  const korak = brojVidljivihKartica();
  // Ako pređemo kraj, vraća nas na početak (na 0), inače ide naprijed
  index = index + korak > maksimalniIndex() ? 0 : index + korak;
  pomjeriSlider();
});

// Klik na lijevu strelicu (idemo unazad)
prev?.addEventListener("click", function () {
  const korak = brojVidljivihKartica();
  // Ako odemo iza početka, šalje nas na sam kraj, inače ide unazad
  index = index - korak < 0 ? maksimalniIndex() : index - korak;
  pomjeriSlider();
});
