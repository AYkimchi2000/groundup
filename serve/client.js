// #region socket.io
const socket = io();

// #region global variables
const command_history = [];
let historyIndex = 0;
let autocomplete_visibility = false;
let tab_panel_visible = false;
const commandTree = {
    test: {
        rename: {
            '<name>': (name) => io.to(socket.id).emit("server_broadcast_all", `hi there, ${name}`)
        },
        combat_init: {
            alone: () => console.log('alone'),
            party: () => console.log('alone')
        }
    }
};





// #endregion

// #region global click events 
document.getElementById("id_prompt_panel").addEventListener("click", event => {
    document.getElementById("id_command_input_box").focus();
});
// #endregion

// #region document keypress events
document.addEventListener("keydown", event => {
    // play keystrike audio
    const sound = (e.key === 'Enter' || e.key === ' ' || e.key === 'Backspace' || e.key === 'Escape') ? '2.wav' : '1.wav';
    new Audio(sound).play();

    if (event.key === "Tab") {
        event.preventDefault();
        tab_panel_visible = !tab_panel_visible;
        document.getElementById("id_status_panel").style.display = tab_panel_visible ? "block" : "none";
    }
});
// #endregion

// #region input box keypress events
document.getElementById("id_command_input_box").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault()
        autocomplete_visibility = false;
        autoCompleteJS.trigger = () => autocomplete_visibility
        
        
        if (document.getElementById("id_command_input_box").value.trim()) {

            //save to command_history
            command_history.push(document.getElementById("id_command_input_box").value);
            historyIndex = command_history.length;

            //clone and replace last input command container
            const clone_of_previous_textrow = document.getElementById('id_text_row_container').cloneNode(true);
            clone_of_previous_textrow.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
            clone_of_previous_textrow.removeAttribute('id');


            //construct last input row element
            


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
                case 'connect':


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
    if (event.key === "/") {
        event.preventDefault();
        autocomplete_visibility = !autocomplete_visibility;
        autoCompleteJS.trigger = () => autocomplete_visibility;

        // Force re-evaluation
        const inputEvent = new Event("input", { bubbles: true });
        document.getElementById("id_command_input_box").dispatchEvent(inputEvent);
    }





    // #region up down arrow navigate history
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
    // #endregion

});
// #endregion

// #region input box value change events
document.getElementById("id_command_input_box").addEventListener("input", (event) => {
    autoCompleteJS.data.src = getSuggestions();
    console.log(`data.src is ${autoCompleteJS.data.src}`)
});

// #endregion

// #region segmented suggestion

const autoCompleteJS = new autoComplete({
    detached: true,
    trigger: () => false,
    query: (input) => {
        const current_segment = document.getElementById("id_command_input_box").value.split(" ")
        return current_segment[current_segment.length - 1];
    },
    selector: "#id_command_input_box",
    placeHolder: "press / to open autocomplete",
    data: {
        src: [" "],
        cache: false,
    },
    resultsList: {
        element: (list, data) => {
            if (!data.results.length) {
                const message = document.createElement("div");
                message.setAttribute("class", "no_result");
                message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
                list.prepend(message);
            }
        },
        noResults: true,
    },
    resultItem: {
        highlight: true,
    }
});

const input = document.getElementById("id_command_input_box"); 
const suggestionsBox = document.getElementById("suggestions");  
let suggestionsVisible = false;
let currentSuggestions = [];

function getSuggestions() {
    const input_command_as_list = document.getElementById("id_command_input_box").value.trim().split(" ");

    let node = commandTree;

    // Traverse to the correct node based on input
    for (let i = 0; i < input_command_as_list.length; i++) {
        const segment = input_command_as_list[i];
        if (node && segment in node) {
            node = node[segment];
        } else {
            node = null;
            break;
        }
    }

    const endsWithSpace = document.getElementById("id_command_input_box").value.endsWith(" ");
    let currentSegment = "";

    if (!endsWithSpace && input_command_as_list.length > 0) { //runs when user is typing
        currentSegment = input_command_as_list[input_command_as_list.length - 1];

        // Go up one level for partial segment
        node = commandTree;
        for (let i = 0; i < input_command_as_list.length - 1; i++) {
            const segment = input_command_as_list[i];
            if (node && segment in node) {
                node = node[segment];
            } else {
                node = null;
                break;
            }
        }
    }

    const currentSuggestions = node && typeof node === "object"
        ? Object.keys(node).filter(k => k.startsWith(currentSegment))
        : [];

    console.log(`current suggestion is ${currentSuggestions}`);
    console.log(`current segment is "${currentSegment}"`);
    console.log(`the query is this ${autoCompleteJS.query()}`)
    console.log(`the input_command_as_list is this ${input_command_as_list}`)
    return currentSuggestions;
}

    // #endregion
