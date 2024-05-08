// localStorage에서 댓글 데이터 가져와서 출력하는 함수 
export function loadComments() {
    let movieId = getMovieIdFromUrl(); // URL에서 영화 아이디 추출
    document.getElementById('movieId').value = movieId; // movieId 입력란에 값 설정
    let commentsKey = 'comments_' + window.location.href; // 페이지 URL을 키로 사용

    // localStorage에서 키값으로 value를 가져옴
    let comments = JSON.parse(localStorage.getItem(commentsKey)) || [];
    let commentContainer = document.getElementById('commentContainer');
    commentContainer.innerHTML = ''; // 기존 댓글을 지우고 새로 불러옴

    // 해당 영화의 댓글들을 가져와서 반복해서 출력
    comments.forEach(function (item) {
        // 삭제 시 사용할 UUID 고유값
        let deleteBtnId = crypto.randomUUID();
        let review_tmp = `
        <div class=reviews>
        <div class="commenter_info">
            <div class="img_and_commenter_and_time">
                <img class="comment_img" src="./img/comment_img.png">
                <div class="commenter_and_time">
                    <p class="commenter" style="font-weight: bold">${item.name}</p>
                    <p class="comment_time">${item.dateTime}</p>
                </div>
            </div>
            <div class="comment_content">
                <p class="review_content" style="font-weight: bold">${item.review}</p>
            </div>
        </div>
        <div class="commenter_delete">
            <button type="button" id="${deleteBtnId}" class="btn btn-outline-danger comment_delete_btn">삭제</button>
        </div>
        </div>
        `
        commentContainer.insertAdjacentHTML('beforeend', review_tmp);

        // UUID로 생성한 고유값을 버튼의 ID로 활용
        let deleteBtn = document.getElementById(`${deleteBtnId}`);

        // 고유 ID를 통해 각 삭제 버튼마다 이벤트 추가
        deleteBtn.addEventListener('click', function () {
            let inputPassword = prompt('비밀번호를 입력하세요:');
            if (inputPassword === item.password) {
                let index = comments.findIndex(function (comment) {
                    return comment.id === item.id;
                });
                comments.splice(index, 1);
                localStorage.setItem(commentsKey, JSON.stringify(comments));
                loadComments();
            } else {
                alert('비밀번호가 일치하지 않습니다.');
            }
        });
    });
}


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


// 댓글 고유 아이디 생성 함수
function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}


// URL에서 현재 페이지의 주소 추출 함수
function getMovieIdFromUrl() {
    return window.location.href.split('?')[1];
}