'use strict';

module.exports = function(app) {
  app.controller('UserController', ['$http', '$location', 'ErrorHandler', 'AuthService', 'NavigationService', UserController]);
};

function UserController($http, $location, ErrorHandler, AuthService, NavigationService) {
  this.$http = $http;
  this.ladder = [];
  this.user;
  this.selectedPlayer = {};
  // console.log('id', playerID && playerID.id );

  const url = 'http://localhost:3000/users/';

  this.getLadder = function() {
    $http.get(url)
    .then((res) => {
      let users = res.data;
      this.ladder = users.sort(function(a,b) {
        return a.rank - b.rank;
      });
    }, ErrorHandler.logError('Error getting users'));
  };

  this.getUser = function(user) {
    $http.get(url + user._id)
    .then((res) => {
      this.user = res.data;
    }, ErrorHandler.logError('Error getting user'));
  }.bind(this);

  this.challenge = function(user) {
    user.hasChallenge = AuthService.getCurrentUser();
    $http.put('http://localhost:3000/challenge', user)
    .then(() =>{

    }, ErrorHandler.logError(`Error adding challenge to ${user.username}.`));
  };

  this.finishMatch = function() {
    let user = AuthService.getCurrentUser();
    user.hasChallenge = null;
    $http({
      method: 'PUT',
      data: user,
      headers: {
        token: AuthService.getToken()
      },
      url: url
    })
    .then(
      // POST to log?
    );
  };

  this.deleteUser = function(user) {
    $http({
      method: 'DELETE',
      data: user,
      headers: {
        token: AuthService.getToken()
      },
      url: url + user._id
    })
    .then(() => {
      this.ladder.splice(this.ladder.indexOf(user), 1);
      for(var i = this.ladder.indexOf(user); i < this.ladder.length; i++) {
        if(this.ladder[i].rank > user.rank) {
          this.ladder[i].rank --;
          $http({
            method: 'PUT',
            data: this.ladder[i],
            headers: {
              token: AuthService.getToken()
            },
            url: url
          })
          .then((res) => {
            console.log(res);
          }, ErrorHandler.logError('Error updating database'));
        }
      }

    }, ErrorHandler.logError('Error deleting user'));
  }.bind(this);

  this.goToProfile = function(player) {
    this.selectedPlayer = player;
    NavigationService.goToProfile(player);

  }.bind(this);
}
