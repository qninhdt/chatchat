const jwt = require('jsonwebtoken');

function loginController(req, res) {
    const { username, password } = req.body;

    const token = jwt.sign({ username }, process.env.TOKEN_SECRET);

    res.status(200).json({ token });
}

function signupController(req, res) {
    const { username, password } = req.body;

    const token = jwt.sign({ username }, process.env.TOKEN_SECRET);

    res.status(200).json({ token });
}

module.exports = { loginController, signupController };
