'use strict'

/*var path       = require('path');
var fs         = require('fs');*/
var mongoose_p = require('mongoose-pagination')
var Follow     = require('../models/follow');
var User       = require('../models/user');

function home( req, res ){
    res.status(200).send({
        message: "hello world from follow controller, we're learning together, please enjoy this"
    });
}

function pruebas ( req, res ){
    res.status(200).send({
        message: "testing actions in nodejs server from follow_controller"
    });
}

function setFollowing( req, res ){
    
    var user_id          = req.user.sub;//--->host user's id
    var followed_user_id = req.body.followed;//-->user's id to be followed
    var follow           = new Follow();
    var allowedToSave    = true;
    var query            = { user: user_id, followed: followed_user_id};
   
    User.findById( followed_user_id, (err, user)=>{
        if(err)
            return res.status(400).send({ message: 'followed user doesn\'t exist' });
        
        Follow.findOne(query, (err, foundFollowed )=>{
            if(err)
                return res.status(500).send({message: "it's happened an error, please try again"});
            if( foundFollowed ){
                allowedToSave = false;
            }

        }).then(()=>{
            if( !allowedToSave )
                return res.status(500).send({ message: "You already follow this user"});
            
            follow.user     = user_id;
            follow.followed = followed_user_id;
            follow.save((err,followStored)=>{
                if(err)
                    return res.status(500).send({ message: "error while saving the following"});

                if(!followStored)
                    return res.status(404).send({ message: 'following was not saved'});

                return res.status(404).send({ message: 'following saved succesfully',
                                            followStored});
            });
        });

    });
    
    
}

function removeFollowing( req, res ){
    var user_id       = req.user.sub;// host
    var user_followed = req.params.id;// id user to be deleted from follows, it comes by url
    var query         = { user: user_id, followed: user_followed };
    Follow.findOneAndDelete(query, ( err, followingRemoved )=>{
        if( err )
            return res.status(500).send({ message: " An error has happend please try again later ", err});
        if( !followingRemoved )
            return res.status(400).send({ message: "It was impossible to find this user" });
        
        return res.status(200).send({ message: "Now, you don't follow this user anymore.", followingRemoved });
    });
}

function listFollows( req, res ){
    var idUser     = req.user.sub;
    var idFollowed = req.params.followed;
}

module.exports = {
    home,
    pruebas,
    setFollowing,
    removeFollowing,
    listFollows
};