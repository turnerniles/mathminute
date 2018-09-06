import React, { Component } from 'react';
import './App.css';
import MathCard from './MathCard/MathCard.js';
import Counter from './Counter/Counter.js';

class App extends Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    let currentQuestion = this.genRandomNumber() + ' ' + this.genRandomOperator()  + ' ' + this.genRandomNumber()
    while(eval(currentQuestion) < 0) {
      currentQuestion = this.genRandomNumber() + ' ' + this.genRandomOperator()  + ' ' + this.genRandomNumber();
    }

    this.state = {
      currentQuestion: currentQuestion,
      answer: eval(currentQuestion),
      counter: 1,
      cards: [],
      cardInputValue: '',
    }
  }
  componentDidMount() {
    var cards = [];
    document.querySelectorAll('.stack li').forEach((targetElement) => {
      cards.push(targetElement)
      targetElement.classList.add('in-deck');
    })

    this.setState({
      cards,
      counter: cards.length - 1,
    })
  }
  onInputChange = (e) => {
    const target = e.target;
    const value = target.value;

    if(value == this.state.answer){

      let currentQuestion = this.genRandomNumber() + ' ' + this.genRandomOperator()  + ' ' + this.genRandomNumber()
      while(eval(currentQuestion) < 0) {
        currentQuestion = this.genRandomNumber() + ' ' + this.genRandomOperator()  + ' ' + this.genRandomNumber();
      }

      this.setState((state, props) => {
       return {
         currentQuestion: currentQuestion,
         answer: eval(currentQuestion),
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

  flickCorrectlyAnsweredCard = () => {
    this.setState((state, props) => {
     return {
       counter: state.counter - 1,
     }
    })
  }

  render() {
    const cards = [];
    for (let i=0;i<10;i+=1){
      cards.push(
        <MathCard
          flickCorrectlyAnsweredCard={this.flickCorrectlyAnsweredCard}
          cardInputValue={this.state.cardInputValue}
          currentQuestion={this.state.currentQuestion}
          onInputChange={this.onInputChange}
          index={i}
          counter={this.state.counter}
          key={i}
        >
        </MathCard>
      )
    }
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Math Minute</h1>
        </header>
        <div id="viewport">
          <Counter></Counter>
            <ul className="stack">
              {cards}
            </ul>
        </div>
      </div>
    );
  }
}

export default App;
