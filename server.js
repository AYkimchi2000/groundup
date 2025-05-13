// #region init express&socket
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const app = express();
const server = createServer(app);
const io = new Server(server);
const fs = require('fs');
const { Command } = require('commander');
const program = new Command();



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
    // #region command tree + parsing
    const commandTree = {
      test: {
        rename: {
          '<name>': (name) => {
            if (io && socket) {
              io.to(socket.id).emit("server_broadcast_all", `hi there, ${name}`);
            } else {
              console.error("io or socket is not defined in the rename command action.");
            }
          }
        },
        combat_init: {
          alone: () => console.log('alone'),
          party: () => console.log('party')
        }
      }
    };

    const descriptions = {
      main: 'Main command',
      test: 'Test command help',
      rename: 'Rename something',
      '<name>': 'The new name',
      combat_init: 'Combat setup',
      alone: 'Start combat alone',
      party: 'Start combat with a party'
    };

    function buildCommands(name, tree, descriptions = {}) {

      const cmd = new Command(name);
      if (descriptions[name]) cmd.description(descriptions[name]);

      for (const key in tree) {
        const val = tree[key];

        if (typeof val === 'function') {
          cmd.command(key)
            .description(descriptions[key] || '')
            .action(val);
        } else {
          const subKeys = Object.keys(val);
          const isArgCommand = subKeys.length === 1 && (subKeys[0].startsWith('<') || subKeys[0].startsWith('['));
          if (isArgCommand) {
            const [arg] = subKeys;
            const fn = val[arg];
            const subCmd = new Command(key);
            if (descriptions[key]) subCmd.description(descriptions[key]);
            subCmd.argument(arg, descriptions[arg] || '').action(fn);
            cmd.addCommand(subCmd);
          } else {
            const subCmd = buildCommands(key, val, descriptions);
            cmd.addCommand(subCmd);
          }
        }
      }

      return cmd;
    }

    const program = buildCommands('main', commandTree, descriptions);
    program.exitOverride();

    program.helpInformation = () => {
      return 'Custom help message goes here. Available commands:\n' + program.commands.map(cmd => `  ${cmd.name()}: ${cmd.description()}`).join('\n');
    };

    const testCommand = program.commands.find(cmd => cmd.name() === 'test');
    if (testCommand) {
      testCommand.helpInformation = () => {
        let help = 'Help for the "test" command:\n';
        help += testCommand.commands.map(subCmd => `  ${testCommand.name()} ${subCmd.name()} ${subCmd._args.map(arg => arg.humanReadableArgName).join(' ')}: ${subCmd.description()}`).join('\n');
        return help;
      };
    }

    const handleCommand = (msg) => {
      const parts = msg.split(" ");
      parts.unshift(process.argv[0], 'some_script');
      try {
        program.parse(parts);
      } catch (err) {
        console.error('Command parsing error:', err.message);
        socket.emit("server_broadcast_all", `Command parsing error: ${err.message}`);
      }
    };

    // Example usage within your socket event handler
    // socket.on('message', (msg) => {
    //   handleCommand(msg);
    // });
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




