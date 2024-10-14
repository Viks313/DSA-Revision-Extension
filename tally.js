// Tally module for DSA Practice Extension

// Function to compare user's solution with the correct answer
function compareSolution(userSolution, correctSolution) {
    // Remove whitespace and convert to lowercase for comparison
    const cleanUserSolution = userSolution.replace(/\s/g, '').toLowerCase();
    const cleanCorrectSolution = correctSolution.replace(/\s/g, '').toLowerCase();

    return cleanUserSolution === cleanCorrectSolution;
}

// Function to provide feedback based on the comparison result
function provideFeedback(isCorrect) {
    const feedbackElement = document.getElementById('feedback');
    
    if (isCorrect) {
        feedbackElement.textContent = "Correct! Great job!";
        feedbackElement.className = "correct";
    } else {
        feedbackElement.textContent = "Incorrect. Try again!";
        feedbackElement.className = "incorrect";
    }
}

// Function to handle solution submission
function handleSubmission(question, userSolution) {
    const isCorrect = compareSolution(userSolution, question.solution);
    provideFeedback(isCorrect);

    // Update user's progress
    updateProgress(isCorrect);
}

// Function to update user's progress
function updateProgress(isCorrect) {
    chrome.storage.sync.get(['totalAttempts', 'correctAttempts'], (result) => {
        let totalAttempts = result.totalAttempts || 0;
        let correctAttempts = result.correctAttempts || 0;

        totalAttempts++;
        if (isCorrect) {
            correctAttempts++;
        }

        chrome.storage.sync.set({ totalAttempts, correctAttempts }, () => {
            console.log('Progress updated');
        });
    });
}

// Export functions for use in other modules
window.tallyModule = {
    handleSubmission,
    updateProgress
};
