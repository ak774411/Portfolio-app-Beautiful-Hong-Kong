const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/').all((req,res,next) =>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) =>{
    res.end('Will send all the leaders to you');
})
.post((req,res,next)=>{
    res.end('Will add the leaders: ' + req.body.name + 'with details: '+req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('Put operation not supported on /leaders');
})
.delete((req,res,next)=>{
    res.end('deleting all the leaders!');
});

leaderRouter.route('/:promoId').all((req,res,next) =>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) =>{
    res.end('Will send you the detail of the promotions: '+ req.params.promoId + 'to you!');
})
.post((req,res,next)=>{
    res.end('Post operation not supported on /leaders/' + req.params.promoId);
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('Will update the promotions: '+req.body.name + ' with details: ' + req.body.description);
})
.delete((req,res,next)=>{
    res.end('deleting promotions: ' + req.params.promoId);
});

module.exports = leaderRouter;
