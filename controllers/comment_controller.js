var models = require('../models/models.js');

// Autoload :id de comentarios

exports.load = function(req, res, next, commentId) {
	models.Comment.find({
		where: {id: Number(commentId)}
	}).then(function(comment) {
		if (comment) {
			req.comment = comment;
			next();
		} else {
			next(new Error('No existe commentId = ' + commentId))
		}
	}).catch(function(error){next(error)});
};

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

// PUT /quizes/:quizId/comments/:commentId/publish

exports.publish = function(req, res) {
	req.comment.publicado = true;

	req.comment.save(
		{ fields: ["publicado"]}).then(function() {
			res.redirect('/quizes/' + req.params.quizId);
		}).catch(function(error){next(error)});
};