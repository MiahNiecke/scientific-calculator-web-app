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

function isOperator(char) {
  return ["*", "/", "+", "-"].includes(char);
}

function parseExpression(expression) {
  const parsedArr = [];
  const sanitizedExpression = expression.replace(/\s/g, "");

  for (let i = 0; i < sanitizedExpression.length; i++) {
    let part = sanitizedExpression[i];
    if (isOperator(part)) {
      parsedArr.push(part);
      continue;
    }

    i += 1;
    while (
      !isOperator(sanitizedExpression[i]) &&
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

export function evaluateExpression(expression) {
  const parsedArr = parseExpression(expression);
  const intermediateResult = calculateOperators(parsedArr, ["*", "/"], {
    "*": multiply,
    "/": divide,
  });

  const finalResults = calculateOperators(intermediateResult, ["+", "-"], {
    "+": add,
    "-": subtract,
  });

  return finalResults[0];
}

function calculateFullExpression(expression) {
  
}

//console.log(evaluateExpression("3*6+12/2+4"));
// console.log(calculateMultiplyAndDivide(["3", "*", "6", "+", "12", "/", "2", "-", "23"]));
// console.log(calculateAddAndSubtract([ 18, '+', 6, "-", 23 ]))

//console.log(splitExpression("3*6+ 1 2 /2"));
