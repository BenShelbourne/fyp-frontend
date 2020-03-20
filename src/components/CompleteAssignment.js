import React, {Component} from 'react';
import Modal from "react-awesome-modal";
import axios from "axios";

class CompleteAssignment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
        this.completeDialog = this.completeDialog.bind(this);
        this.completeTask = this.completeTask.bind(this);
        this.returnToPage = this.returnToPage.bind(this);
    }

    completeDialog() {
        this.setState({
            visible: true
        })
    }

    completeTask() {
        this.setState({
            visible: false
        });
        axios.put("http://localhost:8080/assessment/" + this.props.lusiWorkId + "/completed")
            .then(function (response) {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error)
            });
    }

    returnToPage() {
        this.setState({
            visible: false
        })
    }

    render() {
        return (
            <div>
                <Modal visible={this.state.visible} width="400" height="300" effect="fadeInUp">
                    <div>
                        <h1>Are you sure you want to complete {this.props.assessmentName}?</h1>
                        <button onClick={this.completeTask}>Yes!</button>
                        <button onClick={this.returnToPage}>Not yet</button>
                    </div>
                </Modal>

                <button onClick={this.completeDialog}> Complete</button>

            </div>
        )
    }
}

export default CompleteAssignment;