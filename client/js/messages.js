import * as bootstrap from 'bootstrap';
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

import '../scss/styles.scss';

if (localStorage.getItem('chatGroup') == null)
    location.href = 'friendlist.html';
if (localStorage.getItem('username') == null) location.href = 'index.html';

//Who logged in?
let currentUser = document.getElementById('current-user');
currentUser.innerHTML = `Logged in as <strong>${localStorage.getItem(
    'username',
)}</strong> `;

//Log out
let logOutButton = document.getElementById('log-out-btn');
logOutButton.addEventListener('click', () => {
    localStorage.removeItem('username');
    location.href = 'index.html';
});

//Get ${limit} latest messages, from ${offset} to ${offset + limit - 1}
const getOldMessages= async function(offset, limit)  {
    let response = await fetch('http://localhost:8000')
}

let socket = io();
