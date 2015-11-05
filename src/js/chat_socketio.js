var socket = io();

$(document).ready(function() {
    var chatApp = new Chat (socket);

    socket.on('nameResult', function(result) {
        var message;

        if (result.success) {
            message = 'You have respawned as ' + result.name + '.';
        } else {
            message = result.message;
        }
        $messages.append(trustedContent(message));
    });

    socket.on('joinResult', function(result) {
        $room.text(result.room);
        $messages.append(trustedContent('Jumped into '+ result.room + ' bandwagon'));
    });

    socket.on('message', function(message) {
        var newMessage = $('<div></div>').text(message.text);
        $messages.append(newMessage);
    });

    socket.on('rooms', function(rooms) {
        $roomList.empty();

        for (var room in rooms) {
            if (room !== '') {
                $roomList.append(sanitizedContent(room));
            }
        }

        $roomList.find('div').on('click', function(e) {
            chatApp.commandExec('/join ' +  $(this).text());
            $message.focus();
        });
    });

    var timer = setTimeout(function roomsAvailable() {
        socket.emit('rooms');
        timer = setTimeout(roomsAvailable, 3000);
    }, 1000);

    $message.focus();

    $form.submit(function(e) {
        //console.log('sending');
        processUserInput(chatApp, socket);
        return false;
    });
});