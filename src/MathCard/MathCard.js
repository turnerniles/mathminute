import React, { Component } from "react";
import PropTypes from "prop-types";
import "./MathCard.css";

export default class MathCard extends Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this[`${"textInput" + this.props.index}`] = React.createRef();
  }

  componentDidMount() {
    if (this.props.counter === this.props.index) {
      this.focusTextInput(this.props.counter);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.counter === nextProps.index) {
      this.focusTextInput(nextProps.counter);
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
    return (
      <li
        className="math-card"
        style={{
          left: this.props.leftPosition,
          transition: this.props.isMoving ? "ease .3s" : "initial"
        }}
      >
        <div className="math-question">{this.props.cardValue}</div>
        <div className="input-container">
          <input
            type="tel"
            id={"math-card-input" + this.props.index}
            name={"math-card-input" + this.props.index}
            onChange={this.masterOnInputChange}
            value={
              this.props.counter === this.props.index
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
