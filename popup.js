// Fetch problems from JSON file
async function fetchProblems() {
    const response = await fetch('data/problems.json');
    const data = await response.json();
    return data.problems;
}

// Filter problems by difficulty
function filterProblemsByDifficulty(problems, difficulty) {
    return difficulty === 'Mixed' 
        ? problems 
        : problems.filter(problem => problem.difficulty.toLowerCase() === difficulty.toLowerCase());
}

// Get random unique problems
function getRandomUniqueProblems(problems, count) {
    const shuffled = [...problems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Display problems
function displayProblems(problems) {
    const problemsContainer = document.getElementById('problems-container');
    problemsContainer.innerHTML = '';
    problems.forEach(problem => {
        const problemElement = document.createElement('div');
        problemElement.className = 'practice-problem';
        problemElement.innerHTML = `
            <h3>${problem.title}</h3>
            <p>Difficulty: ${problem.difficulty}</p>
            <a href="${problem.link}" target="_blank">Solve Problem</a>
        `;
        problemsContainer.appendChild(problemElement);
    });
}

// Keep track of previously displayed problems
let previousProblems = new Set();

// Handle difficulty button clicks
function handleDifficultySelection() {
    const difficultyButtons = document.querySelectorAll('.difficulty-buttons button');
    difficultyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const difficulty = button.textContent;
            const allProblems = await fetchProblems();
            const filteredProblems = filterProblemsByDifficulty(allProblems, difficulty);
            
            // Filter out previously displayed problems
            const availableProblems = filteredProblems.filter(problem => !previousProblems.has(problem.title));
            
            // If we've shown all problems, reset the set
            if (availableProblems.length < 3) {
                previousProblems.clear();
            }
            
            const selectedProblems = getRandomUniqueProblems(availableProblems.length >= 3 ? availableProblems : filteredProblems, 3);
            
            // Add newly selected problems to the set
            selectedProblems.forEach(problem => previousProblems.add(problem.title));
            
            displayProblems(selectedProblems);
        });
    });
}

// Save notes to Chrome storage
function saveNotes() {
    const notes = document.getElementById('notes-area').value;
    chrome.storage.sync.set({ 'dsaRevisionNotes': notes }, function() {
        console.log('Notes saved');
    });
}

// Load notes from Chrome storage
function loadNotes() {
    chrome.storage.sync.get(['dsaRevisionNotes'], function(result) {
        if (result.dsaRevisionNotes) {
            document.getElementById('notes-area').value = result.dsaRevisionNotes;
        }
    });
}

// Initialize the application
function init() {
    handleDifficultySelection();
    loadNotes();
    document.getElementById('save-notes').addEventListener('click', saveNotes);
}

// Run the initialization when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);

