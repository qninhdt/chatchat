const { Router } = require('express');
const {
    loginController,
    signupController,
} = require('../controllers/auth-controller');

const route = new Router();

route.post('/login', loginController);

route.post('/signup', signupController);

module.exports = route;
