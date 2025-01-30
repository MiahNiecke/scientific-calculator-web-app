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
const advanceButtons = document.querySelectorAll(".advance-buttons button");
const clearButton = document.getElementById("clear-button");
const backspaceButton = document.getElementById("backspace");
const calculateButton = document.getElementById("calculate");
const errorMessage = document.getElementById("error-message");
const piButton = document.getElementById("pi");

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
    (previous === "(" && keyToAdd === ")") ||
    (previous === "." && keyToAdd === ".")
  ) {
    return;
  }

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
    display.value = display.value.slice(0, -1);
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
  display.value = display.value.slice(0, -1);
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
