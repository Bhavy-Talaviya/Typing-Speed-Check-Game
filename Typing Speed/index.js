// DOM Elements
const textDisplay = document.querySelector('#textDisplay');
const typingArea = document.querySelector('#typingArea');
const timerDisplay = document.querySelector('#timer');
const wpmDisplay = document.querySelector('#wpm');
const accuracyDisplay = document.querySelector('#accuracy');
const bestWPMDisplay = document.querySelector('#bestWPM');
const startBtn = document.querySelector('#startBtn');
const resetBtn = document.querySelector('#resetBtn');

// ⏱️ New buttons for time selection
const btn15 = document.querySelector('#btn15');
const btn30 = document.querySelector('#btn30');
const btn60 = document.querySelector('#btn60');

// Test texts
const testTexts = [
    "The quick brown fox jumps over the lazy dog. Practice makes perfect when learning to type faster.",
    "Technology has revolutionized the way we communicate and work in the modern digital era.",
    "Technology has become an essential part of our daily lives. From the moment we wake up to the time we go to bed, we use various forms of technology.",
    "It helps us stay connected with others, learn new things, and complete our work more efficiently.",
    "However, while technology brings many benefits, it is also important to use it wisely. Spending too much time on screens can affect our health and relationships.",
    "Typing speed is an essential skill for anyone working with computers in today's workplace."
];

// Game state
let currentText = '';
let timeLeft = 60;
let timerInterval = null;
let startTime = null;
let isTestActive = false;
let bestWPM = 0;
let selectedTime = 60; // default

function webLoad() {
    onLoad();
    displayContent();
}

function onLoad() {
    var temp = sessionStorage.getItem('previousWpm');
    if (temp != null) {
        bestWPM = parseInt(temp);
    } else {
        bestWPM = 0;
    }
}

function displayContent() {
    timerDisplay.textContent = timeLeft;
    bestWPMDisplay.textContent = bestWPM;
}

webLoad();

function endGame() {
    clearInterval(timerInterval);
    startBtn.disabled = false;
    typingArea.disabled = true;
    timeLeft = selectedTime;
    displayContent();

    const finalWPM = parseInt(wpmDisplay.textContent);
    if (finalWPM > bestWPM) {
        bestWPM = finalWPM;
        sessionStorage.setItem('previousWpm', bestWPM);
        bestWPMDisplay.textContent = bestWPM;
    }
}

function startGame() {
    timeLeft = selectedTime;
    startBtn.disabled = true;
    currentText = testTexts[Math.floor(Math.random() * testTexts.length)];
    textDisplay.textContent = currentText;

    typingArea.disabled = false;
    typingArea.value = "";
    typingArea.focus();
    typingArea.setAttribute('placeholder', 'Now You Are Eligible To Write And Use The Input Box');

    timerInterval = setInterval(function () {
        timeLeft--;
        if (timeLeft <= 0) {
            endGame();
        }
        displayContent();
    }, 1000);
}

function updateStatus() {
    var typed = typingArea.value;
    const word = typed.trim().split(/\s+/).filter(w => w.length > 0);
    const elapsedTime = (Date.now() - startTime) / 1000 / 60;
    const wpm = elapsedTime > 0 ? Math.floor(word.length / elapsedTime) : 0;
    wpmDisplay.textContent = wpm;

    var currentScore = 0;
    for (var i = 0; i < currentText.length; i++) {
        if (currentText[i] === typed[i]) {
            currentScore++;
        }
    }
    const accuracy = (typed.length > 0) ? Math.floor(currentScore / typed.length * 100) : 0;
    accuracyDisplay.textContent = accuracy;
}

function Highlights() {
    var typed = typingArea.value;
    var highlightText = '';
    for (let i = 0; i < currentText.length; i++) {
        if (i <= typed.length) {
            if (currentText[i] === typed[i]) {
                highlightText += (`<span class="correct">${currentText[i]}</span>`);
            } else {
                (highlightText += `<span class="incorrect">${currentText[i]}</span>`);
            }
        } else {
            highlightText += currentText[i];
        }
    }
    textDisplay.innerHTML = highlightText;
}

function wordType() {
    if (startTime == null) {
        startTime = Date.now();
    }
    updateStatus();
    Highlights();
}

function resetSession() {
    sessionStorage.removeItem('previousWpm');
    bestWPM = 0;
    timeLeft = selectedTime;
    startTime = null;
    clearInterval(timerInterval);

    typingArea.value = "";
    typingArea.disabled = true;
    textDisplay.textContent = "Click 'Start' to begin a new typing test.";
    timerDisplay.textContent = timeLeft;
    wpmDisplay.textContent = 0;
    accuracyDisplay.textContent = 0;
    bestWPMDisplay.textContent = bestWPM;

    startBtn.disabled = false;
}

// ⏱️ Time selection
btn15.addEventListener('click', () => setTestTime(15));
btn30.addEventListener('click', () => setTestTime(30));
btn60.addEventListener('click', () => setTestTime(60));

function setTestTime(time) {
    selectedTime = time;
    timeLeft = time;
    displayContent();

    // Highlight selected button
    [btn15, btn30, btn60].forEach(btn => btn.classList.remove('active'));
    if (time === 15) btn15.classList.add('active');
    if (time === 30) btn30.classList.add('active');
    if (time === 60) btn60.classList.add('active');
}

startBtn.addEventListener('click', startGame);
typingArea.addEventListener('input', wordType);
resetBtn.addEventListener('click', resetSession);
