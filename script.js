document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.getElementById("addButton");
    const modal = document.getElementById("modal");
    const loginModal = document.getElementById("loginModal");
    const closeButton = document.querySelector(".close");
    const closeLoginButton = document.querySelector(".close-login");
    const form = document.getElementById("capsuleForm");
    const loginForm = document.getElementById("loginForm");
    const capsulesContainer = document.getElementById("capsules");
    
    let currentUserEmail = '';
    const webAppUrl = 'https://script.google.com/macros/s/AKfycbwLnwWfFA1EO3c6rYKddTQcTsBZt1EVknEQTWwc91ZwxlxxPsG0r92ziokT13wJfqQkhA/exec';

    // 이메일 확인 함수
    function checkEmail() {
        const email = localStorage.getItem('userEmail');
        if (email) {
            currentUserEmail = email;
            loadCapsules();
        } else {
            loginModal.style.display = "block";
        }
    }

    // 로그인 폼 제출 처리
    loginForm.onsubmit = function(event) {
        event.preventDefault();
        const emailInput = document.getElementById("loginEmail").value;
        if (emailInput) {
            currentUserEmail = emailInput;
            localStorage.setItem('userEmail', emailInput);
            loginModal.style.display = "none";
            loadCapsules();
        }
    };

    // 로그아웃 버튼 추가
    const logoutButton = document.createElement('button');
    logoutButton.textContent = '로그아웃';
    logoutButton.className = 'logout-button';
    logoutButton.onclick = function() {
        localStorage.removeItem('userEmail');
        currentUserEmail = '';
        capsulesContainer.innerHTML = '';
        loginModal.style.display = "block";
    };
    document.querySelector('.container').insertBefore(logoutButton, capsulesContainer);

    // 페이지 로드 시 이메일 확인
    checkEmail();

    // 모달 관련 이벤트 핸들러들
    closeLoginButton.onclick = function() {
        if (!currentUserEmail) {
            alert("이메일을 입력해주세요!");
            return;
        }
        loginModal.style.display = "none";
    };

    closeButton.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
        if (event.target === loginModal && currentUserEmail) {
            loginModal.style.display = "none";
        }
    };

    // 타임캡슐 추가 버튼 클릭
    addButton.onclick = function () {
        if (!currentUserEmail) {
            loginModal.style.display = "block";
            return;
        }
        modal.style.display = "block";
        // 이메일 필드에 현재 사용자 이메일 자동 입력
        document.getElementById("email").value = currentUserEmail;
        document.getElementById("email").readOnly = true;
    };

    // 캡슐 생성 폼 제출 처리
    form.onsubmit = function (event) {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;
        const email = currentUserEmail;
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
        `;
        capsulesContainer.appendChild(capsuleCard);
    }

    // Google Sheets에서 캡슐 데이터 불러오기
    function loadCapsules() {
        if (!currentUserEmail) return;

        fetch(webAppUrl + '?action=getCapsules')
            .then(response => response.json())
            .then(data => {
                capsulesContainer.innerHTML = '';
                data.capsules.forEach(capsule => {
                    if (capsule.email === currentUserEmail && capsule.sent !== 'TRUE') {
                        addCapsuleCard(capsule.title, capsule.content, capsule.email, capsule.openingTime);
                    }
                });
            })
            .catch(error => {
                console.error('Error loading capsules:', error);
            });
    }
});