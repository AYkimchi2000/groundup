// #region socket.io
const socket = io();


// #region focus to inputbox when clicking
document.getElementById("id_prompt_panel").addEventListener("click", event => {
    document.getElementById("id_command_input_box").focus();
});
// #endregion

// #region typing sound effect
const playSound = key => {
    const sound = (key === 'Enter' || key === ' ' || key === 'Backspace' || key === 'Escape') ? '2.wav' : '1.wav';
    new Audio(sound).play();
};
document.addEventListener('keydown', e => playSound(e.key));


// document.addEventListener('keydown', function () {
//     var key_sound_1 = new Audio('1.wav');
//     key_sound_1.play();

// });
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
            
            event.preventDefault()

            //save to command_history
            command_history.push(document.getElementById("id_command_input_box").value);
            historyIndex = command_history.length;

            //clone and replace last input command container
            const clone_of_previous_textrow = document.getElementById('id_text_row_container').cloneNode(true);
            clone_of_previous_textrow.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
            clone_of_previous_textrow.removeAttribute('id');
            //construct response row element 
            const response_row_container = document.createElement('div');
            const response_row_prefix = document.createElement('div');
            const response_row_content = document.createElement('div');
            response_row_container.classList.add('response_row_container');
            response_row_prefix.classList.add('response_prefix_container');
            response_row_content.classList.add('response_row_content');
            response_row_container.appendChild(response_row_prefix);
            response_row_container.appendChild(response_row_content);
            //check for local command response
            response_row_prefix.textContent = 'LocalClient: ';
            switch (document.getElementById("id_command_input_box").value) {
                case 'help':
                    response_row_content.textContent = 'This is where you can get help!';
                case 'who':
                    response_row_content.textContent = 'I am arthur!';
                default:
                    document.getElementById('id_text_row_container').style.display = 'none';
                    document.getElementById('id_command_input_box').disabled = true;
                    let count = 0;
                    response_row_prefix.textContent = 'Server: ';
                    const response_dot_loading = setInterval(() => {
                        count = (count + 1) % 4;
                        response_row_content.textContent = 'fetching server response' + '.'.repeat(count); 
                    }, 500);
                    socket.emit('client_command_input', document.getElementById("id_command_input_box").value);
                    socket.once('server_broadcast_all', (broadcast_content) => {
                        clearInterval(response_dot_loading);
                        response_row_content.textContent = broadcast_content;
                        document.getElementById('id_text_row_container').style.display = '';
                        document.getElementById('id_command_input_box').disabled = false;
                        document.getElementById('id_command_input_box').focus();
                    });


            }
            //insert element to page
            document.getElementById("id_text_interface_container").insertBefore(clone_of_previous_textrow, document.getElementById("id_text_row_container")); // insert previous text row element
            document.getElementById("id_text_interface_container").insertBefore(response_row_container, document.getElementById("id_text_row_container")); // insert server response row element
            

            document.getElementById('id_command_input_box').value = ""; // clear text input box
            

        }
    }
});


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


