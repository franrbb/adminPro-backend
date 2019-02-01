var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;

    //TIPOS DE COLECCION
    var tiposValidos = ['usuarios', 'hospitales', 'medicos'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es valida',
            errors: { message: 'Tipo de coleccion no es valida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Debe seleccionar una imagen',
            errors: { mensaje: 'Debe seleccionar una imagen' }
        });
    }

    //OBTENER NOMBRE DEL ARCHIVO
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son ' + extensionesValidas.join(', ') }
        });
    }

    //NOMBRE ARCHIVO PERSONALIZADO
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //MOVER ARCHIVO A UN PATH
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                error: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

    });

});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe',
                    error: err
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            //SI EXISTE, ELIMINA LA IMAGEN ANTERIOR
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, err => { if (err) console.log(err) });
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.clave = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen usuario actualizada',
                    usuario: usuarioActualizado
                });
            });
        });
    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Hospital no existe',
                    error: err
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;

            //SI EXISTE, ELIMINA LA IMAGEN ANTERIOR
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, err => { if (err) console.log(err) });
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen hospital actualizada',
                    hospital: hospitalActualizado
                });
            });
        });
    }

    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Medico no existe',
                    error: err
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img;

            //SI EXISTE, ELIMINA LA IMAGEN ANTERIOR
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, err => { if (err) console.log(err) });
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen medico actualizada',
                    medico: medicoActualizado
                });
            });
        });
    }

}

module.exports = app;