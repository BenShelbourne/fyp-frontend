import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import TodayIcon from '@material-ui/icons/Today';

const styles = {
    root: {
        position: 'fixed',
        background: '#b5121b',
        bottom: 0,
        width: '100%',
        cursor: 'pointer'
    },
    wrapper: {
        minWidth: '0px',
        background: '#efefef',
        color: '#b5121b'
    }
};

class Tab extends Component {
    state = { value: 0 };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { classes } = this.props;
        const { value } = this.state;

        return (
            <div>
                <BottomNavigation value={value} onChange={this.handleChange} className={classes.root}>
                    <Link to="/assessments">
                        <BottomNavigationAction label="Assignments" value="home" showLabel={true} className={classes.wrapper} icon={<SpeakerNotesIcon/>}/>
                    </Link>
                    <Link to="/progress">
                        <BottomNavigationAction label="Progress" value="board" showLabel={true} className={classes.wrapper} icon={<CheckBoxIcon/>}/>
                    </Link>
                    <Link to="/calendar">
                        <BottomNavigationAction label="Day Planner" value="cal" showLabel={true} className={classes.wrapper} icon={<TodayIcon/>}/>
                    </Link>
                </BottomNavigation>
            </div>
        );
    }
}

export default withStyles(styles)(Tab);