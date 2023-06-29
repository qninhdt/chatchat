const { Router } = require('express');
const { authMiddleware } = require('../middlewares/auth-middleware');
const {
    getUsersController,
    getUserController,
    addFriendController,
    getFriendsController,
} = require('../controllers/user-controller');

const route = new Router();

route.get('/users', authMiddleware, getUsersController);

route.get('/users/:id', authMiddleware, getUserController);

route.post('/friends', authMiddleware, addFriendController);

route.get('/users/:id/friends', authMiddleware, getFriendsController);

module.exports = route;
