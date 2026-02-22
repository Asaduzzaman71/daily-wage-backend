//external imports
require('dotenv').config();
require('express-async-errors');
require('./models')
const multer = require("multer");
const http = require('http');
const express = require('express');
var cookieParser = require('cookie-parser');
const app = express();
const sequelize = require('./config/database');
var cors = require('cors')
const useragent = require('express-useragent');


//internal imports

const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
const chatRouter = require('./routes/chatRoute');
const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');
const { authenticateUser, authorizePermissions } = require('./middleware/authentication');


// Socket imports
const configureSocket = require('./socket/socketConfig');
const { socketHandlers } = require('./socket/socketHandlers');
const { getOnlineUsers } = require('./socket/socketMiddleware');

// Add this line to parse JSON request bodies
app.use(express.json());
app.use(cors())
app.use(useragent.express());
app.use(express.static('public'));
//all api group routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/chat', chatRouter);
// middleware
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// Create an HTTP server using the Express app
const server = http.createServer(app);


// Configure Socket.IO
const io = configureSocket(server);

// Initialize socket handlers
socketHandlers(io);

//get port number from env
const port = process.env.PORT || 3004;

const start = async () => {
  try {
    // connectDB
      await sequelize.authenticate()
      console.log('Connection has been established successfully.');
      server.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
