var express = require('express');
var path = require('path');
var passport = require('passport');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var hbs = require('hbs');
var mongoose = require('mongoose');
var lusca = require('lusca');
var expressValidator = require('express-validator');
var flash = require('express-flash');
var multer = require('multer');

var passportConfig = require('./config/passport');
//route controller
var routes = require('./routes/index');
var users = require('./routes/users');
var diary = require('./routes/diary');

//another config
var secret = require('./config/secret');

var app = express();

//database connect
mongoose.connect(secret.mongo);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

app.use(multer({dest: './public/uploads/',
  rename: function(filedname, filename) {
    return filename+Date.now();
  },
  onFileUploadStart: function(file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function(file) {
    console.log("finish" + file.path);
    done = true;
  }
}));

app.set('port', process.env.PORT || 3000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'bingo the cat'
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(lusca({
  csrf: true,
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
})
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', routes);
app.get('/login', users.getLogin);
app.post('/login', users.postLogin);
app.get('/register', users.getRegister);
app.post('/register', users.postRegister);
app.get('/logout', users.logout);
app.get('/profile', passportConfig.ensureAuthenticated, users.getProfile);
app.post('/profile', passportConfig.ensureAuthenticated, users.updateProfile);

app.get('/diary', passportConfig.ensureAuthenticated, diary.getDiary);
app.get('/diary/new', passportConfig.ensureAuthenticated, diary.getNewDiary);
app.post('/diary/new', passportConfig.ensureAuthenticated, diary.postNewDiary);

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

app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
})


module.exports = app;
