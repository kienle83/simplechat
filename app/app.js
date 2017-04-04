
var app = angular.module('app', []);

app.controller('ChatController', function($scope) {
    var socket = io();
    var $messageInput = $('#message');
       
    socket.on('connection on off', function(number) {
        $('#totalConnectedUsers').text(number);
    });

    socket.on('chat message', function(message, name) {
        appendMessage(false, message, name);
    });

    socket.on('typing', function(isTyping, name) {
        if (isTyping) {
            $('#loginUserName').text(name);
            $('#isTyping').show();
        } else {
            $('#isTyping').hide();
        }
    });

    $scope.$watch('message', function(newValue, oldValue) {
        if (newValue != oldValue && newValue != '') {
            socket.emit("typing", true, loginUser);
        } else {
            socket.emit("typing", false, loginUser);
        }
    });
    
    $scope.submitLogin = function() {
        if ($scope.loginUser != "") {
            socket.emit('new user', $scope.loginUser);
            $('#onlineUserName').text($scope.loginUser);
            
            $scope.loginUser = '';            
            $('#login-form').hide();
            $('#chat-container').show();
            $messageInput.select();
        }        
    };
    
    $scope.submitChat = function() {
        if ($scope.message != "") {
            socket.emit('chat message', $scope.message);
            appendMessage(true, $scope.message);
            
            $scope.message = '';
            $messageInput.select();
            socket.emit("typing", false);
        }        
    };

    $('#chat-form').submit(function() {
        if ($messageInput.val() && $messageInput.val() != "") {
            socket.emit('chat message', $messageInput.val());
            appendMessage(true, $messageInput.val());
            $messageInput.val('');
            $messageInput.select();
            socket.emit("typing", false);
        }
        return false;
    });


    function appendMessage(isMyMessage, message, name) {
        var liClass   = isMyMessage ? "li-mime" : "li-guest";
        var textClass = isMyMessage ? "text-mime" : "text-guest";
        var messageHtml = '<li class="'+liClass+'"><div class="'+textClass+'">' + (isMyMessage ? '' : '<div><strong>'+name+'</strong></div>') + message + '</li>';
        $('#messages').append(messageHtml);
    }
});
