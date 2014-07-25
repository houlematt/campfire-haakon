'use strict';
var chatroomApp = angular.module('chatroomApp',[]);
chatroomApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/chatroom/index', {templateUrl: '/chatroom/views/index', activeTab: 'Chatroom', controller: 'IndexCtrl'});
}]).run(['NavBarService', function(NavBarService) {

}]);
