const slider = document.querySelector('.slider');
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');

next.addEventListener('click', function () {
    slider.scrollBy({
        left: 330,
        behavior: 'smooth'
    });
});

prev.addEventListener('click', function () {
    slider.scrollBy({
        left: -330,
        behavior: 'smooth'
    });
});


// Kontakti js


const forma = document.getElementById("kontaktForma");

forma.addEventListener("submit", function (e) {
  e.preventDefault();

  let ispravno = true;

  // Ime
  const ime = document.getElementById("ime").value.trim();
  const greskaIme = document.getElementById("greskaIme");
  if (ime.length < 2) {
    greskaIme.textContent = "Unesite ispravno ime.";
    ispravno = false;
  } else {
    greskaIme.textContent = "";
  }

  // Prezime
  const prezime = document.getElementById("prezime").value.trim();
  const greskaPrezime = document.getElementById("greskaPrezime");
  if (prezime.length < 2) {
    greskaPrezime.textContent = "Unesite ispravno prezime.";
    ispravno = false;
  } else {
    greskaPrezime.textContent = "";
  }

  // Email
  const email = document.getElementById("email").value.trim();
  const greskaEmail = document.getElementById("greskaEmail");
  if (!email.includes("@") || !email.includes(".")) {
    greskaEmail.textContent = "Unesite ispravnu email adresu.";
    ispravno = false;
  } else {
    greskaEmail.textContent = "";
  }

  // Telefon
  const telefon = document.getElementById("telefon").value.trim();
  const greskaTelefon = document.getElementById("greskaTelefon");
  if (telefon === "" || telefon === "+387") {
    greskaTelefon.textContent = "Unesite broj telefona.";
    ispravno = false;
  } else if (!/^\+?[\d\s\-]{7,20}$/.test(telefon)) {
    greskaTelefon.textContent = "Unesite ispravan broj telefona.";
    ispravno = false;
  } else {
    greskaTelefon.textContent = "";
  }

  // Tema
  const tema = document.getElementById("tema").value;
  const greskaTema = document.getElementById("greskaTema");
  if (!tema) {
    greskaTema.textContent = "Odaberite temu upita.";
    ispravno = false;
  } else {
    greskaTema.textContent = "";
  }

  // Poruka
  const poruka = document.getElementById("poruka").value.trim();
  const greskaPoruka = document.getElementById("greskaPoruka");
  if (poruka.length < 10) {
    greskaPoruka.textContent = "Poruka mora imati najmanje 10 karaktera.";
    ispravno = false;
  } else {
    greskaPoruka.textContent = "";
  }

  // Uspjesan unos
  if (ispravno) {
    document.getElementById("uspjesnaPoruka2").textContent = "✓ Poruka je uspješno poslana!";
    forma.reset();
  }
});
/*INDEX.HTML - kartice, filteri i pomjeranje kartica
   Ovaj dio upravlja karticama na početnoj stranici. Klik na filter
   prikazuje samo kartice iz odabrane kategorije, a strelice pomjeraju
   vidljive kartice bez ponovnog učitavanja stranice.*/
const slider = document.querySelector(".kartice-kontejner");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");
const filterButtons = document.querySelectorAll("[data-filter]");

let index = 0;

function brojVidljivihKartica() {
  if (window.innerWidth <= 600) {
    return 1;
  }

  if (window.innerWidth <= 900) {
    return 2;
  }

  return 3;
}

function sveKartice() {
  return Array.from(document.querySelectorAll(".kartice-kontejner article"));
}

function vidljiveKartice() {
  return sveKartice().filter(function (kartica) {
    return kartica.style.display !== "none";
  });
}

function maksimalniIndex() {
  return Math.max(0, vidljiveKartice().length - brojVidljivihKartica());
}

function pomjeriSlider() {
  if (!slider) return;

  const kartica = vidljiveKartice()[0];
  if (!kartica) return;

  const stil = window.getComputedStyle(slider);
  const gap = parseFloat(stil.columnGap || stil.gap) || 0;
  const pomak = kartica.offsetWidth + gap;

  slider.style.transform = `translateX(-${index * pomak}px)`;
}
   /*AI napomena: Za organizaciju logike filtera i slidera korišten je AI
   kao pomoć pri debagovanju i sređivanju koda. Razumijem da se kartice
   pronalaze preko querySelectorAll, da se kategorija čita iz data-category
   atributa, a pomjeranje se radi preko CSS transform: translateX().*/

next?.addEventListener("click", function () {
  const korak = brojVidljivihKartica();
  index = index + korak > maksimalniIndex() ? 0 : index + korak;
  pomjeriSlider();
});

prev?.addEventListener("click", function () {
  const korak = brojVidljivihKartica();
  index = index - korak < 0 ? maksimalniIndex() : index - korak;
  pomjeriSlider();
});

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    if (!slider) return;

    const filter = button.dataset.filter;

    filterButtons.forEach(function (btn) {
      btn.classList.remove("active-filter");
    });

    button.classList.add("active-filter");

    sveKartice().forEach(function (kartica) {
      kartica.style.display =
        filter === "sve" || kartica.dataset.category === filter
          ? "block"
          : "none";
    });

    index = 0;
    slider.style.transform = "translateX(0)";
  });
});

window.addEventListener("resize", pomjeriSlider);

/*SVE STRANICE - tamni i svijetli prikaz
   Ovaj dio pamti odabranu temu u browseru. Ako korisnik uključi tamni
   prikaz, izbor ostaje zapamćen i nakon ponovnog otvaranja stranice.*/

const themeToggle = document.querySelector("#theme-toggle");

if (localStorage.getItem("tema") === "dark") {
  document.body.classList.add("dark");
}

if (themeToggle) {
  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      localStorage.setItem("tema", "dark");
    } else {
      localStorage.setItem("tema", "light");
    }
  });
}

/*SADRZAJ.HTML - glatko pomjeranje kroz bookmark linkove
   Ovaj dio služi za linkove koji vode na dijelove iste stranice, npr.
   "Skoči na vrh". Stranica se pomjera glatko, bez naglog skoka.*/

document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener("click", function (e) {
    const idSekcije = link.getAttribute("href");

    if (!idSekcije || idSekcije === "#") return;

    const sekcija = document.querySelector(idSekcije);

    if (!sekcija) return;

    e.preventDefault();
    sekcija.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

/*
   KONTAKT.HTML - provjera kontakt forme
   Ovaj dio provjerava ime, prezime, email, telefon, temu i poruku.
   Greške se ispisuju pored polja, a ispravna forma prikazuje poruku
   sa imenom osobe koja je popunila formu.*/

const forma = document.getElementById("kontaktForma");

function postaviGresku(polje, elementGreske, poruka) {
  if (elementGreske) {
    elementGreske.textContent = poruka;
  }

  if (polje) {
    polje.classList.add("polje-greska");
  }
}

function ukloniGresku(polje, elementGreske) {
  if (elementGreske) {
    elementGreske.textContent = "";
  }

  if (polje) {
    polje.classList.remove("polje-greska");
  }
}

if (forma) {
  forma.addEventListener("submit", function (e) {
    e.preventDefault();

    let ispravno = true;

    const imePolje = document.getElementById("ime");
    const ime = imePolje.value.trim();
    const greskaIme = document.getElementById("greskaIme");

    if (ime.length < 2) {
      postaviGresku(imePolje, greskaIme, "Unesite ispravno ime.");
      ispravno = false;
    } else {
      ukloniGresku(imePolje, greskaIme);
    }

    const prezimePolje = document.getElementById("prezime");
    const prezime = prezimePolje.value.trim();
    const greskaPrezime = document.getElementById("greskaPrezime");

    if (prezime.length < 2) {
      postaviGresku(prezimePolje, greskaPrezime, "Unesite ispravno prezime.");
      ispravno = false;
    } else {
      ukloniGresku(prezimePolje, greskaPrezime);
    }

    const emailRegex = /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i;
    const emailPolje = document.getElementById("email");
    const email = emailPolje.value.trim();
    const greskaEmail = document.getElementById("greskaEmail");

    if (!emailRegex.test(email)) {
      postaviGresku(emailPolje, greskaEmail, "Unesite ispravnu email adresu.");
      ispravno = false;
    } else {
      ukloniGresku(emailPolje, greskaEmail);
    }

    const telefonRegex = /^\+?[\d\s-]{7,20}$/;
    const telefonPolje = document.getElementById("telefon");
    const telefon = telefonPolje.value.trim();
    const greskaTelefon = document.getElementById("greskaTelefon");

    if (telefon === "" || telefon === "+387") {
      postaviGresku(telefonPolje, greskaTelefon, "Unesite broj telefona.");
      ispravno = false;
    } else if (!telefonRegex.test(telefon)) {
      postaviGresku(telefonPolje, greskaTelefon, "Unesite ispravan broj telefona.");
      ispravno = false;
    } else {
      ukloniGresku(telefonPolje, greskaTelefon);
    }

    const temaPolje = document.getElementById("tema");
    const tema = temaPolje.value;
    const greskaTema = document.getElementById("greskaTema");

    if (!tema) {
      postaviGresku(temaPolje, greskaTema, "Odaberite temu upita.");
      ispravno = false;
    } else {
      ukloniGresku(temaPolje, greskaTema);
    }

    const porukaPolje = document.getElementById("poruka");
    const poruka = porukaPolje.value.trim();
    const greskaPoruka = document.getElementById("greskaPoruka");

    if (poruka.length < 10) {
      postaviGresku(
        porukaPolje,
        greskaPoruka,
        "Poruka mora imati najmanje 10 karaktera."
      );
      ispravno = false;
    } else {
      ukloniGresku(porukaPolje, greskaPoruka);
    }

    if (ispravno) {
      document.getElementById("uspjesnaPoruka2").textContent =
        "✓ Hvala, " + ime + "! Poruka je uspješno poslana.";

      forma.reset();
      document.querySelectorAll(".polje-greska").forEach(function (polje) {
        polje.classList.remove("polje-greska");
      });
    }
  });

  const resetDugme = document.getElementById("resetDugme2");

  if (resetDugme) {
    resetDugme.addEventListener("click", function () {
      document.querySelectorAll(".greska2").forEach(function (el) {
        el.textContent = "";
      });

      document.querySelectorAll(".polje-greska").forEach(function (polje) {
        polje.classList.remove("polje-greska");
      });

      document.getElementById("uspjesnaPoruka2").textContent = "";
    });
  }
}

/*ISTRAZUJ.HTML - generator nasumičnih činjenica
   Ovaj dio je dodatni interaktivni element. Klikom na dugme prikazuje
   se jedna činjenica o Tuzli, a ista činjenica se ne ponavlja odmah
   dva puta zaredom.*/

const arhivaFaktovi = [
  "Prva pozorišna predstava u Tuzli odigrana je 1898. godine u hotelu 'Grand'.",
  "Čuveni pisac Meša Selimović rođen je u Tuzli, a mnogi njegovi rukopisi se pominju u gradskim arhivima.",
  "U Tuzli je 1905. godine osnovano jedno od prvih pjevačkih društava u BiH pod nazivom 'Majevica'.",
  "Prvi kino-projektor stigao je u Tuzlu početkom 20. vijeka, a filmovi su se prikazivali u improvizovanim šatorima.",
  "Hotel 'Bristol' nekada je bio centar društvenog života i arhitektonski simbol modernizacije grada.",
  "Tuzla je među prvim gradovima u regiji dobila električnu rasvjetu još krajem 19. vijeka.",
  "Barokna zgrada u centru grada, poznata kao 'Barok', bila je jedna od najljepših građevina austrougarskog perioda.",
  "Prva biblioteka u Tuzli otvorena je u sklopu čitaonice koju su osnovali lokalni građani i trgovci.",
];

const prikaz = document.getElementById("fact-display");
const dugme = document.getElementById("btn-generator");

let posljednjiIndeks = -1;

function nasumicniIndeks() {
  let novi;

  do {
    novi = Math.floor(Math.random() * arhivaFaktovi.length);
  } while (novi === posljednjiIndeks && arhivaFaktovi.length > 1);

  return novi;
}

if (dugme && prikaz) {
  dugme.onclick = function () {
    prikaz.classList.add("fade-out");

    setTimeout(function () {
      const indeks = nasumicniIndeks();
      posljednjiIndeks = indeks;
      prikaz.innerText = arhivaFaktovi[indeks];
      prikaz.classList.remove("fade-out");
    }, 300);
  };
}

/*
   SADRZAJ.HTML - kviz o Tuzli
   Ovaj dio vodi korisnika kroz pitanja, zaključava odgovor nakon klika,
   računa bodove, prikazuje progres i na kraju ispisuje rezultat.*/

let kvizBodovi = 0;
let trenutnoPitanje = 0;
const ukupnoPitanja = 6;

const poruke = {
  6: "Savršen rezultat! Pravi si poznavalac historije i kulture Tuzle. Grad soli ti je otvorena knjiga!",
  5: "Odlično! Gotovo savršeno — samo jedan korak do naslova pravog tuzlanskog znalca.",
  4: "Dobro poznavanje! Tuzla ti nije strana, ali ima još lijepih priča koje čekaju da ih otkriješ.",
  3: "Solidno! Polovina tačnih odgovora — vrijedi zaroniti dublje u historiju grada soli.",
  2: "Za početak okej, ali grad soli ima još mnogo toga da ti otkrije. Istraži arhiv!",
  1: "Jedan korak na putu — AURUM arhiv je pravo mjesto da naučiš mnogo više o Tuzli.",
  0: "Nema veze — sada znaš šta ne znaš! Prošetaj kroz arhiv i pokušaj ponovo.",
};

const kvizProgresTekst = document.getElementById("kvizProgresTekst");
const kvizProgresFill = document.getElementById("kvizProgresFill");
const kvizBodoviTekuci = document.getElementById("kvizBodoviTekuci");

function azurirajProgres(pitanjeIndeks) {
  if (!kvizProgresTekst || !kvizProgresFill || !kvizBodoviTekuci) return;

  const procenat = (pitanjeIndeks / ukupnoPitanja) * 100;
  kvizProgresFill.style.width = procenat + "%";
  kvizProgresFill.setAttribute("aria-valuenow", procenat);
  kvizProgresTekst.textContent =
    "Pitanje " + (pitanjeIndeks + 1) + " od " + ukupnoPitanja;
  kvizBodoviTekuci.textContent = kvizBodovi + " bod.";
}

document.querySelectorAll(".kviz-pitanje-blok").forEach(function (blok) {
  const opcije = blok.querySelectorAll(".kviz-opcija");
  const feedback = blok.querySelector(".kviz-feedback");
  const btnNext = blok.querySelector(".kviz-btn-next");

  opcije.forEach(function (opcija) {
    opcija.addEventListener("click", function () {
      opcije.forEach(function (o) {
        o.disabled = true;
      });

      const jeTacno = opcija.dataset.tacno === "true";

      if (jeTacno) {
        opcija.classList.add("tacno");
        feedback.textContent = "✓ Tačno! Odlično poznavanje historije Tuzle.";
        feedback.className = "kviz-feedback tacno";
        kvizBodovi++;

        if (kvizBodoviTekuci) {
          kvizBodoviTekuci.textContent = kvizBodovi + " bod.";
        }
      } else {
        opcija.classList.add("netacno");
        feedback.textContent =
          "✗ Nije tačno. Pogledaj tačan odgovor označen zelenom bojom.";
        feedback.className = "kviz-feedback netacno";

        opcije.forEach(function (o) {
          if (o.dataset.tacno === "true") {
            o.classList.add("tacno");
          }
        });
      }

      btnNext.classList.add("vidljivo");
    });
  });
  
   /*AI napomena: AI je korišten kao pomoć za organizaciju kviza i poruka
   rezultata. Razumijem da se tačan odgovor prepoznaje preko data-tacno
   atributa, da se bodovi povećavaju samo kod tačnog odgovora i da dugme
   "dalje" otvara sljedeći blok pitanja preko data-pitanje atributa. */

  btnNext.addEventListener("click", function () {
    const sljedeciIndeks = parseInt(btnNext.dataset.sljedeci);

    if (sljedeciIndeks === -1) {
      prikaziRezultat();
    } else {
      blok.classList.remove("aktivno");

      const sljedecePitanje = document.querySelector(
        "[data-pitanje='" + sljedeciIndeks + "']"
      );

      if (sljedecePitanje) {
        sljedecePitanje.classList.add("aktivno");
      }

      trenutnoPitanje = sljedeciIndeks;
      azurirajProgres(sljedeciIndeks);
    }
  });
});

function prikaziRezultat() {
  document.querySelectorAll(".kviz-pitanje-blok").forEach(function (b) {
    b.classList.remove("aktivno");
  });

  if (kvizProgresFill) {
    kvizProgresFill.style.width = "100%";
  }

  if (kvizProgresTekst) {
    kvizProgresTekst.textContent = "Kviz završen!";
  }

  if (kvizBodoviTekuci) {
    kvizBodoviTekuci.textContent = kvizBodovi + " / " + ukupnoPitanja;
  }

  const rezultatEl = document.getElementById("kvizRezultat");
  const ikona = document.getElementById("rezultatIkona");
  const bodEl = document.getElementById("rezultatBodovi");
  const porukaEl = document.getElementById("rezultatPoruka");

  if (!rezultatEl || !ikona || !bodEl || !porukaEl) return;

  bodEl.textContent = kvizBodovi;
  porukaEl.textContent = poruke[kvizBodovi] || poruke[0];

  if (kvizBodovi === 6) ikona.textContent = "🏆";
  else if (kvizBodovi >= 4) ikona.textContent = "⭐";
  else if (kvizBodovi >= 2) ikona.textContent = "📚";
  else ikona.textContent = "💡";

  rezultatEl.style.display = "block";
}

const kvizRestart = document.getElementById("kvizRestart");

if (kvizRestart) {
  kvizRestart.addEventListener("click", function () {
    kvizBodovi = 0;
    trenutnoPitanje = 0;

    const kvizRezultat = document.getElementById("kvizRezultat");

    if (kvizRezultat) {
      kvizRezultat.style.display = "none";
    }

    document.querySelectorAll(".kviz-pitanje-blok").forEach(function (blok) {
      blok.classList.remove("aktivno");

      blok.querySelectorAll(".kviz-opcija").forEach(function (o) {
        o.disabled = false;
        o.classList.remove("tacno", "netacno");
      });

      const fb = blok.querySelector(".kviz-feedback");

      if (fb) {
        fb.className = "kviz-feedback";
        fb.textContent = "";
      }

      const btnNext = blok.querySelector(".kviz-btn-next");

      if (btnNext) {
        btnNext.classList.remove("vidljivo");
      }
    });

    const prvoPitanje = document.querySelector("[data-pitanje='0']");

    if (prvoPitanje) {
      prvoPitanje.classList.add("aktivno");
    }

    azurirajProgres(0);
  });
}

/*SADRZAJ.HTML - komentari posjetilaca
   Ovaj dio pomjera kartice sa komentarima građana. Aktivna kartica
   dobija klasu active, a prethodna se sakriva. */

let slideIndex = 0;

function moveSlide(n) {
  const slides = document.querySelectorAll(".feedback-card");

  if (slides.length === 0) return;

  slides[slideIndex].classList.remove("active");
  slideIndex = (slideIndex + n + slides.length) % slides.length;
  slides[slideIndex].classList.add("active");
}

window.moveSlide = moveSlide;

/* SADRZAJ.HTML I ISTRAZUJ.HTML - modali, prije/poslije prikaz i mapa.*/

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".clickable-row").forEach(function (red) {
    red.addEventListener("click", function () {
      const idModala = red.getAttribute("data-target");
      const modal = document.getElementById(idModala);

      if (modal) {
        modal.style.display = "flex";
      }
    });
  });

  document.querySelectorAll(".close-modal").forEach(function (dugme) {
    dugme.addEventListener("click", function () {
      const modal = dugme.closest(".modal");

      if (modal) {
        modal.style.display = "none";
      }
    });
  });

  window.addEventListener("click", function (dogadjaj) {
    if (dogadjaj.target.classList.contains("modal")) {
      dogadjaj.target.style.display = "none";
    }
  });

  document.querySelectorAll(".slider-container").forEach(function (kontejner) {
    const omotacSlike = kontejner.querySelector(".img-before-wrapper");
    const rucicaZaPovlacenje = kontejner.querySelector(".slider-handle");
    const slikaPrije = kontejner.querySelector(".img-before");

    if (!omotacSlike || !rucicaZaPovlacenje || !slikaPrije) return;

    let daLiSeVuce = false;

    function uskladiSirinuSlike() {
      const sirina = kontejner.offsetWidth;

      if (sirina > 0) {
        slikaPrije.style.width = sirina + "px";
      }
    }

    function pomjeriModalSlider(clientX) {
      uskladiSirinuSlike();

      const pozicijaKontejnera = kontejner.getBoundingClientRect();

      let procenat =
        ((clientX - pozicijaKontejnera.left) / pozicijaKontejnera.width) * 100;

      if (procenat < 0) procenat = 0;
      if (procenat > 100) procenat = 100;

      omotacSlike.style.width = procenat + "%";
      rucicaZaPovlacenje.style.left = procenat + "%";
    }

    uskladiSirinuSlike();

    if (kontejner.offsetWidth > 0) {
      omotacSlike.style.width = "50%";
      rucicaZaPovlacenje.style.left = "50%";
    }

    window.addEventListener("resize", uskladiSirinuSlike);

    rucicaZaPovlacenje.addEventListener("mousedown", function (e) {
      e.preventDefault();
      daLiSeVuce = true;
      uskladiSirinuSlike();
    });

    window.addEventListener("mouseup", function () {
      daLiSeVuce = false;
    });

    window.addEventListener("mousemove", function (dogadjaj) {
      if (!daLiSeVuce) return;

      dogadjaj.preventDefault();
      pomjeriModalSlider(dogadjaj.clientX);
    });

    rucicaZaPovlacenje.addEventListener(
      "touchstart",
      function () {
        daLiSeVuce = true;
        uskladiSirinuSlike();
      },
      { passive: true }
    );

    window.addEventListener("touchend", function () {
      daLiSeVuce = false;
    });

    window.addEventListener(
      "touchmove",
      function (dogadjaj) {
        if (!daLiSeVuce || dogadjaj.touches.length === 0) return;

        dogadjaj.preventDefault();
        pomjeriModalSlider(dogadjaj.touches[0].clientX);
      },
      { passive: false }
    );
  });

  const istraziPodaci = [
    {
      naziv: "Most s kipovima",
      kategorija: "Znamenitosti",
      opis: "2024. godine navršilo se 90 godina otkako postoji most “Kipovi” u Tuzli. Za devet decenija postojanja, most je saniran nekoliko puta ali ove godine je doživio veću rekonstrukciju. Kipovi koje je stvorio vrhunski kipar Franjo Leder su postavljeni 1936. godine.",
      godinaPrije: "~1930.",
      godinaPoslije: "2024.",
      slikaPrije: "images/1.svg",
      slikaPoslije: "images/2.svg",
    },
    {
      naziv: "Skver",
      kategorija: "Arhitektura",
      opis: "Skver u Tuzli je jedan od najprepoznatljivijih centralnih dijelova grada, koji povezuje glavnu saobraćajnicu s užim centrom grada. Oduvijek je poznat kao prometno čvorište i mjesto susreta.",
      godinaPrije: "~1957.",
      godinaPoslije: "2026.",
      slikaPrije: "images/3.svg",
      slikaPoslije: "images/4.svg",
    },
    {
      naziv: "Panonska jezera",
      kategorija: "Priroda & Turizam",
      opis: "Gdje su nekada bila aktivna rudna ležišta soli iz kojih se crpio privredni život Tuzle, danas se prostiru vještačka Panonska jezera — simbol savremene transformacije grada.",
      godinaPrije: "~2000.",
      godinaPoslije: "2023.",
      slikaPrije: "images/5.svg",
      slikaPoslije: "images/6.svg",
    },
  ];

  document.querySelectorAll(".ba-dugme").forEach(function (dugme) {
    dugme.addEventListener("click", function () {
      const indeks = parseInt(dugme.dataset.lokacija);
      const d = istraziPodaci[indeks];

      if (!d) return;

      const kontejner = document.getElementById("baKontejner");
      const slikaPrije = document.getElementById("baSlika1");
      const slikaPoslije = document.getElementById("baSlika2");
      const infoKat = document.getElementById("baInfoKat");
      const infoNaziv = document.getElementById("baInfoNaziv");
      const infoOpis = document.getElementById("baInfoOpis");
      const godinaPrije = document.getElementById("baGodinaPrije");
      const godinaPoslije = document.getElementById("baGodinaPoslije");

      if (
        !kontejner ||
        !slikaPrije ||
        !slikaPoslije ||
        !infoKat ||
        !infoNaziv ||
        !infoOpis ||
        !godinaPrije ||
        !godinaPoslije
      ) {
        return;
      }

      slikaPrije.src = d.slikaPrije;
      slikaPrije.alt = d.naziv + " prije";

      slikaPoslije.src = d.slikaPoslije;
      slikaPoslije.alt = d.naziv + " poslije";

      infoKat.textContent = d.kategorija;
      infoNaziv.textContent = d.naziv;
      infoOpis.textContent = d.opis;
      godinaPrije.textContent = d.godinaPrije;
      godinaPoslije.textContent = d.godinaPoslije;

      const omotac = kontejner.querySelector(".img-before-wrapper");
      const rucica = kontejner.querySelector(".slider-handle");
      const beforeImg = kontejner.querySelector(".img-before");

      if (omotac && rucica && beforeImg) {
        beforeImg.style.width = kontejner.offsetWidth + "px";
        omotac.style.width = "50%";
        rucica.style.left = "50%";
      }

      document.querySelectorAll(".ba-dugme").forEach(function (b) {
        b.classList.remove("aktivno");
      });

      dugme.classList.add("aktivno");
    });
  });

  const placeholder = document.getElementById("panelPlaceholder");
  const sadrzaj = document.getElementById("panelSadrzaj");
  const pulse = document.getElementById("pulseRing");

  document.querySelectorAll(".mapa-zona").forEach(function (zona) {
    zona.addEventListener("click", function () {
      const podaci = zona.dataset;
      const krug = zona.querySelector("circle");

      const panelNaziv = document.getElementById("panelNaziv");
      const panelKategorija = document.getElementById("panelKategorija");
      const panelOpis = document.getElementById("panelOpis");
      const panelSlika = document.getElementById("panelSlika");
      const panelIkona = document.getElementById("panelIkona");
      const mapaPanel = document.getElementById("mapaPanel");

      if (
        !panelNaziv ||
        !panelKategorija ||
        !panelOpis ||
        !panelSlika ||
        !panelIkona ||
        !mapaPanel
      ) {
        return;
      }

      panelNaziv.textContent = podaci.naziv;
      panelKategorija.textContent = podaci.kategorija;
      panelKategorija.style.color = podaci.boja;
      panelOpis.textContent = podaci.opis;
      panelSlika.style.background = podaci.boja;
      panelIkona.className = "fa-solid " + podaci.ikona;
      mapaPanel.style.borderColor = podaci.boja;

      document.querySelectorAll(".mapa-zona").forEach(function (z) {
        z.classList.remove("aktivan");
      });

      zona.classList.add("aktivan");

      if (pulse && krug) {
        pulse.setAttribute("cx", krug.getAttribute("cx"));
        pulse.setAttribute("cy", krug.getAttribute("cy"));
        pulse.setAttribute("stroke", podaci.boja);
        pulse.setAttribute("opacity", "1");

        pulse.style.animation = "none";
        pulse.offsetHeight;
        pulse.style.animation = "pulseRing 1.5s ease-out infinite";
      }

      if (placeholder) {
        placeholder.style.display = "none";
      }

      if (sadrzaj) {
        sadrzaj.style.display = "flex";
      }
    });
  });
});
