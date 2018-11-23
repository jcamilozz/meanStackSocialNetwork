'use strict'
var express = require('express');
var api     = express.Router();
var publicationController = require('../controllers/publication');

api.get("/publication/home",publicationController.home);
api.get("/publication/pruebas",publicationController.pruebas);

module.exports = api;