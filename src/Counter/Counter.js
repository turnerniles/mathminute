import React, { Component } from "react";
import "./Counter.css";
import Timer from "./timer.js";

export default class Counter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialTimerSet: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.serverTimeSeconds && !this.state.initialTimerSet) {
      console.log(
        "got the offset",
        nextProps.serverTimeSeconds,
        typeof nextProps.serverTimeSeconds
      );

      var timer = new Timer(
        1000 * nextProps.serverTimeSeconds,
        document.getElementById("countdown")
      );
      timer.start();
      this.setState({ initialTimerSet: true });

      setTimeout(() => {
        console.log("calling");
        timer.reset();
        timer.setDuration(60000);
        timer.start();
        setInterval(() => {
          console.log("boo");
          timer.reset();
          timer.setDuration(60000);
          timer.start();
        }, 60000);
      }, 1000 * nextProps.serverTimeSeconds);
    }
  }

  render() {
    return (
      <div className="container">
        <div className="countdown" id="countdown">
          <div className="countdown__fill" id="ticker" />
          <div className="countdown__digit" id="seconds">
            00
          </div>
        </div>
      </div>
    );
  }
}
