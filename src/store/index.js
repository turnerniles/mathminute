/* global window */
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage'; // default: localStorage if web, AsyncStorage if react-native
import thunk from 'redux-thunk';
import reducers from '../reducers';
import { generateQuestion } from '../actions/QuestionGen.js';

// Redux Persist config
const config = {
  key: 'root',
  storage,
  blacklist: ['status'],
};

const reducer = persistCombineReducers(config, reducers);

const middleware = [thunk];

const questions = [];
for (let i = 0; i < 2; i += 1) {
  questions.push(generateQuestion());
}

const configureStore = () => {
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    reducer,
    {
      game: {
        currentQuestions: questions,
        answer: eval(questions[0]),
      },
    },
    composeEnhancer(applyMiddleware(...middleware)),
  );

  console.log('created store', store);

  const persistor = persistStore(
    store,
    null,
    () => { store.getState(); },
  );

  return { persistor, store };
};

export default configureStore;
