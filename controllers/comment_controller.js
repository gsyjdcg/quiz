var models = require('../models/models.js');

// GET /quizes/:quizId/comments/new

exports.new = function(req, res) {
	res.render('comments/new', {quizid: req.params.quizId,
								errors: []});
};

// POST /quizes/:quizId/comments

exports.create = function(req, res) {
	var comment = models.Comment.build(
		{texto: req.body.comment.texto,
		 QuizId: req.params.quizId
		});

	var errors = comment.validate();

	// Comprueba que los datos introducidos son válidos

	if (errors) {
		var i = 0;
		var errores = new Array();

		for (var prop in errors) {
			errores[i++]={message: errors[prop]};
		}

		// Si no son válidos mostramos un mensaje de error

		res.render('comments/new.ejs',
			{comment: comment,
			 quizid: req.params.quizId,
			 errors: errores});
	} else {
		// Guarda en la DB los campos pregunta y respuesta de quiz

		comment.save().then(function() {
			// Redirección HTTP a la lista de preguntas

			res.redirect('/quizes/' + req.params.quizId);   // URL relativo
		});
	};
};