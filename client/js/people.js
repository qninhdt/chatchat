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

const getAllUsersInfo = async function () {
    let response = await fetch('http://localhost:8000/api/users/', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json',
        },
    });
    let json = await response.json();
    return json.users;
};

let findUserInputForm = document.getElementById('find-user-input-form');
let findUserResult = document.getElementById('find-user-result');
let addFriendButtons = document.getElementsByClassName('add-friend-button');
findUserInputForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let findUserInput = document.getElementById('find-user-input');
    let query = findUserInput.value;
    if (query.length == 0) return;

    findUserResult.innerHTML = '';
    let allUsersInfo = await getAllUsersInfo();
    allUsersInfo.forEach((user) => {
        if (
            user.username.search(new RegExp(query, 'i')) != -1 ||
            user.display_name.search(new RegExp(query, 'i')) != -1
        ) {
            let newLi = document.createElement('li');
            newLi.innerHTML = `<div class="d-grid"><button type="button" class="btn btn-outline-primary add-friend-button" id="${user._id}">${user.display_name} (@${user.username})</button></div>`;
            findUserResult.appendChild(newLi);
        }
    });
    addFriendButtons = document.getElementsByClassName('add-friend-button');
    console.log(addFriendButtons);
    for (let element of addFriendButtons) {
        console.log(element);
        element.addEventListener('click', async () => {
            let response = await fetch('http://localhost:8000/api/friends/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    friend_id: element.id,
                }),
            });
            let json = await response.json();
            let msg = json.message;
            alert(msg);
        });
    }
});
