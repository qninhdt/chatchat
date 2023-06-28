const jwt = require('jsonwebtoken');
const { fakeUsers } = require('./user-controller');

function loginController(req, res) {
    const { username, password } = req.body;

    const user = fakeUsers.find(
        (user) => user.username === username && user.password === password,
    );

    if (!user) {
        return res
            .status(404)
            .json({ message: 'Username or password is incorrect' });
    }

    const token = jwt.sign(
        { username, _id: user._id },
        process.env.TOKEN_SECRET,
    );

    res.status(200).json({ token, message: 'Login successfully' });
}

function signupController(req, res) {
    const { username, password } = req.body;

    const token = jwt.sign({ username }, process.env.TOKEN_SECRET);

    res.status(200).json({ token, message: 'Signup successfully' });
}

module.exports = { loginController, signupController };
