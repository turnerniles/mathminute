import React, { Component } from "react";
import PropTypes from "prop-types";
import "./MathCard.scss";

export default class MathCard extends Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this[`${"textInput" + this.props.index}`] = React.createRef();
  }

  componentDidMount() {
    if (this.props.currentQuestionIndex === this.props.index) {
      this.focusTextInput(this.props.currentQuestionIndex);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentQuestionIndex === nextProps.index) {
      this.focusTextInput(nextProps.currentQuestionIndex);
    }
  }

  focusTextInput = index => {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this[`${"textInput" + index}`].current.focus();
  };

  masterOnInputChange = e => {
    this.props.onInputChange(e);
  };

  render() {
    const cardValueArray = this.props.cardValue.split(" ");
    const operatorClasses = cardValueArray[1] === '*' ? "math-question math-question-operator math-question-operator-multiply" : "math-question math-question-operator";
    return (
      <li
        className="math-card"
        style={{
          zIndex: this.props.currentQuestionIndex === this.props.index ? 2 : 1,
          transition: this.props.isMoving ? "ease .3s" : "initial"
        }}
      >
        <div className="math-question math-question-value-1">{cardValueArray[0]}</div>
        <div className={operatorClasses}>{cardValueArray[1]}</div>
        <div className="math-question math-question-value-2">{cardValueArray[2]}</div>
        <div className="input-container">
          <input
            type="tel"
            id={"math-card-input" + this.props.index}
            name={"math-card-input" + this.props.index}
            onChange={this.masterOnInputChange}
            value={
              this.props.currentQuestionIndex === this.props.index
                ? this.props.cardInputValue
                : ""
            }
            ref={this[`${"textInput" + this.props.index}`]}
            onKeyDown={this.props.handleKeyPress}
            onBlur={this.props.handleKeyPress}
          />
        </div>
      </li>
    );
  }
}

MathCard.propTypes = {
  autoFocus: PropTypes.bool
};
