const correction = (num) => parseFloat(num.toPrecision(15));
const add = (num1, num2) => correction(num1 + num2);
const substract = (num1, num2) => correction(num1 - num2);
const multiply = (num1, num2) => correction(num1 * num2);
const divide = (num1, num2) => correction(num1 / num2);
const operate = function (operator, num1, num2) {
	switch (operator) {
		case "+":
			return add(num1, num2);
		case "-":
			return substract(num1, num2);
		case "*":
			return multiply(num1, num2);
		case "/":
			return divide(num1, num2);
		default:
			break;
	}
};
let num1 = null;
let num2 = null;
let operator1 = "";
let operator2 = "";
let nextDisplay = false;
const numbersKeys = ["0", ".", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const operatorsHelpersKey = ["c", "m", "Backspace"];
const operatorsSymbolsKey = ["/", "*", "-", "+"];
const equalKeys = ["Enter"];
const expression = /[a-df-z]/gi;
window.onload = () => {
	const displayScreen = document.getElementById("display-screen");
	const numberBtns = document.getElementsByClassName("numbers");
	const operatorsHelpers = document.getElementsByClassName("helpers");
	const operatorsSymbols = document.getElementsByClassName("symbols");
	const equal = document.getElementsByClassName("equal");
	clickBtns(numberBtns, displayScreen, populateScreen, showOperatorOnClick);
	clickBtns(
		operatorsHelpers,
		displayScreen,
		applyOperatorsHelpers,
		showOperatorOnClick
	);
	clickBtns(
		operatorsSymbols,
		displayScreen,
		applyOperatorsSymbols,
		showOperatorOnClick
	);
	clickBtns(equal, displayScreen, applyEqual, showOperatorOnClick);
	window.onkeydown = (e) => {
		pressBtns(
			e,
			displayScreen,
			numbersKeys,
			populateScreen,
			showOperatorOnPress
		);
		pressBtns(
			e,
			displayScreen,
			operatorsHelpersKey,
			applyOperatorsHelpers,
			showOperatorOnPress
		);
		pressBtns(
			e,
			displayScreen,
			operatorsSymbolsKey,
			applyOperatorsSymbols,
			showOperatorOnPress
		);
		pressBtns(e, displayScreen, equalKeys, applyEqual, showOperatorOnPress);
	};
};
function clickBtns(btns, displayScreen, action, action2) {
	for (let i = 0; i < btns.length; i++) {
		btns[i].onclick = (e) => {
			action(e.target.dataset.value, displayScreen);
			action2(e);
		};
	}
}
function pressBtns(e, displayScreen, array, action, action2) {
	pressKey(e, displayScreen, array, action, action2);
}
function pressKey(e, displayScreen, array, action, action2) {
	for (let i = 0; i < array.length; i++) {
		if (e.key === array[i]) {
			action(array[i], displayScreen);
			document
				.querySelector(`[data-value='${array[i]}']`)
				.classList.add("press-down-btns");
			setTimeout(() => {
				document
					.querySelector(`[data-value='${array[i]}']`)
					.classList.remove("press-down-btns");
			}, 100);
			action2(e, array);
		}
	}
}
function showOperatorOnClick(e) {
	let symbols = document.getElementsByClassName("symbols");
	for (let i = 0; i < symbols.length; i++) {
		symbols[i].classList.remove("active-operators");
	}
	if (e.target.className.indexOf("symbols") !== -1) {
		e.target.classList.add("active-operators");
	}
}
function showOperatorOnPress(e, array) {
	let symbols = document.getElementsByClassName("symbols");
	for (let i = 0; i < symbols.length; i++) {
		symbols[i].classList.remove("active-operators");
	}
	for (let i = 0; i < array.length; i++) {
		if (
			document
				.querySelector(`[data-value='${array[i]}']`)
				.className.indexOf("symbols") !== -1 &&
			e.key === array[i]
		) {
			document
				.querySelector(`[data-value='${array[i]}']`)
				.classList.add("active-operators");
		}
	}
}
function clearAll(displayScreen) {
	num1 = null;
	num2 = null;
	operator1 = "";
	operator2 = "";
	nextDisplay = false;
	displayScreen.textContent = "0";
}
function populateScreen(value, displayScreen) {
	if (expression.test(displayScreen.textContent)) {
		return;
	} else {
		if (displayScreen.textContent.length < 15 || nextDisplay) {
			if (!operator1) {
				if (
					displayScreen.textContent.charAt(0) === "0" &&
					displayScreen.textContent.length === 1
				) {
					if (value === "0") {
						return;
					} else if (value === ".") {
						displayScreen.textContent += ".";
					} else {
						displayScreen.textContent = value;
					}
				} else if (displayScreen.textContent.length >= 1) {
					if (displayScreen.textContent.indexOf(".") !== -1 && value === ".") {
						return;
					} else {
						displayScreen.textContent += value;
					}
				}
			} else if (operator1) {
				if (nextDisplay) {
					if (value === ".") {
						displayScreen.textContent = "0.";
					} else {
						displayScreen.textContent = value;
					}
					nextDisplay = false;
				} else {
					if (displayScreen.textContent.length >= 1) {
						if (
							displayScreen.textContent.indexOf(".") !== -1 &&
							value === "."
						) {
							return;
						} else if (displayScreen.textContent === "0") {
							if (value === ".") {
								displayScreen.textContent = "0.";
							} else {
								displayScreen.textContent = value;
							}
						} else {
							displayScreen.textContent += value;
						}
					}
				}
			}
		}
	}
}
function applyOperatorsSymbols(value, displayScreen) {
	if (expression.test(displayScreen.textContent)) {
		return;
	} else {
		if ((!operator1 && num1 === null) || !operator1) {
			operator1 = value;
			num1 = +displayScreen.textContent;
			nextDisplay = true;
		} else if (operator1 && nextDisplay) {
			if (operator1 === value) {
				return;
			} else {
				operator1 = value;
			}
		} else if (operator1) {
			operator2 = value;
			num2 = +displayScreen.textContent;
			num1 = operate(operator1, num1, num2);
			if (operator1 === "/" && num2 === 0) {
				displayScreen.textContent = "I wish I could do that";
				return;
			}
			num2 = null;
			operator1 = operator2;
			operator2 = "";
			nextDisplay = true;
			displaySolution(num1, displayScreen);
		}
	}
}
function applyOperatorsHelpers(value, displayScreen) {
	if (expression.test(displayScreen.textContent)) {
		if (value === "c") {
			clearAll(displayScreen);
		}
	} else {
		switch (value) {
			case "c":
				clearAll(displayScreen);
				break;
			case "m":
				if (displayScreen.textContent !== "0") {
					if (displayScreen.textContent.indexOf("-") === -1) {
						displayScreen.textContent = "-" + displayScreen.textContent;
					} else {
						displayScreen.textContent = displayScreen.textContent.replace(
							"-",
							""
						);
					}
					if (operator1 && nextDisplay) {
						num1 = -num1;
					}
				}
				break;
			case "Backspace":
				if (!nextDisplay) {
					if (displayScreen.textContent.length > 2) {
						displayScreen.textContent = displayScreen.textContent.slice(
							0,
							displayScreen.textContent.length - 1
						);
					} else if (displayScreen.textContent.length === 2) {
						if (displayScreen.textContent.indexOf("-") !== -1) {
							displayScreen.textContent = "0";
						} else {
							displayScreen.textContent = displayScreen.textContent.slice(
								0,
								displayScreen.textContent.length - 1
							);
						}
					} else if (displayScreen.textContent.length === 1) {
						displayScreen.textContent = "0";
					}
				}
				break;
			default:
				break;
		}
	}
}
function applyEqual(value, displayScreen) {
	if (expression.test(displayScreen.textContent)) {
		return;
	} else {
		if (num1 !== null && operator1 && !nextDisplay) {
			num2 = +displayScreen.textContent;
			num1 = operate(operator1, num1, num2);
			if (operator1 === "/" && num2 === 0) {
				displayScreen.textContent = "I wish I could do that";
				return;
			}
			num2 = null;
			operator1 = "";
			operator2 = "";
			nextDisplay = true;
			displaySolution(num1, displayScreen);
		} else {
			return;
		}
	}
}
function displaySolution(num1, displayScreen) {
	let num1Stringify = "" + num1;
	if (isNaN(num1Stringify)) {
		displayScreen.textContent = "This is not a number";
	} else if (
		num1Stringify === "Infinity" ||
		num1Stringify === "-Infinity" ||
		/e/gi.test(num1Stringify)
	) {
		displayScreen.textContent = "The number is to big";
	} else {
		displayScreen.textContent = "" + num1;
	}
}
