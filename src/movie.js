import { makeGenreForm } from "./genre_data.js";
// 신이지니 import

// 조민수 시작포인트
// TMDB 에서  영화 가져온것
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5OWIwNDE1OTlmNzBkMDkwYjVmYTg2NjJlOWNkYTVhZCIsInN1YiI6IjY2MmE0NzFmMWM2YWE3MDBiMjkyNzg3MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.P1vJ1UkEQN1GdOv7kd_C2XL1bxFKy16ySE3ZvkrXtxU"
    }
};

export async function getdata() {
    const response = await fetch("https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1", options);
    const data = await response.json();

    const newmovieinfo = [];

    for (let item of data.results) {
        const movieinfo = {};
        movieinfo["title"] = item["title"];
        movieinfo["overview"] = item["overview"];
        movieinfo["poster_path"] = item["poster_path"];
        movieinfo["vote_average"] = item["vote_average"];
        movieinfo["id"] = item["id"];

        newmovieinfo.push(movieinfo);
    }

    //신이지니 시작
    makeGenreForm(data.results);

    return newmovieinfo;
}

// update : 2024 - 05 - 07
// 작성자 : 윤동협
//카드 만들기
const $movieCards = document.querySelector(".movieCards");
const $prevBtn = document.querySelector(".prev");
const $nextBtn = document.querySelector(".next");
const cardWidth = 285;
const cardMargin = 15;
let currentIdx = 0;

export async function makeCard(item) {
    const innerContents = `
            <li class="card" id= "mvcard_${item.id}">
                <a href = "./detail.html?${item.id}">
                    <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" class="card-img-top" alt="이미지 준비중">
                </a>
            </li>
        `;

    $movieCards.insertAdjacentHTML("beforeend", innerContents);
}

//출력하기
export async function print() {
    const data = await getdata();
    let count = 0;
    Promise.all(
        data.map(async function (item) {
            await makeCard(item);
            count++;
        })
    ).then((res) => {
        $movieCards.style.width = (cardWidth + cardMargin) * count - cardMargin + "px";
    });

    $nextBtn.addEventListener("click", function () {
        if (currentIdx < count - 7) $movieCards.style.left = ++currentIdx * (cardWidth + cardMargin) * -1 + "px";
    });
    $prevBtn.addEventListener("click", function () {
        if (currentIdx > 0) $movieCards.style.left = --currentIdx * (cardWidth + cardMargin) * -1 + "px";
    });
}
// ----------------- 구분선 ------------------------

// 조민수 끝나는포인트

// 이동효 시작 부분

function executeSearch() {
    const searchText = document.getElementById("searchInput").value.toLowerCase();
    const cards = document.querySelectorAll(".card");

    cards.forEach(function (card) {
        const title = card.querySelector(".card-title").textContent.toLowerCase();
        if (title.includes(searchText)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

document.getElementById("searchbtn").addEventListener("click", function (event) {
    event.preventDefault();
    executeSearch();
});

document.getElementById("searchInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        executeSearch();
    }
});

//이동효 종료 부분
