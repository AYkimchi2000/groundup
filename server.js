// #region init express&socket
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const app = express();
const server = createServer(app);
const io = new Server(server);
const fs = require('fs');

let online_player_count = ""
let online_party_list = ""
let party_info = ""
let created_character_data = ""


// send files within the serve folder to client
app.use(express.static('serve'));

// user connect message
io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`);
  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
  });
});

// #region command parsing & execution
io.on('connection', (socket) => {
  socket.on('client_command_input', (msg) => {
    console.log(`user ${socket.id} sent something`);

    // #region command tree
    const command_tree = {  
      test: {
        rename: {
          user_input_name: function () {
            io.to(socket.id).emit('server_broadcast_all', `you are ${socket.id}!`);
          }
        },
        combat_init: {
          "y/n": function () {
            console.log('this is again, working')
          }
        },
        char_select: {
          elliot: function () {
            socket.emit("elliot", hi);
          },
          clarissa: function () {
            socket.emit("clarissa", hi);
          },
          mia: function () {
            socket.emit("mia", hi);
          }
        },
        enemy_select: {
          goblin: function () {
            socket.emit("goblin", hi);
          },
          skeleton: function () {
            socket.emit("skeleton", hi);
          },
          wolves: function () {
            socket.emit("wolves", hi);
          }
        },
        party: {
          playername: function () {
            socket.emit("playername", hi);
          },
          view_member: function () {
            socket.emit("view_member", hi);
          },
          invite: function () {
            socket.emit("invite", hi);
          }
        }
      }
    };
    // #endregion 

    // #region command tree walker
    const parts = msg.split(" ");
    let current = command_tree;
    for (const part of parts) {
      if (!current[part]) {
        io.emit('server_broadcast_all', `Command not found: ${part}`);
        return;
      }
      current = current[part];
    }
    current();
    // #endregion

  });
});
// #endregion

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




