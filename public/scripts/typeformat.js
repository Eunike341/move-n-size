let startTime;
let timerInterval;

function startTimer() {
    startTime = new Date(); // Record the start time
    document.getElementById('startButton').disabled = true; // Disable the start button

    timerInterval = setInterval(updateTimerDisplay, 1000);

    loadExercise(currentExerciseIndex); // Load the first exercise
}

function updateTimerDisplay() {
    const currentTime = new Date();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000); // Calculate elapsed time in seconds
    document.getElementById('score').innerText = `Time: ${elapsedSeconds}`;
}

function stopTimer() {
    clearInterval(timerInterval); // Stop updating the timer
    const finalTime = (new Date() - startTime) / 1000; // Calculate final elapsed time in seconds
    return finalTime;
}

function checkStyle(element, styleProperty, expectedValue) {
    const formattingElement = element.firstChild;

    if (formattingElement.nodeType === Node.ELEMENT_NODE) {
        const computedStyle = window.getComputedStyle(formattingElement);
        return computedStyle[styleProperty] === expectedValue;
    } else if (formattingElement.nodeType === Node.TEXT_NODE) {
        const textStyle = window.getComputedStyle(element);
        return textStyle[styleProperty] === expectedValue;
    }

    return false;
}

const exercises = [
    {
        instruction: "Bold the word 'bold' and italicize the word 'italic'.",
        exampleText: 'Please <b>bold</b> and <i>italic</i> the words.',
        userText: 'Please <span class="highlight bold-word">bold</span> and <span class="highlight italic-word">italic</span> the words.',
        formatCheck: function() {
            const boldElement = document.querySelector('.bold-word');
            const italicElement = document.querySelector('.italic-word');
            const boldCheck = checkStyle(boldElement, 'fontWeight', '700') || checkStyle(boldElement, 'fontWeight', 'bold');
            const italicCheck = checkStyle(italicElement, 'fontStyle', 'italic');
            return boldCheck && italicCheck;
        }
    },
    {
        instruction: "Underline the word 'underline' and bold the word 'bold'.",
        exampleText: 'Please <u>underline</u> and <b>bold</b> the words.',
        userText: 'Please <span class="highlight underline-word">underline</span> and <span class="highlight bold-word">bold</span> the words.',
        formatCheck: function() {
            const underlineElement = document.querySelector('.underline-word');
            const boldElement = document.querySelector('.bold-word');
            const underlineCheck = checkStyle(underlineElement, 'textDecorationLine', 'underline');
            const boldCheck = checkStyle(boldElement, 'fontWeight', '700') || checkStyle(boldElement, 'fontWeight', 'bold');
            return underlineCheck && boldCheck;
        }
    },
    {
        instruction: "Bold the words 'Britain and Zanzibar' and '38 minutes'.",
        exampleText: 'The shortest war in history was between <b>Britain and Zanzibar</b> that lasted just <b>38 minutes</b>. Blink and you missed it!',
        userText: 'The shortest war in history was between <span class="highlight bold-word-1">Britain and Zanzibar</span> that lasted just <span class="highlight bold-word-2">38 minutes</span>. Blink and you missed it!',
        formatCheck: function() {
            const boldElement1 = document.querySelector('.bold-word-1');
            const boldElement2 = document.querySelector('.bold-word-2');
            const boldCheck1 = checkStyle(boldElement1, 'fontWeight', '700') || checkStyle(boldElement1, 'fontWeight', 'bold');
            const boldCheck2 = checkStyle(boldElement2, 'fontWeight', '700') || checkStyle(boldElement, 'fontWeight', 'bold');
            return boldCheck1 && boldCheck2;
        }
    },
    {
        instruction: "Bold the words 'Ray Tomlinson' and '1971'.",
        exampleText: 'The first email was sent by <b>Ray Tomlinson</b> to himself in <b>1971</b>',
        userText: 'The first email was sent by <span class="highlight bold-word-1">Ray Tomlinson</span> to himself in <span class="highlight bold-word-2">1971</span>.',
        formatCheck: function() {
            const boldElement1 = document.querySelector('.bold-word-1');
            const boldElement2 = document.querySelector('.bold-word-2');
            const boldCheck1 = checkStyle(boldElement1, 'fontWeight', '700') || checkStyle(boldElement1, 'fontWeight', 'bold');
            const boldCheck2 = checkStyle(boldElement2, 'fontWeight', '700') || checkStyle(boldElement, 'fontWeight', 'bold');
            return boldCheck1 && boldCheck2;
        }
    },
    {
        instruction: "Bold the word 'Creeper' and italicize 'I’m the creeper, catch me if you can!'.",
        exampleText: 'The first computer virus, <b>Creeper</b>, was created in 1971 as an experiment. It simply displayed the message: "<i>I’m the creeper, catch me if you can!</i>"',
        userText: 'The first computer virus, <span class="highlight bold-word-1">Creeper</span>, was created in 1971 as an experiment. It simply displayed the message: "<span class="highlight style-word-2">I’m the creeper, catch me if you can</span>".',
        formatCheck: function() {
            const boldElement1 = document.querySelector('.bold-word-1');
            const styleElement2 = document.querySelector('.style-word-2');
            const boldCheck1 = checkStyle(boldElement1, 'fontWeight', '700') || checkStyle(boldElement1, 'fontWeight', 'bold');
            const styleCheck2 = checkStyle(styleElement2, 'fontStyle', 'italic');
            return boldCheck1 && styleCheck2;
        }
    },
    {
        instruction: "Underline the words 'Word', 'PowerPoint', and 'Excel'.",
        exampleText: 'Some of Microsoft’s programs are <u>Word</u>, <u>PowerPoint</u>, and <u>Excel</u>',
        userText: 'Some of Microsoft’s programs are <span class="highlight style-word-1">Word</span>, <span class="highlight style-word-2">PowerPoint</span>, and <span class="highlight style-word-3">Excel</span>.',
        formatCheck: function() {
            const styleElement1 = document.querySelector('.style-word-1');
            const styleElement2 = document.querySelector('.style-word-2');
            const styleElement3 = document.querySelector('.style-word-3');
            const styleCheck1 = checkStyle(styleElement1, 'textDecorationLine', 'underline');
            const styleCheck2 = checkStyle(styleElement2, 'textDecorationLine', 'underline');
            const styleCheck3 = checkStyle(styleElement3, 'textDecorationLine', 'underline');
            return styleCheck1 && styleCheck2 && styleCheck3;
        }
    },
];

let currentExerciseIndex = 0;

function loadExercise(index) {
    const exercise = exercises[index];
    document.getElementById('formatted-example').innerHTML = exercise.exampleText;
    document.querySelector('.editable').innerHTML = exercise.userText;
}

function checkFormatting() {
    const exercise = exercises[currentExerciseIndex];

    if (exercise.formatCheck()) {
        elapsedTime = (new Date() - startTime) / 1000;
        //alert('Correct! You formatted the text correctly.');
        nextExercise();
    } else {
        alert('Try again. You need to format the text correctly.');
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

// Restrict keyboard input to only allow Ctrl+B, Ctrl+I, and Ctrl+U
function restrictKeys(event) {
    const isCtrl = event.ctrlKey || event.metaKey;
    const allowedKeys = ['b', 'i', 'u'];
    const navigationKeys = [
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'Shift', 'Alt', 'Tab', 'Home', 'End', 'PageUp', 'PageDown'
    ];

    // If Ctrl is held down and one of the allowed keys is pressed, allow it
    if (isCtrl && allowedKeys.includes(event.key.toLowerCase())) {
        return;
    }

    // Allow navigation keys
    if (navigationKeys.includes(event.key)) {
        return;
    }

    // Otherwise, prevent the default action
    event.preventDefault();
}

// Attach the keydown event to restrict input in the editable area
function enableKeyRestrictions() {
    const editableArea = document.querySelector('.editable');
    editableArea.addEventListener('keydown', restrictKeys);
}

window.onload = function() {
    //loadExercise(currentExerciseIndex);
    document.getElementById('startButton').addEventListener('click', startTimer);
    enableKeyRestrictions();
};
