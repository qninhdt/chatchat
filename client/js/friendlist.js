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
    localStorage.clear();
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
    curUserInfo.friends = [];
    for (let i = 0; i < curUserInfo.friend_ids.length; i++) {
        let curFriendInfo = {};
        for (let element of json)
            if (element._id == curUserInfo.friend_ids[i]) {
                curFriendInfo.username = element.username;
                curFriendInfo.chatGroup = curUserInfo.group_ids[i];
                curUserInfo.friends.push(curFriendInfo);
            }
    }
    // console.log(curUserInfo);
    localStorage.setItem('curUserInfo', JSON.stringify(curUserInfo));
    return curUserInfo;
};
setupCurrentUser();

//Display the friend list of the user as buttons
const displayFriendList = async function () {
    let documentFriendList = document.getElementsByClassName('friend-list')[0];
    let curUserInfo = await setupCurrentUser();
    for (let curFriendInfo of curUserInfo.friends) {
        let newLi = document.createElement('li');
        newLi.innerHTML = `<div class="d-grid"><button type="button" class="btn btn-outline-primary" onclick="{
            localStorage.setItem('chatGroup', ${curFriendInfo.chatGroup});
            localStorage.setItem('chatGuest', '${curFriendInfo.username}');
            location.href = 'messages.html';
        };">${curFriendInfo.username}</button></div>`;
        documentFriendList.appendChild(newLi);
    }
};
displayFriendList();
