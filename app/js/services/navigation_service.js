'use strict';

module.exports = function(app) {
  app.factory('NavigationService', function($location) {
    const service = {};

    service.goToLadder = function() {
      $location.path('/ladder');
    };

    service.goToProfile = function(player) {
      $location.path('/profile/' + player._id);
    };

    service.goToEdit = function(player) {
      $location.path('/edit/' + player._id);
    };

    service.goHome = function() {
      $location.path('/');
    };

    service.goToSignup = function() {
      $location.path('/signup');
    };
    return service;
  });
};
