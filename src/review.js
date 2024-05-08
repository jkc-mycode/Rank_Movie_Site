export function loadComments() {
    let movieId = getMovieIdFromUrl(); // URL에서 영화 아이디 추출
    document.getElementById('movieId').value = movieId; // movieId 입력란에 값 설정
    let commentsKey = 'comments_' + window.location.href; // 페이지 URL을 키로 사용
    let comments = JSON.parse(localStorage.getItem(commentsKey)) || [];
    let commentContainer = document.getElementById('commentContainer');
    commentContainer.innerHTML = ''; // 기존 댓글을 지우고 새로 불러옴

    comments.forEach(function (item) {
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

        let deleteBtn = document.getElementById(`${deleteBtnId}`);
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

    let newComment = document.createElement('div');
    newComment.innerHTML = `<strong>${name}</strong> - ${review}`;

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