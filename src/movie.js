import { makeGenreForm } from "./genre_data.js";

// TMDB 에서  영화 가져온것
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5OWIwNDE1OTlmNzBkMDkwYjVmYTg2NjJlOWNkYTVhZCIsInN1YiI6IjY2MmE0NzFmMWM2YWE3MDBiMjkyNzg3MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.P1vJ1UkEQN1GdOv7kd_C2XL1bxFKy16ySE3ZvkrXtxU"
    }
};


// 전체 데이터를 반환하는 함수
export async function getData() {
    const response = await fetch("https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1", options);
    const data = await response.json();

    const newMovieInfo = [];

    for (let item of data.results) {
        const movieInfo = {};
        movieInfo["title"] = item["title"];
        movieInfo["overview"] = item["overview"];
        movieInfo["poster_path"] = item["poster_path"];
        movieInfo["vote_average"] = item["vote_average"];
        movieInfo["id"] = item["id"];

        newMovieInfo.push(movieInfo);
    }

    makeGenreForm(data.results);
    return newMovieInfo;
}


//카드 만들기
const $movieCards = document.querySelector(".movieCards");
let $movieCardLi = document.querySelectorAll(".movieCards>li");
const $prevBtn = document.querySelector(".prev");
const $nextBtn = document.querySelector(".next");
const cardWidth = 285;
const cardMargin = 15;
let currentIdx = 0;
let slideCount = 0;

// 검색 결과 카드 출력하는 함수
export async function makeCard(item) {
    const innerContents = `
    <div class="search_result">
        <a class="search_result_link" href = "./detail.html?${item.id}">
            <div class="search_cards" style="width: 18rem;" id= "mvcard_${item.id}">
                <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" class="card-img-top" alt="이미지 준비중">
                <div class="card-body">
                    <p class="card_title">${item.title}</p>
                </div>
                <div>
                    <p class = "score"> rating : ${item.vote_average}</p>
                </div>
            </div>
        </a>
    </div>
    `;
    document.querySelector("#movieCard").insertAdjacentHTML("beforeend", innerContents);
    document.getElementById(`mvcard_${item.id}`).addEventListener("click", async (e) => {
        await makeModal(item);
    });
}


// 슬라이드 카드 만드는 함수
export async function makeSlideCard(item) {
    const innerContents = `
            <li class="card" id= "mvcard_${item.id}">
                <a href = "./detail.html?${item.id}">
                    <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" class="card-img-top" alt="이미지 준비중">
                </a>
            </li>
        `;

    $movieCards.insertAdjacentHTML("beforeend", innerContents);
}


// 슬라이드 카드 출력하는 함수
export async function print() {
    const data = await getData();
    let count = 0;
    Promise.all(
        data.map(async function (item) {
            await makeSlideCard(item);
            slideCount++;
        })
    ).then((res) => {
        $movieCardLi = document.querySelectorAll(".movieCards>li");
        makeClone();
    });

    // Next, Prev 버튼으로 카드 슬라이드 동작하는 이벤트 추가 (무한루프)
    $nextBtn.addEventListener("click", function () {
        moveCardSlide(currentIdx + 1);
        console.log($movieCardLi);
    });
    $prevBtn.addEventListener("click", function () {
        moveCardSlide(currentIdx - 1);
    });
}


function makeClone() {
    for (let i = 0; i < slideCount; i++) {
        const cloneCard = $movieCardLi[i].cloneNode(true);
        cloneCard.classList.add("clone");
        $movieCards.appendChild(cloneCard);
    }
    for (let i = slideCount - 1; i >= 0; i--) {
        const cloneCard = $movieCardLi[i].cloneNode(true);
        cloneCard.classList.add("clone");
        $movieCards.prepend(cloneCard);
    }
    updateWidth();
    setInitialPos();
    setTimeout(function () {
        $movieCards.classList.add("animated");
    }, 100);
}

function updateWidth() {
    const currentCardLi = document.querySelectorAll(".movieCards>li");
    const newSlideCount = currentCardLi.length;

    const newWidth = (cardWidth + cardMargin) * newSlideCount - cardMargin + "px";
    $movieCards.style.width = newWidth;
}

function setInitialPos() {
    const initialTranslateValue = -(cardWidth + cardMargin) * slideCount;
    $movieCards.style.transform = `translateX(${initialTranslateValue}px)`;
}

function moveCardSlide(num) {
    $movieCards.style.left = -num * (cardWidth + cardMargin) + "px";
    currentIdx = num;

    if (Math.abs(currentIdx) === slideCount) {
        setTimeout(function () {
            $movieCards.classList.remove("animated");
            $movieCards.style.left = "0px";
            currentIdx = 0;
        }, 500);
        setTimeout(function () {
            $movieCards.classList.add("animated");
        }, 600);
    }
}


// 제목으로 검색하는 함수
async function executeSearch() {
    document.getElementById("movieCard").innerHTML = " ";
    document.getElementById("movie_slide").innerHTML = " ";
    document.getElementById("movieCard_wrapper").innerHTML = " ";

    const data = await getData();
    data.forEach(async function (item) {
        await makeCard(item);
    });

    const searchText = document.getElementById("searchInput").value.toLowerCase();
    const cards = document.querySelectorAll(".search_cards");

    // display 옵션을 통해서 보일지 숨길지 결정
    cards.forEach(function (card) {
        const title = card.querySelector(".card_title").textContent.toLowerCase();
        if (title.includes(searchText)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}


// 검색 버튼 클릭 시 제목 검색 함수 실행 이벤트 설정
document.getElementById("searchBtn").addEventListener("click", function (event) {
    event.preventDefault();
    executeSearch();
});

//  엔터를 누를 시 검색 함수 실행 이벤트 설정
document.getElementById("searchInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        executeSearch();
    }
});

// 로고 클릭 시 새로고침
document.getElementById("navbar-brand").addEventListener("click", function (event) {
    location.reload();
});