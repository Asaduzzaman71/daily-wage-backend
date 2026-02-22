const { connectedUsers } = require('./socketHandlers');

const authenticateSocket = (socket, next) => {
  // Add socket authentication logic here
  // You can verify JWT tokens, etc.
  try {
    const token = socket.handshake.auth.token;
    if (token) {
      // Verify token logic (similar to your HTTP auth middleware)
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // socket.userId = decoded.userId;
      next();
    } else {
      next(new Error('Authentication error'));
    }
  } catch (error) {
    next(new Error('Authentication error'));
  }
};

const getOnlineUsers = () => {
  return Array.from(connectedUsers.values()).map(user => ({
    id: user.id,
    username: user.username
  }));
};

module.exports = {
  authenticateSocket,
  getOnlineUsers
};