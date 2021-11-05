const firstNameInput = document.querySelector('[name="firstName"]');
const lastNameInput = document.querySelector('[name="lastName"]');
const facultyNumberInput = document.querySelector('[name="facultyNumber"]');
const gradeInput = document.querySelector('[name="grade"]');
const studentsTable = document.querySelector('#results tbody');

document.getElementById('submit').addEventListener('click', submitStudent);
window.addEventListener('load', loadStudents);

const url = 'http://localhost:3030/jsonstore/collections/students';

async function loadStudents() {
    studentsTable.textContent = 'Loading students...';

    try {
        const res = await fetch(url);
        if (res.ok === false) {
            throw new Error(res.statusText);
        }
        const data = await res.json();

        studentsTable.textContent = '';
        Object.values(data).forEach(student => createRow(student));
    } catch (error) {
        alert(error.message);
    }
}

async function submitStudent(e) {
    e.preventDefault();

    const FirstName = firstNameInput.value.trim();
    const LastName = lastNameInput.value.trim();
    const FacultyNumber = facultyNumberInput.value.trim();
    const Grade = gradeInput.value.trim();
    firstNameInput.value = '';
    lastNameInput.value = '';
    facultyNumberInput.value = '';
    gradeInput.value = '';

    if ((FirstName == '' && typeof FirstName != 'string') ||
        (LastName == '' && typeof LastName != 'string') ||
        (FacultyNumber == '' && typeof FacultyNumber != 'string' && isNaN(Number(FacultyNumber))) ||
        (Grade == '' && typeof Grade != 'number')) return;

    const student = {
        FirstName,
        LastName,
        FacultyNumber,
        Grade
    };

    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    };

    try {
        const res = await fetch(url, options);
        if (res.ok == false) {
            throw new Error(res.statusText);
        }
        const data = await res.json();
        createRow(data);
    } catch (error) {
        alert(error.message);
    }
}

function createRow(studentData) {
    const row = document.createElement('tr');
    Object.entries(studentData).forEach(field => {
        if (field[0] != '_id') {
            row.innerHTML += `
                <td>${field[1]}</td>`;
        }
    });
    studentsTable.appendChild(row);
}