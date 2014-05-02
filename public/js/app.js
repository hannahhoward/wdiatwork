'use strict';


// Declare app level module which depends on filters, and services
var githubApp = angular.module('githubApp',[])

githubApp.controller('GithubUsersCtrl', ['$scope', '$http', 'GithubUsers', 'GithubFeeds', function($scope, $http, GithubUsers, GithubFeeds) {
  $scope.users = {};

  GithubUsers.getUsers().then(function(users) {
    $scope.users = users;
  });

  $scope.loadFeed = function(user) {
    GithubFeeds.getFeed(user).then(function(feed) {
      $scope.entries = feed;
    });
  };

}])

githubApp.factory('GithubUsers', ['$http', '$q', 'SessionToken', function($http, $q, SessionToken){
  var GithubUsers = {};

  GithubUsers.getUsers = function(){
    var dataDefer = $q.defer();

    SessionToken.get().then(function(token){
      var url = 'https://api.github.com/teams/747913/members?per_page=100&access_token='+token;
      $http({method: 'GET', url: url}).success(
        function(data,status,headers,config){
          if(typeof data === "object"){
            dataDefer.resolve(data);
          }
        });
    });

    return dataDefer.promise;
  };

  return GithubUsers;

}]);

githubApp.factory('GithubFeeds', ['$http', '$q', 'SessionToken', function($http, $q, SessionToken){
  var GithubFeeds = {};

  GithubFeeds.getFeed = function(user){
    var dataDefer = $q.defer();

    SessionToken.get().then(function(token){
      var url = user.events_url.replace("{/privacy}", "?per_page=100&access_token=") + token;
      $http({method: 'GET', url: url}).success(
        function(data,status,headers,config){
          if(typeof data === "object"){
            dataDefer.resolve(data);
          }
        });
    });

    return dataDefer.promise;
  };

  return GithubFeeds;

}]);

githubApp.factory('SessionToken', ['$window', '$http', '$q', function($window, $http, $q) {
  var SessionToken = {}

  SessionToken.get = function() {
    var dataDefer = $q.defer();

    if ($window.sessionStorage.token) {
      dataDefer.resolve($window.sessionStorage.token);
    } else if (typeof(oauth2Token) !== 'undefined') {
      $window.sessionStorage.token = oauth2Token;
      dataDefer.resolve($window.sessionStorage.token);
    } else {
      $window.location.href = "/login";
    }
    return dataDefer.promise;
  };

  return SessionToken;

}])