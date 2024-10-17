// EmailJS 초기화
(function(){
    emailjs.init("ydode4YXJhGMuKwPL"); // 사용자 ID로 초기화
})();

// DOM 요소 선택
const modal = document.getElementById("modal");
const addButton = document.getElementById("addButton");
const closeModal = document.querySelector(".close");
const capsuleForm = document.getElementById("capsuleForm");
const capsulesContainer = document.getElementById("capsules");

// 모달 열기
addButton.onclick = function() {
    modal.style.display = "block";
}

// 모달 닫기
closeModal.onclick = function() {
    modal.style.display = "none";
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// 폼 제출 이벤트 처리
capsuleForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const email = document.getElementById("email").value;
    const openingTime = document.getElementById("openingTime").value;

    const openingDate = new Date(openingTime);
    const currentDate = new Date();

    // 개봉 시간이 지나지 않았을 경우
    if (openingDate > currentDate) {
        const timeDifference = openingDate - currentDate;

        // 일정 시간 후에 이메일 발송
        setTimeout(() => {
            sendEmail(title, content, email);
        }, timeDifference);
        
        // 타임캡슐 추가
        addCapsule(title, content, openingDate);

        alert("타임캡슐이 생성되었습니다!");
        modal.style.display = "none"; // 모달 닫기
    } else {
        alert("개봉 시간은 현재 시간 이후여야 합니다.");
    }

    // 폼 초기화
    this.reset();
});

// 이메일 발송 함수
function sendEmail(title, content, email) {
    emailjs.send("VirtualTimeCapsule", "template_kjqohyc", {
        title: title,
        content: content,
        to_email: email
    })
    .then(function(response) {
        console.log("이메일 발송 성공!", response.status, response.text);
    }, function(error) {
        console.log("이메일 발송 실패.", error);
    });
}

// 타임캡슐 추가 함수
function addCapsule(title, content, openingDate) {
    const capsuleDiv = document.createElement("div");
    capsuleDiv.classList.add("capsule");
    capsuleDiv.innerHTML = `
        <h3>${title}</h3>
        <p>${content}</p>
        <p><strong>개봉 시간:</strong> ${openingDate.toLocaleString()}</p>
    `;
    capsulesContainer.appendChild(capsuleDiv);
}
