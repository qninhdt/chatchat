//common.js
//contains constants and functions used in other files
export const LOCALHOST_SERVER = 'http://localhost:8000';
export const ONLINE_SERVER = 'https://chatchat-4z4u.onrender.com';
export const SERVER = ONLINE_SERVER;
export const LOGIN_API = SERVER + '/api/login';
export const SIGNUP_API = SERVER + '/api/signup';
export const USERS_API = SERVER + '/api/users';
export const ADD_FRIEND_API = SERVER + '/api/friends'
export const GROUPS_API = SERVER + '/api/groups';

//Get current user's info as JSON (saved in local storage)
export const getCurUserInfo = function () {
    return JSON.parse(localStorage.getItem('userInfo'));
};

//Get any user info by uid as JSON (using http request)
export const getUserInfoById = async function (_id) {
    let response = await fetch(USERS_API + `/${_id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json',
        },
    });
    let json = await response.json();
    return json;
};

//Get all users' info as JSON
export const getAllUsersInfo = async function () {
    let response = await fetch(USERS_API, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json',
        },
    });
    let json = await response.json();
    return json.users;
};

//Get current user's friends' info as JSON (saved in local storage)
export const getFriendsInfo = function () {
    return JSON.parse(localStorage.getItem('friendsInfo'));
};

//Display components of the navigation bar (log out button and accompanied text)
export const navBarComps = function() {
    //Who logged in?
    let loginStatus = document.getElementsByClassName('login-status')[0];
    if (getCurUserInfo() == null) {
        loginStatus.innerHTML = 'Please log in or sign up to get started.';
    } else {
        let currentUser = document.getElementById('current-user');
        currentUser.innerHTML = `Logged in as <strong>${
            getCurUserInfo().display_name
        }</strong> `;
        //Log out
        let logOutButton = document.getElementById('log-out-btn');
        logOutButton.addEventListener('click', () => {
            localStorage.clear();
            location.href = 'index.html';
        });
    }
}

//Check if an input box in the form is currently non-empty
export const checkInvalid = function () {
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