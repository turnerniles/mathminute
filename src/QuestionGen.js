export function genRandomNumber() {
  return Math.floor(Math.random() * 12 + 1);
}

export function genRandomOperator() {
  const randNum = Math.floor(Math.random() * 4);
  return ["+", "-", "*", "/"][randNum];
}

export function generateQuestion() {
  const randomOperator = genRandomOperator();
  let randomNumber1 = genRandomNumber();
  let randomNumber2 = genRandomNumber();
  let generatedQuestion =
    randomNumber1 + " " + randomOperator + " " + randomNumber2;

  if (randomOperator === "/") {
    while (
      randomNumber1 % randomNumber2 !== 0 ||
      randomNumber1 < randomNumber2
    ) {
      randomNumber1 = genRandomNumber();
      randomNumber2 = genRandomNumber();
      // Don't change the randomOperator in order to maintain operator randomness freqeuncy
      generatedQuestion =
        randomNumber1 + " " + randomOperator + " " + randomNumber2;
    }
  } else {
    while (eval(generatedQuestion) < 0) {
      randomNumber1 = genRandomNumber();
      randomNumber2 = genRandomNumber();
      // Don't change the randomOperator in order to maintain operator randomness freqeuncy
      generatedQuestion =
        randomNumber1 + " " + randomOperator + " " + randomNumber2;
    }
  }
  return generatedQuestion;
}
