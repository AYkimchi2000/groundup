const { response } = require("express");

// #region socket.io
const socket = io();

//print server broadcast to new text row
socket.on('server_broadcast_all', (broadcast_content) => {

});

// #region match client command 
document.getElementById("id_command_input_box").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault()
        if (document.getElementById("id_command_input_box").value) {
            switch (document.getElementById("id_command_input_box").value) {
                case 'help':
                case 'something':
                    defaut:
                    socket.emit('client_command_input', document.getElementById("id_command_input_box").value);
            }

        }
    }
});
// #endregion

//window.scrollTo(0, document.body.scrollHeight); (*depends if I want to set this to notification or just auto jump to the bottom)

// #endregion



// #region focus to inputbox when clicking
document.getElementById("id_prompt_panel").addEventListener("click", event => {
    document.getElementById("id_command_input_box").focus();
});
// #endregion

// #region typing sound effect
document.addEventListener('keydown', function () {
    var key_sound_1 = new Audio('1.wav');
    key_sound_1.play();

});
// #endregion

// #region toggle status panel
let visible = false;
document.addEventListener("keydown", event => {
    if (event.key === "Tab") {
        event.preventDefault();
        visible = !visible;
        document.getElementById("id_status_panel").style.display = visible ? "block" : "none";
    }
});
// #endregion


// #region enter key and historydeclare
document.getElementById("id_command_input_box").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (document.getElementById("id_command_input_box").value.trim()) {
            //save to command_history
            command_history.push(document.getElementById("id_command_input_box").value);
            historyIndex = command_history.length;

            // #region clone and replace last input command container
            const clone_of_previous_textrow = document.getElementById('id_text_row_container').cloneNode(true);
            clone_of_previous_textrow.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
            clone_of_previous_textrow.removeAttribute('id');
            const target_parent = document.getElementById("id_text_interface_container");
            const old_element = document.getElementById("id_text_row_container")

            const response_row_container = document.createElement('div');
            const response_row_prefix = document.createElement('div');
            const response_row_content = document.createElement('div');
            response_row_container.classList.add('response_row_container');
            response_row_prefix.classList.add('response_prefix_container');
            response_row_content.classList.add('response_row_content');
            response_row_prefix.textContent = 'Server: ';
            response_row_content.textContent = 'server response goes here';
            response_row_container.appendChild(response_row_prefix);
            response_row_container.appendChild(response_row_content);
            
            target_parent.insertBefore(clone_of_previous_textrow, old_element);
            document.getElementById('id_command_input_box').value = "";
            // #endregion
        }
    }
});
// #region nevermind
// #endregion


// #region up down arrow navigate history
const command_history = [];
let historyIndex = 0;
document.getElementById("id_command_input_box").addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && historyIndex > 0) {
        event.preventDefault();
        historyIndex--;
        document.getElementById("id_command_input_box").value = command_history[historyIndex];
        return;
    }
    if (event.key === "ArrowDown" && historyIndex < command_history.length - 1) {
        event.preventDefault();
        historyIndex++;
        document.getElementById("id_command_input_box").value = command_history[historyIndex];
        return;
    }
});
// #endregion


