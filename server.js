// #region init express&socket
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('serve'));



//
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

io.on('connection', (socket) => {
    socket.on('client_command_input', (msg) => {
        console.log('nevermind');
        io.emit('server_broadcast_all', 'This is broadcaster');

    });
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
// #endregion



// #region command parsing 
io.on('connection', (socket) => {
  socket.on('client_command_input', (msg) => {
    let msg_splitted = msg.split()
      switch (msg_splitted[0]) {
        case 'test':
          switch (msg_splitted[1]){
            case 'rename':
              switch (msg_splitted[2]){
                
              }
            case 'combat_init':
              switch (msg_splitted[2]) {
                
              }
            case 'char_select':
              switch (msg_splitted[2]) {
                case 'elliot':
                case 'clarissa':
                case 'mia':
              }
            case 'enemy_select':
              switch (msg_splitted[2]) {
                case 'goblin':
                case 'skeleton':
                case 'wolves':
              }
            case 'party':
              switch (msg_splitted[2]) {
                case '{playername}':
                case 'view_member':
                case 'invite':
              }
          }
      }
    io.emit('server_broadcast_all', 'This is broadcaster');

  });
});


// test
//   rename
//     {whatevername}
//   combat_init
//     y/n
//   char_select
//     elliot
//     clarissa
//     mia
//   enemy_select
//     goblin
//     skeleton
//     wolves
//   party
//     {playername}
//     view_member
//     invite



    //chat
  

choose char > choose/add party member > accept invite > choose monster > initiate combat > 

// #endregion

