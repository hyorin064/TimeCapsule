const DateTime = luxon.DateTime;

// Google Apps Script 웹앱 URL (실제 URL로 교체해야 합니다)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyhq-3suSTePZHprvY95JeLIQiA40JFhNWX6Hn_30dy4GTJrPGf1yNDp3wSQWd58Dt95g/exec';

// 인증 코드 요청 버튼 클릭 이벤트
document.getElementById('verificationButton').addEventListener('click', async function() {
  const email = document.getElementById('email').value;

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, action: 'sendVerification' })
    });

    // no-cors 모드에서는 응답을 읽을 수 없으므로, 성공 여부만 확인합니다.
    alert('인증 코드가 이메일로 발송되었습니다.');
  } catch (error) {
    console.error('Error:', error);
    alert('요청 처리 중 오류가 발생했습니다.');
  }
});

// 타임캡슐 생성 폼 제출 이벤트
document.getElementById('capsuleForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const message = document.getElementById('message').value;
  const email = document.getElementById('email').value;
  const openTime = document.getElementById('openTime').value;
  const verificationCode = document.getElementById('verificationCodeInput').value;

  const now = DateTime.now();
  const openDateTime = DateTime.fromISO(openTime);

  if (openDateTime <= now.plus({ minutes: 1 })) {
    document.getElementById('dateError').textContent = "개봉 시간은 현재 시각으로부터 최소 1분 이후여야 합니다.";
    return;
  } else {
    document.getElementById('dateError').textContent = "";
  }

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title, 
        message, 
        email, 
        openDate: openDateTime.toISO(), 
        verificationCode, 
        action: 'createCapsule' 
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP 오류 발생: ${response.status}`);
    }

    const data = await response.json(); // 응답이 JSON 형태라고 가정
    console.log('Response:', data);

    if (data.result === 'verified') {
      alert("이메일 인증이 완료되었습니다. 타임캡슐이 생성되었습니다.");
    } else if (data.result === 'success') {
      alert("이메일 인증을 확인하세요.");
    } else {
      alert("인증 실패. 다시 시도해주세요.");
    }
  } catch (error) {
    console.error('Error:', error);
    alert("요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
  }
});

// 모달 관련 코드
const modal = document.getElementById('modal');
const addButton = document.getElementById('addButton');
const closeButton = document.getElementsByClassName('close')[0];

// 모달 열기
addButton.onclick = function() {
  modal.style.display = "block";
};

// 모달 닫기
closeButton.onclick = function() {
  modal.style.display = "none";
};

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

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
  displayCapsules();
});
