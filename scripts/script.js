import { evaluateExpression } from "./calculate.js";

const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");
const clearButton = document.getElementById("clear-button");
const backspaceButton = document.getElementById("backspace");
const calculateButton = document.getElementById("calculate");

function isValidInput(value) {
  const validChars = /^[0-9+\-x÷().]$/;
  return validChars.test(value);
}

function performCalculations() {
  const replaceX = display.value.replace("x", "*");
  const replaceDivide = replaceX.replace("÷", "/");

  const calculate = evaluateExpression(replaceDivide);

  display.value = calculate;
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const buttonText = button.textContent;
    if (isValidInput(buttonText)) {
      display.value += `${buttonText}`;
    }
  });
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (!isValidInput(key)) {
    event.preventDefault();
  } else {
    event.preventDefault();
    display.value += key;
  }

  if (key === "Backspace") {
    display.value = display.value.slice(0, -1);
  }

  if (key === "Enter" || key === "=") {
    performCalculations();
  }
});

clearButton.addEventListener("click", () => {
  display.value = "";
});

backspaceButton.addEventListener("click", () => {
  display.value = display.value.slice(0, -1);
});

calculateButton.addEventListener("click", () => {
  performCalculations();
});
