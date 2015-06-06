var path = require('path');

// Cargar el Modelo ORM

var Sequelize = require('sequelize');

//  Usar BBDD SQLite

var sequelize = new Sequelize(null, null, null,
						{dialect: "sqlite", storage: "quiz.sqlite"}
					);

// Importar la definición de la tabla Quiz que definimos en quiz.js

var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Exportar la definición de la tabla Quiz

exports.Quiz = Quiz;

// Crear e inicializar Base de Datos

sequelize.sync().success(function() {
	// success(...) ejecuta el manejador una vez creada la tabla

	Quiz.count().success(function(count) {
		if (count === 0) {
			// Inicializar la tabla solo si está vacía

			Quiz.create({pregunta: 'Capital de Italia',
						 respuesta: 'Roma'
						}).success(function(){
								console.log('Base de datos inicializada')});
		}
	});
});