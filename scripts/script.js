import {
  calculateFullExpression,
  isOperator,
  isValidInput,
  isValidToReplace,
} from "./calculate.js";

const display = document.getElementById("display");
display.value = 0;

const buttons = document.querySelectorAll(
  ".buttons button:not(#backspace):not(#clear-button):not(#calculate)"
);
//const advanceButtons = document.querySelectorAll(".advance-buttons button");
const clearButton = document.getElementById("clear-button");
const backspaceButton = document.getElementById("backspace");
const calculateButton = document.getElementById("calculate");
const errorMessage = document.getElementById("error-message");
const piButton = document.getElementById("pi");
const sqrtButton = document.getElementById("sqrt");
const expButton = document.getElementById("exp");
const logButton = document.getElementById("log");
const lnButton = document.getElementById("ln");
const factorialButton = document.getElementById("factorial");
const sinButton = document.getElementById("sin");
const cosButton = document.getElementById("cos");
const tanButton = document.getElementById("tan");
const asinButton = document.getElementById("asin");
const acosButton = document.getElementById("acos");
const atanButton = document.getElementById("atan");

function displayError(error) {
  errorMessage.textContent = error;
  setTimeout(() => {
    errorMessage.textContent = "";
  }, 4000);
}

function performCalculations() {
  const replaceX = display.value.replace("x", "*");
  const replaceDivide = replaceX.replace("÷", "/");

  const calculate = calculateFullExpression(replaceDivide);

  if (typeof calculate !== "number") displayError(calculate);
  else if (Number.isNaN(calculate))
    displayError("Something went wrong with the calculation");
  else display.value = calculate;
}

function validateAndAppendKey(previous, keyToAdd) {
  const secondLastChar = display.value[display.value.length - 2];

  if (display.value === "0" && isValidToReplace(keyToAdd)) {
    display.value = keyToAdd;
    return;
  }

  if (isOperator(secondLastChar) && previous === "-" && isOperator(keyToAdd)) {
    return;
  }

  if (
    display.value === "-" &&
    (!isValidToReplace(keyToAdd) || keyToAdd === "." || keyToAdd === "-")
  ) {
    return;
  }

  if (isOperator(previous) && keyToAdd !== "-" && isOperator(keyToAdd)) {
    display.value = display.value.slice(0, -1) + keyToAdd;
    return;
  }

  if (previous === "+" && keyToAdd === "-") {
    display.value = display.value.slice(0, -1) + keyToAdd;
    return;
  }

  if ((isOperator(previous) || /^[()]$/.test(previous)) && keyToAdd === ".") {
    return;
  }

  if (
    (previous === ")" && /[0-9]/.test(keyToAdd)) ||
    (!isOperator(previous) && previous !== "(" && keyToAdd === "√(")
  ) {
    return;
  }

  if (
    (previous === "(" && keyToAdd === ")") ||
    (previous === "." && keyToAdd === ".")
  ) {
    return;
  }

  if (keyToAdd === "^" && !/[0-9]/.test(previous) && previous !== ")") {
    return;
  }

  if (previous === "^" && !/[0-9]/.test(keyToAdd)) {
    return;
  }

  if (/[0-9]/.test(previous) && (keyToAdd === "log10(" || keyToAdd === "ln(")) {
    return;
  }

  if ((isOperator(previous) || previous === "!") && keyToAdd === "!") return;

  display.value += keyToAdd;
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    errorMessage.textContent = "";
    const buttonText = button.textContent;
    const previousValue = display.value[display.value.length - 1];
    validateAndAppendKey(previousValue, buttonText);
  });
});

document.addEventListener("keydown", (event) => {
  display.focus();
  const key = event.key;
  const previousValue = display.value[display.value.length - 1];

  if (!isValidInput(key)) {
    event.preventDefault();
  } else {
    event.preventDefault();
    errorMessage.textContent = "";
    validateAndAppendKey(previousValue, key);
  }

  if (key === "Backspace") {
    const secondLastChar = display.value[display.value.length - 2];
    if (
      previousValue === "(" &&
      !/[0-9]/.test(secondLastChar) &&
      !isOperator(secondLastChar)
    ) {
      display.value = display.value.slice(0, -2);
    } else display.value = display.value.slice(0, -1);

    if (display.value === "") display.value = 0;
  }

  if (key === "Enter" || key === "=") {
    performCalculations();
  }
});

clearButton.addEventListener("click", () => {
  display.value = 0;
});

backspaceButton.addEventListener("click", () => {
  const previousValue = display.value[display.value.length - 1];
  const secondLastChar = display.value[display.value.length - 2];
  if (
    previousValue === "(" &&
    !/[0-9]/.test(secondLastChar) &&
    !isOperator(secondLastChar)
  ) {
    display.value = display.value.slice(0, -2);
  } else display.value = display.value.slice(0, -1);

  if (display.value === "") display.value = 0;
});

calculateButton.addEventListener("click", () => {
  performCalculations();
});

piButton.addEventListener("click", () => {
  errorMessage.textContent = "";
  const previousValue = display.value[display.value.length - 1];
  validateAndAppendKey(previousValue, "π");
});

sqrtButton.addEventListener("click", () => {
  errorMessage.textContent = "";
  const previousValue = display.value[display.value.length - 1];
  validateAndAppendKey(previousValue, "√(");
});

expButton.addEventListener("click", () => {
  errorMessage.textContent = "";
  const previousValue = display.value[display.value.length - 1];
  validateAndAppendKey(previousValue, "^");
});

logButton.addEventListener("click", () => {
  errorMessage.textContent = "";
  const previousValue = display.value[display.value.length - 1];
  validateAndAppendKey(previousValue, "log10(");
});

lnButton.addEventListener("click", () => {
  errorMessage.textContent = "";
  const previousValue = display.value[display.value.length - 1];
  validateAndAppendKey(previousValue, "ln(");
});

factorialButton.addEventListener("click", () => {
  errorMessage.textContent = "";
  const previousValue = display.value[display.value.length - 1];
  validateAndAppendKey(previousValue, "!");
});

sinButton.addEventListener("click", () => {
  errorMessage.textContent = "";
  const previousValue = display.value[display.value.length - 1];
  validateAndAppendKey(previousValue, "sin(");
});

cosButton.addEventListener("click", () => {
  errorMessage.textContent = "";
  const previousValue = display.value[display.value.length - 1];
  validateAndAppendKey(previousValue, "cos(");
});

tanButton.addEventListener("click", () => {
  errorMessage.textContent = "";
  const previousValue = display.value[display.value.length - 1];
  validateAndAppendKey(previousValue, "tan(");
});

asinButton.addEventListener("click", () => {
  errorMessage.textContent = "";
  const previousValue = display.value[display.value.length - 1];
  validateAndAppendKey(previousValue, "sin⁻¹(");
});

acosButton.addEventListener("click", () => {
  errorMessage.textContent = "";
  const previousValue = display.value[display.value.length - 1];
  validateAndAppendKey(previousValue, "cos⁻¹(");
});

atanButton.addEventListener("click", () => {
  errorMessage.textContent = "";
  const previousValue = display.value[display.value.length - 1];
  validateAndAppendKey(previousValue, "tan⁻¹(");
});
