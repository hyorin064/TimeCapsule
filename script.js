const DateTime = luxon.DateTime;

// 타임캡슐 생성 이벤트
document.getElementById('capsuleForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const title = document.getElementById('title').value;
  const message = document.getElementById('message').value;
  const email = document.getElementById('email').value;
  let openTime = document.getElementById('openTime').value;
  const verificationCode = document.getElementById('verificationCode').value;

  // 현재 시간과 비교하여 과거 시간이 아닌지 확인
  const now = DateTime.now();
  const openDateTime = DateTime.now().set({
    hour: openTime.split(':')[0], 
    minute: openTime.split(':')[1]
  });

  if (openDateTime <= now.plus({ minutes: 1 })) {
    document.getElementById('dateError').textContent = "개봉 시간은 현재 시각으로부터 최소 1분 이후여야 합니다.";
    return;
  } else {
    document.getElementById('dateError').textContent = "";
  }

  // Google Apps Script로 데이터 전송
  fetch('https://cors-anywhere.herokuapp.com/https://script.google.com/macros/s/AKfycbx3bByWmFRO0Xe4jyTOY31jr-AAcC4OV9FHFDau0XLYAhoaMMIehmI-aFoXIjM8uGe1TQ/exec', {
    method: 'POST',
    body: JSON.stringify({ title, message, email, openDate: openDateTime.toISO(), verificationCode }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(data => {
    if (data.result === "verified") {
      alert("타임캡슐이 등록되었습니다.");
    } else if (data.result === "success") {
      alert("이메일 인증을 확인하세요.");
    } else {
      alert("인증 실패. 다시 시도해주세요.");
    }
  });
});

// 인증 코드 받기 버튼 클릭 이벤트
document.getElementById('verificationButton').addEventListener('click', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;

  if (!email) {
    alert("이메일을 입력해주세요.");
    return;
  }

  // Google Apps Script로 인증 코드 요청
  fetch('https://script.google.com/macros/s/AKfycbx3bByWmFRO0Xe4jyTOY31jr-AAcC4OV9FHFDau0XLYAhoaMMIehmI-aFoXIjM8uGe1TQ/exec', {
    method: 'POST',
    body: JSON.stringify({ email }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(data => {
    if (data.result === "success") {
      alert("이메일로 인증 코드가 발송되었습니다.");
    } else {
      alert("인증 코드 발송에 실패했습니다. 다시 시도해주세요.");
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

// 로컬 스토리지에서 타임캡슐 불러오기
function loadCapsules() {
    return JSON.parse(localStorage.getItem('capsules') || '[]');
}

// 타임캡슐 화면에 표시
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
