var mongoose = require('mongoose'); //Trabajar con modelos
var uniqueValidator = require('mongoose-unique-validator'); //Campo unico

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    email: { type: String, unique: true, required: [true, 'El email es obligatorio'] },
    clave: { type: String, required: [true, 'La contraseña es obligatoria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    google: { type: Boolean, default: false }
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} ya existe' });

module.exports = mongoose.model('Usuario', usuarioSchema);