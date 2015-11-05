var $message = $('#chat-form__msg')
  , $messages = $('#messages')
  , $room = $('#room')
  , $roomList = $('#room-list')
  , $form = $('#chat-form')
  , message
  , systemMessage
  , sanitizedContent = function(message) {
        return $('<div/>').text(message);
    }
  , trustedContent = function(message) {
        return $('<div/>').html('<i>' + message + '</i>');
    }
  , processUserInput = function(chatApp, socket) {
        message = $message.val();
        //console.log('input', message)
        if (message.charAt(0) === '/') {
            systemMessage = chatApp.commandExec(message);
            //console.log('sysMsg:',systemMessage)
            if (systemMessage) {
                $messages.append(trustedContent(systemMessage));
            }
        } else {
            //console.log(chatApp,$room.text(),message)
            chatApp.sendMessage($room.text(), message);
            $messages.append(sanitizedContent(message));
            $messages.scrollTop($messages.prop('scrollHeight'));
        }

        $message.val('');
    }