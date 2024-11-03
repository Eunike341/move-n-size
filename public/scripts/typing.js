const statements = [
    "qwerty asdfg zxcvb yuiop hjkl nm",
    "abcd efgh ijkl mnop qrst uvwx yz",
    "ABCD EFGH IJKL MNOP QRST UVWX YZ",
    "Next: 12345..67890,,!@#$%^&*()-_+=[]{};/?",
    "Saya pergi ke pasar untuk membeli jeruk dan sayuran",
    "The quick brown fox jumps over the lazy dog",
    "Malware adalah program komputer yang merusak (e.g. spyware)",
    "Stay focused and keep typing",
    "Phishing adalah website palsu (e.g. klikbca.com vs kilkbca.com)",
    "Practice makes perfect",
    "Zebra pergi ke luar rumah pada jam tiga sore dengan cepat",
    "Hello World",
    "Internet adalah koneksi dari jutaan komputer di seluruh dunia",
    "A picture is worth a thousand words",
    "Vania membeli jus dan quiche di kafe yang ramai dan lezat",
    "Time is money",
    "Impian besar dimulai dari langkah kecil",
    "No pain, no gain",
    "Setiap langkah kecil membawa kita lebih dekat ke tujuan",
    "The grass is always greener on the other side",
    "Tetap semangat dan pantang menyerah",
    "Laughter is the best medicine",
    "Percaya diri dan pantang menyerah dalam belajar",
    "Honesty is the best policy",
    "Email adalah electronic mail atau surat elektronik"
];

let currentIndex = 0;
let score = 0;
let timeLeft = 420;
let timer;

const statementDiv = document.getElementById('statement');
const inputBox = document.getElementById('inputBox');
const startButton = document.getElementById('startButton');
const scoreDiv = document.getElementById('score');
const timeDiv = document.getElementById('time');

function startGame() {
    score = 0;
    currentIndex = 0;
    timeLeft = 420;
    startButton.disabled = true;
    inputBox.disabled = false;
    inputBox.value = "";
    inputBox.focus();
    scoreDiv.textContent = "";
    statementDiv.textContent = statements[currentIndex];
    updateTimeDisplay();
    timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timeLeft--;
    updateTimeDisplay();
    if (timeLeft <= 0) {
        endGame();
    }
}

function updateTimeDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDiv.textContent = `Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function endGame() {
    clearInterval(timer);
    startButton.disabled = false;
    inputBox.disabled = true;
    statementDiv.textContent = "Time's up!";
    scoreDiv.textContent = `Your score: ${score}`;
    window.gameCompleted({'typing': score});
}

inputBox.addEventListener('input', () => {
    const inputText = inputBox.value;
    const currentStatement = statements[currentIndex];

    if (currentStatement.startsWith(inputText)) {
        inputBox.style.color = 'black';
    } else {
        inputBox.style.color = 'red';
    }

    if (inputText === currentStatement) {
        score++;
        currentIndex = (currentIndex + 1) % statements.length;
        inputBox.value = "";
        statementDiv.textContent = statements[currentIndex];
    }
});

// Disable copy, cut, and paste functionality
inputBox.addEventListener('copy', (e) => e.preventDefault());
inputBox.addEventListener('cut', (e) => e.preventDefault());
inputBox.addEventListener('paste', (e) => e.preventDefault());

startButton.addEventListener('click', startGame);
