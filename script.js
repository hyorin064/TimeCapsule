document.getElementById('addButton').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'none';
});

document.getElementById('capsuleForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 기본 제출 동작 방지

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const openingTime = new Date(document.getElementById('openingTime').value);
    const email = document.getElementById('email').value;

    // 타임캡슐 정보를 로컬 스토리지에 저장
    const capsule = {
        title,
        content,
        openingTime,
        email
    };

    localStorage.setItem('capsule', JSON.stringify(capsule));
    alert('타임캡슐이 저장되었습니다!');

    // 개봉 시간이 되면 이메일을 전송하는 함수 호출
    const now = new Date();
    const delay = openingTime - now;

    if (delay > 0) {
        setTimeout(() => {
            sendEmail(capsule);
        }, delay);
    }

    // 모달 닫기
    document.getElementById('modal').style.display = 'none';
});

function sendEmail(capsule) {
    emailjs.send('VirtualTimeCapsule', 'template_kjqohyc', {
        title: capsule.title,
        content: capsule.content,
        email: capsule.email
    }, 'ydode4YXJhGMuKwPL')
    .then((response) => {
        alert('이메일이 성공적으로 전송되었습니다! ' + response.status);
    }, (error) => {
        alert('이메일 전송 실패: ' + error);
    });
}

