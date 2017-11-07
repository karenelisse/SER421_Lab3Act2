// lab3act2.js
// load the things we need
var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');
xmlparser = require('express-xml-bodyparser');
app.use(express.json());
//cookies
app.use(cookieParser());
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

 var jsonUserObject = JSON.parse(contents);

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
      
        sizeOfContents = jsonString.NEWS.ARTICLE.length;
        
    });
       // jsonString.NEWS.ARTICLE[jsonString.NEWS.ARTICLE.length] = article;

//console.log(jsonString.NEWS[0].ARTICAL.length);


for(var index= 0; index< jsonString.NEWS.ARTICLE.length; index++){

    
    title.push(jsonString.NEWS.ARTICLE[index].TITLE[0]);
    content.push(jsonString.NEWS.ARTICLE[index].CONTENT);
    visibility.push(jsonString.NEWS.ARTICLE[index].PUBLIC);
    author.push(jsonString.NEWS.ARTICLE[index].AUTHOR);
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
   
    userName = null;
console.log(req.cookies);
  if (!req.cookies.hasVisited){
    res.cookie('hasVisited', '1', 
               { maxAge: 60*60*100000, 
                 httpOnly: true, 
                 path:'/'});
  }
  
       res.render('pages/index',{userName: userName,
                                title: title,
                                visibility: visibility});    
    
   
});
app.get('/content/:i', function(req, res) {
   var i = req.params.i;
    
       res.render('pages/content',{userName: userName,
                                title: title[i],
                                userRoles: userRoles,
                                  
                                  content: content[i]});    
    
   
});
app.get('/add', function(req, res) {
  
       res.render('pages/add',{userName : userName,
                              userRoles: userRoles});   
   
});
app.post('/add', function(req, res) {
 
   var contentTemp = req.body.article;
   var titleTemp = req.body.title;
    visibility = req.body.visibility;     
    title.push(titleTemp);
    author.push(userName);
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
                                      title: title,
                                       author: author
                                       });   
   
});

// about page 
app.get('/logger', function(req, res) {
    userName = req.body.username;
    //console.log('userName: ' + userName);
    res.render('pages/logger');
});
app.get('/loggerPost', function(req, res) {
  
      res.render('pages/loggerPost',{userName : userName,
                                      userRoles: userRoles,
                                      title: title,
                                     author: author}); 
});
app.post('/remove/:title', function(req, res) {
     var index = req.params.title;     
     res.render('pages/remove',{userName : userName,
                                      userRoles: userRoles,
                                      title: jsonString.NEWS.ARTICLE[index].TITLE[0],
                                 index: index});     
});

app.post('/delete/:title', function(req, res) {
     var indexTodelete = parseInt(req.params.title);
   
    delete jsonString.NEWS.ARTICLE[indexTodelete];  
    var deletTitle = delete title[indexTodelete];
    
        res.render('pages/loggerPost',{userName : userName,
                                      userRoles: userRoles,
                                      title: title,
                                     author: author});    
});
app.post('/logger', function(req, res) {  
     userName = req.body.username;
     userRoles = req.body.usertype;
    if(userName != null){
      
     res.render('pages/loggerPost',{userName : userName,
                                      userRoles: userRoles,
                                      title: title,
                                     author: author});   
   
    }else{
   
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
     res.cookie(cookie_name , 'cookie_value', {expire : new Date() + 3600000000}).send('Cookie is set');
});
//deletes cookies
app.get('/clearcookie', function(req,res){
     clearCookie('cookie_name');
     res.send('Cookie deleted');
});


app.listen(8080);
console.log('8080 is the magic port');
