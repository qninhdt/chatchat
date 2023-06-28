require('dotenv/config');
const http = require('http');
const express = require('express');
const cors = require('cors');
const authRoute = require('./routes/auth-route');
const userRoute = require('./routes/user-route');
const { getSocketServer } = require('./socket');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const route = express.Router();

route.use(authRoute);
route.use(userRoute);

app.use('/api', route);

const io = getSocketServer(server);

server.listen(8000, () => {
    console.log('Server is up on port 8000.');
});
