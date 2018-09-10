import React, { Component } from 'react';
import './App.css';
import MathCard from './MathCard/MathCard.js';
import Counter from './Counter/Counter.js';

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
    }
  }

  onInputChange = (e) => {
    const target = e.target;
    const value = target.value;

    if(value == this.state.answer) {
      let newQuestion = this.genRandomNumber() + ' ' + this.genRandomOperator()  + ' ' + this.genRandomNumber();
      while(eval(newQuestion) < 0) {
        newQuestion = this.genRandomNumber() + ' ' + this.genRandomOperator()  + ' ' + this.genRandomNumber();
      }

      this.setState((state, props) => {
        const questions = state.currentQuestions;
        questions.push(newQuestion);

       return {
         currentQuestions: questions,
         answer: eval(state.currentQuestion[0]),
         counter: state.counter - 1,
         cardInputValue: '',
       }
      })
    } else {
      this.setState({
        cardInputValue: value,
      })
    }
  }

  genRandomNumber = () => {
    return Math.floor((Math.random() * 12) + 1);
  }

  genRandomOperator = () => {
    const randNum = Math.floor((Math.random() * 3));
    return ['+', '-', '*'][randNum]
  }

  handleCardKeyPress = (e) => {
    if (e.key === 'Enter') {
      console.log('event');
      console.log('do validate');
      this.setState((state, props) => {
        const positions = state.cardPositions;
        positions.forEach((postion, i) => {
          positions[i] = positions[i] - 180;
        })
      return {
        isMoving: true,
        cardPositions: positions,
      }});
    }
}

  render() {
    const cards = [];
    for (let i=0;i<10;i+=1) {
      cards.push(
        <MathCard
          flickCorrectlyAnsweredCard={this.flickCorrectlyAnsweredCard}
          cardInputValue={this.state.cardInputValue}
          currentQuestion={this.state.currentQuestion}
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
    cards.reverse();
    }
    return (
      <div className="App">
        <div id="viewport">
          <header className="App-header">
            <h1 className="App-title">Math Minute</h1>
            <Counter></Counter>
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
