// #region socket.io
const socket = io();

// #region global variables
const command_history = [];
let historyIndex = 0;
let no_result_visibility = true;
let autocomplete_visibility = false;
let tab_panel_visible = false;
const commandTree = {
    test: {
        rename: {
            '<name>': (name) => io.to(socket.id).emit("server_broadcast_all", `hi there, ${name}`),
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
        const inputEvent = new Event("input", { bubbles: true });
        document.getElementById("id_command_input_box").dispatchEvent(inputEvent);
        
        if (document.getElementById("id_command_input_box").value.trim()) {

            //save to command_history
            command_history.push(document.getElementById("id_command_input_box").value);
            historyIndex = command_history.length;

            //clone and replace last input command container
            const clone_of_previous_textrow = document.getElementById('id_text_row_container').cloneNode(true);
            clone_of_previous_textrow.querySelector('div:nth-child(2) > div > ul').remove();
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
    if (event.key === "\\") {
        event.preventDefault();
        autocomplete_visibility = !autocomplete_visibility;
        const inputEvent = new Event("input", { bubbles: true });
        document.getElementById("id_command_input_box").dispatchEvent(inputEvent);// force re-render by sending a null keypress event
    }

    if (event.key === "`") {
        event.preventDefault();
        console.log(`${currentSuggestions}`, typeof currentSuggestions)
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

// #region autocomplete

const autoCompleteJS = new autoComplete({
    detached: true,
    trigger: () => autocomplete_visibility,
    query: (input) => {
        const current_segment = document.getElementById("id_command_input_box").value.split(" ")
        return current_segment[current_segment.length - 1];
    },
    selector: "#id_command_input_box",
    placeHolder: "press \\ to open autocomplete",
    data: {
        src: [" "],
        cache: false,
    },
    resultsList: {
        element: (list, data) => {
            if (!data.results.length) {
                const message = document.createElement("div");
                message.setAttribute("class", "no_result");
                message.innerHTML = `<span>Found No Results for "${document.getElementById("id_command_input_box").value}"</span>`;
                list.prepend(message);
            }
        },
        noResults: false,
    },
    resultItem: {
        highlight: true,
    }
});

const input = document.getElementById("id_command_input_box"); 
const suggestionsBox = document.getElementById("suggestions");  
let currentSuggestions = [];

//working one
// function getSuggestions() {
//     const inputBox = document.getElementById("id_command_input_box");
//     const input_command_as_list = inputBox.value.trim().split(" ");

//     let node = commandTree;

//     // Traverse to the correct node based on input
//     for (let i = 0; i < input_command_as_list.length; i++) {
//         const segment = input_command_as_list[i];
//         if (node && segment in node) {
//             node = node[segment];
//         } else {
//             node = null;
//             break;
//         }
//     }

//     const endsWithSpace = inputBox.value.endsWith(" ");
//     let currentSegment = "";

//     if (!endsWithSpace && input_command_as_list.length > 0) { // When user is typing
//         currentSegment = input_command_as_list[input_command_as_list.length - 1];

//         // Re-traverse for incomplete segment
//         node = commandTree;
//         for (let i = 0; i < input_command_as_list.length - 1; i++) {
//             const segment = input_command_as_list[i];
//             if (node && segment in node) {
//                 node = node[segment];
//             } else {
//                 node = null;
//                 break;
//             }
//         }
//     }

//     let currentSuggestions = [];

//     if (node && typeof node === "object") {
//         // First, collect all placeholders like <name>, <target> etc., without filtering them
//         currentSuggestions = Object.keys(node)
//             .filter(k => k.startsWith('<') && k.endsWith('>')) // Match only placeholders
//             .map(k => `{${k.slice(1, -1)}}`); // Convert to {name} for display

//         // Then, filter and match other commands/arguments as usual
//         currentSuggestions = currentSuggestions.concat(
//             Object.keys(node)
//                 .filter(k => !k.startsWith('<') && k.startsWith(currentSegment)) // Only filter normal commands
//         );
//     }

//     return currentSuggestions;
// }

//experiment
function getSuggestions() {
    const inputBox = document.getElementById("id_command_input_box");
    const input_command_as_list = inputBox.value.trim().split(" ");

    let node = commandTree;

    // Traverse the full input to get the current node
    for (let i = 0; i < input_command_as_list.length; i++) {
        const segment = input_command_as_list[i];
        if (node && segment in node) {
            node = node[segment];
        } else {
            node = null;
            break;
        }
    }

    const endsWithSpace = inputBox.value.endsWith(" ");
    let currentSegment = "";

    if (!endsWithSpace && input_command_as_list.length > 0) {
        currentSegment = input_command_as_list[input_command_as_list.length - 1];

        // Re-traverse for incomplete segment
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
    if (node && typeof node === "object") {
        currentSuggestions = Object.keys(node)
            .filter(k => currentSegment === "" || (!k.startsWith('<') && k.startsWith(currentSegment) || (k.startsWith('<') && k.endsWith('>'))))
            .map(k => {
                if (k.startsWith('<') && k.endsWith('>')) {
                    return `{${k.slice(1, -1)}}`;  // Wrap argument suggestions with {}
                }
                return k;
            });
    }

    // Toggle the noResults flag
    if (String(currentSuggestions).startsWith('{') && String(currentSuggestions).endsWith('}')) {
        autoCompleteJS.resultItem.highlight = false;
        autoCompleteJS.resultsList.noResults = false;  // In argument mode, show noResults
        console.log(`noresults turned off, ${currentSuggestions}`)
    } else {
        autoCompleteJS.resultsList.noResults = true; // Reset when done typing argument
        autoCompleteJS.resultItem.highlight = true;
        console.log(`${currentSuggestions}`, typeof currentSuggestions)
    }

    return currentSuggestions;
}
    // #endregion
