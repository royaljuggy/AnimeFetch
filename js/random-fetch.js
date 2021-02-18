const fetchForm = document.getElementById('fetchForm');
const animeNumberInput = document.getElementById('animeNumber');
const animeNumberCeiling = 100000;
const startingAnimeNumber = 31240;
const genreNumberCeiling = 42;
const PAGE_CAP = 20; // MAL only shows up to 20 pages of a result, there may be more!
const APIgetURL = 'https://api.jikan.moe/v3/anime/';
const APIsearchURL = 'https://api.jikan.moe/v3/search/anime';

// Anime Info
const animeInfo = document.querySelector(".animeInfo");
const animeTitle = document.querySelector(".animeTitle");
const animePicture = document.querySelector(".animePicture");
const rank = document.getElementById('rank');
const popularity = document.getElementById('popularity');
const score = document.getElementById("score");
const animeSynopsis = document.querySelector(".animeSynopsis");
const animeOpening = document.querySelector(".animeOpening");
const animeEnding = document.querySelector(".animeEnding");
const animeTrailer = document.querySelector(".animeTrailer");
const animeLink = document.getElementById("animeLink");
const queryError = document.getElementById("queryError")

async function getRandomAnime() {
    // POTENTIAL ISSUE: Up to 4 API calls are made
    const genreNumber = Math.floor(Math.random() * genreNumberCeiling) + 1;
    const responsePage1 = await fetch(`${APIsearchURL}?genre=${genreNumber}&page=1`, {
        method: 'GET'
    });
    if (!responsePage1.ok) {
        console.error(`Error at responsePage1: ${responsePage1.status}`);
        return;
    }
    const page1Data = await responsePage1.json();
    let pageNumber = 0;
    if (page1Data.last_page == PAGE_CAP) {
        const responsePageCap = await fetch(`${APIsearchURL}?genre=${genreNumber}&page=20`, {
            method: 'GET'
        });
        if (!responsePageCap.ok) {
            console.error(`Error at PAGE_CAP: ${responsePageCap.status}`);
            return;
        }
        const pageCapData = await responsePageCap.json();
        pageNumber = Math.floor(Math.random() * pageCapData.last_page) + 1;
    } else {
        pageNumber = Math.floor(Math.random() * page1Data.last_page) + 1;
    }
    const response = await fetch(`${APIsearchURL}?genre=${genreNumber}&page=${pageNumber}`, {
        method: 'GET'
    });
    if (response.ok) {
        const data = await response.json();
        const randomAnimeID = data.results[Math.floor(Math.random() * data.results.length)].mal_id;
        getAnime(randomAnimeID);
    } else {
        console.error(`Error occurred in random-fetch. Status: ${response.status}`);
    }

}

// Fetch an anime from the unofficial MAL API
async function getAnime(animeNumber) {
    const response = await fetch(`${APIgetURL}${animeNumber}`, {
        method: 'GET'
    });
    if (response.ok) {
        const data = await response.json();
        queryError.classList.add('hidden');
        animeInfo.classList.remove('hidden');
        animeTitle.textContent = `${data.title} // MAL ID#${animeNumber}`;
        animePicture.src = data.image_url;
        const animeRank = data.rank;
        const animePopularity = data.popularity;
        if (animeRank && animePopularity) {
            popularity.display = 'flex';
            rank.textContent = animeRank;
            popularity.textContent = animePopularity;
        } else {
            rank.textContent = "Not popular enough (no ranking)";
            popularity.display = 'none';
        }
        const animeScore = data.score;
        if (animeScore) {
            score.textContent = animeScore;
        } else {
            score.textContent = "Not enough ratings!"
        }
        animeSynopsis.textContent = data.synopsis;
        animeOpening.textContent = "";
        let openingThemes = data.opening_themes;
        if (openingThemes.length > 0) {
            openingThemes.forEach((op) => {
                const li = document.createElement('li');
                li.textContent = op;
                animeOpening.appendChild(li);
            });
        } else {
            animeOpening.textContent = "None Found";
        }
        animeEnding.textContent = "";
        let endingThemes = data.ending_themes;
        if (endingThemes.length > 0) {
            endingThemes.forEach((ed) => {
                const li = document.createElement('li');
                li.textContent = ed;
                animeEnding.appendChild(li);
            });
        } else {
            animeEnding.textContent = "None Found";
        }
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

getRandomAnime();