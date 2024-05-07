
# 🖥️ 개발자되고파 팀의 내배캠 인기영화 콜렉션
![메인페이지](./imgs/readme/image.png)

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
- **이동효**
  - 영화 검색 기능 구현
  - 메인 페이지 디자인
- **윤동협**
  - 메인 페이지 영화 슬라이드 구현
  - 메인 페이지 디자인
- **신이지니**
  - 카테고리 별 영화 검색 구현
- **서동현**
  - 리뷰 기능 구현

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
![검색 후 이미지]()

- 그래고 제목을 입력하고 엔터를 누르면 마찬가지로 검색이 됨
```javascript
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
```

<br>

### 5-2. 카테고리 별 검색 기능
- 제목 검색 외에도 카테고리(장르)를 기준으로 검색하는 기능도 구현함

- 영화 데이터에는 `genre` 라는 배열 데이터가 주어짐

- 드롭다운 박스를 통해서 장르를 선택하면 그 장르의 영화만 출력됨

- 장르를 선택하면 드롭다운 박스에 현재 선택한 카테고리(장르)가 보임
![장르 검색 이미지]()

```javascript
// 장르 데이터를 불러와서 카드를 만드는 함수
const loadGenreData = (movieDataList, genreId, genreName) => {
    let searchedMovies = [];

    movieDataList.forEach(item => {
        if (item.genre_ids.includes(Number(genreId))) {
            searchedMovies.push(item)
        }
    });

    document.getElementById('movieCard').innerHTML = ' ';

    searchedMovies.forEach(async item => {
        await makeCard(item);
    });

    document.querySelector("#dropdown_btn").innerText = genreName;
}


// 장르 html 만드는 함수
export const makeGenreForm = (movieDataList) => {
    let genreTmp = ``;
    genre.forEach(item => {
        genreTmp += `<li><a id="genre_${item.id}" class="dropdown-item">${item.name}</a></li>`
    });
    document.querySelector("#dropdown_box").innerHTML = ' ';
    document.querySelector("#dropdown_box").insertAdjacentHTML('beforeend', genreTmp);

    genre.forEach(item => {
        document.getElementById(`genre_${item.id}`).addEventListener('click', () => {
            loadGenreData(movieDataList, item.id, item.name);
        })
    });
}
```


<br>

### 5-3. 영화 이미지 슬라이드 기능
- 현재 영화들 중 상위 10개 영화의 이미지를 슬라이드로 보여줌

- 각 영화마다 이미지를 `fetch` 를 통해 API에서 가져옴

- 각 영화의 이미지를 가져오는 작업을 동시에 진행가기 위해서 `Promise.all()` 를 사용
![메인 페이지 슬라이드]()

```javascript
const getImgdata = async function () {
  const totaldata = await getdata();

  return await Promise.all(
    totaldata.map(
      async (item) =>
        (item.slide_poster_path = await matchImageById(item.id)),
    ),
  )
    .then((data) => {
      return totaldata;
    })
    .catch((error) => {
      // 오류 처리
      console.error('데이터를 가져오는 중 오류가 발생했습니다.', error);
    });
};

const matchImageById = async function (id) {
  const response = await fetch(
    'https://api.themoviedb.org/3/movie/' + id + '/images',
    options,
  );
  const data = await response.json();

  return data.backdrops[0].file_path;
};
```

<br>

### 5-4. 영화 상세 페이지 기능
- 메인 화면에서 영화 카드 클릭 시 영화 상세페이지로 이동
![상세페이지 화면]()

- 상세페이지에서는 영화의 상세정보, 출연진 정보, 트레일러 영상 정보를 가져옴

- 그래서 총 3개의 API를 사용함
```javascript
// 영화 감독 출연진 정보에 대한 api가져오기
async function getcredit(id) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=ko-KR`, options);
    const data = await response.json();
    console.log(data);

    const newmoviecredit = [];
    newmoviecredit.push(data.cast);
    newmoviecredit.push(data.crew);

    return newmoviecredit;
}

// 영화트레일러 api
async function getvideo(id) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=ko-KR`, options);
    const data = await response.json();
    console.log(data);
    let newvideo;
    newvideo = data.results;

    return newvideo;
}

// 영화디테일 api
async function getdetail(id) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=ko-KR`, options);
    const data = await response.json();
    let newdetail;
    newdetail = data;

    return newdetail;
}
```

<br>

### 5-5. 영화 리뷰 기능
- 영화 리뷰 기능은 해당 영화 상세페이지에서 작성 가능

- 작성자, 비밀번호, 내용을 입력하고 버튼을 누르면 localStorage에 해당 댓글이 저장됨
![로컬스토리지 이미지]()
![리뷰 작성 후 결과 이미지]()

```javascript

```


<br>

## 6. 페이지 사진 첨부
![사이트 메인 페이지]()
![제목 검색 결과]()
![카테고리 검색 결과]()
![사이트 상세페이지]()
![리뷰 작성 결과]()


<br>

## 7. 어려웠던 점
### 7-1. 역할 분배의 어려움 (김정찬)
- 코드 구현이 어려운 팀원들도 있기 때문에 필수 기능 구현을 목표로 함
  
- 필수 기능을 우선으로 분배하는데, 인원 수 만큼 분배하기 어려웠음

- 그래서 대부분의 기능을 구현해본 팀장(김정찬)에게 따로 기능을 맡기지 않고 팀원들의 기능 구현에 도움을 주도록 함

- 일종의 중간 멘토 역할을 함

