'use strict';


// Declare app level module which depends on filters, and services
var githubApp = angular.module('githubApp',['ngRoute']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/feeds/:id', {templateUrl: 'partials/feed.html', controller: 'GithubFeedsCtrl'});
  $routeProvider.when('/index', {templateUrl: 'partials/index.html', controller: 'GithubIndexCtrl'});
  $routeProvider.otherwise({redirectTo: '/index'});
}]);

githubApp.controller('GithubIndexCtrl', ['$routeParams', 'SessionToken', function($routeParams, SessionToken){
  if ($routeParams.token) {
    SessionToken.set($routeParams.token);
  } else {
    SessionToken.set(null);
  }
}]);

githubApp.controller('GithubUsersCtrl', ['$scope', 'GithubUsers', function($scope, GithubUsers) {
  $scope.users = {};

  GithubUsers.findAll().then(function(users) {
    $scope.users = users;
  });

}]);

githubApp.controller('GithubFeedsCtrl', ['$scope', '$routeParams', 'GithubFeeds', 'GithubUsers', 'SessionToken', function($scope, $routeParams, GithubFeeds, GithubUsers, SessionToken) {
  if ($routeParams.token) {
    SessionToken.set($routeParams.token);
  } else {
    SessionToken.set(null);
  }
  $scope.entries = {};
  GithubUsers.findOne($routeParams.id).then(function(user) {
    GithubFeeds.getFeed(user).then(function(feed) {
      $scope.entries = feed;
    });
  });
}]);

githubApp.factory('GithubUsers', ['$http', '$q', 'SessionToken', function($http, $q, SessionToken){
  var GithubUsers = {};

  GithubUsers.users = {};

  GithubUsers.findOne = function(id) {
    var dataDefer = $q.defer();

    if (GithubUsers.users[id]) {
      dataDefer.resolve(GithubUsers.users[id]);
    } else {
      SessionToken.get().then(function(token){
      var url = 'https://api.github.com/users/'+id;
      var headers = {};
      headers.Authorization = "token " + token;
      $http({headers: headers, method: 'GET', url: url}).success(
        function(data,status,headers,config){
          if(typeof data === "object"){
            GithubUsers.users[id] = data;
            dataDefer.resolve(data);
          }
        });
      });
    }

    return dataDefer.promise;
  };

  GithubUsers.findAll = function(){
    var dataDefer = $q.defer();

    dataDefer.resolve(GithubUsers.users);

    SessionToken.get().then(function(token){
    var url = 'https://api.github.com/teams/747913/members?per_page=100&access_token='+token;
    $http({method: 'GET', url: url}).success(
      function(data,status,headers,config){
        if(typeof data === "object"){
          data.forEach(function(item) {
            GithubUsers.users[item.login] = item;
          });
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
  SessionToken.dataDefer = $q.defer();

  SessionToken.set = function(token) {
    if (token) {
      $window.sessionStorage.token = token;
      SessionToken.dataDefer.resolve($window.sessionStorage.token);
    } else {
      if ($window.sessionStorage.token) {
        SessionToken.dataDefer.resolve($window.sessionStorage.token);
      } else {
        $window.location.href = "/login";
      }

    }
  };

  SessionToken.get = function() {

    if ($window.sessionStorage.token) {
      SessionToken.dataDefer.resolve($window.sessionStorage.token);
    }
    return SessionToken.dataDefer.promise;
  };

  return SessionToken;

}])