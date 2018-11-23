'use strict'

var jwt       = require('jwt-simple');
var moment    = require('moment');
var secretkey = 'secret_key_from_curso_mean_social';

exports.ensureAuth = function( req, res, next ){//request, response, next it's required to execute this before starting the next method
    
    if( !req.headers.authorization ){
         return res.status(403).send({ message: 'the header doesn\'t have any authentication' });
    }
    var token = req.headers.authorization.replace(/['"]+/g, '');
    try{
        var payload = jwt.decode( token, secretkey );

        if( payload.exp < moment().unix() ){
            return res.status(401).send({ message: 'the authentication is expired ' });    
        }else{
            //return res.status(200).send({ message: ' testing actions inside nodejs ' });    
        }
    }catch(ex){
        return res.status(404).send({ message: 'error verifying the authentication header' });
    }
    req.user = payload;

    next();
};