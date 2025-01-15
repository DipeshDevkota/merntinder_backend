const express = require('express');
const connectDB = require('./config/dbConfig');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const app = express();
const initializeSocket = require("./utils/socket")
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173","http://localhost:5174"],// The frontend URL
    credentials: true, // Allow credentials such as cookies to be sent
}));



// Import routes
const authroute = require("./routes/auth.routes");
const profileroute = require("./routes/profile.routes");
const requestroute = require("./routes/request.route");
const userroute = require("./routes/user.route");
app.use('/', authroute);
app.use('/', profileroute);
app.use('/', requestroute);
app.use('/', userroute);


const server = http.createServer(app)
//initialization of socket.io
initializeSocket(server)



// Database Connection and Server Start
connectDB()
    .then(() => {
        console.log('Database connection established...');
        server.listen(5000, () => {
            console.log('Server is running on port 5000');
        });
    })
    .catch((err) => {
        console.error("Database connection failed!", err);
    });
