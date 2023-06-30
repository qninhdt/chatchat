import * as bootstrap from 'bootstrap';
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

import '../scss/styles.scss';

const MESSAGE_DISPLAY_LIMIT = 20;

if (localStorage.getItem('chatGroup') == null)
    location.href = 'friendlist.html';
if (localStorage.getItem('username') == null) location.href = 'index.html';

//Get current user's info as JSON
const getCurUserInfo = function () {
    return JSON.parse(localStorage.getItem('userInfo'));
};

//Who logged in?
let loginStatus = document.getElementsByClassName('login-status')[0];
if (getCurUserInfo() == null) {
    loginStatus.innerHTML = 'Please log in or sign up to get started.';
} else {
    let currentUser = document.getElementById('current-user');
    currentUser.innerHTML = `Logged in as <strong>${
        getCurUserInfo().display_name
    }</strong> `;
}

//Log out
let logOutButton = document.getElementById('log-out-btn');
logOutButton.addEventListener('click', () => {
    localStorage.clear();
    location.href = 'index.html';
});

//Display chat guest's username
let chatGuest = localStorage.getItem('chatGuest');
let newH1 = document.createElement('h1');
newH1.textContent = chatGuest;
document.getElementById('chat-guest').appendChild(newH1);
console.log(chatGuest);

//Display the newest message
const addMessageToDisplay = function (message) {
    let messageArea = document.getElementById('message-display-area');
    let newDiv = document.createElement('div');
    if (message.type == 'system-message') {
        newDiv.innerHTML = `<span id="system-message">${message.content}</span>`;
    } else {
        newDiv.innerHTML = `<span class="badge rounded-pill text-bg-${message.displayType} message ${message.type}">${message.content}</span>`;
    }
    messageArea.appendChild(newDiv);
};

//Get ${limit} latest messages, from ${offset} to ${offset + limit - 1}
const getMessages = async function (offset, limit) {
    let response = await fetch(
        `http://localhost:8000/api/groups/${localStorage.getItem(
            'chatGroup',
        )}/messages?offset=${offset}&limit=${limit}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                'Content-Type': 'application/json',
            },
        },
    );
    let json = await response.json();
    console.log(json);
    return json.messages;
};

//Classify the messages got in the last function
const getOldMessages = async function (offsetLevel) {
    let oldMessages = [];
    let json = await getMessages(
        offsetLevel * MESSAGE_DISPLAY_LIMIT,
        MESSAGE_DISPLAY_LIMIT,
    );

    json.forEach((element) => {
        let curMsg = {};
        if (element.groupId == localStorage.getItem('chatGroup')) {
            curMsg.content = element.content;
            if (
                element.senderId ==
                JSON.parse(localStorage.getItem('userInfo'))._id
            ) {
                curMsg.type = 'host-message';
                curMsg.displayType = 'primary';
            } else {
                curMsg.type = 'guest-message';
                curMsg.displayType = 'secondary';
            }
            // console.log(element.sender_id);
            // console.log(JSON.parse(localStorage.getItem('userInfo'))._id)
            oldMessages.push(curMsg);
        }
    });
    oldMessages.reverse();
    console.log(oldMessages);
    return oldMessages;
};

//Display old messages
const displayOldMessages = async function (offsetLevel) {
    console.log(offsetLevel);

    let messageArea = document.getElementById('message-display-area');
    messageArea.innerHTML = '';

    let oldMessages = await getOldMessages(offsetLevel);

    let olderMessageButtonArea = document.getElementById(
        'older-messages-button-area',
    );
    olderMessageButtonArea.innerHTML = '';
    if (oldMessages.length >= MESSAGE_DISPLAY_LIMIT)
        olderMessageButtonArea.innerHTML = `<button type="button" class="btn btn-outline-primary btn-sm" id="older-messages-button" type="button">Load older messages</button>`;

    let newerMessageButtonArea = document.getElementById(
        'newer-messages-button-area',
    );
    newerMessageButtonArea.innerHTML = '';
    if (offsetLevel != 0)
        newerMessageButtonArea.innerHTML = `<button type="button" class="btn btn-outline-primary btn-sm" id="newer-messages-button" type="button">Load newer messages</button>`;

    oldMessages.forEach((message) => {
        addMessageToDisplay(message);
        console.log(message);
    });

    if (oldMessages.length == 0)
        addMessageToDisplay({
            content: `There's nothing here.`,
            type: 'system-message',
        });

    let olderMessageButton = document.getElementById('older-messages-button');
    if (olderMessageButton != null) {
        olderMessageButton.addEventListener('click', () => {
            displayOldMessages(offsetLevel + 1);
        });
    }

    let newerMessageButton = document.getElementById('newer-messages-button');
    if (newerMessageButton != null) {
        newerMessageButton.addEventListener('click', () => {
            displayOldMessages(offsetLevel - 1);
        });
    }
};

displayOldMessages(0);

let socket = io('localhost:8000', {
    extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
    },
});
let messageInputForm = document.getElementById('message-input-form');
var messageInput = document.getElementById('message-input');

console.log(localStorage.getItem('chatGroup'));

messageInputForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (messageInput.value) {
        socket.emit('new_message', {
            content: messageInput.value,
            groupId: localStorage.getItem('chatGroup'),
        });
        let message = {
            content: messageInput.value,
            type: 'host-message',
            displayType: 'primary',
        };
        messageInput.value = '';
        addMessageToDisplay(message);
    }
});

socket.on('new_message', (response) => {
    let message = { content: response.content };
    // if (sender_id == getCurUserInfo().sender_id) message.type = 'host-message';
    message.type = 'guest-message';
    message.displayType = 'secondary';
    addMessageToDisplay(message);
});
