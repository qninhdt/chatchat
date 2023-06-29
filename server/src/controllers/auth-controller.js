const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getUserByUsername, createUser } = require('../services/user');

async function loginController(req, res) {
    const { username, password } = req.body;

    const user = await getUserByUsername(username);

    if (!user) {
        return res.status(404).json({ message: 'Username is not exist' });
    }

    // check password hash using bcrypt
    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            const token = jwt.sign(
                { username, _id: user._id },
                process.env.TOKEN_SECRET,
            );

            res.status(200).json({ token, message: 'Login successfully' });
        } else {
            res.status(401).json({ message: 'Password is incorrect' });
        }
    });
}

async function signupController(req, res) {
    const { username, password, displayName } = req.body;

    const user = await getUserByUsername(username);

    if (password.length == 0) {
        return res.status(400).json({ message: 'Password is required' });
    }

    if (displayName.length == 0) {
        return res.status(400).json({ message: 'Display name is required' });
    }

    if (user) {
        return res.status(400).json({ message: 'Username is already exist' });
    }

    // hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user to database
    await createUser(username, hashedPassword, displayName);

    const token = jwt.sign({ username }, process.env.TOKEN_SECRET);

    res.status(200).json({ token, message: 'Signup successfully' });
}

module.exports = { loginController, signupController };
