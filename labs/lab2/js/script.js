const studentNames = ['Alice', 'Pedro', 'Jeff', 'Laura', 'Ella', 'Ethan', 'Emma', 'David'];

const courseGrades = [
    [89, 79, 94, 90],
    [77, 81, null, 82],
    [73, 71, 85, 76],
    [80, 91, 63, null],
    [98, 96, 97, 95],
    [52, 48, 55, null],
    [85, 90, 88, 91],
    [78, 82, null, 80]
];

const detailedGrades = [
    [
        [[85, 90, 88], [92, 95], [88, 90]],
        [[75, 80, 82], [78, 80], [75, 85]],
        [[92, 95, 95], [90, 98], [92, 96]],
        [[88, 90, 92], [85, 95], [88, 92]]
    ],
    [
        [[75, 78, 80], [80, 82], [75, 80]],
        [[80, 82, 81], [85, 80], [80, 85]],
        [[70, 75, null], [78, 80], [72, 75]],
        [[80, 82, 85], [78, 85], [80, 85]]
    ],
    [
        [[70, 75, 72], [75, 70], [70, 75]],
        [[68, 72, 73], [70, 75], [68, 72]],
        [[82, 85, 88], [85, 88], [82, 90]],
        [[73, 75, 80], [75, 78], [73, 80]]
    ],
    [
        [[78, 82, 80], [80, 85], [78, 82]],
        [[88, 92, 93], [90, 95], [88, 95]],
        [[60, 65, 64], [62, 65], [60, 65]],
        [[75, 78, null], [80, 75], [75, 80]]
    ],
    [
        [[97, 98, 99], [98, 97], [98, 99]],
        [[95, 96, 97], [96, 98], [95, 97]],
        [[98, 97, 98], [99, 98], [97, 99]],
        [[96, 95, 94], [97, 96], [95, 96]]
    ],
    [
        [[50, 52, 48], [55, 50], [48, 52]],
        [[45, 48, 50], [50, 45], [48, 50]],
        [[55, 52, 58], [54, 56], [52, 58]],
        [[50, 48, null], [52, 50], [48, 52]]
    ],
    [
        [[82, 85, 88], [85, 90], [82, 88]],
        [[88, 90, 92], [90, 95], [88, 93]],
        [[85, 88, 91], [88, 90], [85, 90]],
        [[89, 91, 93], [90, 95], [89, 94]]
    ],
    [
        [[75, 78, 80], [80, 78], [75, 80]],
        [[80, 82, 84], [85, 80], [80, 85]],
        [[75, 78, null], [80, 75], [75, 80]],
        [[78, 80, 82], [80, 85], [78, 82]]
    ]
];

const GRADE_SCALE = [
    { min: 90, max: 100, letter: 'A+' },
    { min: 85, max: 89, letter: 'A' },
    { min: 80, max: 84, letter: 'A-' },
    { min: 77, max: 79, letter: 'B+' },
    { min: 73, max: 76, letter: 'B' },
    { min: 70, max: 72, letter: 'B-' },
    { min: 65, max: 69, letter: 'C+' },
    { min: 60, max: 64, letter: 'C' },
    { min: 55, max: 59, letter: 'C-' },
    { min: 50, max: 54, letter: 'D' }
];

const ASSESSMENT_WEIGHTS = [30, 20, 50];

function isValidGrade(value) {
    return value !== null && value !== undefined;
}

function formatGrade(grade) {
    return isValidGrade(grade) ? grade : 'N/A';
}

function hasMissingGrades(grades) {
    return grades.some(grade => !isValidGrade(grade));
}

function getStudentIndex(studentName) {
    return studentNames.indexOf(studentName);
}

function getDetailedGradesForStudent(studentName) {
    const index = getStudentIndex(studentName);
    if (index !== -1 && index < detailedGrades.length) {
        return detailedGrades[index];
    }
    return null;
}

function sumValidGrades(grades) {
    let sum = 0;
    let count = 0;
    
    for (let i = 0; i < grades.length; i++) {
        if (isValidGrade(grades[i])) {
            sum += grades[i];
            count++;
        }
    }
    
    return { sum, count };
}

function calculateAverage(grades) {
    const { sum, count } = sumValidGrades(grades);
    return count === 0 ? 0 : Math.round(sum / count);
}

function getLetterGrade(numericGrade) {
    if (numericGrade < 0 || numericGrade > 100) {
        return 'F';
    }
    
    for (let i = 0; i < GRADE_SCALE.length; i++) {
        const scale = GRADE_SCALE[i];
        if (numericGrade >= scale.min && numericGrade <= scale.max) {
            return scale.letter;
        }
    }
    
    return 'F';
}

function calculateWeightedAverage(assessments, weight) {
    const average = calculateAverage(assessments);
    return Math.round(average * weight / 100);
}

function calculateCourseGradeFromDetails(details) {
    const assignments = details[0];
    const quizzes = details[1];
    const exams = details[2];
    
    const assignmentAvg = calculateWeightedAverage(assignments, ASSESSMENT_WEIGHTS[0]);
    const quizAvg = calculateWeightedAverage(quizzes, ASSESSMENT_WEIGHTS[1]);
    const examAvg = calculateWeightedAverage(exams, ASSESSMENT_WEIGHTS[2]);
    
    return assignmentAvg + quizAvg + examAvg;
}

function createElement(tag, className = '', textContent = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
}

function createTableCell(text, className = '') {
    const cell = createElement('td', className);
    if (!isValidGrade(text)) {
        cell.textContent = 'N/A';
        cell.className = className || 'missing-grade';
    } else {
        cell.textContent = text;
    }
    return cell;
}

function createLink(href, text, className = 'student-link') {
    const link = createElement('a', className, text);
    link.href = href;
    return link;
}

function createStudentNameCell(studentName) {
    const nameCell = createElement('td');
    const link = createLink(`student.html?name=${studentName.toLowerCase()}`, studentName);
    nameCell.appendChild(link);
    return nameCell;
}

function createGradeRow(studentName, grades, avgGrade, letterGrade) {
    const row = createElement('tr');
    
    row.appendChild(createStudentNameCell(studentName));
    
    for (let j = 0; j < 4; j++) {
        const grade = grades[j];
        const className = isValidGrade(grade) ? '' : 'missing-grade';
        row.appendChild(createTableCell(grade, className));
    }
    
    row.appendChild(createTableCell(avgGrade));
    row.appendChild(createTableCell(letterGrade));
    
    return row;
}

function displayGradeBook() {
    const tableBody = document.getElementById('gradeBookBody');
    
    if (!tableBody) {
        return;
    }
    
    for (let i = 0; i < studentNames.length; i++) {
        const studentName = studentNames[i];
        const grades = courseGrades[i];
        const avgGrade = calculateAverage(grades);
        const letterGrade = getLetterGrade(avgGrade);
        
        const row = createGradeRow(studentName, grades, avgGrade, letterGrade);
        tableBody.appendChild(row);
    }
}

function logStudentData() {
    console.log('=== GRADE BOOK DATA ===');
    console.log('Total Students:', studentNames.length);
    console.log('');
    
    for (let i = 0; i < studentNames.length; i++) {
        const name = studentNames[i];
        const grades = courseGrades[i];
        const avgGrade = calculateAverage(grades);
        const letterGrade = getLetterGrade(avgGrade);
        
        console.log(`Student: ${name}`);
        console.log('Course Grades:', grades);
        console.log('Average Grade:', avgGrade);
        console.log('Letter Grade:', letterGrade);
        console.log('---');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    displayGradeBook();
    logStudentData();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateAverage,
        getLetterGrade,
        calculateWeightedAverage,
        calculateCourseGradeFromDetails,
        getDetailedGradesForStudent,
        isValidGrade,
        formatGrade,
        studentNames,
        courseGrades,
        detailedGrades
    };
}
