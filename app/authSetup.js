'use strict';

module.exports = function(passport, GithubStrategy, BearerStrategy, UserDB) {
  passport.use('github', new GithubStrategy({
    clientID: process.env['GITHUB_CLIENT'],
    clientSecret: process.env['GITHUB_SECRET'],
    callbackURL: (process.env['SERVER_URL']+'/callback')
    }, function(accessToken, refreshToken, profile, done) {
      UserDB.findOrCreate({username: profile.id,
        email: profile.email,
        accessToken: accessToken}, function(err, user) {
          done(err, user);
        });
    })
  );

  passport.use('bearer', new BearerStrategy(function(token, done) {
    UserDB.findOne({accessToken: token}, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user);
    });
  }));

}