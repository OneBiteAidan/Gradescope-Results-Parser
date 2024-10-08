document.addEventListener('DOMContentLoaded', function() {
    const placeholder = document.getElementById('placeholder');

    document.getElementById('loadFileButton').addEventListener('click', function() {
        document.getElementById('fileInput').click();
    });

    placeholder.addEventListener('click', function() {
        document.getElementById('fileInput').click();
    });
    
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
                console.error(error);
    
            }
        };
    
        document.querySelector('.programmingAssignmentSubmissionViewer').classList.remove('hidden');
        placeholder.classList.add('hidden');

    
        reader.readAsText(file);
    });
    
});


function displayResults(results) {
    // Update the assignment name
    // document.querySelector('submissionOutlineHeader--assignmentTitle').textContent = results.assignment;

    // Update the group name (Single student in our case)
    // document.querySelector('submissionOutline--groupMember').textContent = results.student;

    // Update total points and autograder score
    document.querySelector('.submissionOutlineHeader--totalPoints').textContent = calculateScore(results) + " / " + calculateMaxScore(results);

    // Initialize the failed and passed test lists
    const failedTests = document.querySelector('.submissionOutline--failedTests');
    const passedTests = document.querySelector('.submissionOutine--passedTests');
    failedTests.innerHTML = '';
    passedTests.innerHTML = '';

    // List failed and passed tests
    results.tests.forEach(test => {
        const li = document.createElement('li');

        // Create the <a> element
        const a = document.createElement('a');

        if (test.score === null) {
            testName = test.name
        } else {
            testName = test.name + " (" + (test.score || 0) + "/" + test.max_score + ")";
        }

        testName = test.name + " (" + (test.score || 0) + "/" + test.max_score + ")";
        a.textContent = testName;
        a.href = "#" + testName;

        // Append the <a> element to the <li> element
        li.appendChild(a);

        if (test.status === 'failed') {
            li.classList.add('submissionOutlineTestCases--failed');
            failedTests.appendChild(li);
        } else {
            li.classList.add('submissionOutlineTestCases--passed');
            passedTests.appendChild(li);
        }
    });

    // Display autograder output
    const autograderOutput = `
        <li class="testCase">
            <div class="testCase--header" title="only visible to instructors (for debugging purposes)">Autograder Output (hidden from students)</div>
            <div class="testCase--body">
                ${results.output}
            </div>
        </li>
    `

    // Display the test cases
    const outputDiv = document.querySelector('.testCases');
    outputDiv.innerHTML = autograderOutput + results.tests.map(test => formatTestOutput(test)).join(' ');
}

function formatTestOutput(test) {
    return `
        <li class="testCase testCase-${test.status}">
            <div class="testCase--header 1-flexSpaceBetween">
                <a id="${test.name}">${test.name + " (" + (test.score || 0) + "/" + test.max_score + ")"}</a>
            </div>
            <div class="testCase--body">
                ${test.output}
            </div>
        </li>

    `;

}

function calculateScore(results) {
    score = 0;
    for (const test in results.tests) {
        score += test.score || 0;
    }
    return score;
}

function calculateMaxScore(results) {
    maxScore = 0;
    for (const test in results.tests) {
        maxScore += test.max_score;
    }
    return maxScore;
}
