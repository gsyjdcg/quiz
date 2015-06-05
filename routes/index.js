var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controllers');

// Ruta a la página principal del sitio web

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

// Rutas a preguntas y respuestas

router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);

// Ruta a los créditos

router.get('/author', function(req, res) {
	res.render('author');
});

module.exports = router;
