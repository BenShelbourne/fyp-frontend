import React, {Component}from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Link } from 'react-router-dom';

class KanbanCard extends Component{

    render() {
        if (this.props.description == null){
            return (
                <Card style={this.props.styles}>
                    <CardContent>
                        <div>
                            {this.props.title}
                        </div>
                    </CardContent>
                </Card>
            )
        } else {
            return (
                <Link to={"/assessments/" + this.props.lusiWorkId}>
                    <Card style={this.props.styles}>
                        <CardContent>
                            <div>
                                {this.props.title}
                            </div>
                            <div>
                                {this.props.description}
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            )
        }
    }
}
export default KanbanCard;