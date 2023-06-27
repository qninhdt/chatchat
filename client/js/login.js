//login.js
//script for login.html

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

//Send the login credits to the server after submitting
//Please give me validation information (passed/not passed)
loginForm.addEventListener("submit", () => {
    e.preventDefault()

    let usernameInput = document.getElementById("username-input")
    let passwordInput = document.getElementById("password-input")

    if (!(usernameInput.value == "" || passwordInput.value == ""))
    {
        console.log(`[login.js] usernameInput.value = ${usernameInput.value}`)
        console.log(`[login.js] passwordInput.value = ${passwordInput.value}`)
    }

    let isValid = 1
    fetch(server, {
        method: "POST",
        body: JSON.stringify({
            username: usernameInput.value,
            password: passwordInput.value
        })
    })
    .then((response) => (response.json()))
    .then((json) => {

    })

    if (isValid) 
    {
        alert("Successfully logged in.")
        location.href = "chat.html"
    }
    else alert("Your credientials does not match any registered accounts.")

    usernameInput.value = ""
    passwordInput.value = ""
})

checkInvalid();