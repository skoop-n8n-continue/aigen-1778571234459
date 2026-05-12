let startTime;
let elapsedTime = 0;
let timerInterval;
let laps = [];
let isRunning = false;

const display = document.getElementById('display');
const startStopBtn = document.getElementById('startStopBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsList = document.getElementById('lapsList');
const themeToggle = document.getElementById('themeToggle');
const exportBtn = document.getElementById('exportBtn');
const lapSound = document.getElementById('lapSound');

// Initialize Lucide Icons
lucide.createIcons();

function timeToString(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);

    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);

    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);

    let diffInMs = (diffInSec - ss) * 1000;
    let ms = Math.floor(diffInMs);

    let formattedHH = hh.toString().padStart(2, "0");
    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
    let formattedMS = ms.toString().padStart(3, "0");

    return `${formattedHH}:${formattedMM}:${formattedSS}:<span class="ms">${formattedMS}</span>`;
}

function timeToStringRaw(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);
    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);
    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);
    let diffInMs = (diffInSec - ss) * 1000;
    let ms = Math.floor(diffInMs);
    return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
}

function print(txt) {
    display.innerHTML = txt;
}

function start() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(function printTime() {
        elapsedTime = Date.now() - startTime;
        print(timeToString(elapsedTime));
    }, 10);
    showButton("PAUSE");
    isRunning = true;
    lapBtn.disabled = false;
}

function pause() {
    clearInterval(timerInterval);
    showButton("START");
    isRunning = false;
    lapBtn.disabled = true;
}

function reset() {
    clearInterval(timerInterval);
    print("00:00:00:<span class=\"ms\">000</span>");
    elapsedTime = 0;
    laps = [];
    lapsList.innerHTML = "";
    showButton("START");
    isRunning = false;
    lapBtn.disabled = true;
}

function showButton(buttonKey) {
    if (buttonKey === "PAUSE") {
        startStopBtn.classList.add("paused");
        startStopBtn.innerHTML = `<i data-lucide="pause"></i>`;
    } else {
        startStopBtn.classList.remove("paused");
        startStopBtn.innerHTML = `<i data-lucide="play"></i>`;
    }
    lucide.createIcons();
}

function addLap() {
    if (!isRunning) return;

    const lapTime = elapsedTime;
    const lastLapTime = laps.length > 0 ? laps[laps.length - 1].total : 0;
    const duration = lapTime - lastLapTime;

    const lapData = {
        number: laps.length + 1,
        duration: duration,
        total: lapTime
    };

    laps.push(lapData);

    const li = document.createElement("li");
    li.classList.add("lap-item");
    li.innerHTML = `
        <span class="lap-num">#${lapData.number}</span>
        <span class="lap-time">+${timeToStringRaw(duration)}</span>
        <span class="total-time">${timeToStringRaw(lapTime)}</span>
    `;

    lapsList.prepend(li);

    // Play sound
    lapSound.currentTime = 0;
    lapSound.play().catch(() => {}); // Catch if browser blocks auto-play
}

function exportLaps() {
    if (laps.length === 0) {
        alert("No laps to export!");
        return;
    }

    let content = "Stopwatch Lap Times\n";
    content += "====================\n\n";
    laps.forEach(lap => {
        content += `Lap #${lap.number}: +${timeToStringRaw(lap.duration)} (Total: ${timeToStringRaw(lap.total)})\n`;
    });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stopwatch_laps.txt";
    a.click();
    URL.revokeObjectURL(url);
}

function toggleTheme() {
    const body = document.body;
    const isLight = body.getAttribute("data-theme") === "light";
    body.setAttribute("data-theme", isLight ? "dark" : "light");
    themeToggle.innerHTML = isLight ? `<i data-lucide="sun"></i>` : `<i data-lucide="moon"></i>`;
    lucide.createIcons();
}

// Event Listeners
startStopBtn.addEventListener("click", () => {
    if (isRunning) {
        pause();
    } else {
        start();
    }
});

lapBtn.addEventListener("click", addLap);
resetBtn.addEventListener("click", reset);
exportBtn.addEventListener("click", exportLaps);
themeToggle.addEventListener("click", toggleTheme);

// Keyboard Shortcuts
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault();
        startStopBtn.click();
    } else if (e.key.toLowerCase() === "l") {
        lapBtn.click();
    } else if (e.key.toLowerCase() === "r") {
        resetBtn.click();
    }
});
