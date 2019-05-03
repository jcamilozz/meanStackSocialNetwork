'use strict'
var publicationController = require('../controllers/publication');
var express               = require('express');
var api                   = express.Router();
var md_auth               = require('../middlewares/authenticated');
var multipart             = require('connect-multiparty');
var md_upload             = multipart({uploadDir: './uploads/publications'});

api.get("/publication/home",publicationController.home);
api.get("/publication/pruebas",publicationController.pruebas);
api.post("/publication/save",[md_auth.ensureAuth, md_upload],publicationController.savePublication);

module.exports = api;