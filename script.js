document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.getElementById("addButton");
    const modal = document.getElementById("modal");
    const closeButton = document.querySelector(".close");
    const form = document.getElementById("capsuleForm");
    const capsulesContainer = document.getElementById("capsules");
    const requestVerificationButton = document.getElementById("requestVerification");
    const verifyCodeButton = document.getElementById("verifyCode");
    const capsuleFields = document.getElementById("capsuleFields");
    const errorMessage = document.getElementById("errorMessage");

    // Google Apps Script 웹 앱 URL
    const webAppUrl = 'https://script.google.com/macros/s/AKfycbxroPWV1AGGMqKmPeAgySGNNGVTM9kaDXOV-bgYutRA0oBNZAyCRVKIP5RYoIqm9Dlp3Q/exec';

    // 모달 열기
    addButton.onclick = function () {
        modal.style.display = "block";
    };

    // 모달 닫기
    closeButton.onclick = function () {
        modal.style.display = "none";
        resetForm();
    };

    // 모달 외부 클릭 시 닫기
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            resetForm();
        }
    };

    // 인증 코드 요청
    requestVerificationButton.onclick = function () {
        const email = document.getElementById("email").value;
        if (!email) {
            showError("이메일 주소를 입력해주세요.");
            return;
        }
        fetch(webAppUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'requestCode', email: email })
        }).then(() => {
            showError("인증 코드가 이메일로 전송되었습니다.", false);
        }).catch(error => {
            showError("인증 코드 전송 중 오류가 발생했습니다.");
        });
    };

    // 인증 코드 확인
    verifyCodeButton.onclick = function () {
        const email = document.getElementById("email").value;
        const code = document.getElementById("verificationCode").value;
        if (!email || !code) {
            showError("이메일과 인증 코드를 모두 입력해주세요.");
            return;
        }
        fetch(webAppUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'verifyCode', email: email, code: code })
        }).then(response => response.json())
        .then(data => {
            if (data.verified) {
                showError("이메일이 인증되었습니다.", false);
                capsuleFields.style.display = "block";
            } else {
                showError("인증 코드가 일치하지 않습니다.");
            }
        }).catch(error => {
            showError("인증 과정 중 오류가 발생했습니다.");
        });
    };

    // 폼 제출 처리
    form.onsubmit = function (event) {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;
        const email = document.getElementById("email").value;
        const openingTime = document.getElementById("openingTime").value;

        if (!email || !title || !content || !openingTime) {
            showError("모든 필드를 입력해주세요.");
            return;
        }

        // Google Apps Script 웹 앱에 데이터 제출
        submitToGoogleSheet(title, content, email, openingTime);
        
        // 캡슐 카드 추가
        addCapsuleCard(title, content, email, openingTime);

        // 모달 닫기
        modal.style.display = "none";
        resetForm();
    };

    // Google Apps Script 웹 앱에 데이터 제출
    function submitToGoogleSheet(title, content, email, openingTime) {
        const data = {
            action: 'submitCapsule',
            title: title,
            content: content,
            email: email,
            openingTime: openingTime
        };

        fetch(webAppUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(response => {
            console.log('Data submitted successfully');
        }).catch(error => {
            console.error('Error submitting data:', error);
        });
    }

    // 캡슐 카드 추가 함수
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

    // 에러 메시지 표시 함수
    function showError(message, isError = true) {
        errorMessage.textContent = message;
        errorMessage.style.color = isError ? "red" : "green";
    }

    // 폼 초기화 함수
    function resetForm() {
        form.reset();
        capsuleFields.style.display = "none";
        errorMessage.textContent = "";
    }
});