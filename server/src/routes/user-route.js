const { Router } = require('express');
const { authMiddleware } = require('../middlewares/auth-middleware');
const {
    getUsersController,
    getUserController,
} = require('../controllers/user-controller');

const route = new Router();

route.get('/users', authMiddleware, getUsersController);

route.get('/users/:id', authMiddleware, getUserController);

module.exports = route;
