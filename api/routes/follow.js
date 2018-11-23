'use strict'
//required modules.
var express          = require('express');
var FollowController = require('../controllers/follow');

//express router.
var api    = express.Router();

//middlewares.
var md_auth        = require('../middlewares/authenticated');

api.get('/follow/home', FollowController.home );
api.get('/follow/pruebas', md_auth.ensureAuth, FollowController.pruebas );
api.post('/follow/save', md_auth.ensureAuth, FollowController.setFollowing );
api.delete('/follow/remove/:id', md_auth.ensureAuth, FollowController.removeFollowing );
api.get('/follow/listFollows/:id?', md_auth.ensureAuth, FollowController.listFollows );


module.exports = api;