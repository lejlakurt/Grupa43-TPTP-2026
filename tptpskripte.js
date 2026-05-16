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


/* ┌────────────────────────────────────────────────────────┐ */
/* │                  3. FILTRIRANJE SADRŽAJA               │ */
/* └────────────────────────────────────────────────────────┘ */
/* Kada se klikne na neku kategoriju (npr. Arhitektura) prikazuju se samo te kartice, a ostale se sakrivaju */     

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const filter = button.dataset.filter;

    // Skinu aktivnu klasu sa svih dugmadi i dodaj je samo kliknutom dugmetu
    filterButtons.forEach(btn => btn.classList.remove("active-filter"));
    button.classList.add("active-filter");

    // Prođi kroz sve kartice i sakrij one koje ne odgovaraju filteru
    sveKartice().forEach(function (kartica) {
      kartica.style.display =
        filter === "sve" || kartica.dataset.category === filter
          ? "block"
          : "none";
    });

    // Resetuj slajder na početnu poziciju nakon filtriranja
    index = 0;
    if (slider) slider.style.transform = "translateX(0)";
  });
});


/* ┌────────────────────────────────────────────────────────┐ */
/* │             4. PROMJENA TEME (TAMNA / SVIJETLA)        │ */
/* └────────────────────────────────────────────────────────┘ */
/* Pamti korisnikov izbor tamne ili svijetle teme tako da stranica zapamti izgled i kada se ponovo učita */

// Provjeri da li je korisnik ranije izabrao tamnu temu
if (localStorage.getItem("tema") === "dark") {
  document.body.classList.add("dark");
}

// Klik na dugme za promjenu teme
if (themeToggle) {
  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark"); // Pali/gasi tamni izgled

    // Sačuvaj trenutno stanje u memoriju preglednika
    if (document.body.classList.contains("dark")) {
      localStorage.setItem("tema", "dark");
    } else {
      localStorage.setItem("tema", "light");
    }
  });
}


/* ┌────────────────────────────────────────────────────────┐ */
/* │                  5. GLAS GRAĐANA (KOMENTARI)           │ */
/* └────────────────────────────────────────────────────────┘ */
/* Slajder koji vrti komentare građana u krug dodavanjem i oduzimanjem klase "active" */              
function moveSlide(n) {
  const slides = document.querySelectorAll('.feedback-card');
  if (slides.length === 0) return; // Sigurnost ako nema komentara na stranici

  // Sakrij komentar koji se trenutno vidi
  slides[slideIndex].classList.remove('active');
  
  // Izračunaj koji je sljedeći komentar na redu (ide u krug)
  slideIndex = (slideIndex + n + slides.length) % slides.length;
  
  // Prikaži novi komentar
  slides[slideIndex].classList.add('active');
}


/* ┌────────────────────────────────────────────────────────┐ */
/* │                  6. POKRETANJE NAKON UČITAVANJA        │ */
/* └────────────────────────────────────────────────────────┘ */
/* Sve unutar ovog bloka se pokreće tek kada se cijela      */
/* stranica potpuno učita u pregledniku                    */

document.addEventListener("DOMContentLoaded", function() {
    
    // ── DIO A: SKOČNI PROZORI (MODALI NA HRONOLOGIJI) ──
    var sviRedovi = document.querySelectorAll(".clickable-row");
    
    // Otvaranje prozora kada se klikne na red u tabeli
    sviRedovi.forEach(function(red) {
        red.addEventListener("click", function() {
            var idModala = red.getAttribute("data-target");
            var modal = document.getElementById(idModala);
            if (modal) {
                modal.style.display = "flex"; // Prikaži prozor
            }
        });
    });
    
    // Zatvaranje prozora na dugme X
    var svaDugmadZaZatvaranje = document.querySelectorAll(".close-modal");
    
    svaDugmadZaZatvaranje.forEach(function(dugme) {
        dugme.addEventListener("click", function() {
            var modal = dugme.closest(".modal");
            if (modal) {
                modal.style.display = "none"; // Sakrij prozor
            }
        });
    });
    
    // Zatvaranje prozora ako se klikne bilo gdje sa strane u prazan prostor
    window.addEventListener("click", function(dogadjaj) {
        if (dogadjaj.target.classList.contains("modal")) {
            dogadjaj.target.style.display = "none";
        }
    });


    // ── DIO B: SMANJIVANJE/POVEĆANJE SLIKE (PRIJE / POSLIJE) ──
    var sviSlajderi = document.querySelectorAll(".slider-container");
    
    sviSlajderi.forEach(function(kontejner) {
        var omotacSlike = kontejner.querySelector(".img-before-wrapper");
        var rucicaZaPovlacenje = kontejner.querySelector(".slider-handle");
        var daLiSeVuce = false; // Prati da li je miš stisnut
        
        // --- Pravila za računare (Miš) ---
        rucicaZaPovlacenje.addEventListener("mousedown", function() {
            daLiSeVuce = true; // Korisnik je stisnuo liniju
        });
        
        window.addEventListener("mouseup", function() {
            daLiSeVuce = false; // Korisnik je pustio miš
        });
        
        window.addEventListener("mousemove", function(dogadjaj) {
            if (daLiSeVuce == false) return; // Ako se ne vuče linija, ne radi ništa
            
            var pozicijaKontejnera = kontejner.getBoundingClientRect();
            var udaljenostOdLeveIvice = dogadjaj.clientX - pozicijaKontejnera.left;
            var procenat = (udaljenostOdLeveIvice / pozicijaKontejnera.width) * 100;
            
            // Ograniči pomijeranje da linija ne pobjegne van slike
            if (procenat < 0) procenat = 0;
            if (procenat > 100) procenat = 100;
            
            // Primijeni novu širinu slike i poziciju linije
            omotacSlike.style.width = procenat + "%";
            rucicaZaPovlacenje.style.left = procenat + "%";
        });
        
        // --- Pravila za telefone (Dodir prstom) ---
        rucicaZaPovlacenje.addEventListener("touchstart", function() {
            daLiSeVuce = true;
        });
        
        window.addEventListener("touchend", function() {
            daLiSeVuce = false;
        });
        
        window.addEventListener("touchmove", function(dogadjaj) {
            if (daLiSeVuce == false) return;
            
            if (dogadjaj.touches.length > 0) {
                var pozicijaKontejnera = kontejner.getBoundingClientRect();
                var udaljenostOdLeveIvice = dogadjaj.touches[0].clientX - pozicijaKontejnera.left;
                var procenat = (udaljenostOdLeveIvice / pozicijaKontejnera.width) * 100;
                
                if (procenat < 0) procenat = 0;
                if (procenat > 100) procenat = 100;
                
                omotacSlike.style.width = procenat + "%";
                rucicaZaPovlacenje.style.left = procenat + "%";
            }
        });
    });


    // ── DIO C: INTERAKTIVNA MAPA I DESNI PANEL ──
    const placeholder = document.getElementById('panelPlaceholder');
    const sadrzaj = document.getElementById('panelSadrzaj');
    const pulse = document.getElementById('pulseRing');

    // Prođi kroz sve lokacije na mapi i čekaj klik
    document.querySelectorAll('.mapa-zona').forEach(zona => {
        zona.addEventListener('click', () => {
            const podaci = zona.dataset; // Uzmi podatke (ime, opis, boju) iz HTML-a
            const krug = zona.querySelector('circle');

            // Upisivanje podataka u desni bočni panel
            document.getElementById('panelNaziv').textContent = podaci.naziv;
            document.getElementById('panelKategorija').textContent = podaci.kategorija;
            document.getElementById('panelKategorija').style.color = podaci.boja;
            document.getElementById('panelOpis').textContent = podaci.opis;
            document.getElementById('panelSlika').style.background = podaci.boja;
            document.getElementById('panelIkona').className = `fa-solid ${podaci.ikona}`;
            document.getElementById('mapaPanel').style.borderColor = podaci.boja;

            // Pomijeri pulsirajući krug na lokaciju koju smo upravo kliknuli
            if (pulse && krug) {
                pulse.setAttribute('cx', krug.getAttribute('cx'));
                pulse.setAttribute('cy', krug.getAttribute('cy'));
                pulse.setAttribute('stroke', podaci.boja);
                pulse.setAttribute('opacity', '1');
                
                // Restartuj animaciju pulsa
                pulse.style.animation = 'none';
                pulse.offsetHeight; 
                pulse.style.animation = 'pulse-animation 0.8s ease-out';
            }

            // Sakrij početni tekst ("Klikni na lokaciju") i prikaži stvarne podatke
            if (placeholder) placeholder.style.display = 'none';
            if (sadrzaj) sadrzaj.style.display = 'flex';
        });
    });
});