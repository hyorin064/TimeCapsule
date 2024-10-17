document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.getElementById("addButton");
    const modal = document.getElementById("modal");
    const closeButton = document.querySelector(".close");
    const form = document.getElementById("capsuleForm");
    const capsulesContainer = document.getElementById("capsules");

    // Google Apps Script 웹 앱 URL
    const webAppUrl = 'https://script.google.com/macros/s/AKfycbwLnwWfFA1EO3c6rYKddTQcTsBZt1EVknEQTWwc91ZwxlxxPsG0r92ziokT13wJfqQkhA/exec';

    // 페이지 로드 시 캡슐 데이터 불러오기
    loadCapsules();

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

        if (!email) {
            console.error("이메일 주소가 비어 있습니다.");
            return;
        }

        // Google Apps Script 웹 앱에 데이터 제출
        submitToGoogleSheet(title, content, email, openingTime);
        
        // 캡슐 카드 추가
        addCapsuleCard(title, content, email, openingTime);

        // 모달 닫기
        modal.style.display = "none";
        form.reset();
    };

    // Google Apps Script 웹 앱에 데이터 제출
    function submitToGoogleSheet(title, content, email, openingTime) {
        const data = {
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
            <p>개봉 시간: ${new Date(openingTime).toLocaleString()}</p>
            <p>이메일: ${email}</p>
        `;
        capsulesContainer.appendChild(capsuleCard);
    }

    // Google Sheets에서 캡슐 데이터 불러오기
    function loadCapsules() {
        fetch(webAppUrl + '?action=getCapsules')
            .then(response => response.json())
            .then(data => {
                capsulesContainer.innerHTML = ''; // 기존 캡슐 카드 초기화
                data.capsules.forEach(capsule => {
                    if (capsule.sent !== 'TRUE') {
                        addCapsuleCard(capsule.title, capsule.content, capsule.email, capsule.openingTime);
                    }
                });
            })
            .catch(error => {
                console.error('Error loading capsules:', error);
            });
    }
});