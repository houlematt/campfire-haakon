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
chatroomApp.directive('campfireWidget',  ['DashboardWidgetService', 'ChatroomService', '$interval', '$filter', function(DashboardWidgetService, ChatroomService, $interval, $filter){

    var campfireWidget = DashboardWidgetService.getWidget('campfire-widget');
    campfireWidget.maximizedViewFile = 'campfire_widget_max';

    var campfireWidgetController = function campfireWidgetController($scope){

        $scope.text = 'Test';
        $scope.data = [];
        $scope.msgtext = {
            message:''
        };
        $scope.sendMessage = function(){
            var message = angular.copy($scope.msgtext.message);
            ChatroomService.createMessage($scope.widget.settings.roomId, message);
            $scope.msgtext.message = '';
        }

        $scope.renderMessage = function(message){
            if(message.type === 'TimestampMessage'){
                return $filter('mwDate')(new Date(message.created_at));
            } else if (message.type === 'EnterMessage'){
                return 'User ' + message.user_id + ' entered at ' +message .created_at;
            } else if (message.type === 'AllowGuestsMessage'){
                return 'User ' + ChatroomService.getUserName(message.user_id) + ' allowed ';
            } else if(message.type === 'KickMessage'){
                return 'User ' + ChatroomService.getUserName(message.user_id) + ' left ';
            } else if(message.type === 'TextMessage'){
                return message.body;
            } else {
                return '';
            }
        }

        
        var lastMessageReceived = null;
        function getMessages(){
            ChatroomService.getRecentMessages($scope.widget.settings.roomId,15, lastMessageReceived).then(function(messages){
                $scope.data = messages.data;
                if(messages.data && messages.data.messages){
                    for (var i = messages.data.messages.length - 1; i >= 0; i--) {
                        messages.data.messages[i].userName = ChatroomService.getUserName(messages.data.messages[i].user_id);
                        messages.data.messages[i].created_at = new Date(messages.data.messages[i].created_at);
                        if(i === 0){
                            lastMessageReceived = messages.data.messages[i].id;
                        }
                    };
                }
            });
        }


        function isWidgetReady(){
            if($scope.widget && $scope.widget.settings && $scope.widget.settings.roomId && $scope.widget.settings.userToken){
                return true;
            }
            return false;
        }
        if(isWidgetReady()){
            ChatroomService.currentToken = $scope.widget.settings.userToken;
            getMessages();
            $interval(getMessages, 3000);
        }
    };

    var campfireWidgetLink = angular.noop;

    return new WidgetDirective(campfireWidget, campfireWidgetLink, campfireWidgetController);
}]).directive('ngEnter', function() {
    return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
        if(event.which === 13) {
            scope.$apply(function(){
            scope.$eval(attrs.ngEnter);
            });
            event.preventDefault();
        }
        });
    };
});
