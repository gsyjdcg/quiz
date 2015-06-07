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

		models.Quiz.findAll(
			{where: ["pregunta like ?", search],	// Filtrar
			 order: [['pregunta', 'ASC']]}			// Ordenar
			).then(function(quizes) {
			res.render('quizes/index', {quizes: quizes, errors: []});
		}).catch(function(error) {next(error);});
	} else {
		models.Quiz.findAll().then(function(quizes) {
			res.render('quizes/index', {quizes: quizes, errors: []});
		}).catch(function(error) {next(error);});
	}
};

// GET /quizes/:id

exports.show = function(req, res) {
	res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer

exports.answer = function(req, res) {
	var resultado = 'Incorrecto';

	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}

	res.render('quizes/answer',
				{quiz: req.quiz,
				 respuesta: resultado,
				 errors: []});
};

// GET /quizes/new

exports.new = function(req, res) {
	var quiz = models.Quiz.build(
		{pregunta: "Pregunta", respuesta: "Respuesta"}
		);

	res.render('quizes/new', {quiz: quiz, errors: []});
};

// GET /quizes/create

exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	var errors = quiz.validate();

	// Comprueba que los datos introducidos son válidos

	if (errors) {
		var i = 0;
		var errores = new Array();

		for (var prop in errors) {
			errores[i++]={message: errors[prop]};
		}

		// Si no son válidos mostramos un mensaje de error

		res.render('quizes/new', {quiz: quiz, errors: errores});
	} else {
		// Guarda en la DB los campos pregunta y respuesta de quiz

		quiz.save({fields: ["pregunta", "respuesta"]}).then(function() {
			// Redirección HTTP a la lista de preguntas

			res.redirect('/quizes');   // URL relativo
		});
	}
};

// GET /quizes/:id/edit

exports.edit = function(req, res) {
	var quiz = req.quiz; // Autoload ya a cargado la instancia aquí

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id

exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	var errors = req.quiz.validate();

	// Comprueba que los datos introducidos son válidos

	if (errors) {
		var i = 0;
		var errores = new Array();

		for (var prop in errors) {
			errores[i++]={message: errors[prop]};
		}

		// Si no son válidos mostramos un mensaje de error

		res.render('quizes/edit', {quiz: req.quiz, errors: errores});
	} else {
		// Guarda en la DB los cambios

		req.quiz.save({fields: ["pregunta", "respuesta"]}).then(function() {
			// Redirección HTTP a la lista de preguntas

			res.redirect('/quizes');   // URL relativo
		});
	}
};

// DELETE /quizes/:id

exports.destroy = function(req, res) {
	req.quiz.destroy().then(function() {
		// Redirección HTTP a la lista de preguntas

		res.redirect('/quizes');   // URL relativo
	}).catch(function(error){next(error)});
};