var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser()); //process params from form posts

var session = require('express-session');
app.use(session({ secret: 'app', cookie: { maxAge: 60000 }}));
var verifyUser = function(req, res, next) {
  if(req.session.loggedIn) {
    next();
  } else {
    //res.send("show login form");
    res.render("login", {title: "Please log in."});
  }
}

var verifyUser = function(req, res, next) {
  if(req.session.loggedIn) {
    next();
  } else {
    var username = "admin", password = "admin";
    if(req.body.username === username && req.body.password === password) {
      req.session.loggedIn = true;
      res.redirect('/');
    } else {
      res.render("login", {title: "Please log in."});
    }
  }
}

// in app.js
var logout = function(req, res, next) {
  req.session.loggedIn = false;
  res.redirect('/');
}
app.all('/logout', logout);

app.use('/', verifyUser, routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
