'use strict'

var message = require('../models/message');

function home( req, res ){
    res.status(200).send({
        message: "hello world from message controller, we're learning together, please enjoy this"
    });
}

function pruebas ( req, res ){
    res.status(200).send({
        message: "testing actions in message server from message_controller"
    });
}

module.exports = {
    home,
    pruebas
}