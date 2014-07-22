'use strict';
var chatroomApp = angular.module('chatroomApp',[]);
chatroomApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/chatroom/index', {templateUrl: '/chatroom/views/index', activeTab: 'Chatroom', controller: 'IndexCtrl'});
}]).run(['NavBarService', function(NavBarService) {
// Register the main nav item, if any
//    NavBarService.register({
//        label: 'Chatroom',
//        url: '/chatroom/index',
//        order: 100,
//        showIf: function(CoreCompanyService, CoreUserService) {
//            return true;
//        },
//        subNav: [
//            {label: "Tab One", url: "/chatroom/tabone"},
//            {label: "Tab Two", url: "/chatroom/tabtwo"}
//        ]
//    });

}]);