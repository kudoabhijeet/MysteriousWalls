// basic app setup with dependencies
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const mysql = require('mysql')
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT


var connection = mysql.createConnection({
	host     : process.env.HOST,
	user     : process.env.USER,
	password : process.env.PASS,
	database : process.env.DB
});

app.set('view engine', 'ejs');
app.engine("html", require('ejs').renderFile)
app.use(express.static("static"))

const expressSession = require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  });
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
    app.use(expressSession);

// routes
app.get('/', (req,res) => {
    res.render('index.html');
})
app.get('/rules', (req,res)=>{
    res.render('rules.html')
})

app.get('/play', function(request, response) {
	if (request.session.loggedin) {
		//response.send('Welcome back, ' + request.session.username + '!');
        var user = request.session.username.toUpperCase();
        response.render('play', {user: user});
	} else {
		response.render('error.html');
	}
	response.end();
});

app.get('/login', (req,res)=>{
    res.render('login.html')
})

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
    console.log(username);
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/play');
			} else {
				response.render('Invalid Username & Password');
                
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});






app.listen(port, () =>{
    console.log(`Listening on ${port}`);
})