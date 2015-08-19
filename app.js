var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Importar marco de aplicación

var partials = require('express-partials');

// Importar sobreescritura de metodos delete y put

var methodOverride = require('method-override');

// Importar middleware de gestión de sesiones

var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Instalar marco de aplicación

app.use(partials());

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cookieParser('Quiz-Derick 2015')); // Añadir clave para cifrar COOKIES

// Instalar middleware de gestión de sesiones

var sesionAbierta = false;

app.use(session({ 
            name: 'quiz-derick-2015', // configuración de la cookie
            secret: 'clavesecreta',
            resave: true,       // Fuerza a la sesion a volver a salvar la sesion
            rolling: true,      // Fuerza a la cookie a asignarse en cada respuesta reseteando la fecha de expiración
            saveUninitialized: false,
            cookie: {maxAge: 10000}  // Tiempo de expiracion de la sesion
            })); 

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos
// Definimos un middleware que tiene dos funciones:
// 1.- Copiar la session que está en req.session en res.locals.session
//     para que esté accesible en todas las vistas
// 2.- Guardar ls ruta de cada solicitud HTTP en la variable
//     session.redir para poder redireccionar a la vista anterior
//     después de hacer login o logout

app.use(function(req, res, next) {
  // Resetear req.session.maxAge

  req.session.touch();

  // Hacer visible req.session en las vistas

  res.locals.session = req.session;

	// Guardar path en session.redir para despues de login

  if (req.method === 'GET' && !req.path.match(/\/login|\/logout/)) {
		req.session.redir = req.path;
	}

  // Comprobar si la sesión está abierta

    if(req.session.user){
        sesionAbierta = true;
        console.log("Sesión ABIERTA");
    } else{
        if(sesionAbierta) {
            sesionAbierta = false;
            console.log("Sesion CERRADA");
            var err = new Error('La sesión a finalizado. Vuelva a logearse');
            err.status = 1001;
        }
    }

	next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      errors: []
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors: []    
  });
});


module.exports = app;