let studentsRow = document.getElementById("students");
const student = document.getElementById("firstName");
const studentLast = document.getElementById("lastName");
const studentGroup = document.getElementById("groups");
const studentEmail = document.getElementById("email");
const studentphoneNumber = document.getElementById("phoneNumber");
const studentIsWork = document.getElementById("isWork");
const studentField = document.getElementById("field");
const studentImage = document.getElementById("avatar");

const studentForm = document.getElementById("studentForm");
const studentModal = document.getElementById("student-modal");
const studentBtn = document.getElementById("student-add-btn");
const modalOpenBtn = document.getElementById("modal-open-btn");

let teacherId = localStorage.getItem("teacher");
let selected = null;

const getStudentCard = ({
  id,
  avatar,
  firstName,
  lastName,
  birthday,
  email,
  isWork,
  field,
  phoneNumber,
}) => {
  return `<div class="col-md-6">
            <div class="card mb-2">
              <img height="300px" style={objectFit: 'cover'} src="${avatar}" class="card-img-top" alt="${avatar}" />
              <div class="card-body">
              <div class="d-flex gap-1">
                  <h5 class="card-title">${firstName}</h5>
                  <h5 class="card-title">${lastName}</h5>
              </div>
              <div>
                  <span class="card-birthday"><b>${birthday}</b></span>
              </div>
              <div>
                  <p class="card-email mt-2">${email}</p>
              </div>
              <div class="mb-2">
                  <tel class="studentteacher__phone"><b>${phoneNumber}</b></tel>        
              </div>
              <div class="d-flex align-items-center justify-content-between">
                  <h5 class="student__married">${
                    isWork ? "Ishlaydi" : "Ishlamaydi"
                  }</h5>
                  <h6>${field}</h6>
              </div>
              <div class="d-flex justify-content-between gap-2">
                  <button class="btn btn-danger student__btn" onclick="deleteStudent(${id})" >Del</button>
                  <button class="btn btn-primary student__btn" onclick="editStudent(${id})" data-bs-toggle="modal" data-bs-target="#student-modal">Edit</button>
              </div>
              </div>      
          </div>
        </div>`;
};

async function getStudents() {
  studentsRow.innerHTML = "...loading";
  let res = await fetch(ENDPOINT + `teacher/${teacherId}/student`);
  let students = await res.json();
  studentsRow.innerHTML = "";
  students.forEach((student) => {
    studentsRow.innerHTML += getStudentCard(student);
  });
}

getStudents();

studentForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let check = this.checkValidity();
  this.classList.add("was-validated");
  if (check) {
    bootstrap.Modal.getInstance(studentModal).hide();
    let data = {
      firstName: student.value,
      lastName: studentLast.value,
      avatar: studentImage.value,
      email: studentEmail.value,
      isWork: studentIsWork.checked,
      field: studentField.value,
      phoneNumber: studentphoneNumber.value,
    };
    if (selected) {
      fetch(ENDPOINT + `/teacher/${teacherId}/student/${selected}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      }).then(() => {
        alert("Student is edited");
        getStudents();
        emptyForm();
      });
    } else {
      fetch(ENDPOINT + `teacher/${teacherId}/student`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      }).then(() => {
        alert("Student is added");
        getStudents();
        emptyForm();
      });
    }
  }
});

studentphoneNumber.addEventListener("input", function () {
  let inputValue = studentphoneNumber.value;
  let phoneRegex = /^\+998\((87|9[0-9])\)(\d{3}-\d{2}-\d{2})$/;
  let isPhoneValid = phoneRegex.test(inputValue);
  studentphoneNumber.setCustomValidity(
    isPhoneValid
      ? ""
      : "Please enter a valid phone number in the format +998(87)123-45-67."
  );
});

function editStudent(id) {
  selected = id;
  studentBtn.innerHTML = "Save student";
  fetch(ENDPOINT + `teacher/${teacherId}/student/${id}`)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      student.value = res.firstName;
      studentLast.value = res.lastName;
      studentImage.value = res.avatar;
      studentEmail.value = res.email;
      studentphoneNumber.value = res.phoneNumber;
      studentIsWork.checked = res.isWork;
      studentField.value = res.field;
    });
}

function deleteStudent(id) {
  let check = confirm("Rostanam o'chirishni xohlaysizmi ?");
  if (check) {
    fetch(ENDPOINT + `teacher/${teacherId}/student/${id}`, {
      method: "DELETE",
    }).then(() => {
      getStudents();
    });
  }
}

function emptyForm() {
  student.value = "";
  studentImage.value = "";
}

modalOpenBtn.addEventListener("click", () => {
  selected = null;
});
