require('dotenv/config');
const express = require('express');
const authRoute = require('./routes/auth-route');
const userRoute = require('./routes/user-route');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const route = express.Router();

route.use(authRoute);
route.use(userRoute);

app.use('/api', route);

app.listen(8000, () => {
    console.log('Server is up on port 3000.');
});
