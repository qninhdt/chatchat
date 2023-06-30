//login.js
//script for login.html

import * as bootstrap from 'bootstrap';
// import jwt from 'jsonwebtoken';

import '../scss/styles.scss';

const server = 'http://localhost:8000/api/login';

let loginForm = document.getElementById('login-form');

//Get current user's info as JSON
const getCurUserInfo = function () {
    return JSON.parse(localStorage.getItem('userInfo'));
};
if (getCurUserInfo() != null) location.href ='friendlist.html';

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

//Check if an input box in the form is currently non-empty
const checkInvalid = function () {
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach((form) => {
        form.addEventListener(
            'submit',
            (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add('was-validated');
            },
            false,
        );
    });
};

//Get response from the server
const getServerResponse = async function (username, password) {
    let response = await fetch(server, {
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
