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
        visible = !visible;
        document.getElementById("id_status_panel").style.display = visible ? "block" : "none";
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

// #send user input
document.getElementById("id_command_input_box").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (document.getElementById("id_command_input_box").value.trim()) {
            command_history.push(document.getElementById("id_command_input_box").value);
            console.log("hi");
            historyIndex = command_history.length;
            document.getElementById("id_command_input_box").value = "";
            window.scrollTo(0, document.body.scrollHeight);
        }
    }
});
