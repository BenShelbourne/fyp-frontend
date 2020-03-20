import React, {Component} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import Popup from "reactjs-popup";
import Stopwatch from "./Stopwatch";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

class MyCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cal_events: [],
            modules: [],
            today: new Date(),
            coursework: [],
            open: false,
            stopwatchOpen: false,
            start: 0,
            end: 0,
            title: "",
            switch: false,
        };

        this.getCourseworkFromModules = this.getCourseworkFromModules.bind(this);
        this.changeDateForCalendar = this.changeDateForCalendar.bind(this);
        this.openPopup = this.openPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.getLusiWorkIdFromTitle = this.getLusiWorkIdFromTitle.bind(this);
        this.setCalEvents = this.setCalEvents.bind(this);
    }

    componentDidMount() {
        const self = this;
        axios.get("http://localhost:8080/calendar")
            .then(function (response) {
                console.log(response.data);
                self.setCalEvents(response.data);
                self.forceUpdate()
            });

        axios.get("http://localhost:8080/courses")
            .then(function (response) {
                self.setState({
                    modules: response.data
                });
                console.log(self.state.modules);
                self.getCourseworkFromModules();
                self.forceUpdate()
            });
    }

    setCalEvents(response){
        console.log(response);
        for (let i = 0; i < response.length; i++) {
            const id = response[i].id;
            const title = response[i].title;
            const start = this.changeDateForCalendar(response[i].start);
            const end = this.changeDateForCalendar(response[i].end);
            const eventType = response[i].eventType;

            this.state.cal_events.push({id: id, title: title, start: start, end: end, eventType: eventType});
        }
        console.log(this.state.cal_events);
    }

    changeDateForCalendar(date){
        return new Date(date);
    }

    getCourseworkFromModules() {
        const modules = this.state.modules;
        for (let i = 0; i < modules.length; i++) {
            for (let j = 0; j < modules[i].coursework.length; j++) {
                if (modules[i].coursework[j].isSubmittedMoodle) {
                    continue
                }
                this.state.coursework.push({module: modules[i], coursework: modules[i].coursework[j]})
            }
        }
        console.log(this.state.coursework);
    }

    openPopup(){
        this.setState({
            open: true
        })
    }

    closeStopwatch(){
        this.setState({
            stopwatchOpen: false,
        })
    }

    closePopup(){
        this.setState({
            open: false,
        });
    }

    getEventColour(event){
        const type = event.eventType;

        switch (type) {
            case "COURSEWORK_TRACKING":
                return {style: {
                        backgroundColor: "#b5121b",
                    }};
            case "LECTURE":
                return {style: {
                        backgroundColor:  "#4b7d94",
                    }};
            default:
                return {style: {
                        backgroundColor:  "#68795c",
                    }};
        }

    }

    getLusiWorkIdFromTitle(title){
        const coursework = this.state.coursework;
        for(let i = 0; i < coursework.length; i ++){
            if (coursework[i].coursework.name === title){
                return coursework[i].coursework.lusiWorkId;
            }
        }

    }

    handleSelect = ({start, end}) => {
        this.openPopup();
        this.setState({
            start: start,
            end: end
        })
    };

    handleOptionSelected = (event) =>{
        let start = this.state.start;
        let end = this.state.end;
        const title = event.target.value;
        if(title){
            this.setState({
                cal_events: [
                    ...this.state.cal_events,
                    {
                        start,
                        end,
                        title,
                    },
                ],
            })
        }
        start = new Date(this.state.start).toISOString().slice(0,19);
        end = new Date(this.state.end).toISOString().slice(0,19);
        const lusiWorkId = this.getLusiWorkIdFromTitle(title);
        const self = this;
        const data = {
            title: title,
            start: start,
            end: end,
            eventStatus: "TODO",
            eventType: "COURSEWORK_TRACKING",
            lusiWorkId: lusiWorkId
        };
        console.log(data);
        axios.post("http://localhost:8080/calendar", data)
            .then(function (response){
                console.log(response);
                self.setState({
                    switch: true,
                });
                window.location.reload();
            })
            .catch(error => console.log(error));
        this.closePopup();
    };

    handleStopwatch = (event) =>{
        this.setState({
            stopwatchOpen: true,
            title: event.title,
            eventId: event.id,
        });
    };

    render() {
        const {cal_events} = this.state;
        return (
            <div style={{height: "100%", backgroundColor: '#efefef'}}>
                <Calendar
                    selectable
                    localizer={localizer}
                    min={new Date(this.state.today.getFullYear(), this.state.today.getMonth(), this.state.today.getDate(),8)}
                    max={new Date(this.state.today.getFullYear(), this.state.today.getMonth(), this.state.today.getDate(),22)}
                    events={cal_events}
                    defaultView='day'
                    views={['day']}
                    style={{backgroundColor: '#efefef'}}
                    defaultDate={new Date()}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectEvent={event => this.handleStopwatch(event)}
                    onSelectSlot={this.handleSelect}
                    eventPropGetter={event => this.getEventColour(event)}
                />

                <Popup open={this.state.open} closeOnDocumentClick onClose={this.closePopup}>
                    <div>
                        <ul>
                            {this.state.coursework.map((assessment, index) => (
                                <li id={index} key={index} className="card-list"><button type="button" value={assessment.coursework.name} onClick={e => this.handleOptionSelected(e)}>{assessment.coursework.name}</button></li>
                            ))}
                        </ul>
                    </div>
                </Popup>

                <Popup open={this.state.stopwatchOpen}>
                    <div>
                        <Stopwatch assessmentName={this.state.title} assessmentProgressId={this.state.eventId} closeTimer={this.closeStopwatch.bind(this)}/>
                    </div>
                </Popup>
            </div>
        )
    }
}

export default MyCalendar