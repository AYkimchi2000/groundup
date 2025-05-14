const command_tree = {
    test: {
        rename: {
            '<name>': (name) => io.to(socket.id).emit("server_broadcast_all", `hi there, ${name}`)
        },
        combat_init: {
            "y/n": function () {
                io.to(socket.id).emit("placeholder")
            }
        },
        char_select: {
            elliot: function () {
                io.to(socket.id).emit("placeholder")
            },
            clarissa: function () {
                io.to(socket.id).emit("placeholder")
            },
            mia: function () {
                io.to(socket.id).emit("placeholder")
            }
        },
        enemy_select: {
            goblin: function () {
                io.to(socket.id).emit("placeholder")
            },
            skeleton: function () {
                io.to(socket.id).emit("placeholder")
            },
            wolves: function () {
                io.to(socket.id).emit("placeholder")
            }
        },
        party: {
            playername: function () {
                io.to(socket.id).emit("placeholder")
            },
            view_member: function () {
                io.to(socket.id).emit("placeholder")
            },
            invite: function () {
                io.to(socket.id).emit("placeholder")
            }
        }
    }
};

