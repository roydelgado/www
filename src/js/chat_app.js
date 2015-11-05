'use strict';
//initialize socket
var Chat = function(socket) {
    this.socket = socket;
};
//send message
Chat.prototype.sendMessage = function(room, text) {
    //console.log('sendingMsg:',room, text);
    this.socket.emit('message', {
        room: room,
        text: text
    });
};
//change rooms
Chat.prototype.changeRoom = function(room) {
    this.socket.emit('join', {
        newRoom: room
    });
};
//process chat commands: join and nick
Chat.prototype.commandExec = function(command) {
    var words = command.split(' ')
      , command = words[0].substring(1, words[0].length).toLowerCase()
      , message = false
      , room
      , name;
    //console.log('command received:', command)
    switch(command) {
        case 'join' :
            words.shift();
            room = words.join(' ');
            this.changeRoom(room);
            break;
        case 'nick' :
            words.shift();
            name = words.join(' ');
            this.socket.emit('nameChange', name);
            break;
        default:
            message = 'u wot m8??';
            break;
    }
    //console.log('message is:', message)
    return message;
};