var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
var router = express.Router();
const cors = require('./cors');


router.use(bodyParser.json());

/* GET users listing. */
router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); } )
router.get('/',cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next)=>{
  //res.send('respond with a resource');
  User.find({})
    .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    }, (err) => next(err))
    .catch((err) => next(err));
});

/*router.post('/signup', (req,res,next)=>{
  User.findOne({username:req.body.username})
  .then((user)=>{
    if(user !=null){
      var err = new Error('User' + req.body.username+'already signed up');
      err.status=403;
      next(err);
    }
    else{
      return User.create({
        username:req.body.username,
        password:req.body.password
      });
    }
  }).then((user)=>{
    res.statusCode=200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registration Successful', user:user})
  },(err)=>next(err))
  .catch((err)=>next(err));
});

router.post('/login', (req,res,next)=>{
  if(!req.session.user){
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        next(err);
        return;
    }

    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];
    User.findOne({username: username})
    .then((user)=>{
      if(user===null){
        var err = new Error('User '+username+ 'doesnot exist');
        err.status = 401;
        next(err);
      }
      else if(user.password !== password){
        var err = new Error('password '+password+ 'doesnot exist');
        err.status = 401;
        next(err);
      }
      else if (user.username == username && user.password == password) {
        //res.cookie('user', 'admin', {signed:true})
        req.session.user='authenticated';
        res.statusCode=200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!');
      }
    })
    .catch((err)=>next(err));
  }
  else{
    res.statusCode=200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are authenticated!');
  }
})

router.get('/logout', (req,res)=>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/')
  }
  else{
        var err = new Error('you doesnt log in');
        err.status = 403;
        next(err);
  }
})*/

router.post('/signup',cors.corsWithOptions, (req, res, next) => {
  User.register(new User({username: req.body.username}),req.body.password, (err, user)=>{
    if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err:err});
    }
    else {
            if(req.body.firstname){
                user.firstname = req.body.firstname;
              }   
            if(req.body.lastname){
                user.lastname = req.body.lastname;
              }
            user.save((err, user)=>{
                if(err){
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({err:err});
                }
                passport.authenticate('local')(req, res, ()=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success:true, status: 'Registration Successful!'});
            });               
        });
    }
  });
  
});

router.post('/login', cors.corsWithOptions, (req, res, next) => {

  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: 'Login Unsuccessful!', err: info});
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});          
      }

      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Login Successful!', token: token});
    }); 
  }) (req, res, next);
});

router.get('/logout',cors.corsWithOptions, (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});

router.get('/checkJWTtoken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err)
      return next(err);
    
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid!', success: false, err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user});

    }
  }) (req, res);
});

module.exports = router;
