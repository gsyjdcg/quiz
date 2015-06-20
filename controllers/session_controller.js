// GET /login -- Formulario de login

exports.new = function(req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors});
};

// POST /login -- Crear la sesión

exports.create = function(req, res) {
	var login = req.body.login;
	var password = req.body.password;
	var userController = require('./user_controller');

	userController.autenticar(login, password, function(error, user) {
		if (error) { // Si hay error lo retornamos en la sesion
			req.session.errors = [{"menssage": 'Se ha producido un error: ' + error}]; 
			res.redirect("/login");
			return;
		}
	
		// Crear req.session.user y guardar campos id y username
		// La sesión se define por la existencia de: req.session.user

		req.session.user = {id:user.id, username:user.username};

		// Redireccionar al path anterior a login

		res.redirect(req.session.redir.toString());
	});
};

// DELETE /logout -- Destruir sesión

exports.destroy = function(req, res) {
	delete req.session.user;

	// Redirección al path anterior a login

	res.redirect(req.session.redir.toString());
};