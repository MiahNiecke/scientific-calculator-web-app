function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  return num1 / num2;
}

function parseExpression(expression) {
  const parsedArr = [];
  const sanitizedExpression = expression.replace(/\s/g, "");

  for (let i = 0; i < sanitizedExpression.length; i++) {
    let part = sanitizedExpression[i];
    if (part === "*" || part === "/" || part === "+" || part === "-") {
      parsedArr.push(part);
      continue;
    }

    i += 1;
    while (
      sanitizedExpression[i] !== "*" &&
      sanitizedExpression[i] !== "/" &&
      sanitizedExpression[i] !== "+" &&
      sanitizedExpression[i] !== "-" &&
      i < sanitizedExpression.length
    ) {
      part += sanitizedExpression[i];
      i += 1;
    }

    parsedArr.push(Number(part));
    if (i < sanitizedExpression.length) i -= 1;
  }

  return parsedArr;
}

function calculateMultiplyAndDivide(expressionArr) {
  if (expressionArr.includes("*" || expressionArr.includes("/"))) {
    let i = 0;
    while (i < expressionArr.length) {
      if (expressionArr[i] === "*" || expressionArr[i] === "/") {
        const newValue =
          expressionArr[i] === "*"
            ? multiply(expressionArr[i - 1], expressionArr[i + 1])
            : divide(expressionArr[i - 1], expressionArr[i + 1]);
        expressionArr.splice(i - 1, 3, newValue);
        i -= 2;
      }
      i += 1;
    }
  }
  return expressionArr;
}

function calculateAddAndSubtract(expressionArr) {
  if (expressionArr.includes("+" || expressionArr.includes("-"))) {
    let i = 0;
    while (i < expressionArr.length) {
      if (expressionArr[i] === "+" || expressionArr[i] === "-") {
        const newValue =
          expressionArr[i] === "+"
            ? add(expressionArr[i - 1], expressionArr[i + 1])
            : subtract(expressionArr[i - 1], expressionArr[i + 1]);
        expressionArr.splice(i - 1, 3, newValue);
        i -= 2;
      }
      i += 1;
    }
  }
  return expressionArr;
}

function calculateOperators(expressionArr, operators, operationMap) {
  let i = 0;
  while (i < expressionArr.length) {
    if (operators.includes(expressionArr[i])) {
      const operator = expressionArr[i];
      const newValue = operationMap[operator](
        expressionArr[i - 1],
        expressionArr[i + 1]
      );
      expressionArr.splice(i - 1, 3, newValue);
      i -= 2;
    }
    i += 1;
  }
  return expressionArr;
}

function smallCalculate(expression) {
  const splitStr = parseExpression(expression);
  const eliminateMultiplyAndDivide = calculateMultiplyAndDivide(
    splitStr,
    ["*", "/"],
    {
      "*": multiply,
      "/": divide,
    }
  );

  return calculateOperators(eliminateMultiplyAndDivide, ["+", "-"], {
    "+": add,
    "-": subtract,
  })[0];
}

console.log(smallCalculate("3*6+12/2+4"));
// console.log(calculateMultiplyAndDivide(["3", "*", "6", "+", "12", "/", "2", "-", "23"]));
// console.log(calculateAddAndSubtract([ 18, '+', 6, "-", 23 ]))

//console.log(splitExpression("3*6+ 1 2 /2"));

// 3*6+2/2
