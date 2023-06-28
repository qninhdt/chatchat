import * as bootstrap from 'bootstrap';

import '../scss/styles.scss';

if (localStorage.getItem('username') == null) location.href = 'index.html';

//Who logged in?
let currentUser = document.getElementById('current-user');
currentUser.innerHTML = `Already logged in as ${localStorage.getItem(
    'username',
)}`;

//Log out
let logOutButton = document.getElementById('log-out-btn');
logOutButton.addEventListener('click', () => {
    localStorage.removeItem('username');
    location.href = 'index.html';
});
