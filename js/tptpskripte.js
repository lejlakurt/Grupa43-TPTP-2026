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
