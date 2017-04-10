var express = require('express');
var reverseProxy = require('./routes/reverse-proxy');
var discovery = require('./middlewares/discovery');
var app = express();

// service discovery start
discovery();

// define the home page route
app.get('/', function(req, res) {
    res.send('This is a Service Gateway Demo')
});

// define proxy route
app.use('/services', reverseProxy);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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