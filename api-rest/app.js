var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fileUpload = require('express-fileupload');
var path = require('path');
global.appRoot = path.resolve(__dirname);
var app = express();

var indexRouter = require('./routes/index');
var addSongRouter = require('./routes/add-song');
var manageSongRouter = require('./routes/manage-song');
var musiqueRouter = require('./routes/music-rest');
var lecteurRouter = require('./routes/lecteur');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',indexRouter);
app.use('/add-song', addSongRouter);
app.use('/manage-song', manageSongRouter);
app.use('/musique', musiqueRouter);
app.use('/lecteur',lecteurRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) { next(createError(404)); });

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
