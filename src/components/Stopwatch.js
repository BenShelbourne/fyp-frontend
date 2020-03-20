import React, {Component} from "react";
import "../styles/App.css";
import axios from "axios";

class Stopwatch extends Component {
    state = {
        timerOn: false,
        timerStart: 0,
        timerTime: 0,
    };

    startTimer = (event) => {
        event.stopPropagation();
        console.log(this.props.assessmentProgressId);
        this.setState({
            timerOn: true,
            timerTime: this.state.timerTime,
            timerStart: Date.now() - this.state.timerTime,
        });
        this.timer = setInterval(() => {
            this.setState({
                timerTime: Date.now() - this.state.timerStart
            });
        }, 10);

        axios.post("http://localhost:8080/assessment/" + this.props.assessmentProgressId + "/start")
            .then(r => {
                console.log(r.data)
            })
            .catch(error => {
                console.log(error)
            })
    };

    stopTimer = (event) => {
        event.stopPropagation();
        const self = this;
        axios.put("http://localhost:8080/assessment/" + this.props.assessmentProgressId + "/complete")
            .then(function (response) {
                console.log(response.data);
                clearInterval(this.timer);
                self.props.closeTimer();
                window.location.reload();
            })
            .catch(error => {
                console.log(error)
            });
    };


    render() {
        const {timerTime} = this.state;
        let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
        let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
        let hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);

        return (
            <div className="Stopwatch">
                <div className="Stopwatch-header">{this.props.assessmentName}</div>
                <div className="Stopwatch-display">
                    {hours} : {minutes} : {seconds}
                </div>

                {this.state.timerOn === false && this.state.timerTime === 0 && (
                    <button onClick={this.startTimer}>Start</button>
                )}
                {this.state.timerOn === true && (
                    <button onClick={this.stopTimer}>Stop</button>
                )}
                {this.state.timerOn === false && this.state.timerTime > 0 && (
                    <button onClick={this.startTimer}>Resume</button>
                )}
            </div>
        );
    }
}

export default Stopwatch;