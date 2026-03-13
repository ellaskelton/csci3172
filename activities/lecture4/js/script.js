let personName = "Ella";
let age = 20;
let isStudent = true;

if (isStudent) {
    console.log(personName + " is a student.");
} else {
    console.log(personName + " is not a student.");
}

let futureAge = age + 8;

document.getElementById("output").innerText =
personName + " is " + age + " years old. In 8 years they will be " + futureAge + ".";
