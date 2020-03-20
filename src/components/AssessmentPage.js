import React, {Component} from "react";
import axios from 'axios';
import {Route, Switch} from 'react-router-dom';
import Container from "@material-ui/core/Container";
import AssessmentCard from "./AssessmentCard";
import KanbanCard from "./KanbanCard";
import moment from "moment";


class AssessmentPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modules: [],
            coursework: [],
            render: false
        };
        this.getCourseworkFromModules = this.getCourseworkFromModules.bind(this);
    }

    componentDidMount() {
        const self = this;
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
        let sortedCoursework = this.state.coursework.sort((a, b) => Date.parse(new Date(a.coursework.dueDate.split("/").reverse().join("-"))) - Date.parse(new Date(b.coursework.dueDate.split("/").reverse().join("-"))));
        console.log(sortedCoursework);
    }

    createAssessmentStack() {
        const styles = {
            kanbanCard: {
                backgroundColor: "#efefef",
                color: "#b5121b",
                border: 'black',
            },
        };
        return (
            <div>
                {this.state.coursework.map((coursework, i) =>
                    <li key={i.toString()} className="card-list">
                        <KanbanCard styles={styles.kanbanCard} title={coursework.coursework.name}
                                    description={moment(coursework.coursework.dueDate).fromNow()}
                                    lusiWorkId={coursework.coursework.lusiWorkId}/>
                    </li>
                )}
            </div>
        )
    }

    render() {
        const coursework = this.state.coursework;
        if (coursework.length < 1) {
            return <div/>
        }
        return (
            <div>
                <div>
                    <Container>{this.createAssessmentStack()}</Container>
                </div>
                <div>
                    <Switch>
                        <Route exact path={'/assessments/:id'} component={AssessmentCard}/>
                    </Switch>
                </div>
            </div>
        )
    }
}

export default AssessmentPage;