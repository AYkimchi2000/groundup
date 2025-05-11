const command_tree = {
    test: {
        rename: {
            user_input_name: function () {
                //function goes here
                console.log('this is working')
                io.to(socketId).emit('server_broadcast_all', 'client_specific_message is working!');
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

