
# 🖥️ 개발자되고파 팀의 내배캠 인기영화 콜렉션
![메인페이지](./img/readme/mainpage.png)

## 프로젝트 소개
- 개인과제에서 작성한 [내배캠 인기영화 콜렉션]을 발전시키는 팀 프로젝트
- 팀원들의 프로젝트 N개 중 1개를 대표로 선택, 팀 프로젝트로 발전
- TMDB(KR) 오픈 API를 이용한 인기 영화 콜렉션

<br>

## 팀원 구성
- 팀장 : 김정찬 [@jkc-mycode](https://github.com/jkc-mycode)
- 팀원 : 조민수 [@CMINSOO](https://github.com/CMINSOO)
- 팀원 : 이동효 [@hyodong2](https://github.com/hyodong2)
- 팀원 : 윤동협 [@ydh1503](https://github.com/ydh1503)
- 팀원 : 신이지니 [@shinleejini](https://github.com/shinleejini)
- 팀원 : 서동현 [@lucetaseo](https://github.com/lucetaseo)

<br>

## 1. 개발 기간
- 2024.05.01 ~ 2024.05.09

<br>

## 2. 개발 환경
- FrontEnd : HTML, CSS, JavaScript, Bootstrap
- API : [TMDB](https://developer.themoviedb.org/reference/intro/getting-started)

<br>

## 3. 역할 분배
- **김정찬**
  - 코드 병합
  - 팀원들의 기능 구현 도움
- **조민수**
  - 영화 상세 페이지 구현
  - 영화 상세 페이지 디자인
  - 시연 영상 촬영
- **이동효**
  - 영화 검색 기능 구현
- **윤동협**
  - 메인 슬라이드 구현
  - 영화 카드 슬라이드 구현
  - 메인 페이지 디자인
- **신이지니**
  - 카테고리 별 영화 검색 구현
  - 메인 페이지 디자인
- **서동현**
  - 리뷰 기능 구현
  - 발표자

<br>

## 4. 와이어 프레임
![alt text](./img/wireframe_1.png)
![alt text](./img/wireframe_2.png)

<br>

## 5. 주요 기능
### 5-1. 제목 검색 기능
- 원래 개인과제에서 구현되어야 할 기능임

- 검색 기능이 구현된 코드는 이미 모듈화되어 있어서 팀원들이 보기 불편함

- 그래서 기본 틀만 구성된 코드에서 프로젝트를 진행함

- 제목을 입력하고 검색 버튼을 클릭하면 해당 영화의 카드가 출력됨
![검색 후 이미지](./img/readme/title_search_result.png)

- 그래고 제목을 입력하고 엔터를 누르면 마찬가지로 검색이 됨
```javascript
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
```

<br>

### 5-2. 카테고리 별 검색 기능
- 제목 검색 외에도 카테고리(장르)를 기준으로 검색하는 기능도 구현함

- 영화 데이터에는 `genre` 라는 배열 데이터가 주어짐

- 드롭다운 박스를 통해서 장르를 선택하면 그 장르의 영화만 출력됨

- 장르를 선택하면 드롭다운 박스에 현재 선택한 카테고리(장르)가 보임
![장르 검색 이미지](./img/readme/category_search.png)
![장르 검색 이미지](./img/readme/category_search_result.png)

```javascript
// 장르 데이터를 불러와서 카드를 만드는 함수
const loadGenreData = (movieDataList, genreId, genreName) => {
    let searchedMovies = [];

    movieDataList.forEach(item => {
        if (item.genre_ids.includes(Number(genreId))) {
            searchedMovies.push(item)
        }
    });

    document.getElementById("movieCard").innerHTML = " ";
    document.getElementById("movie_slide").innerHTML = " ";
    document.getElementById("movieCard_wrapper").innerHTML = " ";

    searchedMovies.forEach(async item => {
        await makeCard(item);
    });

    document.querySelector("#dropdown_btn").innerText = genreName;
}
```


<br>

### 5-3. Top 10 영화 이미지 슬라이드 기능
- 현재 영화들 중 상위 10개 영화의 이미지를 슬라이드로 보여줌

- 각 영화마다 이미지를 `fetch` 를 통해 API에서 가져옴

- 각 영화의 이미지를 가져오는 작업을 동시에 진행가기 위해서 `Promise.all()` 를 사용
![메인 페이지 슬라이드](./img/readme/main_slide.png)

```javascript
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
```


<br>

### 5-4. 영화 카드 슬라이드 기능
- 전체 영화를 좌우의 슬라이드 버튼으로 확인 가능

- 슬라이드는 처음과 끝이 연결된 루프 형태
![카드 슬라이드 초기 상태](./img/readme/card_slide_init.png)
![카드 슬라이드 루프 상태](./img/readme/card_slide_loop.png)

- 코드가 길어서 자세한 코드는 깃허브 참조
```javascript
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
```



<br>

### 5-5. 영화 상세 페이지 기능
- 메인 화면에서 영화 카드 클릭 시 영화 상세페이지로 이동
![상세페이지 화면](./img/readme/movie_detail.png)

- 상세페이지에서는 영화의 상세정보, 출연진 정보, 트레일러 영상 정보를 가져옴

- 그래서 총 3개의 API를 사용함
```javascript
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
```

<br>

### 5-6. 영화 리뷰 기능
- 영화 리뷰 기능은 해당 영화 상세페이지에서 작성 가능

- 작성자, 비밀번호, 내용을 입력하고 버튼을 누르면 localStorage에 해당 댓글이 저장됨

- 영화 ID를 Key값으로 사용해서 데이터 저장
![로컬스토리지 이미지1](./img/readme/localstorage1.png)
![로컬스토리지 이미지2](./img/readme/localstorage2.png)
![로컬스토리지 이미지3](./img/readme/localstorage3.png)

- 작성한 리뷰는 리뷰 작성란 밑으로 쌓이게 됨
![리뷰 작성 후 결과 이미지](./img/readme/review_result.png)

```javascript
// 댓글 작성 함수
export function addComment() {
    let name = document.getElementById('reviewer').value;
    let password = document.getElementById('review_pass').value;
    let review = document.getElementById('review_content').value;
    let movieId = document.getElementById('movieId').value;

    // 현재 날짜 및 시간 가져오기
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + ' ' + time;

    let commentId = generateUniqueId(); // 댓글 고유 아이디 생성

    // 댓글을 로컬 스토리지에 저장
    let commentsKey = 'comments_' + window.location.href; // 페이지 URL을 키로 사용
    let comments = JSON.parse(localStorage.getItem(commentsKey)) || [];
    comments.push({ id: commentId, name: name, password: password, review: review, dateTime: dateTime, movieId: movieId });
    localStorage.setItem(commentsKey, JSON.stringify(comments));

    document.getElementById('reviewer').value = '';
    document.getElementById('review_pass').value = '';
    document.getElementById('review_content').value = '';
}
```


<br>

## 6. 페이지 사진 첨부
![사이트 메인 페이지](./img/readme/mainpage.png)
![제목 검색 결과](./img/readme/title_search_result.png)
![카테고리 검색 결과](./img/readme/category_search_result.png)
![사이트 상세페이지](./img/readme/movie_detail.png)
![리뷰 작성 결과](./img/readme/review_result.png)


<br>

## 7. 어려웠던 점
### 7-1. 역할 분배의 어려움 (김정찬)
- 코드 구현이 어려운 팀원들도 있기 때문에 필수 기능 구현을 목표로 함
  
- 필수 기능을 우선으로 분배하는데, 인원 수 만큼 분배하기 어려웠음

- 그래서 대부분의 기능을 구현해본 팀장(김정찬)에게 따로 기능을 맡기지 않고 팀원들의 기능 구현에 도움을 주도록 함

- 일종의 중간 멘토 역할을 함

