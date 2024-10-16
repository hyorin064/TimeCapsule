const DateTime = luxon.DateTime;

// Google Apps Script 웹앱 URL (실제 URL로 교체해야 합니다)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxx0y_aIXcX3doRSi7-JkrSxjdJfsbL6ASkk9XsHTsoDk7Yg07x_4p2-BN1a93Fb55BdQ/exec';

// 인증 코드 요청 버튼 클릭 이벤트
document.getElementById('verificationButton').addEventListener('click', function() {
  const email = document.getElementById('email').value;
  fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if (data.result === 'success') {
      alert('인증 코드가 이메일로 발송되었습니다.');
    } else {
      alert('문제가 발생했습니다.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('문제가 발생했습니다.');
  });
});

// 타임캡슐 생성 폼 제출 이벤트
document.getElementById('capsuleForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const title = document.getElementById('title').value;
  const message = document.getElementById('message').value;
  const email = document.getElementById('email').value;
  const openTime = document.getElementById('openTime').value;
  const verificationCode = document.getElementById('verificationCodeInput').value;

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
  fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, message, email, openDate: openDateTime.toISO(), verificationCode })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Server response:", data);
    if (data.result === "success") {
      alert("이메일 인증을 확인하세요.");
    } else if (data.result === "verified") {
      alert("이메일 인증이 완료되었습니다. 타임캡슐이 생성되었습니다.");
    } else {
      alert("인증 실패. 다시 시도해주세요.");
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert("요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
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
    // DOM이 완전히 로드된 후에 실행할 코드
    const verificationCodeInput = document.getElementById('verificationCodeInput');
    const form = document.getElementById('capsuleForm');

    if (form && verificationCodeInput) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // 폼 제출 방지
            const inputCode = verificationCodeInput.value.trim();
            console.log(inputCode); // 입력한 코드를 콘솔에 출력
        });
    } else {
        console.error('폼 또는 입력 요소를 찾을 수 없습니다.');
    }
});