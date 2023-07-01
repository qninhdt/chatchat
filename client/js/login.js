//login.js
//script for login.html

import * as bootstrap from 'bootstrap';

import '../scss/styles.scss';

import { LOGIN_API } from './utils/common';
import { getCurUserInfo, navBarComps, getUserInfoById, getAllUsersInfo, getFriendsInfo } from './utils/common';
import { checkInvalid } from './utils/common';

let loginForm = document.getElementById('login-form');

navBarComps();

//Get response from the server
const getServerResponse = async function (username, password) {
    let response = await fetch(LOGIN_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    });
    // localStorage.setItem('jwtToken', token);
    let json = await response.json();
    let jwtToken = await json.token;
    localStorage.setItem('jwtToken', jwtToken);

    if (json.message == 'Login successfully') {
        alert('Successfully logged in.');
        localStorage.setItem('userInfo', JSON.stringify(json.user));
        return 1;
    }

    alert('Your credientials do not match any of the registered accounts.');
    return 0;
};

//Send the login credits to the server after submitting
loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    let usernameInput = document.getElementById('username-input');
    let passwordInput = document.getElementById('password-input');
    
    let username = usernameInput.value;
    let password = passwordInput.value;

    let isValid = await getServerResponse(username, password);
    if (isValid) {
        location.href = 'friendlist.html';
        localStorage.setItem('username', username);
    }

    localStorage.setItem('curUser', username);

    // usernameInput.value = ""
    // passwordInput.value = ""
});
checkInvalid();
