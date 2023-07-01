//friendlist.js
//script for friendlist.html
import * as bootstrap from 'bootstrap';

import '../scss/styles.scss';

import { USERS_API } from './utils/common';
import { getCurUserInfo, navBarComps, getUserInfoById, getAllUsersInfo, getFriendsInfo } from './utils/common';

if (localStorage.getItem('userInfo') == null) location.href = 'index.html';

navBarComps();

//Set up the friendlist
//Returns the friendlist as an array of ojects
const setupFriends = async function () {
    let response = await fetch(USERS_API + `/${getCurUserInfo()._id}/friends`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json',
        },
    });
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

//Display the friendlist of the user as buttons
const displayFriendList = async function () {
    let documentFriendList = document.getElementsByClassName('friend-list')[0];
    let friendsInfo = await setupFriends();
    for (let curFriendInfo of friendsInfo) {
        let newLi = document.createElement('li');
        newLi.innerHTML = `<div class="d-grid"><button type="button" class="btn btn-outline-primary" onclick="{
            localStorage.setItem('chatGroup', '${curFriendInfo.group_id}');
            localStorage.setItem('chatGuest', '${curFriendInfo.display_name}');
            location.href = 'messages.html';
        };">${curFriendInfo.display_name} (@${curFriendInfo.username})</button></div>`;
        documentFriendList.appendChild(newLi);
    }
};
displayFriendList();
