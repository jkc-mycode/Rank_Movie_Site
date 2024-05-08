import { loadComments, addComment } from "./review.js";

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


//  영화 감독 출연진 정보에 대한 api가져오기
async function getcredit(id) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=ko-KR`, options);
    const data = await response.json();
    console.log(data);

    const newmoviecredit = [];
    newmoviecredit.push(data.cast);
    newmoviecredit.push(data.crew);

    return newmoviecredit;
}

//  영화트레일러 api
async function getvideo(id) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=ko-KR`, options);
    const data = await response.json();
    console.log(data);
    let newvideo;
    newvideo = data.results;

    return newvideo;
}

//영화 비디오가 없을때

let newvideo = function novideo() {
    if (getvideo(id).length > 0) {
        return get[0].key;
    } else if (getvideo(id).length === 0) {
        return " 관련영상이없습니다";
    }
};

// let newvideo = function novideo(id) {
//     while (getvideo(id).length === 0) {
//         return "관련 영상이 없습니다";
//         break;
//     }
//     return getvideo(id)[0].key;
// };

// 영화디테일 api
async function getdetail(id) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=ko-KR`, options);
    const data = await response.json();
    let newdetail;
    newdetail = data;

    return newdetail;
}

async function makesubpage() {
    document.getElementById("mainContents").innerHTML = "";
    let id = location.href.split("?")[1];
    let tmp = ``;
    const details = await getdetail(id);
    const videos = await getvideo(id);
    if (videos.length > 0) {
        tmp = `<a href="https://www.youtube.com/watch?v=${videos[0].key}" target="_blank">
       https://www.youtube.com/watch?v=${videos[0].key} </a>`;
    } else if (videos.length === 0) {
        tmp = `관련영상이없습니다`;
    }
    const credits = await getcredit(id);
    const innerContents = `
    <div id="content" class="row">
    <div id="left_section" class="col text-center">
        <div id="moviePoster">
            <img src="https://image.tmdb.org/t/p/w500${details.poster_path}" alt="이미지준비중입니다" id="posterimg">
        </div>
    </div>
    <div id="right_section" class="col">
        <h2 id ="mtitle"> ${details.title}</h2>
        <p> <strong>유트브 링크</strong> :${tmp} </p>
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
                <button id="review_btn" class="btn btn-primary review_btn" type="button">Submit</button>
            </div>
            <div id="commentContainer">

            </div>
        </div>
    </div>
</div>
    `;
    document.querySelector("#mainContents").insertAdjacentHTML("beforeend", innerContents);
}

await makesubpage();

// 페이지가 로드될 때 댓글을 불러옴
loadComments();

// 댓글 작성 양식 제출 시 addComment 함수 호출
document.getElementById('review_btn').addEventListener('click', function (event) {
    event.preventDefault();
    addComment();
    // 댓글 작성 후 다시 댓글을 불러옴
    loadComments();
});

// 조민수 끝나는포인트
