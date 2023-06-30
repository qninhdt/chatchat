import * as bootstrap from 'bootstrap';

import '../scss/styles.scss';

if (localStorage.getItem('userInfo') == null) location.href = 'index.html';

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

let allUsersInfo = [
    {
        username: 'qninhdeptrai',
        display_name: 'Qninh Dep Zai',
        _id: '649d3f0a6921366225a29088',
    },
    {
        username: 'lmao',
        display_name: 'Lmao Zedong',
        _id: '649d3fad6921366225a2908b',
    },
    {
        username: 'thattinh123',
        display_name: 'That tinh 123',
        _id: '649d82f1ec5fa351a0f6ee29',
    },
    {
        username: 'ambatukam',
        display_name: 'Anh Ba Xỉn',
        _id: '649e5a9e8e7d3bf040effa46',
    },
    {
        username: 'ambatunat',
        display_name: 'Anh Ba Xỉn',
        _id: '649e5a9e8e7d3bf040effa46',
    },
];

let findUserInputForm = document.getElementById('find-user-input-form');
let findUserResult = document.getElementById('find-user-result');
findUserInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let findUserInput = document.getElementById('find-user-input');
    let query = findUserInput.value;
    if (query.length == 0) return;

    findUserResult.innerHTML = '';
    allUsersInfo.forEach((user) => {
        if (
            user.username.search(new RegExp(query, 'i')) != -1 ||
            user.display_name.search(new RegExp(query, 'i')) != -1
        ) {
            let newLi = document.createElement('li');
            newLi.innerHTML = `<div class="d-grid"><button type="button" class="btn btn-outline-primary">${user.display_name} (@${user.username})</button></div>`;
            findUserResult.appendChild(newLi);
        }
    });
});
