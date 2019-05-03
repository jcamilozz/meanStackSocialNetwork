'use strict'

var Publication = require('../models/publication');
var path        = require('path');
var fs          = require('fs');
var moment      = require('moment');
var mongoose_p  = require('mongoose-pagination'); 
var Follow      = require('../controllers/follow');
var User        = require('../controllers/user');

function home( req, res ){
    res.status(200).send({
        message: "hello world from publication controller, we're learning together, please enjoy this"
    });
}

function pruebas( req, res ){
    res.status(200).send({
        message: "testing actions in message server from publication_controller"
    });
}

function savePublication(req, res){
    var text      = "";
    var file_path = null;
    var newPublication = new Publication();
    var user_id   = req.user.sub; // user's publication id.

    if( req.body.text ){
        text = req.body.text;
    }else{
        return res.status(200).send({message: 'you should add a text'})
    }

    if( req.files ){
        file_path = req.files.image.path;

    }

    var file_split = file_path.split('\\');
    var file_name  = file_split[2];
    var ext        = file_name.split('\.');
    var ext        = ext[1];
    
    if( !(ext == 'png' || ext == 'jpg' || ext == 'jpeg' || ext == 'gif' ))
        return res.status(500).send({ message: 'The file is not an image, please try another one'});

    newPublication.user = user_id;
    newPublication.text = text;
    newPublication.file = file_name;
    newPublication.created_at = moment(moment()).format('YYYY-MM-DDTHH:mm:ss');

    newPublication.save( ( err, publicationStored )=>{

        if( err )
            return res.status(500).send({ message: 'error while storing your publication, please try it later'});
        
        return res.status(200).send({publicationStored});
        
    });
}

module.exports = {
    home,
    pruebas,
    savePublication
}