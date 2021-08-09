const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

var nodemailer = require('nodemailer');

var mailTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'yuenming54@gmail.com',
      pass: 'wittbncfhocouxxw',
    },
  });


const feedback = require('../models/feedback');

const feedbackRouter = express.Router();

feedbackRouter.use(bodyParser.json());

feedbackRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) =>{
    feedback.find(req.query)
    .then((feedbacks)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(feedbacks);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,(req,res,next)=>{
    feedback.create(req.body)
    .then((feedbacks)=>{
        console.log('Dish Created',feedbacks);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(feedbacks);
        mailTransport.sendMail(
            {
              from: 'michaelcheng <yuenming54@gmail.com>',
              to: 'michael <michael@chengyuenming.com>',
              subject: 'Hi :)',
              html: '<h1>Hello</h1><p>Nice to meet you.</p>',
            },
            function(err) {
              if (err) {
                console.log('Unable to send email: ' + err);
              }
            },
          );

    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end('Put operation not supported on /feedbacks');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    feedback.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

feedbackRouter.route('/:feedbackId')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) =>{
    feedback.findById(req.params.feedbackId)
    .then((feedbacks)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(feedbacks);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.end('Post operation not supported on /feedback/' + req.params.dishId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    feedback.findByIdAndUpdate(req.params.feedbackId,{
        $set:req.body
    },{new:true})   
    .then((feedbacks)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(feedbacks);
    },(err)=>next(err))
    .catch((err)=>next(err));

})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    feedback.findByIdAndRemove(req.params.feedbackId)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});




module.exports = feedbackRouter;
