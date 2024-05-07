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

//카드 만들기
export async function makeCard(item) {
    console.log(item);
    const innerContents = `
    <div>
        <a href = "./detail.html?${item.id}">
        <div class="card" style="width: 18rem;" id= "mvcard_${item.id}">
        <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" class="card-img-top" alt="이미지 준비중">
            <div class="card-body">
                <h3 class="card-title">${item.title}</h3>
                <p class="card-text">${item.overview}</p>
            </div>
            <div>
            <small class = "score"> "rating:${item.vote_average}</small>
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

//출력하기
export async function print() {
    const data = await getdata();
    let count = 0;
    data.forEach(async function (item) {
        await makeCard(item);
        count++;
    });
}

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
    if (event.key === 'Enter') {
        event.preventDefault();
        executeSearch();
    }
});

//이동효 종료 부분
