'use strict'

var publication = require('../models/publication');

function home( req, res ){
    res.status(200).send({
        message: "hello world from publication controller, we're learning together, please enjoy this"
    });
}

function pruebas( req, res ){
    res.status(200).send({
        message: "testing actions in message server from publication_controller"
    });
}

module.exports = {
    home,
    pruebas
}