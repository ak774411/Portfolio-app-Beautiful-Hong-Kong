const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');


const favorite = require('../models/favoriteSchema');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) =>{
    favorite.findOne({user:req.user._id})
    .populate('dishes._id')
    .populate('user')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        console.log(dishes);
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    //console.log(req.body);
    favorite.findOne({user:req.user._id})
    .then((favorites)=>{
        if(favorites==null){
            favorite.create({user:req.user._id})
            .then((favorites)=>{
                for(let i of req.body){
                    favorites.dishes.push({_id:i._id});
                }
                //favorites.dishes.create(req.body);
                favorites.save()
                .then((favorites)=>{
                    favorite.findById(favorites._id)
                    .populate('user')
                    .populate('dishes._id')
                    .then((favorites)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(favorites);
                    })
            
                },(err)=>next(err))
        
            },(err)=>next(err))
        }
        else{
            //console.log(req.body);
            for(let i of req.body){
                favorites.dishes.push({_id:i._id});
            }
            //favorites.dishes.create(req.body);
            favorites.save()
            .then((favorites)=>{
                favorite.findById(favorites._id)
                    .populate('user')
                    .populate('dishes._id')
                    .then((favorites)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(favorites);
                    })
        
            },(err)=>next(err))
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    favorite.findOne({user:req.user._id})
    .then((favorites)=>{
        if(favorites !=null){
            for(var i = favorites.dishes.length-1;i>=0;i--){
                favorites.dishes.id(favorites.dishes[i]._id).remove();
            }
            favorites.save()
            .then((favorites)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(favorites.dishes);
            },(err)=>next(err));
        }
        else{
            let err = new Error("favorite not found");
            err.status = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
});

favoriteRouter.route('/:favoriteId')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,authenticate.verifyUser,(req,res,next) =>{
    favorite.findOne({user:req.user._id})
    .then((favorites)=>{
        if(!favorites){
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        return res.json({"exists":false,"favorites":favorites});
        }
        else{
            if(favorites.dishes.indexOf(req.params.dishId)<0){
                res.statusCode=200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists":false,"favorites":favorites});
        
            }
            else{
                res.statusCode=200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists":true,"favorites":favorites});
        
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    favorite.findOne({user:req.user._id})
    .then((favorites)=>{
        if(favorites==null){
            favorite.create({user:req.user._id})
            .then((favorites)=>{
                favorites.dishes.push({_id:req.params.favoriteId});
                favorites.save()
                .then((favorites)=>{
                    favorite.findById(favorites._id)
                    .populate('user')
                    .populate('dishes._id')
                    .then((favorites)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(favorites);
                    })
            
                },(err)=>next(err))
        
            },(err)=>next(err))
        }
        else{
            favorites.dishes.push({_id:req.params.favoriteId});
            favorites.save()
            .then((favorites)=>{
                favorite.findById(favorites._id)
                    .populate('user')
                    .populate('dishes._id')
                    .then((favorites)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(favorites);
                    })
        
            },(err)=>next(err))
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    favorite.findOne({user:req.user._id})
    .then((favorites)=>{
        if(favorites !=null && favorites.dishes.id(req.params.favoriteId)!=null){
            if(favorites !=null && favorites.dishes.id(req.params.favoriteId)!=null){
                favorites.dishes.id(req.params.favoriteId).remove();
                favorites.save()
                .then((favorites)=>{
                    favorite.findById(favorites._id)
                    .populate('user')
                    .populate('dishes._id')
                    .then((favorites)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(favorites);
                    })
                },(err)=>next(err));
            }else{
                let err = new Error("you can't modify it because you are not the creator");
                err.status = 404;
                return next(err);
            }
        }
        else{
            let err = new Error("favorites" + req.params.favoriteId+ "not found");
            err.status = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
});





module.exports = favoriteRouter;
