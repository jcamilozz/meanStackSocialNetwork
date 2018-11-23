'use strict'

var express = require('express');
var api     = express.Router();
var messageController = require('../controllers/message');

api.get('/message/home', messageController.home );
api.get('/message/pruebas', messageController.pruebas);

module.exports = api;