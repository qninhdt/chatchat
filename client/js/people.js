//people.js
//script for people.html
import * as bootstrap from 'bootstrap';

import '../scss/styles.scss';

import { ADD_FRIEND_API } from './utils/common';
import { getCurUserInfo, navBarComps, getUserInfoById, getAllUsersInfo } from './utils/common';

if (localStorage.getItem('userInfo') == null) location.href = 'index.html';

navBarComps();

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
            let response = await fetch(ADD_FRIEND_API, {
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
            if (msg == 'Friend added successfully') {
                let userInfo = await getUserInfoById(getCurUserInfo()._id);
                // console.log(userInfo);
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
            }
            // console.log(getCurUserInfo());
        });
    }
});
