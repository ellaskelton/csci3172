const ASSESSMENT_NAMES = ['Assignments', 'Quizzes', 'Exams'];

const TABLE_HEADERS = ['Assessment Type', 'Grades', 'Average', 'Weight', 'Weighted Average'];

function getStudentNameFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const nameParam = urlParams.get('name');
    
    if (nameParam) {
        const capitalizedName = nameParam.charAt(0).toUpperCase() + nameParam.slice(1).toLowerCase();
        console.log('Student name from URL:', capitalizedName);
        return capitalizedName;
    }
    
    console.log('No student name found in URL');
    return '';
}

function isValidGrade(value) {
    return value !== null && value !== undefined;
}

function calculateArrayAverage(arr) {
    let sum = 0;
    let count = 0;
    
    for (let i = 0; i < arr.length; i++) {
        if (isValidGrade(arr[i])) {
            sum += arr[i];
            count++;
        }
    }
    
    return count === 0 ? 0 : Math.round(sum / count);
}

function calculateWeightedAverage(assessments, weight) {
    const average = calculateArrayAverage(assessments);
    return Math.round(average * weight / 100);
}

function formatGradesArray(grades) {
    return grades.map(grade => isValidGrade(grade) ? grade : 'N/A').join(', ');
}

function hasMissingGrades(grades) {
    return grades.some(grade => !isValidGrade(grade));
}

function createElement(tag, className = '', textContent = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
}

function createTableHeader(headers) {
    const thead = createElement('thead');
    const headerRow = createElement('tr');
    
    headers.forEach(headerText => {
        const th = createElement('th', '', headerText);
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    return thead;
}

function createTableCell(text, className = '') {
    const cell = createElement('td', className, text);
    return cell;
}

function createAssessmentRow(typeName, grades, average, weight, weighted) {
    const row = createElement('tr');
    const hasMissing = hasMissingGrades(grades);
    const gradesText = formatGradesArray(grades);
    
    row.appendChild(createTableCell(typeName));
    row.appendChild(createTableCell(gradesText, hasMissing ? 'missing-grade' : ''));
    row.appendChild(createTableCell(average));
    row.appendChild(createTableCell(weight + '%'));
    row.appendChild(createTableCell(weighted));
    
    return row;
}

function createTotalRow(totalGrade) {
    const row = createElement('tr', 'total-row');
    const totalCell = createElement('td', '', 'Course Total:');
    totalCell.colSpan = 4;
    totalCell.style.fontWeight = 'bold';
    row.appendChild(totalCell);
    
    const totalGradeCell = createElement('td', '', totalGrade);
    totalGradeCell.style.fontWeight = 'bold';
    row.appendChild(totalGradeCell);
    
    return row;
}

function createCourseSection(courseNum, courseDetails) {
    const courseSection = createElement('div', 'course-section');
    
    const weights = typeof ASSESSMENT_WEIGHTS !== 'undefined' ? ASSESSMENT_WEIGHTS : [30, 20, 50];
    let totalGrade = 0;
    
    for (let index = 0; index < ASSESSMENT_NAMES.length; index++) {
        const assessments = courseDetails[index];
        const weight = weights[index];
        const weighted = calculateWeightedAverage(assessments, weight);
        totalGrade += weighted;
    }
    
    const courseLetterGrade = typeof getLetterGrade !== 'undefined' ? getLetterGrade(totalGrade) : '';
    const courseHeaderText = courseLetterGrade ? `Course ${courseNum} - ${courseLetterGrade}` : `Course ${courseNum}`;
    const courseHeader = createElement('h2', '', courseHeaderText);
    courseSection.appendChild(courseHeader);
    
    const table = createElement('table', 'course-details-table');
    table.appendChild(createTableHeader(TABLE_HEADERS));
    
    const tbody = createElement('tbody');
    totalGrade = 0;
    
    for (let index = 0; index < ASSESSMENT_NAMES.length; index++) {
        const assessments = courseDetails[index];
        const avg = calculateArrayAverage(assessments);
        const weight = weights[index];
        const weighted = calculateWeightedAverage(assessments, weight);
        totalGrade += weighted;
        
        const row = createAssessmentRow(
            `${ASSESSMENT_NAMES[index]} (${weight}%)`,
            assessments,
            avg,
            weight,
            weighted
        );
        tbody.appendChild(row);
    }
    
    tbody.appendChild(createTotalRow(totalGrade));
    table.appendChild(tbody);
    courseSection.appendChild(table);
    
    return courseSection;
}

function updatePageTitle(studentName, letterGrade) {
    const titleText = letterGrade ? `${studentName}'s Detailed Grades - ${letterGrade}` : `${studentName}'s Detailed Grades`;
    document.getElementById('studentName').textContent = titleText;
    document.title = `${studentName}'s Grades - Lab 2`;
}

function validateStudentData(studentName) {
    if (!studentName) {
        document.getElementById('studentName').textContent = 'Student Not Found';
        return false;
    }
    
    if (typeof studentNames === 'undefined' || typeof detailedGrades === 'undefined') {
        console.error('Student data not loaded. Make sure script.js is loaded first.');
        document.getElementById('detailsContainer').innerHTML = '<p>Error: Student data not loaded.</p>';
        return false;
    }
    
    const studentIndex = studentNames.indexOf(studentName);
    if (studentIndex === -1 || studentIndex >= detailedGrades.length) {
        document.getElementById('detailsContainer').innerHTML = '<p>Student data not found.</p>';
        return false;
    }
    
    return true;
}

function logStudentDetails(studentName, studentDetails) {
    console.log(`=== ${studentName}'s Detailed Grades ===`);
    console.log('Student:', studentName);
    for (let i = 0; i < studentDetails.length; i++) {
        console.log(`Course ${i + 1}:`, studentDetails[i]);
    }
    console.log('---');
}

function displayStudentDetails() {
    console.log('displayStudentDetails called');
    console.log('studentNames available:', typeof studentNames !== 'undefined');
    console.log('detailedGrades available:', typeof detailedGrades !== 'undefined');
    
    const studentName = getStudentNameFromURL();
    
    if (!studentName) {
        document.getElementById('studentName').textContent = 'Student Not Found';
        document.getElementById('detailsContainer').innerHTML = '<p>Please select a student from the grade book.</p>';
        return;
    }
    
    if (typeof studentNames === 'undefined' || typeof detailedGrades === 'undefined') {
        console.error('Student data arrays not available. Waiting for script.js to load...');
        setTimeout(displayStudentDetails, 100);
        return;
    }
    
    console.log('Available student names:', studentNames);
    console.log('Looking for student:', studentName);
    
    if (!validateStudentData(studentName)) {
        return;
    }
    
    const studentIndex = studentNames.indexOf(studentName);
    console.log('Student index found:', studentIndex);
    const studentDetails = detailedGrades[studentIndex];
    console.log('Student details:', studentDetails);
    
    let overallLetterGrade = '';
    if (typeof courseGrades !== 'undefined' && typeof calculateAverage !== 'undefined' && typeof getLetterGrade !== 'undefined') {
        const studentCourseGrades = courseGrades[studentIndex];
        const overallAverage = calculateAverage(studentCourseGrades);
        overallLetterGrade = getLetterGrade(overallAverage);
    }
    
    updatePageTitle(studentName, overallLetterGrade);
    
    const container = document.getElementById('detailsContainer');
    
    if (!container) {
        console.error('Details container not found');
        return;
    }
    
    container.innerHTML = '';
    
    for (let courseIndex = 0; courseIndex < studentDetails.length; courseIndex++) {
        const courseSection = createCourseSection(courseIndex + 1, studentDetails[courseIndex]);
        container.appendChild(courseSection);
    }
    
    console.log('Course sections created successfully');
    logStudentDetails(studentName, studentDetails);
}

document.addEventListener('DOMContentLoaded', function() {
    displayStudentDetails();
});
