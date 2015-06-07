var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controllers');

// Ruta a la página principal del sitio web

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

// Autoload de comandos con :quizId

router.param('quizId', quizController.load);

// Definición de rutas a /quizes

router.get('/quizes',					   quizController.index);
router.get('/quizes/:quizId(\\d+)', 	   quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', 				   quizController.new);
router.post('/quizes/create', 			   quizController.create);

// Ruta a los créditos

router.get('/author', function(req, res) {
	res.render('author');
});

module.exports = router;