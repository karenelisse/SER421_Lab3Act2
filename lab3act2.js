// lab3act2.js
// load the things we need
var express = require('express');
var app = express();


// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
    res.render('pages/index');
});

// about page 
app.get('/logger', function(req, res) {
    res.render('pages/logger');
});

// about page 
app.get('/articles', function(req, res) {
    res.render('pages/articles');
});

app.listen(8080);
console.log('8080 is the magic port');
