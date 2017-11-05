// lab3act2.js
// load the things we need
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
xmlparser = require('express-xml-bodyparser');
app.use(express.json());

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

//cookies
app.use(cookieParser());

//Set Cookie and Set Expir Date
app.get('/cookie',function(req, res){
     res.cookie(cookie_name , 'cookie_value', {expire : new Date() + 9999}).send('Cookie is set');
});
//deletes cookies
app.get('/clearcookie', function(req,res){
     clearCookie('cookie_name');
     res.send('Cookie deleted');
});


app.listen(8080);
console.log('8080 is the magic port');
