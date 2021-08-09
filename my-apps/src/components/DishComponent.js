import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, FormGroup, Form, Input, Label,Col, Row  } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import {baseUrl} from '../shared/BaseUrl';


const required = (val) => val && val.length;
const maxLength = (len) =>(val) =>!(val) || (val.length <=len);
const minLength = (len) => (val) => val && (val.length >= len);
const isNumber = (val) =>!isNaN(Number(val));

class DishDetail extends Component {

    constructor(props){
        super(props);

        this.state = {
            selectedDish: this.props.dish,
            isNavOpen: false,
            isModalOpen:false
        }
        this.toggleModal = this.toggleModal.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);



    }

    toggleModal() {
        this.setState({
          isModalOpen: !this.state.isModalOpen
        });
      }

    handleLogin(event){
        this.toggleModal();
        alert("Rating:" + this.rating.value + "Your name :" + this.username.value + " Password: " +this.password.value+" Remember: " + this.remember.checked);
        event.preventDefault();
    }

    handleSubmit(values){
        console.log("Current State is:" + JSON.stringify(values));
        alert("Current State is:" + JSON.stringify(values));
    }


    render(){
        //console.log(this.props.dish.name);
        if (this.props.dish == null) {
            return (<div></div>);
        }

        const comments = this.props.comments.map((comment)=>{
            return (
                <div>
                    <p>{comment.comment}</p>
                    <p>-- {comment.author} , {new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit'
                    }).format(new Date(comment.date))}</p>
                </div>
            );
        });

        

        return(
            <>
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{this.props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{this.props.dish.name}</h3>
                        <hr />
                    </div>                
                </div>
                <div className='row'>
                    <div className="col-12 col-md-5 m-1">
                        <Card>
                            <CardImg width="100%" src={baseUrl+this.props.dish.image} alt={this.props.dish.name} />
                            <CardBody>
                                <CardTitle>{this.props.dish.name}</CardTitle>
                                <CardText>{this.props.dish.description}</CardText>
                            </CardBody>
                        </Card>
                    </div>
                    <div className="col-12 col-md-5 m-1">
                        <h1>Comments</h1>
                        {comments}
                        <Button outline onClick={this.toggleModal}>
                        <span className="fa fa-sign-in fa-lg"></span> Login
                        </Button>
                        
                    </div>
                </div>
            </div>
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                <ModalBody>
                <LocalForm onSubmit={(values)=>this.handleSubmit(values)}>
                            <Row className="form-group" >
                                <Col>
                                    <Label htmlFor=".rating">Rating</Label>
                                        <Control.select model=".rating" name="rating" className="form-control">
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                            <option>6</option>
                                            <option>7</option>
                                            <option>8</option>
                                            <option>9</option>
                                            <option>10</option>
                                        </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group" >
                                <Col>
                                <Label htmlFor=".yourname">First Name</Label>
                                    <Control.text model=".yourname" id="yourname" name="yourname"
                                            placeholder="First Name"
                                            className="form-control"
                                            validators={{
                                                required, minLength: minLength(3), maxLength: maxLength(15)
                                            }}
                                            />
                                        <Errors
                                            className="text-danger"
                                            model=".yourname"
                                            show="touched"
                                            messages={{
                                                required: 'Required ',
                                                minLength: 'Must be greater than 2 characters',
                                                maxLength: 'Must be 15 characters or less'
                                            }}
                                        />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Label htmlFor="comment">Comments</Label>
                                        <Control.textarea model=".comment" id="comment" name="comment" rows="12" className="form-control"/>
                                </Col>
                            </Row>

                            <Row className="form-group">
                                <Col>
                                    <Button type="submit" color="primary">
                                        Submit
                                    </Button>
                                </Col>
                                </Row>
                        </LocalForm>
                </ModalBody>
            </Modal>
            </>
            
            
        );
    }
}

export default DishDetail;