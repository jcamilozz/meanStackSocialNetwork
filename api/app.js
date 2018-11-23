'use strict'

var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();

//cargar rutas
var user_routes        = require('./routes/user');
var follow_routes      = require('./routes/follow');
var message_routes     = require('./routes/message');
var publication_routes = require('./routes/publication');


//cargar middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

//cors

//rutas
app.get('/', (req, res) =>{
    res.status(200).send({
        message: "hello world, we're learning together, please enjoy this"
    });
} );

app.get('/pruebas', (req, res) =>{
    res.status(200).send({
        message: "testing actions in nodejs server"
    });
});

app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', message_routes);
app.use('/api', publication_routes);


//exportar
module.exports = app;