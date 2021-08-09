import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, FormGroup, Form, Input, Label,Col, Row  } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import {Loading} from './LoadingComponent';
import {baseUrl} from '../shared/BaseUrl';
import {FadeTransform, Fade, Stagger} from 'react-animation-components';


const required = (val) => val && val.length;
const maxLength = (len) =>(val) =>!(val) || (val.length <=len);
const minLength = (len) => (val) => val && (val.length >= len);
const isNumber = (val) =>!isNaN(Number(val));

class CommentForm extends Component{
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

    handleLogin(values){
        this.toggleModal();
        //this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
    }

    handleSubmit(values){
        console.log("Current State is:" + JSON.stringify(values));
        alert("Current State is:" + JSON.stringify(values));
        this.props.postComment(this.props.dishId, values.rating, values.yourname, values.comment);
    }

    render(){
        return(
        <>
        <Button outline onClick={this.toggleModal}>
            <span className="fa fa-sign-in fa-lg"></span> Comments
        </Button>
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
        )
    }

}



    function RenderDish({dish}) {

        if (dish != null) {
            return (
                <div className='col-12 col-md-5 m-1'>
                    <FadeTransform in 
                transformProps={{
                    exitTransform:'scale(0.5) translateY(-50%)'
                }}>
                        <Card>
                            <CardImg width="100%" src={baseUrl+dish.image} alt={dish.name} />
                            <CardBody>
                                <CardTitle> {dish.name}</CardTitle>
                                <CardText> {dish.description} </CardText>
                            </CardBody>
                        </Card>
                    </FadeTransform>
                </div>   
            );
        }
        else {
            return (
                <div></div>
            );
        }
    }

    function RenderComments({comments, postComment, dishId}) {
        if (comments == null) {
            return (<div></div>)
        }
        const cmnts = comments.map(comment => {
            return (
                <Fade in>
                    <li key={comment.id}>
                        <p>{comment.comment}</p>
                        <p>-- {comment.author},
                        &nbsp;
                        {new Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: '2-digit'
                        }).format(new Date(comment.date))}
                        </p>
                    </li>
                </Fade>
            )
        })
        return (
            <div className='col-12 col-md-5 m-1'>
                <h4> Comments </h4>
                <ul className='list-unstyled'>
                    <Stagger in>
                        {cmnts}
                    </Stagger>
                </ul>
                <CommentForm dishId={dishId} postComment={postComment} />
            </div>
        )
    }


    const DishDetail= (props)=>{
        const dish = props.dish

        console.log(dish);
        if(props.isLoading){
            return(
                <div className="container">
                    <div className="row">
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess){
            return(
                <div className="container">
                    <div className="row">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if (dish == null) {
            return (<div></div>);
        }

        const dishItem = <RenderDish dish={props.dish} />;
        const dishComment = <RenderComments comments={props.comments} postComment={props.postComment} dishId={props.dish.id}/>

        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>                
                </div>
                <div className="row">
                    {dishItem}
                    {dishComment}
                </div>
            </div>
        );
    }



export default DishDetail;