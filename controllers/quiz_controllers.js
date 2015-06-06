var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId

exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
		// Comprueba si existe el quiz y lo guarda
		// Si no existe devuelve error

		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quizId=' + quizId));
			}
		}).catch(function(error) {next(error);});
};

// GET /quizes
// GET /quizes?search=texto_a_buscar

exports.index = function(req, res) {
	if (req.query.search) {
		// delimitar el string contenido en search
		// con el comodín % antes y después
		// cambie también los espacios en blanco por %.
		// De esta forma, si busca "uno dos" ("%uno%dos%"),
		// mostrará todas las preguntas que tengan "uno"
		// seguido de "dos", independientemente de lo que
		// haya entre "uno" y "dos".

		var search = '%' + req.query.search.replace(/\s/g,"%") + '%';

		console.log('PARAMETRO SEARCH = ' + search);

		models.Quiz.findAll(
			{where: ["pregunta like ?", search],	// Filtrar
			 order: [['pregunta', 'ASC']]}			// Ordenar
			).then(function(quizes) {
			res.render('quizes/index', {quizes: quizes});
		}).catch(function(error) {next(error);});
	} else {
		models.Quiz.findAll().then(function(quizes) {
			res.render('quizes/index', {quizes: quizes});
		}).catch(function(error) {next(error);});
	}
};

// GET /quizes/:id

exports.show = function(req, res) {
	res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/:id/answer

exports.answer = function(req, res) {
	var resultado = 'Incorrecto';

	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}

	res.render('quizes/answer',
				{quiz: req.quiz, respuesta: resultado});
};