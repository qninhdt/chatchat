//signup.js
//script for signup.html

import * as bootstrap from 'bootstrap'

import "../scss/styles.scss"

const server = ""

let loginForm = document.getElementById("login-form")

//Check if an input box in the form is currently non-empty
const checkInvalid = function()
{
    const forms = document.querySelectorAll('.needs-validation')

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
        }

        form.classList.add('was-validated')
        }, false)
    })
}

//Check if the given username or password is valid
const infoFirstCheck = function(username, password) {
    let usernameRegExPattern = /[a-zA-Z0-9_]/g
    if (username.match(usernameRegExPattern) == null || username.match(usernameRegExPattern).length != username.length)
    {
        alert("The username can only contain letters of any cases, number and underscore symbol (_).")
        return 0
    }
    let passwordRegExPattern = /[^ ]/g
    if (password.match(passwordRegExPattern) == null || password.match(passwordRegExPattern).length != password.length)
    {
        alert("The password cannot contain spaces.")
        return 0
    }
    if (password.length < 6)
    {
        alert("Password length must be at least 6.")
        return 0
    }
    if (password != passwordRetype.value) 
    {
        alert("Password retype does not match.")
        return 0
    }
    return 1
}

//Send the registered credits to the server after submitting
loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    let usernameInput = document.getElementById("username-input")
    let passwordInput = document.getElementById("password-input")
    let passwordRetype = document.getElementById("password-retype")

    if (!(usernameInput.value == "" || passwordInput.value == ""))
    {
        console.log(`[signup.js] usernameInput.value = ${usernameInput.value}`)
        console.log(`[signup.js] passwordInput.value = ${passwordInput.value}`)
        console.log(`[signup.js] passwordRetype.value = ${passwordRetype.value}`)
    }

    let username = usernameInput.value
    let password = passwordInput.value

    let isValid = infoFirstCheck(username, password)

    //Post {username, password} to the server
    //Please give me validation information (passed or not) (new username cannot coincide with registered ones)
    fetch(server, {
        method: "POST",
        body: JSON.stringify({
            username: usernameInput.value,
            password: passwordInput.value,
        })
    })
    .then((response) => (response.json()))
    .then((json) => {

    })

    if (isValid) 
    {
        alert("Successfully registered.")
        location.href = "chat.html"
        localStorage.setItem("username", username)
    }
})

checkInvalid();