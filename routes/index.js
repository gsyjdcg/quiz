var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

// Ruta a la página principal del sitio web

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz', errors: []});
});

// Autoload de comandos con :quizId

router.param('quizId', quizController.load);

// Definición de rutas de sesión

router.get('/login', sessionController.new); // formulario login
router.post('/login', sessionController.create); // crear sesión
router.delete('/logout', sessionController.destroy); // destruir sesión

// Definición de rutas a /quizes

router.get('/quizes',					   quizController.index);
router.get('/quizes/:quizId(\\d+)', 	   quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', 				   sessionController.loginRequired, quizController.new);
router.post('/quizes/create', 			   sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',   sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',	 	   sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',	   sessionController.loginRequired, quizController.destroy);

// Definición de rutas a /comments

router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',	 commentController.create);

// Ruta a los créditos

router.get('/author', function(req, res) {
	res.render('author', {errors: []});
});

module.exports = router;