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

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

function exponent(expression) {
  const parts = expression.split("^");
  return Math.pow(Number(parts[0]), Number(parts[1]));
}

function logBase10(expression) {
  let regex = /base10([^()]+)/g;

  while (regex.test(expression)) {
    expression = expression.replace(regex, (match, p1) => {
      return `${Math.log10(Number(p1))}`;
    });
  }
  return expression;
}

function lnCalculate(expression) {
  let regex = /Math.log([^()]+)/g;

  while (regex.test(expression)) {
    expression = expression.replace(regex, (match, p1) => {
      return `${Math.log(Number(p1))}`;
    });
  }
  return expression;
}

function factorial(n) {
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }

  return result;
}

function calculateTrig(expression) {
  const regexFnObj = {
    sinRegex: {
      regex: /sinTrig\(?(-?\d+(\.\d+)?)\)?/g,
      fn: (_, num) => Math.sin(degreesToRadians(parseFloat(num))),
    },
    cosRegex: {
      regex: /cosTrig\(?(-?\d+(\.\d+)?)\)?/g,
      fn: (_, num) => Math.cos(degreesToRadians(parseFloat(num))),
    },
    tanRegex: {
      regex: /tanTrig\(?(-?\d+(\.\d+)?)\)?/g,
      fn: (_, num) => Math.tan(degreesToRadians(parseFloat(num))),
    },
    asinRegex: {
      regex: /sin⁻¹Trig\(?(-?\d+(\.\d+)?)\)?/g,
      fn: (_, num) => radiansToDegrees(Math.asin(parseFloat(num))),
    },
    acosRegex: {
      regex: /cos⁻¹Trig\(?(-?\d+(\.\d+)?)\)?/g,
      fn: (_, num) => radiansToDegrees(Math.acos(parseFloat(num))),
    },
    atanRegex: {
      regex: /tan⁻¹Trig\(?(-?\d+(\.\d+)?)\)?/g,
      fn: (_, num) => radiansToDegrees(Math.atan(parseFloat(num))),
    },
  };
  let prevExpression;
  let newExpression = expression;

  do {
    prevExpression = newExpression;
    for (const key in regexFnObj) {
      const { regex, fn } = regexFnObj[key];
      newExpression = newExpression.replace(regex, fn);
    }
  } while (prevExpression !== newExpression);
  return newExpression;
}

export function isOperator(char) {
  return ["*", "/", "+", "-", "÷", "x"].includes(char);
}

export function isValidInput(value) {
  const validChars = /^[0-9+\-x÷().^]$/;
  return validChars.test(value);
}

export function isValidToReplace(value) {
  const validChars = /(?:[0-9-(π]|log10\()$/;
  return validChars.test(value) || value === "√(";
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

    if (part.includes("^")) parsedArr.push(part);
    else parsedArr.push(Number(part));

    if (i < sanitizedExpression.length) i -= 1;
  }

  while (isOperator(parsedArr[parsedArr.length - 1])) {
    parsedArr.pop();
  }

  return parsedArr;
}

function replacePi(expression) {
  return expression.toString().replaceAll(/π/g, `(${Math.PI.toString()})`);
}

function addMultiply(expression) {
  let modifiedExpression = expression.replaceAll(/(\d)(\()/g, "$1*$2");
  modifiedExpression = modifiedExpression.replace(/(\))(\()/g, "$1*$2");
  return modifiedExpression.replace(/base10\*\(/g, "base10(");
}

function replaceSquareRoot(expression) {
  let regex = /√\(([^)]+)\)/g;

  let replacedExpression = expression;

  while (replacedExpression.match(regex)) {
    replacedExpression = replacedExpression.replaceAll(regex, (match, p1) => {
      let replacedInner = replaceSquareRoot(p1);
      return `(Math.sqrt(${replacedInner}))`;
    });
  }
  return replacedExpression;
}

function eliminateAllExponents(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].toString().includes("^")) {
      arr[i] = exponent(arr[i]);
    }
  }
  return arr;
}

function replaceLog10(expression) {
  let regex = /log10\(([^)]+)\)/g;

  let replacedExpression = expression;

  while (replacedExpression.match(regex)) {
    replacedExpression = replacedExpression.replaceAll(regex, (match, p1) => {
      let replacedInner = replaceLog10(p1);
      return `(base10(${replacedInner}))`;
    });
  }
  return replacedExpression;
}

function replaceln(expression) {
  let regex = /ln\(([^)]+)\)/g;

  let replacedExpression = expression;

  while (replacedExpression.match(regex)) {
    replacedExpression = replacedExpression.replaceAll(regex, (match, p1) => {
      let replacedInner = replaceSquareRoot(p1);
      return `(Math.log(${replacedInner}))`;
    });
  }
  return replacedExpression;
}

function wrapFactorial(expression) {
  let modifiedExpression = expression.replace(/(\d+)!/g, "($1!)");
  modifiedExpression = modifiedExpression.replace(/\(([^()]+)\)!/g, "(($1)!)");

  return modifiedExpression;
}

function wrapTrigFn(expression) {
  const regexObj = {
    sinRegex: /(sin)(\([^)]*\)|[0-9]+)/g,
    cosRegex: /(cos)(\([^)]*\)|[0-9]+)/g,
    tanRegex: /(tan)(\([^)]*\)|[0-9]+)/g,
    asinRegex: /(sin⁻¹)(\([^)]*\)|[0-9]+)/g,
    acosRegex: /(cos⁻¹)(\([^)]*\)|[0-9]+)/g,
    atanRegex: /(tan⁻¹)(\([^)]*\)|[0-9]+)/g,
  };

  let prevExpression;
  let newExpression = expression;

  do {
    prevExpression = newExpression;

    for (const key in regexObj) {
      const regex = regexObj[key];
      newExpression = newExpression.replace(regex, (match, func, args) => {
        return `(${func}Trig${args})`;
      });
    }
  } while (prevExpression !== newExpression);
  return newExpression;
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
  expression = expression
    .replace(/Math\.sqrt\(?([\d.]+)\)?/g, (_, num) => Math.sqrt(Number(num)))
    .replace(/(\d+)!/g, (_, num) => factorial(Number(num)));

  expression = calculateTrig(lnCalculate(logBase10(expression)));
  const parsedArr = parseExpression(expression);
  const exponentResults = eliminateAllExponents(parsedArr);

  const intermediateResult = calculateOperators(exponentResults, ["*", "/"], {
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

  const transformedExpression = [
    replacePi,
    replaceSquareRoot,
    replaceLog10,
    replaceln,
    wrapFactorial,
    wrapTrigFn,
    addMultiply,
  ].reduce((expr, fn) => fn(expr), expression);

  let innermostParentheses = /\(([^()]+)\)/g;
  let updatedExpression = transformedExpression;
  while (innermostParentheses.test(updatedExpression)) {
    updatedExpression = updatedExpression.replace(
      innermostParentheses,
      (match, inside) => {
        const evaluatedResult = evaluateExpression(inside);
        return evaluatedResult;
      }
    );
  }

  return Number(evaluateExpression(updatedExpression).toFixed(10));
}
