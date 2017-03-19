
var app = angular.module('app', []);

app.controller('ChatController', function($scope) {
    var socket = io();

    var $messageInput = $('#message');

    $('#login-form').submit(function() {
        if ($('#loginUser').val() && ($('#loginUser').val() != "")) {
            socket.emit('new user', $('#loginUser').val());

            $('#onlineUserName').text($('#loginUser').val());
            $('#loginUser').val('');
            $('#login-form').hide();
            $('#chat-container').show();
            $messageInput.select();
        }
        return false;
    });


    $('#chat-form').submit(function() {
        if ($messageInput.val() && $messageInput.val() != "") {
            socket.emit('chat message', $messageInput.val());
            appendMessage(true, $messageInput.val());
            $messageInput.val('');
            $messageInput.select();
        }
        return false;
    });

    socket.on('connection on off', function(number) {
        $('#totalConnectedUsers').text(number);
    });

    socket.on('chat message', function(message, name) {
        appendMessage(false, message, name);
    });

    function appendMessage(isMyMessage, message, name) {
        var liClass   = isMyMessage ? "li-mime" : "li-guest";
        var textClass = isMyMessage ? "text-mime" : "text-guest";
        var messageHtml = '<li class="'+liClass+'"><div class="'+textClass+'">' + (isMyMessage ? '' : '<div><strong>'+name+'</strong></div>') + message + '</li>';
        $('#messages').append(messageHtml);
    }
});