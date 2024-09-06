const DateTime = luxon.DateTime;

// 인증 코드 요청 버튼 클릭 이벤트
document.getElementById('verificationButton').addEventListener('click', function() {
  const email = document.getElementById('email').value;
  fetch('https://cors-anywhere.herokuapp.com/https://script.google.com/macros/s/AKfycbzMd7KUTzZCjKt7AQ7JqgILy0jb1MCV5rpttn_fjE0TzZ9TtTCwRGSpRIgh6ZU3uMaFWw/exec', {
    method: 'POST',
    
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  .then(response => response.json())
  .then(data => {
    if (data.result === 'success') {
      alert('인증 코드가 이메일로 발송되었습니다.');
    } else {
      alert('문제가 발생했습니다.');
    }
  })
  .catch(error => console.error('Error:', error));
});

// 타임캡슐 생성 폼 제출 이벤트
document.getElementById('capsuleForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const title = document.getElementById('title').value;
  const message = document.getElementById('message').value;
  const email = document.getElementById('email').value;
  const openTime = document.getElementById('openTime').value;
  const verificationCode = document.getElementById('verificationCode').value;

  // 현재 시간과 비교하여 과거 시간이 아닌지 확인
  const now = DateTime.now();
  const openDateTime = DateTime.fromISO(openTime);

  if (openDateTime <= now.plus({ minutes: 1 })) {
    document.getElementById('dateError').textContent = "개봉 시간은 현재 시각으로부터 최소 1분 이후여야 합니다.";
    return;
  } else {
    document.getElementById('dateError').textContent = "";
  }

  // Google Apps Script로 데이터 전송
  fetch('https://cors-anywhere.herokuapp.com/https://script.google.com/macros/s/AKfycbzMd7KUTzZCjKt7AQ7JqgILy0jb1MCV5rpttn_fjE0TzZ9TtTCwRGSpRIgh6ZU3uMaFWw/exec', {
    method: 'POST',
    body: JSON.stringify({ title, message, email, openDate: openDateTime.toISO(), verificationCode }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(data => {
    if (data.result === "success") {
      alert("이메일 인증을 확인하세요.");
    } else if (data.result === "verified") {
      alert("이메일 인증이 완료되었습니다. 타임캡슐이 생성되었습니다.");
    } else {
      alert("인증 실패. 다시 시도해주세요.");
    }
  });
});

// 모달 관련 요소
const modal = document.getElementById('modal');
const addButton = document.getElementById('addButton');
const closeButton = document.getElementsByClassName('close')[0];

// 모달 열기
addButton.onclick = function() {
    modal.style.display = "block";
}

// 모달 닫기
closeButton.onclick = function() {
    modal.style.display = "none";
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function loadCapsules() {
    return JSON.parse(localStorage.getItem('capsules') || '[]');
}

function displayCapsules() {
    const capsulesDiv = document.getElementById('capsules');
    capsulesDiv.innerHTML = '';

    const capsules = loadCapsules();
    const now = DateTime.now();

    capsules.forEach((capsule) => {
        const capsuleDiv = document.createElement('div');
        capsuleDiv.className = 'capsule';
        const openDate = DateTime.fromISO(capsule.openDate);
        const isOpen = openDate <= now;

        capsuleDiv.innerHTML = `
            <h3>${capsule.title}</h3>
            <p>상태: ${isOpen ? '개봉됨' : '미개봉'}</p>
            <p>생성일: ${DateTime.fromISO(capsule.created).toLocaleString()}</p>
            <p>개봉일: ${openDate.toLocaleString()}</p>
            ${isOpen ? `<p>메시지: ${capsule.message}</p>` : ''}
        `;
        capsulesDiv.appendChild(capsuleDiv);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    // 폼과 입력 요소를 찾고 이벤트 리스너를 추가합니다.
    const form = document.getElementById('capsuleForm');
    const verificationCodeInput = document.getElementById('verificationCodeInput');


    if (form && verificationCodeInput) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // 폼 제출 방지

            // 입력한 코드를 가져와서 공백을 제거합니다.
            const inputCode = verificationCodeInput.value.trim();
            console.log(inputCode); // 입력한 코드를 콘솔에 출력

            // 여기에 인증 코드와 관련된 로직을 추가합니다.
        });
    } else {
        console.error('폼 또는 입력 요소를 찾을 수 없습니다.');
    }
});




