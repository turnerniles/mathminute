import React, { Component } from 'react';
import './Home.scss';
import MathCard from './MathCard/MathCard.js';
import Counter from './Counter/Counter.js';
import { Firebase } from '../../lib/firebase';
import { generateQuestion } from '../../actions/QuestionGen.js';

class Game extends Component {
  constructor(props) {
    super(props);
    const questions = [];
    for (let i = 0; i < 2; i += 1) {
      questions.push(generateQuestion());
    }

    this.state = {
      currentQuestionIndex: 0,
      currentQuestions: questions,
      answer: eval(questions[0]),
      counter: 0,
      cards: [],
      cardInputValue: '',
      numCorrect: 0,
      numIncorrect: 0,
      otherScores: [],
      playerName: `dogman${Math.floor(Math.random() * 2)}`,
      storedRef: null,
      correctSoundStatus: 'STOPPED',
    };
  }

  componentDidMount() {
    const leadsRef = Firebase.database().ref('scores');

    let otherScores = [];
    leadsRef.on('value', (snapshot) => {
      otherScores = [];
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        otherScores.push(childData);
        this.setState({
          otherScores,
        });
      });
    });

    Firebase.database()
      .ref('/.info/serverTimeOffset')
      .once('value')
      .then(
        (data) => {
          this.setState({
            serverTimeSeconds:
              60 - new Date(data.val() + Date.now()).getSeconds(),
          });
        },
        err => err,
      );

    const fireBaseRef = {
      playerName: this.state.playerName,
      correctRef: 0,
      incorrectRef: 0,
    };

    const storedScore = Firebase.database()
      .ref('scores')
      .push(fireBaseRef);

    this.setState({
      storedRef: storedScore.key,
    });

    storedScore.onDisconnect().remove();
  }

  onInputChange = (e) => {
    const target = e.target;
    const value = target.value;

    this.setState({
      cardInputValue: value,
    });
  };

  genRandomNumber = () => Math.floor(Math.random() * 12 + 1);

  genRandomOperator = () => {
    const randNum = Math.floor(Math.random() * 3);
    return ['+', '-', '*'][randNum];
  };

  handleCardKeyPress = (e) => {
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    if (e.key === 'Enter' || e.key === 'Tab' || e.type === 'blur') {
      e.preventDefault();
    }

    if (
      (((e.key === 'Enter' || e.key === 'Tab') && !isMobile)
        || (e.type === 'blur' && isMobile))
      && !this.state.isMoving
    ) {
      this.setState((state, props) => {
        // const currentQuestions = [...state.currentQuestions];
        // currentQuestions[0] = generateQuestion();
        // currentQuestions[1] = currentQuestions[0];
        props.generateQuestions();

        let numCorrect;
        let numIncorrect;

        if (parseInt(state.cardInputValue) === props.answer) {
          numCorrect = state.numCorrect + 1;
          numIncorrect = state.numIncorrect;
          const correctSound = new Audio('421002__eponn__correct.wav');
          correctSound.play();
        } else {
          numCorrect = state.numCorrect;
          numIncorrect = state.numIncorrect + 1;
          const inCorrectSound = new Audio('Cork,Pop,Strong,Classic.wav');
          inCorrectSound.play();
        }

        const fireBaseRef = {
          playerName: this.state.playerName,
          correctRef: numCorrect,
          incorrectRef: numIncorrect,
        };

        const nextQuestionIndex = this.state.currentQuestionIndex === 0 ? 1 : 0;

        Firebase.database()
          .ref()
          .update({ [`scores/${this.state.storedRef}`]: fireBaseRef });

        return {
          currentQuestionIndex: nextQuestionIndex,
          numCorrect,
          numIncorrect,
          isMoving: true,
          counter: state.counter + 1,
          answer: eval(currentQuestions[nextQuestionIndex]),
          cardInputValue: '',
          currentQuestions,
        };
      });

      setTimeout(() => {
        // Since we can't control a blur firing after hitting enter
        // and focusing on the next input we would create an infinite loop
        // of 'Enter triggering this function followed by the onBlur triggering this
        // function follow by another onBlur and so on and so forth.
        // Currently set to the animation speed of the card.
        this.setState({
          isMoving: false,
        });
      }, 100);
    }
  };

  render() {
    const otherScores = [];
    const movingCardClass = this.state.isMoving
      ? 'math-card math-card-special'
      : 'math-card';
    for (let i = 0; i < this.state.otherScores.length; i += 1) {
      otherScores.push(
        <div className="otherScore" key={i}>
          <div>{this.state.otherScores[i].playerName}</div>
          <div>
            Correct:
            {' '}
            {this.state.otherScores[i].correctRef}
          </div>
          <div>
            Incorrect:
            {' '}
            {this.state.otherScores[i].incorrectRef}
          </div>
        </div>,
      );
    }

    console.log('this.props.currentQuestions[0]', this.props.currentQuestions[0]);

    return (
      <div className="App">
        <div id="viewport">
          <Counter serverTimeSeconds={this.state.serverTimeSeconds} />
          <div className="otherScores">{otherScores}</div>
          <div className="scoreBoard">
            <div className="numCorrect">
              {' '}
✅
              {' '}
              {this.state.numCorrect}
            </div>
            <div className="numIncorrect">
              {' '}
❌
              {' '}
              {this.state.numIncorrect}
            </div>
          </div>
          <ul className="stack">
            <MathCard
              id="MathCard1"
              currentQuestionIndex={this.state.currentQuestionIndex}
              cardInputValue={this.state.cardInputValue}
              cardValue={this.props.currentQuestions[0]}
              onInputChange={this.onInputChange}
              index={0}
              counter={this.state.counter}
              key={0}
              handleKeyPress={this.handleCardKeyPress}
              isMoving={this.state.isMoving}
            />
            <MathCard
              id="MathCard2"
              currentQuestionIndex={this.state.currentQuestionIndex}
              cardInputValue={this.state.cardInputValue}
              cardValue={this.props.currentQuestions[1]}
              onInputChange={this.onInputChange}
              index={1}
              counter={this.state.counter}
              key={1}
              handleKeyPress={this.handleCardKeyPress}
              isMoving={this.state.isMoving}
            />
            <li id="MathCardSpecial" className={movingCardClass} />
          </ul>
        </div>
      </div>
    );
  }
}

export default Game;
