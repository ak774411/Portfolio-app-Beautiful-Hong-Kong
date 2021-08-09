const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/').all((req,res,next) =>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) =>{
    res.end('Will send all the dished to you');
})
.post((req,res,next)=>{
    res.end('Will add the dish: ' + req.body.name + 'with details: '+req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('Put operation not supported on /dishes');
})
.delete((req,res,next)=>{
    res.end('deleting all the dishes!');
});

dishRouter.route('/:dishId').all((req,res,next) =>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) =>{
    res.end('Will send you the detail of the dish: '+ req.params.dishId + 'to you!');
})
.post((req,res,next)=>{
    res.end('Post operation not supported on /dishes/' + req.params.dishId);
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('Will update the dish: '+req.body.name + ' with details: ' + req.body.description);
})
.delete((req,res,next)=>{
    res.end('deleting dish: ' + req.params.dishId);
});

module.exports = dishRouter;
