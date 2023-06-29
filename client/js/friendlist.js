import * as bootstrap from 'bootstrap';

import '../scss/styles.scss';

if (localStorage.getItem('username') == null) location.href = 'index.html';

//Get all users data
//Return all users data as json
const getUsers = async function () {
    let response = await fetch('http://localhost:8000/api/users', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json',
        },
    });
    let json = await response.json();
    return json;
};

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

//Set up the data for the current user
//Returns the current user's info as an object
const setupCurrentUser = async function () {
    let json = await getUsers();
    let curUserInfo = {};
    for (let element of json)
        if (element.username == localStorage.getItem('username'))
            curUserInfo = element;
    curUserInfo.friends = curUserInfo.friend_ids.map((curFriendId) => {
        for (let element of json)
            if (element._id == curFriendId) return element.username;
    });
    localStorage.setItem('curUserInfo', JSON.stringify(curUserInfo));
    return curUserInfo;
    console.log(curUserInfo);
};

setupCurrentUser();

//Display the friend list of the user as buttons
const displayFriendList = async function () {
    let documentFriendList = document.getElementsByClassName('friend-list')[0];
    let curUserInfo = await setupCurrentUser();
    for (let friend of curUserInfo.friends) {
        let newLi = document.createElement('li');
        newLi.innerHTML = `<div class="d-grid"><button class="btn btn-outline-primary" onclick="">${friend}</button></div>`;
        documentFriendList.appendChild(newLi);
    }
};
displayFriendList();
