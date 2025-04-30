let command_tree = "test rename mychar";

function dispatchCommand(command_tree) {
    const parts = command_tree.split(" ");
    let current = command_tree;

    for (const part of parts) {
        if (!current[part]) {
            io.emit('server_broadcast_all', `Command not found: ${part}`);
            return;
        }
        current = current[part];
    }

    console.log(current)
}

// Example usage
dispatchCommand("test char_select mia");




export let myDict = {
    key: function() {
        socket.emit("user_input_name", hi);
    }
};

