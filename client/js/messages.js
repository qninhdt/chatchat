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
let currentUser = document.getElementById('current-user');
currentUser.innerHTML = `Logged in as <strong>${
    getCurUserInfo().display_name
}</strong> `;

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
    let messageArea = document.getElementsByClassName('message-area')[0];
    let newDiv = document.createElement('div');
    newDiv.innerHTML = `<span class="badge rounded-pill text-bg-${message.displayType} message ${message.type}">${message.content}</span>`;
    messageArea.appendChild(newDiv);
};

//Get ${limit} latest messages, from ${offset} to ${offset + limit - 1}
const getMessages = async function (offset, limit) {
    let response = await fetch(
        `http://localhost:8000/api/groups/${localStorage.getItem(
            'chatGroup',
        )}/messages`,
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
        if (element.group_id == localStorage.getItem('chatGroup')) {
            curMsg.content = element.content;
            if (
                element.sender_id ==
                JSON.parse(localStorage.getItem('curUserInfo'))._id
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
    console.log(oldMessages);
    return oldMessages;
};

//Display old messages
const displayOldMessages = async function () {
    let oldMessages = await getOldMessages(0);

    oldMessages.forEach((message) => addMessageToDisplay);
};
displayOldMessages();

let socket = io();
let messageInputForm = document.getElementById('message-input-form');
var messageInput = document.getElementById('message-input');

messageInputForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (messageInput.value) {
        socket.emit('new_message', {
            content: messageInput.value,
            group_id: localStorage.getItem('chatGroup'),
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
