'use strict'

var mongoose     = require('mongoose');
var app          = require('./app');
var port         = 3800;

//dataBase connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean_social',{ useMongoClient: true })
        .then( ()   => {
                
                console.log( " !!  connection to bd curso_mean_social has been done successfully ¡¡ " ); 
                //server creation
                app.listen(port, ()=> {
                        console.log( "server reachable from localhost new" )
                })
                
        }).catch( err => console.log(err) );
