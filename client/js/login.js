//login.js
//script for login.html

import * as bootstrap from 'bootstrap';
// import jwt from 'jsonwebtoken';

import '../scss/styles.scss';

const server = '/api/login';

let loginForm = document.getElementById('login-form');

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
//Please give me validation information (passed/not passed)
const getServerResponse = async function (username, password) {
    let response = await fetch(server, {
        method: 'POST',
        body: {
            username: username,
            password: password
        },
    });
    // localStorage.setItem('jwtToken', token);
    let json = response.json;

    return 1;
};

//Send the login credits to the server after submitting
loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    let usernameInput = document.getElementById('username-input');
    let passwordInput = document.getElementById('password-input');

    if (!(usernameInput.value == '' || passwordInput.value == '')) {
        console.log(`[login.js] usernameInput.value = ${usernameInput.value}`);
        console.log(`[login.js] passwordInput.value = ${passwordInput.value}`);
    }

    let username = usernameInput.value;
    let password = passwordInput.value;

    let isValid = await getServerResponse(username, password);
    if (isValid) {
        alert('Successfully logged in.');
        location.href = 'friendlist.html';
        localStorage.setItem('username', username);
    }

    localStorage.setItem('curUser', username);

    // usernameInput.value = ""
    // passwordInput.value = ""
});
checkInvalid();
