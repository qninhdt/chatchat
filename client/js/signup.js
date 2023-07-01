//signup.js
//script for signup.html

import * as bootstrap from 'bootstrap';

import '../scss/styles.scss';

import { SIGNUP_API } from './utils/common';
import { getCurUserInfo, navBarComps, getUserInfoById, getAllUsersInfo, getFriendsInfo } from './utils/common';
import { checkInvalid } from './utils/common';

let loginForm = document.getElementById('login-form');

navBarComps();

//Check if the given username or password is valid
const infoFirstCheck = function (username, password, password2) {
    let usernameRegExPattern = /[a-zA-Z0-9_]/g;
    if (
        username.match(usernameRegExPattern) == null ||
        username.match(usernameRegExPattern).length != username.length
    ) {
        alert(
            'The username can only contain letters of any cases, number and underscore symbol (_).',
        );
        return 0;
    }
    let passwordRegExPattern = /[^ ]/g;
    if (
        password.match(passwordRegExPattern) == null ||
        password.match(passwordRegExPattern).length != password.length
    ) {
        alert('The password cannot contain spaces.');
        return 0;
    }
    if (password.length < 6) {
        alert('Password length must be at least 6.');
        return 0;
    }
    if (password != password2) {
        alert('Password retype does not match.');
        return 0;
    }
    return 1;
};

//Post {username, password, display_name} to the server (after some validation)
const getServerResponse = async function (
    username,
    password,
    password2,
    displayName,
) {
    if (!infoFirstCheck(username, password, password2)) return 0;

    let response = await fetch(SIGNUP_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
            displayName: displayName,
        }),
    });
    let json = await response.json();
    let status = response.status;
    if (status == 404) {
        alert('This username has already been taken.');
        return 0;
    }

    // let jwtToken = await json.token;
    // localStorage.setItem('jwtToken', jwtToken);

    return 1;
};

//Send the registered credits to the server after submitting
loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    let usernameInput = document.getElementById('username-input');
    let passwordInput = document.getElementById('password-input');
    let passwordRetype = document.getElementById('password-retype');
    let displayNameInput = document.getElementById('display-name-input');

    let username = usernameInput.value;
    let password = passwordInput.value;
    let displayName = displayNameInput.value;
    if (displayName == '') displayName = username;

    let isValid = await getServerResponse(
        username,
        password,
        passwordRetype.value,
        displayName,
    );
    if (isValid) {
        alert('Successfully registered. Please log in again.');
        location.href = 'login.html';
    }
});

checkInvalid();
