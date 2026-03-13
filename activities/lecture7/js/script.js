const currentDate = new Date();
const currentHour = currentDate.getHours();

let greetingMessage = '';

if (currentHour < 12) {
	greetingMessage = 'Good Morning';
}
else if (currentHour < 15) {
	greetingMessage = 'Hey! I think we are in class!';
}
else {
	greetingMessage = 'Welcome';
}

document.getElementById('greeting').innerHTML = greetingMessage;

let num1, num2;

function getNumbers() {
	num1 = parseFloat(document.getElementById('number1').value);
	num2 = parseFloat(document.getElementById('number2').value);
}

function calculate(operation) {
	getNumbers();
	
	if (isNaN(num1) || isNaN(num2)) {
		document.getElementById('calc-result').innerHTML = '<strong>Error:</strong> Please enter valid numbers.';
		document.getElementById('calc-result').style.color = '#e74c3c';
		return;
	}
	
	let result;
	let operationSymbol;
	
	if (operation === 'add') {
		result = num1 + num2;
		operationSymbol = '+';
	}
	else if (operation === 'subtract') {
		result = num1 - num2;
		operationSymbol = '-';
	}
	else if (operation === 'multiply') {
		result = num1 * num2;
		operationSymbol = '×';
	}
	else if (operation === 'divide') {
		if (num2 === 0) {
			document.getElementById('calc-result').innerHTML = '<strong>Error:</strong> Cannot divide by zero.';
			document.getElementById('calc-result').style.color = '#e74c3c';
			return;
		}
		result = num1 / num2;
		operationSymbol = '÷';
	}
	else {
		document.getElementById('calc-result').innerHTML = '<strong>Error:</strong> Invalid operation.';
		document.getElementById('calc-result').style.color = '#e74c3c';
		return;
	}
	
	document.getElementById('calc-result').innerHTML = `<strong>Result:</strong> ${num1} ${operationSymbol} ${num2} = ${result}`;
	document.getElementById('calc-result').style.color = '#27ae60';
}

function evenOddArray() {
	const arrayInput = document.getElementById('arrayInput').value.trim();
	
	if (!arrayInput) {
		document.getElementById('array-result').innerHTML = '<strong>Error:</strong> Please enter an array of numbers.';
		document.getElementById('array-result').style.color = '#e74c3c';
		return;
	}
	
	const numbers = arrayInput.split(',').map(item => item.trim()).filter(item => item !== '');
 
	if (numbers.length === 0) {
		document.getElementById('array-result').innerHTML = '<strong>Error:</strong> Please enter at least one number.';
		document.getElementById('array-result').style.color = '#e74c3c';
		return;
	}
 
	const result = numbers.length % 2 === 0 ? 'even' : 'odd';
	
	document.getElementById('array-result').innerHTML = `<strong>Array Length Result:</strong> The array [${numbers.join(', ')}] has ${numbers.length} item(s), which is <strong>${result}</strong>.`;
	document.getElementById('array-result').style.color = '#2980b9';
}

function evenOddArrayItems() {
	const arrayInput = document.getElementById('arrayInput').value.trim();
	
	if (!arrayInput) {
		document.getElementById('array-result').innerHTML = '<strong>Error:</strong> Please enter an array of numbers.';
		document.getElementById('array-result').style.color = '#e74c3c';
		return;
	}
	
	const numberStrings = arrayInput.split(',').map(item => item.trim()).filter(item => item !== '');
	const numbers = numberStrings.map(item => parseFloat(item));
	
	if (numbers.some(isNaN)) {
		document.getElementById('array-result').innerHTML = '<strong>Error:</strong> Please enter only valid numbers.';
		document.getElementById('array-result').style.color = '#e74c3c';
		return;
	}
	
	if (numbers.length === 0) {
		document.getElementById('array-result').innerHTML = '<strong>Error:</strong> Please enter at least one number.';
		document.getElementById('array-result').style.color = '#e74c3c';
		return;
	}
	
	const results = numbers.map(num => {
		if (!Number.isInteger(num)) {
			return 'not an integer';
		}
		return num % 2 === 0 ? 'even' : 'odd';
	});
	
	document.getElementById('array-result').innerHTML = `<strong>Array Items Result:</strong> [${numbers.join(', ')}] → ${results.join(', ')}`;
	document.getElementById('array-result').style.color = '#2980b9';
}
