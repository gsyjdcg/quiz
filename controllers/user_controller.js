// La gestión de usuarios es muy simple. Se basa en tener
// creados 2 usuarios predefinidos en la variable users.
// En un portal real suele haber una tabla de gestion de usuarios.

var users = {admin: {id:1, username:"admin", password:"1234"},
			derick:  {id:2, username:"derick", password:"5678"}
		   };

// Comprobamos si el usuario está registrado es users
// Si autenticación falla o hay errores se ejecuta callback(error).

exports.autenticar = function(login, password, callback) {
	if (users[login]) {
		if (password == users[login].password) {
			callback(null, users[login]);
		} else {
			callback(new Error('Contraseña errónea.'));
		}
	} else {
		callback(new Error('No existe el usuario.'));
	}
};