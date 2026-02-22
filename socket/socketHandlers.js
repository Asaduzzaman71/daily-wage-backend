// Store connected users
const db = require('../models')
const Conversation = db.Conversation
const ConversationParticipant = db.ConversationParticipant
const Message = db.Message
const connectedUsers = new Map();

const socketHandlers = (io) => {
  io.on('connection', (socket) => {

    // Handle user joining with authentication
    socket.on('user_join', (userData) => {
      handleUserJoin(socket, userData);
    });

    // Handle private messages
    socket.on('send_private_message', (data) => {
      console.log("data received on server:", data);
      handlePrivateMessage(socket, data);
    });

    // Handle group messages
    socket.on('send_group_message', (messageData) => {
      handleGroupMessage(socket, messageData);
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      handleTypingStart(socket, data);
    });

    socket.on('typing_stop', () => {
      handleTypingStop(socket);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      handleUserDisconnect(socket);
    });

    // Handle message read receipts
    socket.on('message_read', (data) => {
      handleMessageRead(socket, data);
    });

    // Ensure conversation exists for private chat
    socket.on('ensure_conversation', (data) => {
      console.log('[socket] ensure_conversation received:', data);
      handleEnsureConversation(socket, data);
    });
  });
};

// Handler functions
const findExistingPrivateConversation = async (userId, otherUserId) => {
  const userRows = await ConversationParticipant.findAll({
    where: { user_id: userId },
    attributes: ['conversation_id']
  });
  const otherRows = await ConversationParticipant.findAll({
    where: { user_id: otherUserId },
    attributes: ['conversation_id']
  });

  const userIds = new Set(userRows.map(row => row.conversation_id));
  const intersection = otherRows
    .map(row => row.conversation_id)
    .filter(id => userIds.has(id));

  if (!intersection.length) return null;

  return Conversation.findOne({
    where: { id: intersection, is_group: false }
  });
};

const handleEnsureConversation = async (socket, data) => {
  console.log('[socket] handleEnsureConversation start:', data);
  const { userId, peerId } = data || {};
  const currentUserId = Number(userId);
  const otherUserId = Number(peerId);

  if (!currentUserId || !otherUserId || Number.isNaN(currentUserId) || Number.isNaN(otherUserId)) {
    return;
  }
  if (currentUserId == otherUserId) {
    return;
  }

  try {
    let conversation = await findExistingPrivateConversation(currentUserId, otherUserId);

    if (!conversation) {
      conversation = await Conversation.create({ is_group: false });
      await ConversationParticipant.bulkCreate([
        { conversation_id: conversation.id, user_id: currentUserId },
        { conversation_id: conversation.id, user_id: otherUserId }
      ]);
    }

    const messages = await Message.findAll({
      where: { conversation_id: conversation.id },
      order: [['created_at', 'ASC']]
    });
    console.log("Ensured conversation=============>:", conversation.id, "with messages count:", messages.length);

    console.log('[socket] emitting conversation_details to', socket.id, 'peerId', otherUserId);
    socket.emit('conversation_details', {
      conversationId: conversation.id,
      peerId: otherUserId,
      messages: messages.map(msg => msg.toJSON())
    });
  } catch (error) {
    console.error('Error ensuring conversation:', error);
  }
};
const handleUserJoin = (socket, userData) => {
  connectedUsers.set(socket.id, {
    id: userData.userId,
    username: userData.username,
    socketId: socket.id
  });
  
  // Notify others that user joined
  socket.broadcast.emit('user_joined', {
    username: userData.username,
    message: `${userData.username} joined the chat`,
    timestamp: new Date().toISOString()
  });

  // Send current online users to the newly connected user
  const onlineUsers = getOnlineUsers();
    console.log("onlineUsers after connect", onlineUsers);
  socket.emit('online_users', onlineUsers);
  
  // Update all clients with new online users list
  socket.broadcast.emit('online_users', onlineUsers);
};

const handlePrivateMessage = async (socket, data) => {
  const { receiverId, message, conversationId } = data;
  const sender = connectedUsers.get(socket.id);
  if (!sender) return;

  try {
    let convId = conversationId;

    // If no conversationId, create a new conversation and participants
    if (!convId) {
      const newConversation = await Conversation.create({ is_group: false });
      convId = newConversation.id;

      // Add sender and receiver as participants
      await ConversationParticipant.bulkCreate([
        { conversation_id: convId, user_id: sender.id },
        { conversation_id: convId, user_id: receiverId }
      ]);
    }

    // Save message
    const newMessage = await Message.create({
      conversation_id: convId,
      sender_id: sender.id,
      message,
      status: 'sent'
    });

    const messagePayload = {
      ...newMessage.toJSON(),
      receiver_id: receiverId
    };

    // Emit to receiver if online
    const receiverEntry = Array.from(connectedUsers.entries())
      .find(([_, user]) => user.id === receiverId);

    if (receiverEntry) {
      const [receiverSocketId] = receiverEntry;
      socket.to(receiverSocketId).emit('receive_private_message', messagePayload);
      await newMessage.update({ status: 'delivered' });
    }

    // Emit back to sender
    socket.emit('message_sent', messagePayload);

  } catch (error) {
    console.error('Error sending private message:', error);
  }
};

const handleGroupMessage = (socket, messageData) => {
  const user = connectedUsers.get(socket.id);
  
  if (user) {
    const groupMessage = {
      id: Date.now(),
      userId: user.id,
      username: user.username,
      message: messageData.message,
      groupId: messageData.groupId,
      timestamp: new Date().toISOString()
    };

    // Broadcast to all connected clients including sender
    socket.emit('receive_group_message', groupMessage); // Send to sender
    socket.broadcast.emit('receive_group_message', groupMessage); // Send to others
  }
};

const handleTypingStart = (socket, data) => {
  const user = connectedUsers.get(socket.id);
  if (user) {
    const typingData = {
      username: user.username,
      userId: user.id,
      conversationId: data.conversationId
    };
    
    if (data.receiverId) {
      // Private chat typing indicator
      const receiverEntry = Array.from(connectedUsers.entries())
        .find(([_, user]) => user.id === data.receiverId);
      if (receiverEntry) {
        const [receiverSocketId] = receiverEntry;
        socket.to(receiverSocketId).emit('user_typing', typingData);
      }
    } else {
      // Group chat typing indicator
      socket.broadcast.emit('user_typing', typingData);
    }
  }
};

const handleTypingStop = (socket) => {
  const user = connectedUsers.get(socket.id);
  if (user) {
    socket.broadcast.emit('user_stop_typing', {
      userId: user.id
    });
  }
};

const handleUserDisconnect = (socket) => {
  const user = connectedUsers.get(socket.id);
  if (user) {
    // Notify others that user left
    socket.broadcast.emit('user_left', {
      username: user.username,
      message: `${user.username} left the chat`,
      timestamp: new Date().toISOString()
    });
    
    connectedUsers.delete(socket.id);
    
    // Update online users list for all remaining clients
    const onlineUsers = getOnlineUsers();
  
    socket.broadcast.emit('online_users', onlineUsers);
  }
  console.log('User disconnected:', socket.id);
};

const handleMessageRead = (socket, data) => {
  const { messageId, conversationId, senderId } = data;
  const reader = connectedUsers.get(socket.id);
  
  if (reader && senderId) {
    // Notify the sender that their message was read
    const senderEntry = Array.from(connectedUsers.entries())
      .find(([_, user]) => user.id === senderId);
    
    if (senderEntry) {
      const [senderSocketId] = senderEntry;
      socket.to(senderSocketId).emit('message_read_receipt', {
        messageId,
        conversationId,
        readBy: reader.id,
        readAt: new Date().toISOString()
      });
    }
  }
};

// Utility function to get online users
const getOnlineUsers = () => {
  return Array.from(connectedUsers.values()).map(user => ({
    id: user.id,
    username: user.username
  }));
};

// Export utility functions if needed elsewhere
module.exports = {
  socketHandlers,
  getOnlineUsers,
  connectedUsers
};


