import { generateQuestion } from './QuestionGen.js';

/**
  * Generate New Questions
  */
export function generateQuestions(currentQuestions) {
  currentQuestions[0] = generateQuestion();
  currentQuestions[1] = currentQuestions[0];
  return dispatch => new Promise(resolve => resolve(dispatch({
    type: 'GENERATE_NEW_QUESTIONS',
    data: currentQuestions,
  })));
}


/**
  * Set an Error Message
  */
export function setError(message) {
  return dispatch => new Promise(resolve => resolve(dispatch({
    type: 'RECIPES_ERROR',
    data: message,
  })));
}
