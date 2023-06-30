import * as bootstrap from 'bootstrap';
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

import '../scss/styles.scss';

if (localStorage.getItem('userInfo') == null) location.href = 'index.html';

//Get current user's info as JSON
const getCurUserInfo = function () {
    return JSON.parse(localStorage.getItem('userInfo'));
};

//Get current user's friends' info as JSON
const getFriendsInfo = function () {
    return JSON.parse(localStorage.getItem('friendsInfo'));
};

//Get users data by UID
//Return this user's info as json
const getUserInfoById = async function (_id) {
    let response = await fetch(`http://localhost:8000/api/users/${_id}`, {
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

//Set up the friendlist
//Returns the friendlist as an array of ojects
const setupFriends = async function () {
    let response = await fetch(
        `http://localhost:8000/api/users/${getCurUserInfo()._id}/friends`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                'Content-Type': 'application/json',
            },
        },
    );
    let json = await response.json();

    for (let i = 0; i < getCurUserInfo().friend_ids.length; i++) {
        for (let curFriend of json.friends)
            if (curFriend._id == getCurUserInfo().friend_ids[i])
                curFriend.group_id = getCurUserInfo().group_ids[i];
    }
    localStorage.setItem('friendsInfo', JSON.stringify(json.friends));

    return json.friends;
};
setupFriends();

const getNewestMessageTime = async function () {
    let offset = 0;
    let limit = 1;
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
    let createdAt = new Date(json.messages[0].createdAt);
    return createdAt.getTime();
};

//Display the friendlist of the user as buttons
const displayFriendList = async function () {
    let documentFriendList = document.getElementsByClassName('friend-list')[0];
    let friendsInfo = await setupFriends();
    let buttonId = 0;
    for (let curFriendInfo of friendsInfo) {
        let newestMessageTime = await getNewestMessageTime();
        let lastMessageTime = localStorage.getItem(`lastMessageTime_${curFriendInfo.group_id}`);
        buttonId ++;

        let newLi = document.createElement('li');
        newLi.innerHTML = `<div class="d-grid"><button type="button" class="btn btn-outline-primary position-relative" id="btn-${buttonId}" onclick="{
            localStorage.setItem('chatGroup', '${curFriendInfo.group_id}');
            localStorage.setItem('chatGuest', '${curFriendInfo.display_name}');
            location.href = 'messages.html';
        };">${curFriendInfo.display_name}</button></div>`;
        documentFriendList.appendChild(newLi);
        if (newestMessageTime != lastMessageTime) {
            console.log(newestMessageTime);
            console.log(lastMessageTime)
            let button = document.getElementById(`btn-${buttonId}`);
            button.innerHTML = `${curFriendInfo.display_name}<span class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
            <span class="visually-hidden">New alerts</span>`
        }
    }
};
displayFriendList();
