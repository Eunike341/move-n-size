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
    // Add more exercises as needed
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
        alert('Correct! You formatted the text correctly.');
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
        alert('Congratulations! You have completed all the exercises.');
    }
}

window.onload = function() {
    loadExercise(currentExerciseIndex);
};
