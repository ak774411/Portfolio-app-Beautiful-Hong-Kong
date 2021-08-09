var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore =require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');
var favouriteRouter = require('./routes/favoriteRouter');
var uploadRouter = require('./routes/uploadRouter');
var commentRouter = require('./routes/commentRouter');
var feedbackRouter = require('./routes/feedbackRouter');


const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

//const url = 'mongodb://localhost:27017/conFusion';
const url = 'mongodb+srv://michael:ak887976@cluster0.ncs6u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const connect = mongoose.connect(url, {autoIndex: false});

connect.then((db)=>{
  console.log('connected to the server ');
}, (err)=>{console.log(err);});

var app = express();

/*app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));

/*app.use(session({
  name:'session-id',
  secret:'12345-67890-09876-54321',
  saveUninitialized:false,
  resave:false,
  store:new FileStore()
}));*/

app.use(passport.initialize());
//app.use(passport.session());
__dirname = path.resolve();
if(process.env.NODE_ENV=='production'){
  app.use(express.static(path.join(__dirname,'/client/build')));

  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'));
  })
}
app.use('/users', usersRouter);
/*function auth (req, res, next) {

if(!req.user) {
    var err = news Error('You are not authenticated!');
    err.status = 403;
    return next(err);
}
else {
    next();
}
}*/

//app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes' , dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);
app.use('/favorites', favouriteRouter);
app.use('/imageUpload',uploadRouter);
app.use('/comments',commentRouter);
app.use('/feedback',feedbackRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
