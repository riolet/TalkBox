var g_tb = {}

function talkbox_init() {
    "use strict";
    g_tb.root = document.getElementById("talkbox");

    var div_msg = document.createElement("div");
    div_msg.classList.add("tb_content");
    g_tb.root.appendChild(div_msg);
    g_tb.history = div_msg;

    var div_input = document.createElement("div");
    div_input.classList.add("tb_input");
    g_tb.root.appendChild(div_input);

    //order is important here: initialize input, then messages
    tb_init_input(div_input);
    tb_init_messages(div_msg);
    add_mock_messages();
    g_tb.history.scrollTop = g_tb.history.scrollHeight;

}

function tb_init_messages() {
    "use strict";
    //maxHeight is talkbox.clientHeight - inputHeight.offsetHeight
    var h = g_tb.root.clientHeight;
    h -= g_tb.input.offsetHeight;
    g_tb.history.style.maxHeight = h.toString() + "px";
    return;
}

function tb_init_input(div) {
    "use strict";
    var input = document.createElement("textarea");
    input.id = "tb_input";
    input.rows = 3;
    input.placeholder = "type your message here. \n<enter> to submit";
    input.onkeydown = tb_keydown;
    g_tb.input = input;
    div.appendChild(input);
}

function tb_keydown(event) {
    "use strict";
    if (event.keyCode === 13 && (!event.ctrlKey && !event.shiftKey)) {
        tb_submit(g_tb.input.value);
        g_tb.input.value = "";
        return false;
    }
}

function tb_submit(msg) {
    "use strict";
    //add the local message
    var message = {"local": true, "msg": msg};
    tb_add_message(message);
    g_tb.history.scrollTop = g_tb.history.scrollHeight;

    //prepare the server request
    var request = {};
    var path = g_tb.root.attributes.src.value
    request.msg = msg;

    //place server request
    $.ajax({
        url: path,
        type: "GET",
        data: request,
        error: tb_server_error,
        success: tb_server_response
    });
}

function tb_server_error(jqXHR, status, error) {
    "use strict";
    console.log("----- AJAX Error -----");
    console.log(jqXHR);
    console.log(status);
    console.log(error);
    console.log("----------------------");
}

function tb_server_response(response, status, jqXHR) {
    "use strict";
    var message = {"local": false, "msg": response};
    tb_add_message(message);
    g_tb.history.scrollTop = g_tb.history.scrollHeight;
}

function tb_add_message(message) {
    "use strict";
    var msg = document.createElement("div");
    msg.innerHTML = message.msg;

    if (g_tb.latest !== undefined && g_tb.latest.classList.contains("client") == message.local) {
        g_tb.latest.firstChild.appendChild(msg);
    } else {
        var msg_div = document.createElement("div");
        msg_div.classList.add("msg");
        if (message.local) {
            msg_div.classList.add("client");
        } else {
            msg_div.classList.add("server");
        }
        var msg_group = document.createElement("div");
        msg_group.appendChild(msg);
        msg_div.appendChild(msg_group);
        g_tb.history.appendChild(msg_div);
        g_tb.latest = msg_div;
    }
}

function add_mock_message(local, message) {
    "use strict";
    var msg = {"local": local, "msg": message};
    tb_add_message(msg);
}

function add_mock_messages() {
    "use strict";
    add_mock_message(true, "knock-knock");
    add_mock_message(false, "who's there?");
    add_mock_message(true, "night time is wasted");
    add_mock_message(true, "on the owls.");
    add_mock_message(false, "that isn't even a knock knock joke. Do you have any idea what you're doing?");
    add_mock_message(true, "okay");
    add_mock_message(true, "ask me why");
    add_mock_message(true, "I can't tell a good joke.");
    add_mock_message(false, "ok, why can't you t--");
    add_mock_message(true, "timing.");
    add_mock_message(false, "If");
    add_mock_message(false, "I");
    add_mock_message(false, "just");
    add_mock_message(false, "add");
    add_mock_message(false, "a");
    add_mock_message(false, "few");
    add_mock_message(false, "more");
    add_mock_message(false, "lines");
    add_mock_message(false, "this should now be long enough");
    add_mock_message(true, "to scroll");
}
