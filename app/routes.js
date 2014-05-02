 // app/routes.js

  module.exports = function(app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // route to handle creating (app.post)
    // route to handle delete (app.delete)

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
      res.render('index')
    });

  };
