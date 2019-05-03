'use strict'
//required modules.
var express          = require('express');
var FollowController = require('../controllers/follow');
var fs               = require('fs');
var path             = require('path');

//express router.
var api    = express.Router();

//middlewares.
var md_auth = require('../middlewares/authenticated');

api.post('/follow/save', md_auth.ensureAuth, FollowController.setFollowing );
api.delete('/follow/remove/:id', md_auth.ensureAuth, FollowController.removeFollowing );
api.get('/follow/getMyFollows/:followers?', md_auth.ensureAuth, FollowController.getMyFollows );
api.get('/follow/getFollowings/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowings );
api.get('/follow/getFollowers/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowers );


module.exports = api;