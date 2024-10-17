const fs = require('fs');
const emailjs = require('@emailjs/browser');

emailjs.init("ydode4YXJhGMuKwPL"); // EmailJS 퍼블릭 키

// 캡슐 데이터 로드
let capsules = [];
try {
    const data = fs.readFileSync('capsules.json', 'utf8');
    capsules = JSON.parse(data);
} catch (err) {
    console.error("캡슐 데이터를 불러오지 못했습니다.", err);
}

// 현재 시간과 비교하여 이메일 발송
const now = new Date().getTime();
capsules = capsules.filter(capsule => {
    const openingTime = new Date(capsule.openingTime).getTime();
    if (openingTime <= now) {
        sendEmail(capsule);
        return false; // 발송된 캡슐은 제거
    }
    return true;
});

// 이메일 발송 함수
function sendEmail(capsule) {
    emailjs.send("VirtualTimeCapsule", "template_kjqohyc", {
        title: capsule.title,
        content: capsule.content,
        email: capsule.email,
    }).then(response => {
        console.log("이메일 발송 성공:", response.status, response.text);
    }).catch(error => {
        console.error("이메일 발송 실패:", error);
    });
}

// 갱신된 캡슐 데이터 저장
fs.writeFileSync('capsules.json', JSON.stringify(capsules));
