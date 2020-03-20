import React, {Component} from "react";
import Carousel from 'react-bootstrap/Carousel'
import KanbanCard from "./KanbanCard";
import axios from "axios";
import Container from "@material-ui/core/Container";

class CarouselKanban extends Component{
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
        this.getCourseworkFromModules = this.getCourseworkFromModules.bind(this);
        this.getToDoKanbanCards = this.getToDoKanbanCards.bind(this);
        this.getWipKanbanCards = this.getWipKanbanCards.bind(this);
        this.getCompleteKanbanCards = this.getCompleteKanbanCards.bind(this);

        this.state = {
            index: 1,
            direction: null,
            toDo: {
                assessments: [],
            },
            wip: {
                assessments: [],
            },
            complete: {
                assessments: [],
            },

        };
    }

    handleSelect(selectedIndex, e) {
        this.setState({
            index: selectedIndex,
            direction: e.direction,
        });
    }

    componentDidMount() {
        const self = this;
        //http://localhost:8080/courses
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
                    this.state.complete.assessments.push({id: modules[i].coursework[j].lusiWorkId, title: modules[i].name,
                        description:modules[i].coursework[j].name})
                }
                else if (modules[i].coursework[j].status === "TODO") {
                    this.state.toDo.assessments.push({id: modules[i].coursework[j].lusiWorkId, title: modules[i].name,
                        description:modules[i].coursework[j].name})
                }
                else if (modules[i].coursework[j].status === "IN_PROGRESS") {
                    this.state.wip.assessments.push({id: modules[i].coursework[j].lusiWorkId, title: modules[i].name,
                        description:modules[i].coursework[j].name})
                }
            }
        }
    }

    getToDoKanbanCards(styles){
        if (this.state.toDo.assessments && this.state.toDo.assessments.length > 0){
            console.log(this.state.toDo.assessments[0]);
            return (
                this.state.toDo.assessments.map((coursework, i)=>
                    <li key={i.toString()} className="card-list">
                        <KanbanCard styles={styles} title={coursework.title} description={coursework.description} lusiWorkId={coursework.id}/>
                    </li>
                )
            )
        } else {
            return <KanbanCard styles={styles} title="You have nothing to do!"/>
        }
    }

    getWipKanbanCards(styles){
        if (this.state.wip.assessments && this.state.wip.assessments.length > 0){
            return (
                this.state.wip.assessments.map((coursework, i)=>
                    <li key={i.toString()} className="card-list">
                        <KanbanCard styles={styles} title={coursework.title} description={coursework.description} lusiWorkId={coursework.id}/>
                    </li>
                )
            )
        } else {
            return <KanbanCard styles={styles} title="You have nothing in progress"/>
        }
    }

    getCompleteKanbanCards(styles){
        if (this.state.complete.assessments && this.state.complete.assessments.length > 0){
            return (
                this.state.complete.assessments.map((coursework, i)=>
                    <li key={i.toString()} className="card-list">
                        <KanbanCard styles={styles} title={coursework.title} description={coursework.description} lusiWorkId={coursework.id}/>
                    </li>
                )
            )
        } else {
            return <KanbanCard styles={styles} title="You haven't completed anything yet"/>
        }
    }


    render() {
        const { index, direction } = this.state;

        const styles = {
          kanbanCard: {
              backgroundColor: "#efefef",
              color: "#b5121b",
              border: 'black',
          },
          kanbanHeader: {
              background: "#b5121b",
              color:  "#efefef",
              textAlign: "center",
              fontSize: "25px",
          }
        };
        return (
            <Carousel
                activeIndex={index}
                direction={direction}
                onSelect={this.handleSelect}
                interval={null}
                wrap={false}
            >
                <Carousel.Item>
                    <Container maxWidth="sm" style={{height: '80%'}}>
                        <KanbanCard styles={styles.kanbanHeader} title="To Do"/>
                        {this.getToDoKanbanCards(styles.kanbanCard)}
                    </Container>
                </Carousel.Item>
                <Carousel.Item>
                    <Container maxWidth="sm" style={{height: '80%'}}>
                        <KanbanCard styles={styles.kanbanHeader} title="In Progress"/>
                        {this.getWipKanbanCards(styles.kanbanCard)}
                    </Container>
                </Carousel.Item>
                <Carousel.Item>
                    <Container maxWidth="sm" style={{height: '80%'}}>
                        <KanbanCard styles={styles.kanbanHeader} title="Complete"/>
                        {this.getCompleteKanbanCards(styles.kanbanCard)}
                    </Container>
                </Carousel.Item>
            </Carousel>
        );
    }
}
export default CarouselKanban;