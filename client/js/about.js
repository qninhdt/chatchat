import * as bootstrap from 'bootstrap';

import '../scss/styles.scss';

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

console.log(getCurUserInfo().display_name)