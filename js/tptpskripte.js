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