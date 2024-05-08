import { getData } from "./movie.js";

const $carouselIndicator = document.querySelector(".carousel-indicators");
const $carouselItem = document.querySelector(".carousel-inner");

// TMDB API MOVEIS-Images 데이터 가져오기
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3N2M5NTE5NGJmNmQxNTRjMTAyODEyZWFkNmZmZGIzMyIsInN1YiI6IjY2MmVkZWI3ZTMzZjgzMDEyODIxYjY3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._pBtT4wAn0hnLFf8LKD2dPzrGwfE-364B4Pw2ow_siY"
    }
};


// 각 영화의 이미지를 모아서 
const getImgData = async function () {
    const totalData = await getData();

    return await Promise.all(totalData.map(async (item) => (
        item.slide_poster_path = await matchImageById(item.id)
    )))
        .then(() => {
            return totalData;
        })
        .catch((error) => {
            // 오류 처리
            console.error("데이터를 가져오는 중 오류가 발생했습니다.", error);
        });
};


// 매개변수로 받은 id로 TMDB API에서 데이터 fetch하는 함수
const matchImageById = async function (id) {
    const response = await fetch("https://api.themoviedb.org/3/movie/" + id + "/images", options);
    const data = await response.json();

    return data.backdrops[0].file_path;
};


// data에서 상위 10개만큼 슬라이드에 추가
export const makeMovieSlide = async function () {
    const data = await getImgData();
    const NUM_OF_SLIDE = 10;

    let i = 0;
    while (true) {
        addMovieSlide(data[i], i++);
        if (i > NUM_OF_SLIDE - 1) break;
    }
};


// 슬라이드에 항목 추가
const addMovieSlide = (data, index) => {
    let carouselIndicator;
    let carouselItem;

    if (index === 0) {
        carouselIndicator = `<button type="button" data-bs-target="#carouselExampleIndicators" 
                                data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1">
                            </button>`;
        carouselItem = `<div class="carousel-item active">
                            <img src="https://image.tmdb.org/t/p/w500${data.slide_poster_path}" id="img_slide_${data.id}"
                                class="d-block w-100" alt="movie poster 0">
                            <div class="carousel-caption d-none d-md-block">
                                <h5>${data.title}</h5>
                            </div>
                        </div>`;
    } else {
        carouselIndicator = `<button type="button" data-bs-target="#carouselExampleIndicators" 
                                data-bs-slide-to="${index}" aria-label="Slide ${index + 1}">
                            </button>`;
        carouselItem = `<div class="carousel-item">
                            <img src="https://image.tmdb.org/t/p/w500${data.slide_poster_path}" id="img_slide_${data.id}"
                                class="d-block w-100" alt="movie poster ${index}">
                            <div class="carousel-caption d-none d-md-block">
                                <h5>${data.title}</h5>
                            </div>
                        </div>`;
    }
    $carouselIndicator.insertAdjacentHTML("beforeend", carouselIndicator);
    $carouselItem.insertAdjacentHTML("beforeend", carouselItem);
    addMovieSlideClickEvent(data.id);
};


// 각 슬라이드 카드에 click 이벤트 생성
const addMovieSlideClickEvent = (id) => {
    document.getElementById(`img_slide_${id}`).addEventListener("click", () => {
        window.location.href = `detail.html?${id}`;
    });
};
