const { Router } = require('express');
const { authMiddleware } = require('../middlewares/auth-middleware');
const {
    getUsersController,
    getUserController,
    addFriendController,
} = require('../controllers/user-controller');

const route = new Router();

route.get('/users', authMiddleware, getUsersController);

route.get('/users/:id', authMiddleware, getUserController);

route.post('/friends', authMiddleware, addFriendController);

module.exports = route;
