 // app/routes.js

  module.exports = function(app, passport) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // route to handle creating (app.post)
    // route to handle delete (app.delete)


    app.get('/login',
      passport.authenticate('github'));

    app.get('/callback',
      passport.authenticate('github', { failureRedirect: '/login' }),
        function(req, res) {
          res.writeHead(302, {
            'Location': process.env['SERVER_URL']+'/#/index?token=' + req.user.token
          });
          res.end();
        });
    });

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
      res.sendfile('./public/index.html');
    });


  };
