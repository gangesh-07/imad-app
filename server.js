






var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;
var crypto=require('crypto');
var bodyParser=require('body-parser');
var session=require("express-session")

var config={
    user:'gangesh97dhar',
    database:'gangesh97dhar',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD
};


var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret:"someRandomSecretValue",
    cookie:{maxAge:1000*60*60*24*30}
}));


var articles={
'article-one':{
    title: 'Article One | Gangesh Dhar',
    heading:'Article One',
    date:'Aug 7,2017',
    content:   `
                <p>
                    This is the content for my first article.This is the content for my first article.This is the content for my first articl.This is the content for my first article.This is the content for my first article.
                </p>
                <p>
                    This is the content for my first article.This is the content for my first article.This is the content for my first articl.This is the content for my first article.This is the content for my first article.
                </p>
                <p>
                    This is the content for my first article.This is the content for my first article.This is the content for my first articl.This is the content for my first article.This is the content for my first article.
                 </p>`
    

},
'article-two':{
    title: 'Article Two | Gangesh Dhar',
    heading:'Article Two',
    date:'Sept 7,2017',
    content:   `
                <p>
                    This is the content for my second article.This is the content for my second article.
                </p>`
    
},
'article-three':{
      title: 'Article Three | Gangesh Dhar',
    heading:'Article Three',
    date:'Oct 7,2017',
    content:   `
                <p>
                    This is the content for my third article.This is the content for my third article.
                </p>
                `
    
    
}
};

function createTemplate(data){

var title=data.title;
var heading=data.heading;
var date=data.date;
var content=data.content;

var htmlTemplate=`
<html>
    <head>
        <title>
            ${title}
        </title>
        <meta name="viewport" content="width-device-width initial-scale=1" />
        <link href="/ui/style.css" rel="stylesheet" />
        
    </head>
    <body>
        <div class="container">
            <div>
                <a href="/">Home</a>
            </div>
            <hr/>
            
            <h3>
                ${heading}
            </h3>
            <div>
                ${date.toString()}
            </div>
            <div>
               ${content}
            </div>
        </div>
        
    </body>
    
    
</html>

`;

return htmlTemplate;
}


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input,salt){
    var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return["pbkdf2",10000,salt,hashed.toString('hex')].join('$');
}

app.get('/hash/:input', function (req, res) {
  var hashedString=hash(req.params.input,'love52you');
  res.send(hashedString);
});
//var pool=new Pool(config);
app.post('/create-user', function (req, res) {
    //json
    //
  var username=req.body.username;
  var password=req.body.password;
  var salt=crypto.randomBytes(128).toString('hex');
  var dbString=hash(password,salt);
  
  pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,dbString],(err,result)=>{
       if(err){
            res.status(500).send(err.toString());
        }else{
            
             res.send('user succesfully created '+username);
            }
        
      
  });
});

app.post('/login', function (req, res) {
    //json
    //
  var username=req.body.username;
  var password=req.body.password;
  
  
  pool.query('SELECT * FROM "user" WHERE username=$1',[username],(err,result)=>{
       if(err){
            res.status(500).send(err.toString());
        }else{
            if(result.rows.length===0){
                res.status(403).send('Username/Password is Invalid');
            }else{
                //match the password
                var dbString=result.rows[0].password;
                var salt=dbString.split('$')[2];
                var hashedPassword=hash(password,salt);
                if(hashedPassword===dbString)
                {
                    // set the sessions value
                    req.session.auth={userId: result.rows[0].id};
                    
                    
                    
                    res.send('credentials are correct!! ');
                }else{
                    res.status(403).send('Username/Password is Invalid');
                }
            }
        }
        
      
  });
});

app.get('/check-login', function (req, res) {
  if(req.session && req.session.auth && req.session.auth.userId)
    res.send("You are logged in: " + req.session.auth.userId.toString());
  else
        res.send("you are not logged in");
});

app.get('/logout', function (req, res) {
  delete req.session.auth;
  res.send("logged out");
});



var pool=new Pool(config);
/*app.get('/test-db', function(req,res){
    
    pool.query('SELECT * FROM test',function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send(JSON.stringfy(result));
        }
    });
});*/
app.get('/testdb', function (req, res) {
pool.query('SELECT * from test', (err, result) => {
if(err){
res.send("Error in getting records from DB"+err.toString());
}else{
res.send(JSON.stringify(result.rows));
}

});

});

app.get('/articles/:articleName', function (req, res) {
    
    pool.query("SELECT * FROM article WHERE title = '"+ req.params.articleName +"'",(err,result)=>{
        if(err){
            res.status(500).send("Error in getting records from DB"+err.toString());
        }else{
            if(result.rows.length===0){
                res.status(404).send('Article not found');
            }else{
               var articleData=result.rows[0];
             res.send(createTemplate(articleData));
            }
            
        }
    });
    
});



/*app.get('/article-two', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
});
app.get('/article-three', function (req, res) {
   res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));
});*/






app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});



// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
