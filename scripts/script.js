const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");
const clearButton = document.getElementById("clear-button");

function isValidInput(value) {
  const validChars = /^[0-9+\-x÷.]$/;
  return validChars.test(value);
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
    display.value += key;
  }

  if (key === "Backspace") {
    display.value = display.value.slice(0, -1);
  }
});

clearButton.addEventListener("click", () => {
  display.value = "";
});
