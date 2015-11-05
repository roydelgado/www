var express = require('express')
  , app = express()
  , cons = require('consolidate') // templating library adapter for Express
  , MongoClient = require('mongodb').MongoClient 
  , routes = require('./src/routes')
  , fs = require('fs')
  , path = require('path')
  , mime = require('mime')
  , ChatServer = require('./src/lib/chat_server') ;


var port = process.env.PORT || 4321
  , server;

MongoClient.connect('mongodb://localhost:27017/blog', function(err, db) {
    "use strict";
    if (err) throw err;

    //serve public files
    app.use(express.static(__dirname + '/public'));
    // Register our templating engine
    app.engine('html', cons.swig);
    app.set('view engine', 'html');
    app.set('views', __dirname + '/src/views');

    // Express middleware to populate 'req.cookies' so we can access cookies
    app.use(express.cookieParser());

    // Express middleware to populate 'req.body' so we can access POST variables
    app.use(express.bodyParser());

    // Application routes
    routes(app, db);

    server = app.listen(port);
    console.log('Express server listening on port ' + port);

    ChatServer.listen(server);
    console.log('SocketIO initialized for /chat');

});