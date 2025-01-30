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

/* function sqrt(num) {
  if (num)
} */

export function isOperator(char) {
  return ["*", "/", "+", "-", "÷", "x"].includes(char);
}

export function isValidInput(value) {
  const validChars = /^[0-9+\-x÷().]$/;
  return validChars.test(value);
}

export function isValidToReplace(value) {
  const validChars = /^[0-9-(π]$/;
  return validChars.test(value);
}

function validateBrackets(expression) {
  const stack = [];

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (char === "(") {
      stack.push(char);
    } else if (char === ")") {
      if (stack.length === 0) {
        return "Unmatched closing bracket at position " + i;
      }
      stack.pop();
    }
  }

  if (stack.length > 0) {
    return "Unmatched opening brackets in the expression.";
  }

  return true;
}

function parseExpression(expression) {
  const parsedArr = [];
  const sanitizedExpression = expression.replace(/\s/g, "");

  for (let i = 0; i < sanitizedExpression.length; i++) {
    let part = sanitizedExpression[i];
    if (
      isOperator(part) &&
      i !== 0 &&
      !isOperator(sanitizedExpression[i - 1])
    ) {
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

  while (isOperator(parsedArr[parsedArr.length - 1])) {
    parsedArr.pop();
  }

  return parsedArr;
}

function replacePi(expression) {
  return expression.replaceAll(/π/g,`(${Math.PI.toString()})`);
}

function addMultiply(expression) {
  let modifiedExpression = expression.replaceAll(/(\d)(\()/g, "$1*$2");
  modifiedExpression = modifiedExpression.replace(/(\))(\()/g, "$1*$2");
  return modifiedExpression;
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

  return Number(finalResults[0]);
}

export function calculateFullExpression(expression) {
  const error = validateBrackets(expression);
  if (error !== true) {
    return error;
  }
  const replacePI = replacePi(expression);
  const addedMultiply = addMultiply(replacePI);

  let innermostParentheses = /\(([^()]+)\)/g;
  let updatedExpression = addedMultiply;
  while (innermostParentheses.test(updatedExpression)) {
    updatedExpression = updatedExpression.replace(
      innermostParentheses,
      (match, inside) => {
        const evaluatedResult = evaluateExpression(inside);
        return evaluatedResult;
      }
    );
  }
  return evaluateExpression(updatedExpression);
}

//console.log(evaluateExpression("3*6+12/2+4"));
// console.log(calculateMultiplyAndDivide(["3", "*", "6", "+", "12", "/", "2", "-", "23"]));
// console.log(calculateAddAndSubtract([ 18, '+', 6, "-", 23 ]))

//console.log(splitExpression("3*6+ 1 2 /2"));
//console.log(parseExpression("-3*-6"))

//console.log(calculateFullExpression("3(3+6(-7)+9)(3+7)"));
//console.log(parseExpression("-3*-7"));
