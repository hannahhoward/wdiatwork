// server.js

  // modules =================================================
  var express = require('express');
  var app     = express();
  var ejsLocals = require('ejs-locals');
  var githubOAuth = require('github-oauth')({
    githubClient: process.env['GITHUB_CLIENT'],
    githubSecret: process.env['GITHUB_SECRET'],
    baseURL: process.env['SERVER_URL'],
    loginURI: '/login',
    callbackURI: '/callback',
    scope: 'user, read:org' // optional, default scope is set to user
  })

  // configuration ===========================================

  // config files

  var port = process.env.PORT || 8080; // set our port
  // mongoose.connect(db.url); // connect to our mongoDB database (uncomment after you enter in your own credentials in config/db.js)

  app.configure(function() {
    app.engine('ejs', ejsLocals);
    app.set('views', __dirname + '/app/views');
    app.set('view engine', 'ejs');
    app.use(express.static(__dirname + '/public'));   // set the static files location /public/img will be /img for users
    app.use(express.logger('dev'));           // log every request to the console
    app.use(express.bodyParser());            // have the ability to pull information from html in POST
    app.use(express.methodOverride());          // have the ability to simulate DELETE and PUT
  });



  githubOAuth.addRoutes(app, function(err, token, serverResponse, tokenResponse) {
    if (err == false) {
      serverResponse.render('token', { token: token });
    } else {
      serverResponse.render('index')
    }
  })

  // routes ==================================================
  require('./app/routes')(app); // configure our routes

  // start app ===============================================
  app.listen(port);                   // startup our app at http://localhost:8080
  console.log('Magic happens on port ' + port);       // shoutout to the user
  exports = module.exports = app;             // expose app
