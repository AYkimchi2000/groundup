// #region init express&socket
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const app = express();
const server = createServer(app);
const io = new Server(server);
const fs = require('fs');


// send files within the serve folder to client
app.use(express.static('serve'));


// user connect message
io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// #region command parsing 
io.on('connection', (socket) => {
  socket.on('client_command_input', (msg) => {
    const commandTree = JSON.parse(fs.readFileSync('./commandtree.json', 'utf8'));
    const parts = msg.split(" ");
    let current = commandTree;
    for (const part of parts) {
      if (!current[part]) {
        io.emit('server_broadcast_all', `Command not found: ${part}`);
        return;
      }
      current = current[part];
    }

    if (typeof current === "string") {
      io.emit('server_broadcast_all', current);
    } else {
      io.emit('server_broadcast_all', "Incomplete command");
    }

  });
});


server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});


// test
//   rename
//     user_input_name
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
//     playername
//     view_member
//     invite




