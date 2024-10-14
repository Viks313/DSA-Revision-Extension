// Global variables
let currentQuestion = null;
let dailyQuestions = [];
let config = {
    numQuestions: 3,
    difficulty: 'all'
};

// Load configuration and initialize the extension
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    initializeUI();
    generateDailyQuestions();
    displayQuestion();
});

// Load saved configuration
function loadConfig() {
    chrome.storage.sync.get(['numQuestions', 'difficulty'], (result) => {
        if (result.numQuestions) config.numQuestions = result.numQuestions;
        if (result.difficulty) config.difficulty = result.difficulty;
        document.getElementById('numQuestions').value = config.numQuestions;
        document.getElementById('difficulty').value = config.difficulty;
    });
}

// Initialize UI elements
function initializeUI() {
    document.getElementById('saveConfig').addEventListener('click', saveConfig);
    document.getElementById('submitSolution').addEventListener('click', submitSolution);
}

// Save configuration
function saveConfig() {
    config.numQuestions = parseInt(document.getElementById('numQuestions').value);
    config.difficulty = document.getElementById('difficulty').value;
    chrome.storage.sync.set(config, () => {
        console.log('Configuration saved');
        generateDailyQuestions();
        displayQuestion();
    });
}

// Generate daily questions based on configuration
function generateDailyQuestions() {
    dailyQuestions = getRandomQuestions(config.numQuestions, config.difficulty);
}

// Display a random question from the daily questions
function displayQuestion() {
    if (dailyQuestions.length > 0) {
        currentQuestion = dailyQuestions[Math.floor(Math.random() * dailyQuestions.length)];
        document.getElementById('questionText').textContent = currentQuestion.question;
    } else {
        document.getElementById('questionText').textContent = 'No questions available for today.';
    }
}

// Submit solution
function submitSolution() {
    const userSolution = document.getElementById('solutionInput').value;
    const result = validateSolution(currentQuestion, userSolution);
    displayFeedback(result);
}

// Display feedback
function displayFeedback(isCorrect) {
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = isCorrect ? 'Correct!' : 'Incorrect. Try again.';
    feedbackElement.className = isCorrect ? 'correct' : 'incorrect';
}

// Helper function to get random questions (to be implemented in questions.js)
function getRandomQuestions(count, difficulty) {
    // This function should be implemented in questions.js
    // For now, we'll return a dummy question
    return [{
        question: 'What is the time complexity of quicksort in the average case?',
        answer: 'O(n log n)'
    }];
}

// Helper function to validate solution (to be implemented in tally.js)
function validateSolution(question, userSolution) {
    // This function should be implemented in tally.js
    // For now, we'll do a simple string comparison
    return userSolution.trim().toLowerCase() === question.answer.toLowerCase();
}
