document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.getElementById("addButton");
    const modal = document.getElementById("modal");
    const closeButton = document.querySelector(".close");
    const form = document.getElementById("capsuleForm");
    const capsulesContainer = document.getElementById("capsules");

    // 모달 열기
    addButton.onclick = function () {
        modal.style.display = "block";
    };

    // 모달 닫기
    closeButton.onclick = function () {
        modal.style.display = "none";
    };

    // 모달 외부 클릭 시 닫기
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // 폼 제출 처리
    form.onsubmit = function (event) {
        event.preventDefault();
        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;
        const email = document.getElementById("email").value;
        const openingTime = document.getElementById("openingTime").value;
    
        // 타임캡슐 저장
        addCapsuleToJSON(title, content, email, openingTime);
    
        addCapsuleCard(title, content, email, openingTime);
        modal.style.display = "none";
        form.reset();
    };

    // 타임캡슐 카드 추가 함수
    function addCapsuleCard(title, content, email, openingTime) {
        const capsuleCard = document.createElement("div");
        capsuleCard.className = "capsule";
        capsuleCard.innerHTML = `
            <h3>${title}</h3>
            <p>${content}</p>
            <p>개봉 시간: ${new Date(openingTime).toLocaleString()}</p>
            <p>이메일: ${email}</p>
        `;
        capsulesContainer.appendChild(capsuleCard);
    }

    // 이메일 발송 예약 함수
    function scheduleEmail(title, content, email, openingTime) {
        const openingTimeDate = new Date(openingTime).getTime();
        const currentTime = Date.now();

        if (openingTimeDate > currentTime) {
            const delay = openingTimeDate - currentTime;
            setTimeout(function() {
                sendEmail(title, content, email);
            }, delay);
        } else {
            // 즉시 발송 (예: 개봉 시간이 이미 지나간 경우)
            sendEmail(title, content, email);
        }
    }

    // 이메일 발송 함수
    function sendEmail(title, content, email) {
        emailjs.send("VirtualTimeCapsule", "template_kjqohyc", {
            title: title,
            content: content,
            email: email // 템플릿에서 사용할 email 변수
        })
        .then(function (response) {
            console.log("이메일 발송 성공!", response.status, response.text);
        }, function (error) {
            console.log("이메일 발송 실패.", error);
        });
    }
});

function addCapsuleToJSON(title, content, email, openingTime) {
    const capsule = { title, content, email, openingTime };
    let capsules = JSON.parse(localStorage.getItem("capsules") || "[]");
    capsules.push(capsule);
    localStorage.setItem("capsules", JSON.stringify(capsules));
}
