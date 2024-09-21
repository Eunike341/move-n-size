let startTime;
let timerInterval;

function startTimer() {
    startTime = new Date();
    document.getElementById('startButton').disabled = true;

    timerInterval = setInterval(updateTimerDisplay, 1000);

    loadExercise(currentExerciseIndex);
}

function updateTimerDisplay() {
    const currentTime = new Date();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    document.getElementById('score').innerText = `Time: ${elapsedSeconds}`;
}

function stopTimer() {
    clearInterval(timerInterval);
    const finalTime = (new Date() - startTime) / 1000;
    return finalTime;
}

const exercises = [
    {
        exampleText: 'Open: Membuka file/folder/program',
        userText: ''
    },
    {
        exampleText: 'Cut: Menyimpan sekaligus menghapus data/file/folder ke dalam memory komputer',
        userText: ''
    },
    {
        exampleText: 'Сору : Menyalin data/file/folder ke dalam memory komputer',
        userText: ''
    },
    {
        exampleText: 'Paste: Memunculkan kembali data/file/folder terakhir yang tersimpan dalam memory komputer',
        userText: ''
    },
    {
        exampleText: 'Delete: Menghapus data/file/folder',
        userText: 'Delete'
    },
    {
        exampleText: 'Rename: Mengubah nama file/folder',
        userText: 'Rename'
    },
    {
        exampleText: 'Dewasa ini komputer menjadi kebutuhan bagi semua kalangan dalam berbagai bidang. Komputer merupakan alat untuk memudahkan kinerja manusia dalam waktu yang lebih singkat dalam mengolah data, menghitung bahkan sebagai sarana menyampaikan informasi yang akurat.',
        userText: ''
    },
    {
        exampleText: 'Ketersediaan jaringan internet akan menunjang kinerja komputer dari segi manfaatnya. Semakin bertambahnya waktu, perkembangan teknologi komputer akan semakin canggih. Tentu saja mempelajari komputer akan mendatangkan banyak manfaat bagi pribadi maupun kehidupan lingkungan sekitar.',
        userText: ''
    },
];

let currentExerciseIndex = 0;

function loadExercise(index) {
    const exercise = exercises[index];
    document.getElementById('formatted-example').innerText = exercise.exampleText;
    document.querySelector('.editable').innerText = exercise.userText;
}

function checkFormatting() {
    const exercise = exercises[currentExerciseIndex];
    const userText = document.querySelector('.editable').innerText.trim();

    if (userText === exercise.exampleText.trim()) {
        const elapsedTime = (new Date() - startTime) / 1000;
        nextExercise();
    } else {
        alert('Try again. The text does not match exactly.');
    }
}

function nextExercise() {
    currentExerciseIndex++;
    if (currentExerciseIndex < exercises.length) {
        loadExercise(currentExerciseIndex);
    } else {
        const finalTime = stopTimer();
        alert(`Congratulations! You have completed all the exercises in ${finalTime.toFixed(0)} seconds.`);
        document.getElementById('score').innerText = `Completed in ${finalTime.toFixed(0)} seconds.`;
        window.gameCompleted({'time': finalTime.toFixed(0)});
    }
}

// Allow only Ctrl+C, Ctrl+V, Ctrl+A and navigation keys, and enable right-click copy/paste
function restrictKeys(event) {
    const isCtrl = event.ctrlKey || event.metaKey; // Detect Cmd or Ctrl
    const allowedCtrlKeys = ['c', 'v', 'a']; // Allow Ctrl+C (copy), Ctrl+V (paste), and Ctrl+A (select all)
    const navigationKeys = [
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'Shift', 'Alt', 'Tab', 'Home', 'End'
    ];

    // Allow copy-pasting and navigation
    if ((isCtrl && allowedCtrlKeys.includes(event.key.toLowerCase())) || navigationKeys.includes(event.key)) {
        return;
    }

    // Prevent any other key press
    event.preventDefault();
}

// Enable right-click context menu for copy/paste functionality
function enableRightClickContextMenu() {
    const editableArea = document.querySelector('.editable');
    editableArea.addEventListener('contextmenu', function (event) {
        // Allow right-click context menu (copy/paste options)
    });
}

// Attach the keydown event to restrict input in the editable area
function enableKeyRestrictions() {
    const editableArea = document.querySelector('.editable');
    editableArea.addEventListener('keydown', restrictKeys);
    enableRightClickContextMenu(); // Enable right-click copy-paste
}

window.onload = function() {
    document.getElementById('startButton').addEventListener('click', startTimer);
    enableKeyRestrictions(); // Enable key restrictions when the page loads
};
