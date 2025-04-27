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
        io.emit('server_broadcast_all', '');

    });
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
// #endregion



