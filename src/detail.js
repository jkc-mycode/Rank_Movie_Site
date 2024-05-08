import { loadComments, addComment } from "./review.js";


// TMDB 에서  영화 가져온것
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5OWIwNDE1OTlmNzBkMDkwYjVmYTg2NjJlOWNkYTVhZCIsInN1YiI6IjY2MmE0NzFmMWM2YWE3MDBiMjkyNzg3MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.P1vJ1UkEQN1GdOv7kd_C2XL1bxFKy16ySE3ZvkrXtxU"
    }
};


//  영화 감독 출연진 정보에 대한 api가져오기
async function getCredit(id) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=ko-KR`, options);
    const data = await response.json();
    console.log(data);

    const newMovieCredit = [];
    newMovieCredit.push(data.cast);
    newMovieCredit.push(data.crew);

    return newMovieCredit;
}


//  영화트레일러 api
async function getVideo(id) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=ko-KR`, options);
    const data = await response.json();
    console.log(data);
    let newVideo;
    newVideo = data.results;

    return newVideo;
}


// 영화디테일 api
async function getDetail(id) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=ko-KR`, options);
    const data = await response.json();
    let newDetail;
    newDetail = data;

    return newDetail;
}


// 상세페이지 출력하는 함수
async function makeSubPage() {
    document.getElementById("mainContents").innerHTML = "";  // 페이지 출력 전에 초기화
    let id = location.href.split("?")[1];  // url에서 영화ID 추출

    const details = await getDetail(id);  // 영화 상세 정보 호출
    const videos = await getVideo(id);  // 비디오 정보 호출
    const credits = await getCredit(id);  // 출연진 정보 호출

    let tmp = ``;  // 유튜브 주소 탬플릿
    // 비디오 정보가 비어있으면 '관련영상이없습니다' 문구 출력
    if (videos.length > 0) {
        tmp = `<a href="https://www.youtube.com/watch?v=${videos[0].key}" target="_blank">
       https://www.youtube.com/watch?v=${videos[0].key} </a>`;
    } else if (videos.length === 0) {
        tmp = `관련 영상이 없습니다`;
    }

    const innerContents = `
    <div id="content" class="row">
        <div id="left_section" class="col text-center">
            <div id="moviePoster">
                <img src="https://image.tmdb.org/t/p/w500${details.poster_path}" alt="이미지준비중입니다" id="posterimg">
            </div>
        </div>
        <div id="right_section" class="col">
            <h2 id ="mtitle"> ${details.title}</h2>
            <p> <strong>유트브 링크</strong> : ${tmp} </p>
            <strong> 줄거리 </strong>
            <p> ${details.overview} </p>
            <strong> 영화 감독</strong>
            <p> ${credits[1][0].name}</p>
            <strong> 출연자 배우</strong>
            <p> ${credits[0][0].name}, ${credits[0][1].name}, ${credits[0][2].name},
            ${credits[0][3].name} </p>
            <div class="movie_review" id="movie_review">
                <p><b>리뷰쓰기</b></p>
                <div class="row g-3">
                    <div class="col-md-4">
                        <input type="text" id="reviewer" class="form-control" placeholder="작성자" aria-label="작성자">
                    </div>
                    <div class="col-md-4">
                        <input type="password" id="review_pass" class="form-control" placeholder="비밀번호" aria-label="비밀번호">
                    </div>
                </div><br>
                <div class="row g-3">
                    <div class="col-12">
                        <textarea class="form-control" id="review_content" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 50px"></textarea>
                    </div>
                </div><br>
                <input type="hidden" id="movieId" value="영화 아이디를 여기에 입력하세요">
                <div class="review_btn_box">
                    <button id="review_btn" class="btn btn-outline-secondary review_btn" type="button">리뷰작성</button>
                </div>
                <div id="commentContainer">

                </div>
            </div>
        </div>
    </div>
    `;
    document.querySelector("#mainContents").insertAdjacentHTML("beforeend", innerContents);
}


// 상세페이지 로드될 때 데이터 출력
await makeSubPage();


// 상세페이지 로드될 때 댓글들을 불러옴
loadComments();


// 댓글 작성 양식 제출 시 addComment 함수 호출
document.getElementById("review_btn").addEventListener("click", function (event) {
    event.preventDefault();
    addComment();
    // 댓글 작성 후 다시 댓글을 불러옴
    loadComments();
});