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
            return res.status(404).send({ message: 'followed user doesn\'t exist' });
        
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
            return res.status(404).send({ message: "It was impossible to find this user" });
        
        return res.status(200).send({ message: "Now, you don't follow this user anymore.", followingRemoved });
    });
}


function getFollowings( req, res ){

    var idUser     = req.user.sub;
    var idFollower = req.params.id;
    var query      = {};
    var page       = 1;
    var itemsPage  = 4;
    var totalPages = 0;
    
    if( !idFollower && !req.params.page ){//there's no params in the url
        idFollower = idUser;
    }

    if( idFollower && !req.params.page ){
        if( !isNaN( idFollower ) ){
            page       = idFollower;
            idFollower = idUser;
        }
    }
    
    if( idFollower && req.params.page ){
        page = req.params.page;
    }

    query = { user: idFollower }; 

    Follow.find(query).sort("-_id").populate({ path: "followed"}).paginate( page, itemsPage, (err, followings, total) =>{
        if( err )
            return res.status(500).send({err});
        if( !followings )
            return res.status(404).send({message: 'There\'s no user available'});
        totalPages = total/itemsPage;
        return res.status(200).send({followings, total, totalPages: totalPages });
    });
}

function getFollowers( req, res ){
    
    var userId       = req.user.sub;
    var userFollowed = req.params.id;
    var query        = {};
    var page         = req.params.page;
    var itemsPage    = 4;
    var total        = 0;
    var totalPages   = 0;

    if( !userFollowed && !page ){
        userFollowed = userId;
    }
    
    if( !page ){
        if( !isNaN(userFollowed) ){
            page         = userFollowed;
            userFollowed = userId;
        }
    }
    query = { followed: userFollowed };
    Follow.find( query ).sort("-_id").populate({path: "user", select: "nick name email"}).paginate( page, itemsPage, ( err, followers, total )=>{
        if( err )
            return res.status(500).send({err});
        if( !followers )
            return res.status(404).send({message: 'There\'s no user available'});
        totalPages = total/itemsPage;
        return res.status(200).send({followers, total, totalPages: totalPages });
    });
}
//this line is just to try to push it on git
function getMyFollows( req, res ){
    var userId    = req.user.sub;
    var followers = req.params.followers;
    var query     = {};
    var queryPath = "";   
    
    if( followers == "followers" ){
        query      = { followed: userId };
        queryPath  = "user";
    }else{
        query = { user: userId };
        queryPath  = "followed";
    }

    var find = Follow.find( query ).sort("-_id").populate({path: queryPath, select: "nick name email"});
    find.exec(( err, follows )=>{
        if( err )
            return res.status(500).send({err});
        if( !follows )
            return res.status(404).send({message: 'There\'s no user available'});
        return res.status(200).send({follows});
    });
}

module.exports = {
    home,
    pruebas,
    setFollowing,
    removeFollowing,
    getFollowings,
    getFollowers,
    getMyFollows
};