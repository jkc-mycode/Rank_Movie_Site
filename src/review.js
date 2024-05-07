function addComment() {
    let name = document.getElementById('name').value;
    let password = document.getElementById('password').value;
    let review = document.getElementById('review').value;
    let movieId = document.getElementById('movieId').value;

    // 현재 날짜 및 시간 가져오기
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + ' ' + time;

    let commentId = generateUniqueId(); // 댓글 고유 아이디 생성

    let newComment = document.createElement('div');
    newComment.innerHTML = '<strong>' + name + '</strong> - ' + review;

    // 댓글을 로컬 스토리지에 저장
    let commentsKey = 'comments_' + movieId; // 각 페이지(영화)별로 다른 키 생성
    let comments = JSON.parse(localStorage.getItem(commentsKey)) || [];
    comments.push({ id: commentId, name: name, password: password, review: review, dateTime: dateTime, movieId: movieId });
    localStorage.setItem(commentsKey, JSON.stringify(comments));

    let deleteButton = document.createElement('button');
    deleteButton.textContent = '삭제';
    deleteButton.addEventListener('click', function () {
        let inputPassword = prompt('비밀번호를 입력하세요:');
        if (inputPassword === password) {
            newComment.remove();

            let index = comments.findIndex(function(item) {
                return item.id === commentId;
            });
            comments.splice(index, 1);
            localStorage.setItem(commentsKey, JSON.stringify(comments));
        } else {
            alert('비밀번호가 일치하지 않습니다.');
        }
    });
    newComment.appendChild(deleteButton);

    let commentContainer = document.getElementById('commentContainer');
    commentContainer.appendChild(newComment);

    document.getElementById('name').value = '';
    document.getElementById('password').value = '';
    document.getElementById('review').value = '';
}

function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

document.getElementById('commentForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    addComment(); 
});

window.onload = loadComments;

// 댓글 작성 함수
function addComment() {
    let name = document.getElementById('name').value;
    let password = document.getElementById('password').value;
    let review = document.getElementById('review').value;
    let movieId = document.getElementById('movieId').value;

    // 현재 날짜 및 시간 가져오기
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + ' ' + time;

    let commentId = generateUniqueId(); // 댓글 고유 아이디 생성

    let newComment = document.createElement('div');
    newComment.innerHTML = '<strong>' + name + '</strong> - ' + review;

    // 댓글을 로컬 스토리지에 저장
    let commentsKey = 'comments_' + movieId; // 각 페이지(영화)별로 다른 키 생성
    let comments = JSON.parse(localStorage.getItem(commentsKey)) || [];
    comments.push({ id: commentId, name: name, password: password, review: review, dateTime: dateTime, movieId: movieId });
    localStorage.setItem(commentsKey, JSON.stringify(comments));

    let deleteButton = document.createElement('button');
    deleteButton.textContent = '삭제';
    deleteButton.addEventListener('click', function () {
        let inputPassword = prompt('비밀번호를 입력하세요:');
        if (inputPassword === password) {
            newComment.remove();

            let index = comments.findIndex(function(item) {
                return item.id === commentId;
            });
            comments.splice(index, 1);
            localStorage.setItem(commentsKey, JSON.stringify(comments));
        } else {
            alert('비밀번호가 일치하지 않습니다.');
        }
    });
    newComment.appendChild(deleteButton);

    let commentContainer = document.getElementById('commentContainer');
    commentContainer.appendChild(newComment);

    document.getElementById('name').value = '';
    document.getElementById('password').value = '';
    document.getElementById('review').value = '';
}

// 댓글 작성 양식 제출 시 addComment 함수 호출
document.getElementById('commentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addComment();
    // 댓글 작성 후 다시 댓글을 불러옴
    loadComments();
});

// 댓글 고유 아이디 생성 함수
function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// URL에서 영화 아이디 추출 함수
function getMovieIdFromUrl() {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('movieId');
}
