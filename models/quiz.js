module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		'Quiz', 
		{ pregunta: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta la Pregunta"}}
		  },

		  respuesta: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta la Respuesta"}}
		  },

		  tema: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta el Tema"}}
		  }
	});
}