import React, { Component } from "react";
import "./App.css";
import MathCard from "./MathCard/MathCard.js";
import Counter from "./Counter/Counter.js";
import firebase from "./firebase.js";
import { generateQuestion } from "./QuestionGen.js";

class App extends Component {
  constructor(props) {
    super(props);
    const questions = [];
    const positions = [];
    for (let i = 0; i < 2; i += 1) {
      questions.push(generateQuestion());
    }

    this.state = {
      currentQuestionIndex: 0,
      currentQuestions: questions,
      answer: eval(questions[0]),
      counter: 0,
      cards: [],
      cardInputValue: "",
      numCorrect: 0,
      numIncorrect: 0,
      otherScores: [],
      playerName: "dogman" + Math.floor(Math.random() * 2),
      storedRef: null
    };
  }

  componentDidMount() {
    window.firebase = firebase;

    var leadsRef = firebase.database().ref("scores");

    var otherScores = [];
    leadsRef.on("value", snapshot => {
      otherScores = [];
      snapshot.forEach(childSnapshot => {
        var childData = childSnapshot.val();
        otherScores.push(childData);
        this.setState({
          otherScores
        });
      });
    });

    firebase
      .database()
      .ref("/.info/serverTimeOffset")
      .once("value")
      .then(
        data => {
          this.setState({
            serverTimeSeconds:
              60 - new Date(data.val() + Date.now()).getSeconds()
          });
        },
        function(err) {
          return err;
        }
      );

    const fireBaseRef = {
      playerName: this.state.playerName,
      correctRef: 0,
      incorrectRef: 0
    };

    var storedScore = firebase
      .database()
      .ref("scores")
      .push(fireBaseRef);

    this.setState({
      storedRef: storedScore.key
    });

    storedScore.onDisconnect().remove();
  }

  onInputChange = e => {
    const target = e.target;
    const value = target.value;

    this.setState({
      cardInputValue: value
    });
  };

  genRandomNumber = () => {
    return Math.floor(Math.random() * 12 + 1);
  };

  genRandomOperator = () => {
    const randNum = Math.floor(Math.random() * 3);
    return ["+", "-", "*"][randNum];
  };

  handleCardKeyPress = e => {
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    if (e.key === "Enter" || e.key === "Tab" || e.type === "blur") {
      e.preventDefault();
    }

    if (
      (((e.key === "Enter" || e.key === "Tab") && !isMobile) ||
        (e.type === "blur" && isMobile)) &&
      !this.state.isMoving
    ) {
      this.setState((state, props) => {
        const currentQuestions = [...state.currentQuestions];
        currentQuestions[0] = generateQuestion();
        currentQuestions[1] = currentQuestions[0];

        const numCorrect =
          state.cardInputValue == state.answer
            ? state.numCorrect + 1
            : state.numCorrect;
        const numIncorrect =
          state.cardInputValue != state.answer
            ? state.numIncorrect + 1
            : state.numIncorrect;

        const fireBaseRef = {
          playerName: this.state.playerName,
          correctRef: numCorrect,
          incorrectRef: numIncorrect
        };

        const nextQuestionIndex = this.state.currentQuestionIndex === 0 ? 1 : 0;

        firebase
          .database()
          .ref()
          .update({ [`scores/${this.state.storedRef}`]: fireBaseRef });

        return {
          currentQuestionIndex: nextQuestionIndex,
          numCorrect,
          numIncorrect,
          isMoving: true,
          counter: state.counter + 1,
          answer: eval(currentQuestions[nextQuestionIndex]),
          cardInputValue: "",
          currentQuestions
        };
      });

      setTimeout(() => {
        // Since we can't control a blur firing after hitting enter
        // and focusing on the next input we would create an infinite loop
        // of 'Enter triggering this function followed by the onBlur triggering this
        // function follow by another onBlur and so on and so forth.
        // Currently set to the animation speed of the card.
        this.setState({
          isMoving: false
        });
      }, 100);
    }
  };

  render() {
    const otherScores = [];
    for (let i = 0; i < this.state.otherScores.length; i += 1) {
      otherScores.push(
        <div className="otherScore" key={i}>
          <div>{this.state.otherScores[i].playerName}</div>
          <div>Correct: {this.state.otherScores[i].correctRef}</div>
          <div>Incorrect: {this.state.otherScores[i].incorrectRef}</div>
        </div>
      );
    }

    return (
      <div className="App">
        <div id="viewport">
          <header className="App-header">
            <h1 className="App-title">Math Minute</h1>
            <Counter serverTimeSeconds={this.state.serverTimeSeconds} />
            <div>Number Correct {this.state.numCorrect}</div>
            <div>Number Incorrect {this.state.numIncorrect}</div>
          </header>
          <div className="otherScores">{otherScores}</div>
          <ul className="stack">
            <MathCard
              id="MathCard1"
              currentQuestionIndex={this.state.currentQuestionIndex}
              cardInputValue={this.state.cardInputValue}
              cardValue={this.state.currentQuestions[0]}
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
              cardValue={this.state.currentQuestions[1]}
              onInputChange={this.onInputChange}
              index={1}
              counter={this.state.counter}
              key={1}
              handleKeyPress={this.handleCardKeyPress}
              isMoving={this.state.isMoving}
            />
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
