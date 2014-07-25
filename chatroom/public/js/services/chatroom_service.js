'use strict';
chatroomApp.service('ChatroomService', ['$http', 'CoreUserService', function($http, CoreUserService) {
    var campfireService = {},
        appSettings = CoreUserService.getAppSettings('chatroom'),
        campfireAPIToken = '86f0e7a972be8a09a31c0346e87493dce3b91a40',
        CAMPFIRE_DOMAIN = "https://" + campfireAPIToken + ":x@meltwater.campfirenow.com";

    campfireService.getRecentMessages = function getRecentMessages(roomId) {
        var url = CAMPFIRE_DOMAIN + "/room/" + roomId + "/recent.json";
        return $http.get(url);
    };

    campfireService.createMessage = function createMessage(roomId, message) {
        var url = CAMPFIRE_DOMAIN + "/room/" + roomId + "/speak.json";
        return $http.post(url, message);
    };

    return campfireService;
}]);