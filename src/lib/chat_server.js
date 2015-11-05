var socketio = require('socket.io')
  , io
  , guestNumber = 1
  , nicknames = {}
  , usedNicknames = []
  , currentRoom = {}
  , availableRooms = {};


exports.listen = function(server) {
    //start socker.io server with piggyback on existing server
    io = socketio.listen(server);
    //io.set('log level', 1);

    io.sockets.on('connection', function(socket) {
        //assign nickname to guests on new connections
        guestNumber = assignNickname(socket, guestNumber, nicknames, usedNicknames);
        //ride user to Valhalla
        joinRoom(socket, 'Valhalla');
        //handle user messages
        handleMessageBroadcasting(socket, nicknames);
        //handle nickname change
        handleNameChange(socket, nicknames, usedNicknames);
        //create/change room
        handleRoomJoining(socket);
        //provide user with occupied rroms
        socket.on('rooms', function() {
            //old < 1.0
            //socket.emit('rooms', io.sockets.manager.rooms);
            //console.log('rooms available', io.sockets.adapter.rooms);
            var adapterRooms = io.sockets.adapter.rooms;
            for (var r in adapterRooms) {
                if (adapterRooms[r]['__isVisible']) {
                    availableRooms[r] = adapterRooms[r];
                }
            }
            socket.emit('rooms', availableRooms);
        });
        //cleanup logic when user disconnects
        handleClientDisconnection(socket, nicknames, usedNicknames);
    })

};

//each new conn is "Guest" followed by a number that increments each time a new user connects
function assignNickname(socket, guestNumber, nicknames, usedNicknames) {
    'use strict';
    //get new nickname
    let name = 'Guest' + guestNumber;
    //associate nickname with connection ID
    nicknames[socket.id] = name;
    //let user know its nickname
    socket.emit('nameResult', {
        success: true,
        name: name
    })
    //make note nickname is now already in use
    usedNicknames.push(name);
    //increment guests counter
    return ++guestNumber;
}

//handles a user joining a chat room
function joinRoom(socket, room) {
    'use strict';
    //put the user in a room then make note of it
    //console.log(socket.id,'joinRoom ->', room)
    socket.join(room);
    currentRoom[socket.id] = room;
    io.sockets.adapter.rooms[room]['__isVisible'] = true;
    //let the user know the new room and notify other users in same room
    socket.emit('joinResult', {
        room: room
    });
    socket.broadcast.to(room).emit('message', {
        text: nicknames[socket.id] + ' kicks the door and enters to ' + room + '.'
    })
    //check if there's any other users in room and notify new user
    //old <1.0
    //let usersInRoom = io.sockets.clients(room)
    let usersInRoom = Object.keys(io.sockets.adapter.rooms[room]);
    // console.log('users in room------------\n', usersInRoom);
    if (usersInRoom.length > 1) {
        let userSocketId
          , usersInRoomList = 'Current users: ';
        for (let i in usersInRoom) {
            userSocketId = usersInRoom[i];
            // console.log('iterating users----------\n', userSocketId);
            //usersInRoomList += (i > 0) ? '.' : nicknames[userSocketId] + ',' ;
            if (userSocketId !== socket.id) {
                if (i > 0) {
                    usersInRoomList += ', ';
                }
                usersInRoomList += nicknames[userSocketId];
            }
        }
        usersInRoomList += '.';
        //send list to the newly connected user in the room
        socket.emit('message', {
            text: usersInRoomList
        });
    }
}

//a name change involves the client's browser making a request via socket.io 
//and then receiving a response from the server
function handleNameChange(socket, nicknames, usedNicknames) {
    'use strict';

    socket.on('nameChange', function(name) {
        //don't allow nicknames beginning with, Guest
        //TODO: use regex instead?
        if (name.toLowerCase().indexOf('guest') === 0) {
            socket.emit('nameResult', {
                success: false,
                message: 'Custom nicknames can\'t begin with "Guest"'
            });
        } else {
            //name not in use
            if (usedNicknames.indexOf(name) === -1) {
                let oldNickname = nicknames[socket.id],
                    oldNicknameIndex = usedNicknames.indexOf(oldNickname);
                usedNicknames.push(name);
                nicknames[socket.id] = name;
                delete usedNicknames[oldNicknameIndex];

                //return a successful name plus broadcast the change to the room
                socket.emit('nameResult', {
                    success: true,
                    name: name
                });
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text: oldNickname + ' is no longer. Long live ' + name + '!'
                });
            } else {
                socket.emit('nameResult', {
                    success: false,
                    message: '"' + name +'" already in use'
                });
            }
        }
    });
}

//sending chat messages: the user emits an event indicating where is the message going to.
//server will relay the message to all users in that room
function handleMessageBroadcasting(socket) {
    'use strict';
    socket.on('message', function(message) {
        socket.broadcast.to(message.room).emit('message', {
            text: nicknames[socket.id] + ' > ' + message.text
        });
    });
}

//joining/creating a new room
//client -> server send 'join' event
//client <- server 'joinResult' event with room info
function handleRoomJoining(socket) {
    'use strict';
    socket.on('join', function(room) {
        //exit current room
        socket.broadcast.to(currentRoom[socket.id]).emit('message', {
            text: '--- ' + nicknames[socket.id] + ' abandoned thread. Jumped to: ' + room.newRoom + ' ---'
        })
        socket.leave(currentRoom[socket.id]);
        //join new room
        joinRoom(socket, room.newRoom);
    });
}

//remove user info when (s)he disconnects
function handleClientDisconnection(socket, nicknames, usedNicknames) {
    'use strict';
    socket.on('disconnect', function() {
        let nicknameIndex = usedNicknames.indexOf(nicknames[socket.id]);
        delete usedNicknames[nicknameIndex];
        delete nicknames[socket.id];
    });
}