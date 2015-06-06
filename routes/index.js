var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controllers');

// Ruta a la página principal del sitio web

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

// Definición de rutas a /quizes

router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

// Ruta a los créditos

router.get('/author', function(req, res) {
	res.render('author');
});

module.exports = router;
