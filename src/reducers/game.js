import Store from '../store/recipes';

export const initialState = Store;

export default function gameReducer(state = initialState, action) {
  switch (action.type) {
    case 'GENERATE_NEW_QUESTIONS': {
      console.log('in the reduce', action.data);
      return {
        ...state,
        currentQuestions: action.data,
        answer: eval(action.data[0]),
      };
    }
    case 'MEALS_REPLACE': {
      return {
        ...state,
        error: null,
        loading: false,
        meals: action.data,
      };
    }
    case 'RECIPES_ERROR': {
      return {
        ...state,
        error: action.data,
      };
    }

    default:
      return state;
  }
}
