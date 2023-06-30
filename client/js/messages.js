import * as bootstrap from 'bootstrap';
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

import '../scss/styles.scss';

const MESSAGE_DISPLAY_LIMIT = 20;
const MESSAGE_LENGTH_LIMIT = 999;
const MESSAGE_LINE_LIMIT = 50;

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

//Display the newest message
const addMessageToDisplay = function (message) {
    let messageArea = document.getElementById('message-display-area');
    let newDiv = document.createElement('div');
    if (message.type == 'system-message') {
        newDiv.innerHTML = `<span id="system-message">${message.content}</span>`;
    } else {
        newDiv.innerHTML = `<span class="badge text-bg-${message.displayType} message ${message.type}">${message.content}</span>`;
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
            oldMessages.push(curMsg);
        }
    });
    oldMessages.reverse();
    return oldMessages;
};

//Display old messages
const displayOldMessages = async function (offsetLevel) {
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

const addLineBreak = function (text) {
    text += ' ';
    let ret = '';
    let line = '';
    let word = '';
    for (let character of text) {
        word += character;
        if (character != ' ') {
            if (word.length >= MESSAGE_DISPLAY_LIMIT) {
                if ((line + word).length > MESSAGE_LINE_LIMIT) {
                    line += '<br>';
                    ret += line;
                    line = word;
                } else line += word;
                word = '';
            }
        } else {
            if ((line + word).length > MESSAGE_LINE_LIMIT) {
                line += '<br>';
                ret += line;
                line = word;
            } else line += word;
            word = '';
        }
    }
    ret += line;
    return ret;
};

messageInputForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (messageInput.value.length > MESSAGE_LENGTH_LIMIT) {
        alert('Your message is too long.\n');
        return;
    }
    let messageContent = addLineBreak(messageInput.value);
    if (messageInput.value) {
        socket.emit('new_message', {
            content: messageContent,
            groupId: localStorage.getItem('chatGroup'),
        });
        let message = {
            content: messageContent,
            type: 'host-message',
            displayType: 'primary',
        };
        messageInput.value = '';
        // addMessageToDisplay(message);
    }
});

socket.on('new_message', ({ group_id, sender_id, content }) => {
    let message = { content };

    if (group_id != localStorage.getItem('chatGroup')) return;

    [message.type, message.displayType] =
        sender_id == JSON.parse(localStorage.getItem('userInfo'))._id
            ? ['host-message', 'primary']
            : ['guest-message', 'secondary'];

    addMessageToDisplay(message);
});
