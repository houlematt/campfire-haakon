'use strict';
chatroomApp.service('ChatroomService', ['$http', 'CoreUserService','DASHBOARD_SERVICES_URL','$q', function($http, CoreUserService, DASHBOARD_SERVICES_URL, $q) {
    var campfireService = {},
        appSettings = CoreUserService.getAppSettings('chatroom'),
        campfireAPIToken = '86f0e7a972be8a09a31c0346e87493dce3b91a40',
        CAMPFIRE_DOMAIN = "https://" + campfireAPIToken + ":x@meltwater.campfirenow.com",
        CAMPFIRE_STREAMING_DOMAIN = "http://" + campfireAPIToken + ":x@meltwater.campfirenow.com";

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
        //var url = CAMPFIRE_DOMAIN + "/room/" + roomId + "/recent.json";
        var url = "/room/" + roomId + "/recent.json";

        var parameters = new Array();
        if(limit) {
            parameters["limit"] = limit;
        }
        if(since_message_id) {
            parameters["since_message_id"] = since_message_id;
        }
        url = buildUrl(url, parameters);

        return $http.get(DASHBOARD_SERVICES_URL+'/campfire?url='+url + '&token='+campfireAPIToken);
    };

    /**
     * Create a new message for a room.
     *
     * @param roomId The room we are creating a new message too.
     * @param message The message we are creating.
     * @returns {*|HttpPromise}
     */
    campfireService.createMessage = function createMessage(roomId, message) {
        var url = "/room/" + roomId + "/speak.json";
        return $http.post(DASHBOARD_SERVICES_URL+'/campfire', {token:campfireAPIToken,data:{message:{type:"TextMessage",body:message}}, url:url});
    };

    /**
     * Live stream of the messages for a room
     * @param roomId The room we are getting the live stream for.
     * @returns {*|Array|null|String|Object|HTMLElement}
     */
    campfireService.liveStream = function liveStream(roomId) {
        var url = CAMPFIRE_STREAMING_DOMAIN + "/room/" + roomId + "/live.json";
        return $http.get(url);
    };

    /**
     * Helper function that will build a url with the request parameters that are provided.
     *
     * @param url The url we are adding request parameters too
     * @param parameters The request parameters that we are adding
     * @returns {*}
     */
    function buildUrl(url, parameters){
        var queryString = "";
        for(var key in parameters) {
            var value = parameters[key];
            queryString += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
        }
        if (queryString.length > 0){
            queryString = queryString.substring(0, queryString.length-1); //chop off last "&"
            url = url + "?" + queryString;
        }
        return url;
    }

    return campfireService;
}]);