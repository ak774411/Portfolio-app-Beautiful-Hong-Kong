import React from 'react';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, CardHeader, Media } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { Fade, Stagger } from 'react-animation-components';

function RenderLeader({leader}) {
    return(
        <Media tag="li">
            <Media left middle>
                <Media object src={baseUrl + leader.image} alt={leader.name} />
            </Media>
            <Media body className="ml-5">
                <Media heading>{leader.name}</Media>
                <p>{leader.designation}</p>
                <p>{leader.description}</p>
            </Media>
        </Media>
    );

}

function LeaderList(props) {

    const leaders = props.leaders.leaders.map((leader) => {
        return (
            <Fade in key={leader._id}>
                <div className="col-12 mt-2">
                        <RenderLeader leader={leader} />
                </div>
            </Fade>
        );
    });

    if (props.leaders.isLoading) {
        return(
                <Loading />
        );
    }
    else if (props.leaders.errMess) {
        return(
            <div className="col-12"> 
                <h4>{props.leaders.errMess}</h4>
            </div>
        );
    }
    else {
        return (
            <Media list>
                <Stagger in>
                    {leaders}
                </Stagger>
            </Media>
        );
    }
}

function About(props) {

    return(
        <div className="container">
            <div className="row">
                <Breadcrumb>
                    <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                    <BreadcrumbItem active>About Us</BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>About Me</h3>
                    <hr />
                </div>                
            </div>
            <div className="row row-content">
                <div className="col-12 col-md-6">
                    <h2>My History</h2>
                    <p>Hi, I’m Micahel and i am Full Stack Web Developer. It's been 2 years, I’m working as web developer.I have developed website in gobybus.hk and also fond of hiking, I am going to build a website providing hiking information for any hiking enthusiasts by using react js and node js. </p>
                    <p>The restaurant traces its humble beginnings to <em>The Frying Pan</em>, a successful chain started by our CEO, Mr. Peter Pan, that featured for the first time the world's best cuisines in a pan.</p>
                </div>
                <div className="col-12 col-md-5">
                    <Card>
                        <CardHeader className="bg-primary text-white">Facts At a Glance</CardHeader>
                        <CardBody>
                            <dl className="row p-1">
                                <dt className="col-6">Started</dt>
                                <dd className="col-6">3 June. 2021</dd>
                                <dt className="col-6">Creater</dt>
                                <dd className="col-6">Cheng Yuen Ming</dd>
                                <dt className="col-6">Last Year's Turnover</dt>
                                <dd className="col-6">0</dd>
                                <dt className="col-6">Employees</dt>
                                <dd className="col-6">1</dd>
                            </dl>
                        </CardBody>
                    </Card>
                </div>
                <div className="col-12">
                    <Card>
                        <CardBody className="bg-faded">
                            <blockquote className="blockquote">
                                <p className="mb-0">There are plateus, but you must not stay there, you must go beyond them. If it kills you, it kills you. A man must constantly exceed his level.</p>
                                <footer className="blockquote-footer">Bruce Lee,
                                <cite title="Source Title">Speech of Bruce Lee</cite>
                                </footer>
                            </blockquote>
                        </CardBody>
                    </Card>
                </div>
            </div>
            <div className="row row-content">
                <div className="col-12">
                    <h2>Corporate Leadership</h2>
                </div>
                <LeaderList leaders={props.leaders} />
            </div>
        </div>
    );
}

export default About;    