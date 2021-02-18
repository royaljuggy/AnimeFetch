const fetchForm = document.getElementById('fetchForm');
const animeNumberInput = document.getElementById('animeNumber');
const genreNumberCeiling = 42;
const apiURL = 'https://api.jikan.moe/v3/search/anime';

// Anime Info
const animeInfo = document.querySelector(".animeInfo");
const animeTitle = document.querySelector(".animeTitle");
const animePicture = document.querySelector(".animePicture");
const score = document.getElementById("score");
const animeSynopsis = document.querySelector(".animeSynopsis");
const animeOpening = document.querySelector(".animeOpening");
const animeEnding = document.querySelector(".animeEnding");
const animeTrailer = document.querySelector(".animeTrailer");
const animeLink = document.getElementById("animeLink");
const queryError = document.getElementById("queryError")

fetch('https://api.jikan.moe/v3/search/anime?genre=22&page=21')
    .then(response => response.json())
    .then(data => console.log(data));


fetchForm.addEventListener('submit', submitForm);
function submitForm(e) {
    e.preventDefault();
    let genreNumber = animeNumberInput.value;
    // !isNaN(+animeNumber) && animeNumber !== ""
    if (isNaN(genreNumber) || genreNumber == "" || genreNumber > genreNumberCeiling || genreNumber < 0) {
        genreNumber = Math.floor(Math.random() * genreNumberCeiling) + 1;
    }
    getRandomAnimeFromGenre(genreNumber);
}
async function getRandomAnimeFromGenre(genreNumber) {
    console.log(genreNumber);
    const responsePage1 = await fetch(`${apiURL}?genre=${genreNumber}&page=1`, {
        method: 'GET'
    });
    if (!responsePage1.ok) {
        console.error(`Error: ${response.status}`);
        return;
    }
    const page1Data = await responsePage1.json();
    console.log(page1Data);
    const pageNumber = Math.floor(Math.random() * page1Data.last_page) + 1;
    console.log(page1Data.last_page);
    const response = await fetch(`${apiURL}?genre=${genreNumber}&page=${pageNumber}`, {
        method: 'GET'
    });
    if (response.ok) {
        const data = await response.json();
        const randomAnime = data.results[Math.floor(Math.random() * data.results.length)];
        console.log(data);
        queryError.classList.add('hidden');
        animeInfo.classList.remove('hidden');
        animeTitle.textContent = `${randomAnime .title}`;
        animePicture.src = randomAnime.image_url;
        score.textContent = randomAnime.score;
        animeSynopsis.textContent = randomAnime.synopsis;
        animeLink.textContent = `Check out ${randomAnime.title}`;
        animeLink.href = randomAnime.url;
    } else {
        console.error(`Error: ${response.status}`);
    }
}