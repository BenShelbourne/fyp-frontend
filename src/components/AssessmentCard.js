import React, {Component} from 'react';
import moment from "moment";
import CompleteAssignment from "./CompleteAssignment";
import axios from "axios";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class AssessmentCard extends Component{

    constructor(props) {
        super(props);
        this.state = {
            modules : [],
            coursework : [],
        };
        this.getCourseworkFromModules = this.getCourseworkFromModules.bind(this);
        this.getCourseworkFromId = this.getCourseworkFromId.bind(this);
        this.createTrackingTable = this.createTrackingTable.bind(this);
        this.convertTime = this.convertTime.bind(this);
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
    }

    getCourseworkFromId(id){
        const coursework = this.state.coursework;
        console.log("Finding coursework");
        for(let i = 0; i < coursework.length; i ++){
            if (coursework[i].coursework.lusiWorkId === id){
                console.log(coursework[i].coursework);
                return coursework[i].coursework;
            }
        }
    }

    createTrackingTable(tracking){
        return(
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Planned Time</TableCell>
                            <TableCell>Actual Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tracking.map(tracked => (
                            <TableRow key={tracked.id}>
                                <TableCell> {moment(tracked.plannedStart).format("MMM Do YY")} </TableCell>
                                <TableCell>{moment(tracked.plannedStart).format("h:mm") + " - " + moment(tracked.plannedEnd).format("h:mm")}</TableCell>
                                <TableCell>{this.convertTime(tracked.plannedTimeInSeconds)}</TableCell>
                                <TableCell>{this.convertTime(tracked.actualTimeInSeconds)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    convertTime(value) {
        if(value == null){
            return "0 hours 0 minutes"
        }
        let hours   = Math.floor(value / 3600);
        let minutes = Math.floor((value - (hours * 3600)) / 60);
        return hours+ " hours "+minutes + " minutes"; // Return is HH : MM : SS
    }

    render() {
        const DetailsRow = ({icon, title, summary}) => {
            const renderSummary = () => {
                if (summary) return (
                    <p style={{fontWeight: 300, lineHeight: 1.45}}>
                        {summary}
                    </p>
                );
                return null;
            };

            return (
                <div style={styles.detailsRow.row}>
			<span
                className={`icon ${icon}`}
                style={{...styles.detailsRow.icon, alignSelf: 'flex-start'}}
            />
                    <div style={{width: '80%'}}>
                        <h2 style={styles.detailsRow.title}>
                            {title}
                        </h2>
                        {renderSummary()}
                    </div>
                </div>
            );
        };


        const styles = {
            cardHeader: {
                display: 'flex',
                height: '125px',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 20px',
                color: '#b5121b',
                textAlign: 'right',
            },
            headerName: {
                margin: 0,
                fontWeight: 500,
                fontSize: '25px',
                textAlign: 'left'
            },
            headerTitle: {
                margin: '4px 0 0',
                fontWeight: 300,
                fontSize: '17px',
                opacity: 0.8,
                textAlign: 'right'
            },
            detailsRow: {
                row: {
                    width: '100%',
                    padding: '0 20px',
                    display: 'flex',
                    alignItems: 'center',
                    margin: '25px 0',
                    color: '#b5121b',
                },
                icon: {
                    display: 'block',
                    width: '25px',
                    height: '30px',
                    margin: '0 20px 0 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.8)',
                    textAlign: 'center',
                    fontSize: '22px',
                },
                title: {
                    fontWeight: 500,
                    fontSize: '20px',
                    margin: 0,
                    fontStyle: 'italic',
                    color: '#b5121b',
                },
            },
        };

        console.log(this.props);
        let coursework = this.getCourseworkFromId(this.props.match.params.id);
        if (typeof(coursework) == "undefined"){
            return <div>Rendering...</div>
        }
        return(
            <div style={{position: 'absolute', top: 0}} onClick={this.props.match.params.onClick}>
                <header style={styles.cardHeader} className='card-header-details'>
                    <div>
                        <h1 style={styles.headerName}>{coursework.name}</h1>
                    </div>
                </header>

                <div style={{color: '#fff'}}>
                    <DetailsRow
                        icon='ion-ios-location-outline'
                        title="Due"
                        summary={moment(coursework.dueDate).fromNow()}
                    />
                </div>
                <div>
                    <DetailsRow
                        title="Planned Time"
                        summary={this.convertTime(coursework.plannedTimeInSeconds)}
                    />
                </div>
                <div>
                    <DetailsRow
                        title="Actual Time"
                        summary={this.convertTime(coursework.actualTimeInSeconds)}
                    />
                </div>
                <br/>
                <CompleteAssignment assessmentName={coursework.name} lusiWorkId={this.props.match.params.id}/>
                <br/>
                {this.createTrackingTable(coursework.tracking)}
            </div>
        )
    }
}

export default AssessmentCard;