'use strict'

var express        = require('express');
var UserController = require('../controllers/user');
var multiparty     = require('connect-multiparty');

var api = express.Router();

var md_auth        = require('../middlewares/authenticated');
var md_mp          = multiparty({uploadDir: './uploads/users'});


api.get( '/user/home',UserController.home );
api.get( '/user/pruebas',md_auth.ensureAuth, UserController.pruebas );
api.post( '/user/login',UserController.loginUser );
api.post( '/user/register',UserController.saveUser );
api.get( '/user/user/:id',md_auth.ensureAuth,UserController.getUser );
api.get( '/user/users/:page?',md_auth.ensureAuth,UserController.getUsers );
api.put( '/user/update/:id',md_auth.ensureAuth,UserController.updateUser );
api.post( '/user/uploadImageUser/:id',[md_auth.ensureAuth, md_mp],UserController.uploadImage );
api.get( '/user/getImage/:nameFile',md_auth.ensureAuth,UserController.getImage );
api.get( '/user/getCounters/:id?',md_auth.ensureAuth,UserController.getCounters );



module.exports = api;