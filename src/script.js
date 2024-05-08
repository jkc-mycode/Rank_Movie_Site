import { print } from "./movie.js";
import { makeMovieSlide } from "./movie_slide.js";


// data에서 상위 10개만큼 슬라이드에 추가
await makeMovieSlide();


// 페이지 로드 시 검색창에 포커싱
document.getElementById("searchInput").focus();


// 슬라이드 카드 출력하는 함수
print();