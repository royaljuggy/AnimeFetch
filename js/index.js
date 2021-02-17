const fetchForm = document.getElementById('fetchForm');
const animeNumberInput = document.getElementById('animeNumber');
const animeNumberCeiling = 100000;
const startingAnimeNumber = 31240;
const apiURL = 'https://api.jikan.moe/v3/anime/';

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

fetchForm.addEventListener('submit', submitForm);
function submitForm(e) {
    e.preventDefault();
    let animeNumber = animeNumberInput.value;
    // !isNaN(+animeNumber) && animeNumber !== ""
    if (isNaN(animeNumber) || animeNumber == "" || animeNumber > animeNumberCeiling || animeNumber < 0) {
        animeNumber = Math.floor(Math.random() * animeNumberCeiling) + 1;
    }
    getAnime(animeNumber);
}

// Fetch an anime from the unofficial MAL API
async function getAnime(animeNumber) {
    const response = await fetch(`${apiURL}${animeNumber}`, {
        method: 'GET'
    });
    if (response.ok) {
        const data = await response.json();
        console.log(data);
        queryError.classList.add('hidden');
        animeInfo.classList.remove('hidden');
        animeTitle.textContent = `${data.title} // #${animeNumber}`;
        animePicture.src = data.image_url;
        score.textContent = data.score;
        animeSynopsis.textContent = data.synopsis;
        // !!! INNERHtml Used (cross-site scripting attack potential!)
        animeOpening.innerHTML = "None Found";
        data.opening_themes.forEach((op) => {
            const li = document.createElement('li');
            li.textContent = op;
            animeOpening.appendChild(li);
        });
        animeEnding.innerHTML = "None Found";
        data.ending_themes.forEach((ed) => {
            const li = document.createElement('li');
            li.textContent = ed;
            animeEnding.appendChild(li);
        });
        animeLink.textContent = `Check out ${data.title}`;
        animeLink.href = data.url;
    } else if (response.status == 404) {
        queryError.textContent = `No Anime at #${animeNumber}. Try again!`;
        queryError.classList.remove('hidden');
        animeInfo.classList.add('hidden');
    } else {
        queryError.textContent = "Unexpected error occurred";
        queryError.classList.remove('hidden');
        animeInfo.classList.add('hidden');
    }

}

// Make Re:Zero out starting anime shown
getAnime(startingAnimeNumber);