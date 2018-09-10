import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './MathCard.css';

export default class MathCard extends Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this[`${'textInput'+this.props.index}`] = React.createRef();

    const question = this.genRandomNumber() + ' ' + this.genRandomOperator()  + ' ' + this.genRandomNumber()

    this.state = {
      currentQuestion: question,
      answer: eval(question),
    }
  }

  componentDidMount() {
    if(this.props.counter === this.props.index){
      this.focusTextInput(this.props.counter);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.counter === nextProps.index){
      this.focusTextInput(nextProps.counter);
    }
  }

  genRandomNumber = () => {
    return Math.floor((Math.random() * 12) + 1);
  }

  genRandomOperator = () => {
    const randNum = Math.floor((Math.random() * 3));
    return ['+', '-', '*'][randNum]
  }

  focusTextInput = (index) => {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    console.log(`focusing ${'textInput'+index}`)
    this[`${'textInput'+index}`].current.focus();
  }

  masterOnInputChange = (e) => {
    console.log('hey', e.keyCode)
    this.props.onInputChange(e)
  }

  blurred = (e) => {
    console.log('hey', e)
  }

  render() {
    console.log(this.props.leftPosition)
    return (
      <li className="math-card" style={{left: this.props.leftPosition, transition: this.props.isMoving ? 'ease 1s' : 'initial'}}>
        <div className="math-question">{this.props.currentQuestion}</div>
        <div className="input-container">
          <input
            id={"math-card-input"+this.props.index}
            name={"math-card-input"+this.props.index}
            type="text"
            onChange={this.masterOnInputChange}
            value={this.props.cardInputValue}
            ref={this[`${'textInput'+this.props.index}`]}
            onKeyPress={this.props.handleKeyPress}
            onBlur={this.blurred}
          />
        </div>
      </li>
    )
  }
}

MathCard.propTypes = {
  autoFocus: PropTypes.bool,
};
