const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');



const Promotion = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) =>{
    Promotion.find(req.query)
    .then((Promotions)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(Promotions);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotion.create(req.body)
    .then((Promotions)=>{
        console.log('Dish Created',Promotions);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(Promotions);

    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end('Put operation not supported on /Promotions');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotion.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

promoRouter.route('/:promoId')
.get(cors.cors,(req,res,next) =>{
    Promotion.findById(req.params.promoId)
    .then((Promotions)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(Promotions);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.end('Post operation not supported on /promo/' + req.params.dishId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotion.findByIdAndUpdate(req.params.promoId,{
        $set:req.body
    },{new:true})   
    .then((Promotions)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(Promotions);
    },(err)=>next(err))
    .catch((err)=>next(err));

})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotion.findByIdAndRemove(req.params.promoId)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});




module.exports = promoRouter;
