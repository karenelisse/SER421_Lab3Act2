// lab3act2.js
// load the things we need
var express = require('express');
var session = require('express-session');
var app = express();
var cookieParser = require('cookie-parser');
xmlparser = require('express-xml-bodyparser');
app.use(express.json());
app.use(cookieParser());
var path = require('path');
var bodyParser = require('body-parser');

  parseString = require('xml2js').parseString,
    xml2js = require('xml2js');

//express sessions
// Use the session middleware
app.use(session({ secret: 'EXPRESSKEY', resave: true, saveUninitialized: true, cookie: { maxAge: 2592000000 }})) // sets expriy for 30 days

//sets up items for xml and json files
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
 var usersJsonStr = fsJson.readFileSync("newsusers.json");
// Define to JSON type
 console.log(" users" + usersJsonStr);
 var jsonUserObject = JSON.parse(usersJsonStr);



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
        if(userName=undefined){
            res.sendStatus(403);
        }
        else if(userRoles = false || userRoles === "Subscriber"){
        res.sendStatus(403);      
        }
        else{
        res.render('pages/add',{userName : userName,
                  userRoles: userRoles}); 
    }
         
   
});
app.post('/add', function(req, res) {
 
   var contentTemp = req.body.article;
   var titleTemp = req.body.title;
   var visibilityTemp = req.body.visibility;     
    title.push(titleTemp);
    author.push(userName);
    visibility.push(visibilityTemp);
    
    article.AUTHOR[0] = (userName);
    article.TITLE[0] =  (titleTemp);
    article.PUBLIC[0] = (visibility);
    article.CONTENT[0] =(contentTemp);
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

                                       author: author,
                                   visibility: visibility

                                       });   
   
});

// about page 
app.get('/logger', function(req, res) {
    userName = req.body.username;
    //console.log('userName: ' + userName);
    res.render('pages/logger');
});
app.get('/loggerPost', function(req, res) {
        req.session.userName;
        req.session.userRole;
      res.render('pages/loggerPost',{userName : userName,
                                      userRoles: userRoles,
                                      title: title,

                                     author: author,
                                    visibility: visibility}); 

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

                                     author: author,
                                      visibility: visibility});    

});
app.post('/logger', function(req, res) {  
     userName = req.body.username;
     userRoles = req.body.usertype;
    for(var i =0; i<jsonUserObject.users.length; i++){
        var exit = false;        
        if(userName == jsonUserObject.users[i].name){
            console.log('user exit');
            exit = true;
        }
    }
    if(!exit){
        //write to file
     //var jsonObj = {"role": "Subscriber", "name": "Bob"};
        jsonObj.name = userName;
        jsonObj.role = userRoles;
        jsonUserObject.users.push(jsonObj);
        
        fsJson.writeFile("newsusers.json", JSON.stringify(jsonUserObject), (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("newsusers.json File has been created");
});

        
    }

    if(userName != null){
      
     res.render('pages/loggerPost',{userName : userName,
                                      userRoles: userRoles,
                                      title: title,

                                     author: author,
                                   visibility: visibility});   

   
    }else{
   
       res.render('pages/logger')} 
});


//error handling
var path = require('path');
var morgy = require('morgan');
var silent = 'test' == process.env.NODE_ENV;

// general config
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// our custom "verbose errors" setting
app.enable('verbose errors');
// disable them in production
if ('production' == app.settings.env) app.disable('verbose errors');
silent || app.use(morgy('dev'));
// Routes
app.get('/', function(req, res){
  res.render('index.ejs');
});
app.get('/404', function(req, res, next){
  next();
});
app.get('/403', function(req, res, next){
  // trigger a 403 error
  var err = new Error('Invalid!');
  err.status = 403;
  next(err);
});
app.get('/500', function(req, res, next){
  // trigger a generic (500) error
  next(new Error('Something went wrong!'));
});
app.use(function(req, res, next){
  res.status(404);

  res.format({
    html: function () {
      res.render('404', { url: req.url })
    },
    json: function () {
      res.json({ error: 'Not found' })
    },
    default: function () {
      res.type('txt').send('Not found')
    }
  })
});


app.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  res.status(err.status || 500);
  res.render('500', { error: err });
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
