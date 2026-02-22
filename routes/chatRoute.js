const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../middleware/authentication');
const {
  createOrGetConversationWithUser,
  getConversationMessages,
  sendPrivateMessage
} = require('../controllers/ChatController');

router.post('/conversations/with/:userId', authenticateUser, createOrGetConversationWithUser);
router.get('/conversations/:conversationId/messages', authenticateUser, getConversationMessages);
router.post('/messages', authenticateUser, sendPrivateMessage);

module.exports = router;
