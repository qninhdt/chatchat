require('dotenv/config');
const express = require('express');
const authRoute = require('./routes/auth-route');

const app = express();
const route = express.Router();

route.use(authRoute);

app.use(express.json());
app.use('/api', route);

app.listen(8000, () => {
    console.log('Server is up on port 3000.');
});
