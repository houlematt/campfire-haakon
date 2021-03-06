'use strict';
chatroomApp.service('ChatroomService', ['$http', 'DASHBOARD_SERVICES_URL', function($http, DASHBOARD_SERVICES_URL) {
    var campfireService = {};

    campfireService.currentToken = '';
    campfireService.campfireUsers = new Array();

    /**
     * Get the recent messages for a room.
     * This function provides a way to limit the number of messages that are returned.
     * It also provides a way to only retrieve messages that occur after a specific message id.
     *
     * @param roomId The room we are getting the recent messages from.
     * @param limit optional parameter to limit the number of messages we get.
     * @param since_message_id optional parameter to specify the message id that you want to start from and get everything after.
     * @returns {*|Array|null|String|Object|HTMLElement}
     */
    campfireService.getRecentMessages = function getRecentMessages(roomId, limit, since_message_id) {
        var route = "/room/" + roomId + "/recent.json",
            parameters = new Array();

        if(limit) {
            parameters["limit"] = limit;
        } else {
            parameters["limit"] = 10;
        }

        if(since_message_id) {
            parameters["since_message_id"] = since_message_id;
        }

        return $http.get(DASHBOARD_SERVICES_URL+'/campfire?token='+campfireService.currentToken+'&route='+buildRoute(route, parameters));
    };

    /**
     * Create a new message for a room.
     *
     * @param roomId The room we are creating a new message too.
     * @param message The message we are creating.
     * @returns {*|HttpPromise}
     */
    campfireService.createMessage = function createMessage(roomId, message) {
        var route = "/room/" + roomId + "/speak.json";
        return $http.post(DASHBOARD_SERVICES_URL+'/campfire', {token:campfireService.currentToken,data:{message:{type:"TextMessage",body:message}}, route:route});
    };

    /**
     * Get room by id
     *
     * @param roomId The id of the room we are getting
     * @returns {*|Array|null|String|Object|HTMLElement}
     */
    campfireService.getRoom = function getRoom(roomId) {
        var route = "/room/" + roomId + ".json";
        return $http.get(DASHBOARD_SERVICES_URL+'/campfire?token='+campfireService.currentToken+'&route='+buildRoute(route));
    };

    /**
     * Get a list of rooms that the current user has access too.
     *
     * @returns {*|Array|null|String|Object|HTMLElement}
     */
    campfireService.getRooms = function getRooms() {
        var route = "/rooms.json";
        return $http.get(DASHBOARD_SERVICES_URL+'/campfire?token='+campfireService.currentToken+'&route='+buildRoute(route));
    };

    /**
     * Get user by id
     *
     * @returns {*|Array|null|String|Object|HTMLElement}
     */
    campfireService.getUser = function getUser(userId) {
        var route = "/users/" + userId + ".json";
        return $http.get(DASHBOARD_SERVICES_URL+'/campfire?token='+campfireService.currentToken+'&route='+buildRoute(route));
    };

    /**
     * Get the current user
     *
     * @returns {*|Array|null|String|Object|HTMLElement}
     */
    campfireService.getCurrentUser = function getCurrentUser() {
        var route = "/me.json";
        return $http.get(DASHBOARD_SERVICES_URL+'/campfire?token='+campfireService.currentToken+'&route='+buildRoute(route));
    };

    /**
     * Responsible for getting the user name that is associated to the provide user id.
     *
     * @param userId The user id we are getting the user name for.
     * @returns {*}
     */
    campfireService.getUserName = function getUserName(userId) {
        if(!userId) {
            return " ";
        }
        if(campfireService.campfireUsers[userId]) {
            return campfireService.campfireUsers[userId];
        } else {
            campfireService.getUser(userId).success(function(data) {
                if(data.user) {
                    var userName = data.user.name;
                    campfireService.campfireUsers[userId] = userName;
                    return userName;
                } else {
                    return " ";
                }
            }).error(function() {
                return " ";
            });
        }
    };

    /**
     * Helper function that will build the url route with the request parameters that are provided.
     *
     * @param route The url route we are adding request parameters too
     * @param params The request parameters that we are adding
     * @returns {*}
     */
    function buildRoute(route, params){
        var queryString = "";

        for(var key in params) {
            var value = params[key];
            queryString += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
        }
        if (queryString.length > 0){
            queryString = queryString.substring(0, queryString.length-1); //chop off last "&"
            route = route + "?" + queryString;
        }
        return route;
    }

    return campfireService;
}]);