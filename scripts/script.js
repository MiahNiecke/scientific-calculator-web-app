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
const clearButton = document.getElementById("clear-button");
const backspaceButton = document.getElementById("backspace");
const calculateButton = document.getElementById("calculate");
const errorMessage = document.getElementById("error-message");

const advancedButtons = {
  pi: "π",
  sqrt: "√(",
  exp: "^",
  log: "log10(",
  ln: "ln(",
  factorial: "!",
  sin: "sin(",
  cos: "cos(",
  tan: "tan(",
  asin: "sin⁻¹(",
  acos: "cos⁻¹(",
  atan: "tan⁻¹(",
};

function displayError(error) {
  errorMessage.textContent = error;
  setTimeout(() => {
    errorMessage.textContent = "";
  }, 4000);
}

function performCalculations() {
  const sanitizedInput = display.value.replace("x", "*").replace("÷", "/");
  const result = calculateFullExpression(sanitizedInput);

  if (typeof result !== "number") {
    displayError(result);
  } else if (Number.isNaN(result)) {
    displayError("Something went wrong with the calculation");
  } else {
    display.value = result;
  }
}

function validateAndAppendKey(previous, keyToAdd) {
  const secondLastChar = display.value[display.value.length - 2];

  if (display.value === "0" && isValidToReplace(keyToAdd)) {
    display.value = keyToAdd;
    return;
  }

  if (isOperator(secondLastChar) && previous === "-" && isOperator(keyToAdd))
    return;
  if (isOperator(previous) && keyToAdd !== "-" && isOperator(keyToAdd)) {
    display.value = display.value.slice(0, -1) + keyToAdd;
    return;
  }

  if (
    (display.value === "-" && !isValidToReplace(keyToAdd)) ||
    (previous === "+" && keyToAdd === "-")
  ) {
    if (keyToAdd === "." || keyToAdd === "-") return;
    display.value = display.value.slice(0, -1) + keyToAdd;
    return;
  }

  if ((isOperator(previous) || /^[()]$/.test(previous)) && keyToAdd === ".")
    return;

  const invalidFunctionCalls = [
    "log10(",
    "ln(",
    "sin(",
    "cos(",
    "tan(",
    "sin⁻¹(",
    "cos⁻¹(",
    "tan⁻¹(",
    "√(",
  ];
  if (
    (previous === ")" && /[0-9]/.test(keyToAdd)) ||
    (!isOperator(previous) &&
      previous !== "(" &&
      invalidFunctionCalls.includes(keyToAdd)) ||
    (previous === "(" && keyToAdd === ")") ||
    (previous === "." && keyToAdd === ".")
  ) {
    return;
  }

  if (keyToAdd === "^" && !/[0-9]/.test(previous) && previous !== ")") return;
  if (previous === "^" && !/[0-9]/.test(keyToAdd) && keyToAdd !== "-") return;

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

Object.entries(advancedButtons).forEach(([id, value]) => {
  const button = document.getElementById(id);
  button.addEventListener("click", () => {
    errorMessage.textContent = "";
    const previousValue = display.value[display.value.length - 1];
    validateAndAppendKey(previousValue, value);
  });
});
