/*globals dashboardApp,WidgetDirective*/
'use strict';
chatroomApp.run(['DashboardWidgetService', function(DashboardWidgetService) {
    DashboardWidgetService.register({
        name: 'Campfire Room',
        app: 'chatroom',
        description: 'Use this to track conversations in campfire rooms that you are a member of',
        directive: 'campfire-widget',
        icon:'/chatroom/images/campfire-logo.png',
        defaultSettings: {
        },
        displayOrder: 300,
        requiredSettings: [],
        unconfiguredViewFile: 'campfire_unconfigured',
        availableFilters : [],
        availableSettings : ['title'],
        hasCustomSettings: true,
        reportAs: 'html'
    });

}]);
chatroomApp.directive('campfireWidget',  ['DashboardWidgetService', 'ChatroomService', '$interval', function(DashboardWidgetService, ChatroomService, $interval){

    var campfireWidget = DashboardWidgetService.getWidget('campfire-widget');
    campfireWidget.maximizedViewFile = 'campfire_widget_max';

    var campfireWidgetController = function textWidgetController ($scope){

        var fakeMessage = {
          "message": {
            "id": 1,
            "room-id": "1",
            "user-id": "2",
            "body": "Hello Room",
            "created-at": "2009-11-22T23:46:58Z",
            "type": "Starred",
            "starred": "true"
          }
        };

        var data =    {
            "messages": []
        };
        $scope.text = 'Test';
        $scope.data = [];
        $scope.sendMessage = function(){
            var message = angular.copy($scope.text);
            //ChatroomService.createMessage(1234,message);
            console.log(message);
            $scope.text = '';
        }
        //console.log(data);
        for (var i = 10 - 1; i >= 0; i--) {
            data.messages.push(
                {
                    "type": "TextMessage",
                    "user_id": 1362995,
                    "id": 1326583658,
                    "room_id": 599528,
                    "starred": false,
                    "body": "hey justin",
                    "created_at": "2014/07/25 13:44:52 +0000"
                }
            );
        };
        function getMessages(){
            ChatroomService.getRecentMessages(599528).then(function(messages){
                console.log(messages);
                $scope.data = messages.data;
            });
        }
        
        //$interval(getMessages, 3000);

    };

    var campfireWidgetLink = angular.noop;

    return new WidgetDirective(campfireWidget, campfireWidgetLink, campfireWidgetController);
}]);
