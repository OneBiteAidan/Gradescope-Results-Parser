document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("No file selected");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        try {
            const results = JSON.parse(content);
            displayResults(results);
        } catch (error) {
            alert("Invalid JSON file");
        }
    };

    document.querySelector('.content').classList.remove('hidden');

    reader.readAsText(file);
});

function displayResults(results) {
    // Update student name and autograder name
    document.getElementById('student-name').textContent = results.student;
    document.getElementById('autograder-name').textContent = results.autograder;

    // Update total points and autograder score
    document.getElementById('total-points').textContent = results.score + " / " + getMaxScore(results.tests);
    document.getElementById('autograder-score').textContent = results.score + " / " + results.score;

    const failedTests = document.getElementById('failed-tests');
    const passedTests = document.getElementById('passed-tests');
    failedTests.innerHTML = '';
    passedTests.innerHTML = '';

    // List failed and passed tests
    results.tests.forEach(test => {
        const li = document.createElement('li');
        li.textContent = test.name + " (" + (test.score || 0) + "/" + test.max_score + ")";
        if (test.status === 'failed') {
            li.classList.add('failed');
            failedTests.appendChild(li);
        } else {
            li.classList.add('passed');
            passedTests.appendChild(li);
        }
    });

    // Display autograder output
    const outputDiv = document.getElementById('autograder-output');
    outputDiv.innerHTML = results.tests.map(test => formatTestOutput(test)).join('\n');
}

function getMaxScore(tests) {
    return tests.reduce((max, test) => max + (test.max_score || 0), 0);
}

function formatTestOutput(test) {
    return `Test: ${test.name}\n` +
           `Score: ${test.score || 0} / ${test.max_score}\n` +
           `Status: ${test.status}\n` +
           `Output: ${test.output}\n` +
           `------------------------------------\n`;
}
