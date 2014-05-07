 // app/routes.js

  module.exports = function(app, passport) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // route to handle creating (app.post)
    // route to handle delete (app.delete)


    app.get('/login',
      passport.authenticate('github', { session: false}));

    app.get('/callback',
      passport.authenticate('github', { session: false, failureRedirect: '/login' }),
      function(req, res) {
        res.writeHead(302, {
          'Location': '/#/index?token=' + req.user.accessToken
        });
        res.end();
      });

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
      res.sendfile('./public/index.html');
    });


  };
