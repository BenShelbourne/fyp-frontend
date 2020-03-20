import React from 'react';
import {Route, Switch} from 'react-router-dom';
import AssessmentPage from "./AssessmentPage";
import MyCalendar from "./Calendar";
import CarouselKanban from "./CarouselKanban";
import AssessmentCard from "./AssessmentCard";

const Routers = () => (
    <div>
        <Switch>
            <Route path='/assessments' component={AssessmentPage} exact={true}/>
            <Route path='/assessments/:id' component={AssessmentCard} exact={true}/>
            <Route path='/progress' component={CarouselKanban} exact={true}/>
            <Route path='/calendar' component={MyCalendar} exact={true}/>
        </Switch>
    </div>
);

export default Routers;