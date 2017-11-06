var express = require('express');
var app = express();
 
// setting up the templating view engine
app.set('view engine', 'ejs');
 
// users array
var usersList = [
    {
        id: 1,
        name: 'Mukesh Chapagain',
        age: 99,
        email: 'mukesh@example.com'
    },
    {
        id: 2,
        name: 'Brad Pitt',
        age: 80,
        email: 'brad@example.com'
    },
    {
        id: 3,
        name: 'Steve Smith',
        age: 56,
        email: 'steve@example.com'
    },
    {
        id: 4,
        name: 'Darren Sammy',
        age: 48,
        email: 'sammy@example.com'
    }
];
 
app.get('/', function(request, response){    
    response.render('index', {title: 'My Homepage', msg: 'Hello World'});
});
 
// for users list page
app.get('/users', function(request, response){    
    /**
     * render to views/users.ejs template file
     * usersList is set to users variable
     */ 
    response.render('users', {users: usersList});
});
 
// for individual user page
app.get('/user/:id', function(request, response){    
    /** 
     * Get the individual user details using request param ID
     * 
     * We use array.filter() function for this purpose
     * 
     * filter() is a Javascript function that creates a new array with elements 
     * that satisfies the conditions present in the callback function
     */ 
    var singleUser = usersList.filter(function(user){console.log(user.id); return user.id == request.params.id});
    
    /** 
     * The filter creates a new array with single user element
     * Hence, getting the value of the first and only element
     */ 
    var singleUser = singleUser[0];
    
    /**
     * render to views/user.ejs template file
     * name, age & email variables are passed to the template
     */ 
    response.render('user', {
        name: singleUser.name, 
        age: singleUser.age,
        email: singleUser.email
    });
});
 
app.listen(3000, function(){
    console.log('Server running at port 3000: http://127.0.0.1:3000');
});