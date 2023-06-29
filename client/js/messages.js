import * as bootstrap from 'bootstrap';

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
