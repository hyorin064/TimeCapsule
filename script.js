const DateTime = luxon.DateTime;

// Google Sheet로 데이터 전송
document.getElementById('capsuleForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const title = document.getElementById('title').value;
  const message = document.getElementById('message').value;
  const email = document.getElementById('email').value;
  let openTime = document.getElementById('openTime').value;
  const verificationCode = document.getElementById('verificationCode').value;

  // 항상 분을 00으로 설정
  openTime = openTime.split(':')[0] + ":00";

  // 현재 시간과 비교하여 과거 시간이 아닌지 확인
  const now = DateTime.now();
  const openDateTime = DateTime.now().set({ hour: openTime.split(':')[0], minute: 0 });

  if (openDateTime <= now.plus({ minutes: 1 })) {
    document.getElementById('dateError').textContent = "개봉 시간은 현재 시각으로부터 최소 1분 이후여야 합니다.";
    return;
  } else {
    document.getElementById('dateError').textContent = "";
  }

  // Google Apps Script로 데이터 전송
  fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
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
            ${isOpen ? `<p>메시지: ${capsule.message}</p>` : '<p>아직 개봉되지 않았습니다.</p>'}
        `;
        capsulesDiv.appendChild(capsuleDiv);
    });
}

// 페이지 로드 시 타임캡슐 표시
window.addEventListener('load', displayCapsules);
