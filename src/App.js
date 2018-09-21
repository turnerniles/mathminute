import React, { Component } from 'react';
import './App.css';
import MathCard from './MathCard/MathCard.js';
import Counter from './Counter/Counter.js';
import firebase from './firebase.js';

class App extends Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    const questions = [];
    const positions = []
    for (let i=0;i<10;i+=1) {
      let currentQuestion = this.genRandomNumber() + ' ' + this.genRandomOperator()  + ' ' + this.genRandomNumber()
      while(eval(currentQuestion) < 0) {
        currentQuestion = this.genRandomNumber() + ' ' + this.genRandomOperator()  + ' ' + this.genRandomNumber();
      }
      questions.push(currentQuestion)
      positions.push(180*i);
    }

    this.state = {
      currentQuestions: questions,
      answer: eval(questions[0]),
      counter: 0,
      cards: [],
      cardInputValue: '',
      cardPositions: positions,
      numCorrect: 0,
      numIncorrect: 0,
    }
  }

  componentDidMount(){
    var presenceRef = firebase.database().ref("disconnectmessage");
    // Write a string when this client loses connection
    presenceRef.onDisconnect().set("I disconnected!");    
  }

  onInputChange = (e) => {
    const target = e.target;
    const value = target.value;

    this.setState({
      cardInputValue: value,
    })
  }

  genRandomNumber = () => {
    return Math.floor((Math.random() * 12) + 1);
  }

  genRandomOperator = () => {
    const randNum = Math.floor((Math.random() * 3));
    return ['+', '-', '*'][randNum]
  }

  handleCardKeyPress = (e) => {
    const isMobile = (/Android|iPhone|iPad/i.test(navigator.userAgent))
    if (e.key === 'Enter' || e.key === 'Tab' || e.type === 'blur') {
      e.preventDefault();
    }

    if ((((e.key === 'Enter' || e.key === 'Tab') && !isMobile) || (e.type === 'blur' && isMobile)) && !this.state.isMoving) {
      console.log('doing')
      const a = this.state.cardInputValue == this.state.answer;

      this.setState((state, props) => {
        const positions = state.cardPositions;
        positions.forEach((postion, i) => {
          positions[i] = positions[i] - 180;
        })

      console.log(state.numCorrect)
      const numCorrect = state.cardInputValue == state.answer ? state.numCorrect + 1 : state.numCorrect;
      const numIncorrect = state.cardInputValue != state.answer ? state.numIncorrect + 1 : state.numIncorrect;

      const correctRef = firebase.database().ref('correctRef');
      const incorrectRef = firebase.database().ref('incorrectRef');

      if (state.cardInputValue == state.answer){
        correctRef.push(numCorrect);
      } else {
        incorrectRef.push(numIncorrect);
      }

      return {
        numCorrect,
        numIncorrect,
        isMoving: true,
        cardPositions: positions,
        counter: state.counter + 1,
        answer: eval(state.currentQuestions[state.counter + 1]),
        cardInputValue: '',
      }});

      setTimeout(() => {
        // Since we can't control a blur firing after hitting enter
        // and focusing on the next input we would create an infite loop
        // of 'Enter triggering this function followed by the onBlur triggering this
        // function follow by another onBlur and so on and so forth.
        // Currently set to the animation speed of the card.
        this.setState({
          isMoving: false,
        })
      }, 1000)
    }
    else {
    }
}

  render() {
    const cards = [];
    for (let i=0;i<10;i+=1) {
      cards.push(
        <MathCard
          cardInputValue={this.state.cardInputValue}
          cardValue={this.state.currentQuestions[i]}
          onInputChange={this.onInputChange}
          index={i}
          counter={this.state.counter}
          key={i}
          handleKeyPress={this.handleCardKeyPress}
          leftPosition={this.state.cardPositions[i]}
          isMoving={this.state.isMoving}
        >
        </MathCard>
      );
    cards;
    }
    console.log(cards)
    return (
      <div className="App">
        <div id="viewport">
          <header className="App-header">
            <h1 className="App-title">Math Minute</h1>
            <Counter></Counter>
            <div>Number Correct {this.state.numCorrect}</div>
            <div>Number Incorrect {this.state.numIncorrect}</div>
          </header>
            <ul className="stack">
              {cards}
            </ul>
        </div>
      </div>
    );
  }
}

export default App;
