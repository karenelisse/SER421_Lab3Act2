// lab3act2.js
// load the things we need
var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');
xmlparser = require('express-xml-bodyparser');
app.use(express.json());

var path = require('path');
var bodyParser = require('body-parser');

  parseString = require('xml2js').parseString,
    xml2js = require('xml2js');


var userName ;
var userRoles ;
var visibility = 'F';
var title ='';
var content = [];
var jsonString = {};
var article ={"TITLE":[],"AUTHOR":[],"PUBLIC":[],"CONTENT":[]};
var jsonObj = {"role": "Subscriber", "name": "Bob"};
var sizeOfContents = 0;
var title = [];
var id = 0;
var visibility = [];
var author = [];


 var fsJson = require('fs');
 console.log("\n *STARTING* \n");
// Get content from file
 var contents = fsJson.readFileSync("users.json");
// Define to JSON type
console.log("this is Json content:   " + contents);
 var jsonUserObject = JSON.parse(contents);
console.log("this is Json content:  (OBJECT)  " + jsonUserObject);
// Get Value from JSON

var fs = require('fs'),
    parseString = require('xml2js').parseString;

var data = fs.readFileSync('news.xml');   
   
    // we then pass the data to our method here
    parseString(data, function(err, result){
        if(err) console.log(err);
        // here we log the results of our xml string conversion
        jsonString = result;
        var str = JSON.stringify(result);
        console.log(str);
        sizeOfContents = jsonString.NEWS.ARTICLE.length;
        
    });
       // jsonString.NEWS.ARTICLE[jsonString.NEWS.ARTICLE.length] = article;

//console.log(jsonString.NEWS[0].ARTICAL.length);
console.log("jason Object " +jsonString); 

for(var index= 0; index< jsonString.NEWS.ARTICLE.length; index++){

    console.log(jsonString.NEWS.ARTICLE[index].TITLE.length);
    title.push(jsonString.NEWS.ARTICLE[index].TITLE[0]);
    content.push(jsonString.NEWS.ARTICLE[index].CONTENT);
    visibility.push(jsonString.NEWS.ARTICLE[index].PUBLIC);
    author.push(jsonString.NEWS.ARTICLE[index].AUTHOR);
}

for(var i = 0; i  < title.length; i++)
{
    console.log("Title is : " + title[i]);
}


// set the view engine to ejs
app.set('view engine', 'ejs');
//app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// use res.render to load up an ejs view file

// use middleware
app.use(bodyParser());
// index page 
app.get('/', function(req, res) {
   console.log('userName at get' + userName);
       res.render('pages/index',{userName: userName,
                                title: title,
                                visibility: visibility});    
    
   
});
app.get('/content/:i', function(req, res) {
   var i = req.params.i;
     console.log('REQUEWT ' + i);
       res.render('pages/content',{userName: userName,
                                title: title[i],
                                userRoles: userRoles,
                                  
                                  content: content[i]});    
    
   
});
app.get('/add', function(req, res) {
   console.log('userName at get' + userName);
       res.render('pages/add',{userName : userName,
                              userRoles: userRoles});   
   
});
app.post('/add', function(req, res) {
 
   var contentTemp = req.body.article;
   var titleTemp = req.body.title;
     visibility = req.body.visibility;
     console.log('Title' + titleTemp + "   :"+ userName);
     console.log("Content: " + contentTemp + 'VVVV' +visibility);
    article.AUTHOR.push(userName);
    article.TITLE.push(titleTemp);
    article.PUBLIC.push(visibility);
    article.CONTENT.push(contentTemp);
    jsonString.NEWS.ARTICLE[jsonString.NEWS.ARTICLE.length] = article;
    // convert json object to xml file
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(jsonString);
        
    fs.writeFile('news.xml', xml, function(err, data){
        if (err) console.log(err);
            
            console.log("successfully written our update xml to file");
             });
    res.render('pages/loggerPost',{userName : userName,
                                      userRoles: userRoles,
                                      title: title});   
   
});

// about page 
app.get('/logger', function(req, res) {
    userName = req.body.username;
    //console.log('userName: ' + userName);
    res.render('pages/logger');
});
app.post('/logger', function(req, res) {  
     userName = req.body.username;
     userRoles = req.body.usertype;
    if(userName != null){
      console.log('userName' + userName + " and usertype " + userRoles);
     res.render('pages/loggerPost',{userName : userName,
                                      userRoles: userRoles,
                                      title: title,
                                     author: author});   
   
    }else{
    console.log('userName: Logger' + userName);
       res.render('pages/logger')} 
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
