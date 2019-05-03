'use strict'

var bcrypt     = require('bcrypt-nodejs');
var mongoose_p = require('mongoose-pagination');
var User       = require('../models/user');
var jwt        = require('../services/jwt');
var fs         = require('fs');
var path       = require('path');
var Follow     = require('../models/follow');


function home(req, res){
    res.status(200).send({
        message: "hello world from user_controller, we're learning together, please enjoy this"
    });
}

function pruebas(req, res){
    res.status(200).send({
        message: "testing actions in nodejs server from user_controller"
    });
}

function saveUser( req, res ){
    var user   = new User();
    var params = req.body;
    console.log( params );

    if( params.name && params.surname && params.email && params.password ){
        user.name     = params.name;
        user.surname  = params.surname;
        user.nick     = params.nick;  
        user.email    = params.email;
        user.rol      = 'ROLE_USER';      
        user.image    = null;

         User.find({
            $or:[
                { email: user.email.toLowerCase()},
                { nick : user.nick.toLowerCase()}
            ]
        }).exec( ( err, users ) => {

            if( err )
                return res.status(500).send({ message: 'error saving the new user'});
            
            if( users && users.length >= 1 )
                return res.status(500).send({ message: 'this user has already been created' });
                else{
                    bcrypt.hash(params.password,null, null, (err, hash) => {
                        user.password = hash;
                        user.save( ( err, userStored ) => {
                            if( err )
                                return res.status(500).send({ message: 'error saving the new user'});
                        
                            if( userStored )
                                return res.status(200).send({ message: 'New user has been stored succesfully', user: userStored });
                                else
                                    return res.status(404).send({ message: 'New user hasn\'t been stored '});
                        
                        });
                    });
                }
        });

    }else{
        res.status(200).send({
            message: " Please send all required fields. "
        })
    }
       
}

function loginUser( req, res){
    var params = req.body;
    User.findOne({email: params.email}, ( err, user ) => {
        
        if( err )
            return res.status(500).send({message: 'it has happened an error, please try it again'});
        
        if( user ){
            bcrypt.compare( params.password, user.password, ( err, check ) => {
                if(check){

                    if( params.getToken ){
                        //create a token
                        var newToken = jwt.createToken(user);
                        //return a token
                        return res.status(200).send({token: newToken});
                    }else{
                        user.password = undefined;
                        return res.status(200).send({message: 'Welcome '+user.name, user });
                    }
                }else{
                    return res.status(404).send({message: 'we couldn\'t find this user, please try it again'}); 
                }
            });
        }else{
            return res.status(404).send({message: 'we couldn\'t find this user, please try it again (email)'}); 
        }
    });
}

function getUser( req, res ){
    var userId = req.params.id;
    User.findById(userId, ( err, user )=>{
        
        if( err )
            return res.status(500).send({err});
        if( !user ){
            return res.status(404).send({message: "The user doesn\'t exist."});
        }

        findFollowship( req.user.sub, userId ).then((answer)=>{
            return res.status(200).send({user, answer});
        });
    });
}

async function findFollowship( idAuthenticated, userToFind ){

    var following = false;
    var followed  = false;
    var query     = {};
    
    query         = { user: idAuthenticated, followed: userToFind };
    var followingQ = await Follow.findOne( query, (err, follow)=>{
        if(err)
            return handleError(err);
        if( follow ){
            following = true;
        }
        
    });

    query = { user: userToFind, followed: idAuthenticated };
    var followedQ  = await Follow.findOne( query, (err, follow)=>{

        if(err)
            return handleError(err);
        if( follow ){
            followed = true;
        }
        
    });
    return{ "following":following, "followedBy": followed };
}

function getUsers( req, res ){
    var identityUserId  = req.user.sub;
    var usuarioOriginal = req.user;
    var page            = 1;
    var itemsPerPage    = 4;
    
    if(req.params.page)
        page = req.params.page;

    User.find().sort('_id').paginate( page, itemsPerPage, (err, users, total) =>{
        if( err )
            return res.status(500).send({err});
        if(!users)
            return res.status(404).send({message: 'There\'s no user available'});
        
        return res.status(200).send({usuarioOriginal, users, total, totalPages: Math.ceil( total/itemsPerPage) });
    });
}

function updateUser( req, res ){

    var userId     = req.params.id;
    var updateData = req.body;
    delete updateData.password;

    //we're comparig the id from params to authorization's one, remember "user" got set in the req by the middleware
    if( userId != req.user.sub ){
        return res.status(500).send({message: 'you don\'t have permission to update this user'});
    }

    User.findByIdAndUpdate( userId, updateData,{new: true}, ( err, userUpdated ) => {
        if( err )
            return res.status(500).send({message: 'There was an error while updating the user, please try it again'});
        if( !userUpdated )
            return res.status(404).send({message: 'The user doesn\'t exist'});

        return res.status(200).send({userUpdated});

    });
}

function uploadImage( req, res ){
    var userId     = req.params.id;
    var file_path  = req.files.image.path;
    var message    = "";
    var updateData = req.body;

    if( req.files ){
        if( userId != req.user.sub ){
            message = "you don\'t have permission to update this user";
            removeFiles(file_path, res, message );
        }else{
            var file_split = file_path.split('\\');
            var file_name  = file_split[2];
            var ext        = file_name.split('\.');
            var ext        = ext[1];
            if( ext == 'png' || ext == 'jpg' || ext == 'jpeg' || ext == 'gif' ){
                //updating the data of the user
                updateData.image = file_name;
                User.findByIdAndUpdate( userId, updateData,{new: true}, ( err, userUpdated ) => {
                    if( err )
                        return res.status(500).send({message: 'There was an error while updating the user, please try it again'});
                    if( !userUpdated )
                        return res.status(404).send({message: 'The user doesn\'t exist'});
            
                    return res.status(200).send({userUpdated});
                });

            }else{
                message = 'extention not valid';
                removeFiles( file_path, res, message );
            }
        }
    }else{
        res.status(200).send({message: 'no files have been uploaded'});
    }
}

function getImage( req, res ){
    var pathUploads = "./uploads/users/";
    var file_name   = req.params.nameFile;
    var file        = pathUploads+file_name;
    fs.exists(file, ( exists )=>{
        if( exists ){
            res.sendFile( path.resolve(file) );
        }else
            return res.status(400).send({message: "it was impossible to find the image"});
    });
}

function removeFiles( file_path, res, receivedMessage ){
    fs.unlink( file_path, ( err ) => {
        res.status(200).send({message: receivedMessage });        
    });
}

function getCounters( req, res ){
    var params         = req.body;
    var user_id        = req.user.sub;
    if( req.params.id ){
        user_id = req.params.id;
    }
    
    getIndividualStadistics( user_id ).then( ( counters )=>{
        if( counters )
            return res.status(200).send( counters );
    });
}

async function getIndividualStadistics( id_user ){

    var query           = { user: id_user };
    
    var followsCount = await Follow.count(query, (err, countValue )=>{
        if(err)
            return handleError(err);
        if(countValue)
            return( countValue );
    });

    query = { followed: id_user };
    var followedByCount = await Follow.count(query, (err, countValue )=>{
        if(err)
            return handleError(err);
        if(countValue)
            return( countValue );
    });

    return({followings: followsCount, followedBy: followedByCount });
}

module.exports = {
  home,
  pruebas,
  saveUser,
  loginUser, 
  getUser,
  getUsers,
  updateUser,
  uploadImage,
  getImage,
  getCounters
};