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

//Send the registered credits to the server after submitting
//Please give me validation information (passed or not, why not passed)
loginForm.addEventListener("submit", () => {
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

    let isValid = 1

    // let usernameRegExPattern = /[a-zA-Z0-9_]*/
    // if (username.match(usernameRegExPattern)) 
    // {
    //     alert("The username can only contain letters of any cases, number and underscore symbol (_)")
    //     isValid = 0;
    // }
    // let passwordRegExPattern = /[^ ]*/
    // if (password.match(passwordRegExPattern)) 
    // {
    //     alert("The password cannot contain spaces")
    //     isValid = 0;
    // }
    // if (password.length < 6)
    // {
    //     alert("Your password is too short")
    //     isValid = 0;
    // }
    // if (password != passwordRetype) 
    // {
    //     alert("Your password retype does not match")
    //     isValid = 0
    // }

    fetch(server, {
        method: "POST",
        body: JSON.stringify({
            username: usernameInput.value,
            password: passwordInput.value,
            passwordRetype: passwordRetype.value
        })
    })
    .then((response) => (response.json()))
    .then((json) => {

    })

    if (isValid) 
    {
        alert("Successfully registered.")
        location.href = "chat.html"
    }

    usernameInput.value = ""
    passwordInput.value = ""
    passwordRetype.value = ""
})

checkInvalid();