const { Router } = require('express');
const { authMiddleware } = require('../middlewares/auth-middleware');
const {
    getLastestMessagesController,
    getGroupController,
} = require('../controllers/group-controller');

const router = Router();

router.get('/groups/:id', authMiddleware, getGroupController);

router.get(
    '/groups/:id/messages',
    authMiddleware,
    getLastestMessagesController,
);

module.exports = router;
