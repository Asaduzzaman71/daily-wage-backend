const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const db = require('../models');

const Conversation = db.Conversation;
const ConversationParticipant = db.ConversationParticipant;
const Message = db.Message;

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

const createOrGetConversationWithUser = async (req, res) => {
  const currentUserId = Number(req.user.userId);
  const otherUserId = Number(req.params.userId);

  if (!otherUserId || Number.isNaN(otherUserId)) {
    throw new CustomError.BadRequestError('Invalid user id');
  }
  if (currentUserId === otherUserId) {
    throw new CustomError.BadRequestError('Cannot create conversation with yourself');
  }

  const existingConversation = await findExistingPrivateConversation(currentUserId, otherUserId);
  if (existingConversation) {
    return res.status(StatusCodes.OK).json({
      conversationId: existingConversation.id,
      created: false
    });
  }

  const newConversation = await Conversation.create({ is_group: false });
  await ConversationParticipant.bulkCreate([
    { conversation_id: newConversation.id, user_id: currentUserId },
    { conversation_id: newConversation.id, user_id: otherUserId }
  ]);

  return res.status(StatusCodes.CREATED).json({
    conversationId: newConversation.id,
    created: true
  });
};

const getConversationMessages = async (req, res) => {
  const currentUserId = Number(req.user.userId);
  const conversationId = Number(req.params.conversationId);

  if (!conversationId || Number.isNaN(conversationId)) {
    throw new CustomError.BadRequestError('Invalid conversation id');
  }

  const isParticipant = await ConversationParticipant.findOne({
    where: { conversation_id: conversationId, user_id: currentUserId }
  });
  if (!isParticipant) {
    throw new CustomError.UnauthorizedError('Not a participant of this conversation');
  }

  const messages = await Message.findAll({
    where: { conversation_id: conversationId },
    order: [['created_at', 'ASC']]
  });

  return res.status(StatusCodes.OK).json({
    conversationId,
    messages
  });
};

const sendPrivateMessage = async (req, res) => {
  const currentUserId = Number(req.user.userId);
  const { conversationId, receiverId, message } = req.body || {};

  const convId = Number(conversationId);
  const targetUserId = Number(receiverId);

  if (!convId || Number.isNaN(convId)) {
    throw new CustomError.BadRequestError('Invalid conversation id');
  }
  if (!message || !String(message).trim()) {
    throw new CustomError.BadRequestError('Message is required');
  }

  const participant = await ConversationParticipant.findOne({
    where: { conversation_id: convId, user_id: currentUserId }
  });
  if (!participant) {
    throw new CustomError.UnauthorizedError('Not a participant of this conversation');
  }

  if (targetUserId && !Number.isNaN(targetUserId)) {
    const receiverParticipant = await ConversationParticipant.findOne({
      where: { conversation_id: convId, user_id: targetUserId }
    });
    if (!receiverParticipant) {
      throw new CustomError.BadRequestError('Receiver is not a participant');
    }
  }

  const newMessage = await Message.create({
    conversation_id: convId,
    sender_id: currentUserId,
    message: String(message).trim(),
    status: 'sent'
  });

  return res.status(StatusCodes.CREATED).json({
    message: newMessage
  });
};

module.exports = {
  createOrGetConversationWithUser,
  getConversationMessages,
  sendPrivateMessage
};
