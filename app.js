var express = require('express')
var app = express()
path = require('path')

var mysql = require('mysql')


var myConnection  = require('express-myconnection')

var config = require('./config')
var dbOptions = {
	host:	  config.database.host,
	user: 	  config.database.user,
	password: config.database.password,
	port: 	  config.database.port, 
	database: config.database.db
}

app.use(myConnection(mysql, dbOptions, 'pool'))


app.set('view engine', 'ejs')


var index = require('./routes/index')
var users = require('./routes/users')
app.set('port', process.env.PORT || 5000);


 
var expressValidator = require('express-validator')
app.use(expressValidator())



var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



var methodOverride = require('method-override')


app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
  
    var method = req.body._method
    delete req.body._method
    return method
  }
}))


var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser('keyboard cat'))
app.use(session({ 
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))
app.use(flash())


app.use('/', index)
app.use('/users', users)

app.use(express.static(path.join(__dirname, './public')));

app.listen(app.get('port'), () => {
	console.log(`Servidor escuchando desde el puerto  ${app.get('port')}`);
});
