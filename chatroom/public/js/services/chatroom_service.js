'use strict';
chatroomApp.service('ChatroomService', ['$http', 'CoreUserService','DASHBOARD_SERVICES_URL','$q', function($http, CoreUserService, DASHBOARD_SERVICES_URL, $q) {
    var campfireService = {},
        appSettings = CoreUserService.getAppSettings('chatroom');


    campfireService.currentToken = '';

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

        return $http.get(DASHBOARD_SERVICES_URL+'/campfire?route='+buildRoute(route, parameters));
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
     * Get a list of rooms that the current user has access too.
     *
     * @returns {*|Array|null|String|Object|HTMLElement}
     */
    campfireService.getRooms = function getRooms() {
        var route = "/rooms.json";
        return $http.get(DASHBOARD_SERVICES_URL+'/campfire?route='+buildRoute(route));
    };

    /**
     * Get user by id
     *
     * @returns {*|Array|null|String|Object|HTMLElement}
     */
    campfireService.getUser = function getUser(userId) {
        var route = "/users/" + userId + ".json";
        return $http.get(DASHBOARD_SERVICES_URL+'/campfire?route='+buildRoute(route));
    };

    /**
     * Get the current user
     *
     * @returns {*|Array|null|String|Object|HTMLElement}
     */
    campfireService.getCurrentUser = function getCurrentUser() {
        var route = "/me.json";
        return $http.get(DASHBOARD_SERVICES_URL+'/campfire?route='+buildRoute(route));
    }

    /**
     * Helper function that will build the url route with the request parameters that are provided.
     *
     * @param route The url route we are adding request parameters too
     * @param params The request parameters that we are adding
     * @returns {*}
     */
    function buildRoute(route, params){
        var queryString = "";

        // check if there were any parameters passed in and initialize if necessary.
        if(!params) {
            params = new Array();
        }
        // we always need the token parameter so setting it here.
        params["token"] = campfireService.currentToken;

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