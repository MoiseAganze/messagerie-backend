const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const sendMessage = async (senderId, receiverId, conversationId, text) => {
  try {
    // 1. Créer un nouveau message
    const message = new Message({
      conversationId,
      sender: senderId,
      receiver: receiverId,
      text,
    });
    await message.save();

    // 2. Mettre à jour le champ lastMessage dans la conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
    });

    return message;
  } catch (error) {
    console.error("Erreur lors de l’envoi du message :", error);
    return null;
  }
};
const createConversation = async (user1_id, user2_id) => {
  try {
    const conv = new Conversation({
      participants: [user1_id, user2_id],
    });
    await conv.save();
    if (conv) {
      return conv;
    }
  } catch (error) {
    console.error("erreur lors de la cretion de la conversation: ", error);
    return null;
  }
};
const getMessages = async (conversationId, userId) => {
  try {
    // Trouver tous les messages d'une conversation
    const messages = await Message.find({ conversationId })
      .populate({
        path: "sender", // Inclure les infos de l'expéditeur
        select: "name avatar", // Limiter les champs retournés
      })
      .sort({ createdAt: 1 }); // Trier par ordre croissant (anciens en premier)

    // Ajouter `isSender` à chaque message
    const enrichedMessages = messages.map((message) => ({
      ...message.toObject(), // Convertir en objet JS pour modification
      isSender: message.sender._id.toString() === userId.toString(), // Vérifier si l'user est l'expéditeur
      status: message.status,
    }));

    return enrichedMessages;
  } catch (error) {
    console.error("Erreur lors du chargement des messages :", error);
    throw new Error("Impossible de charger les messages.");
  }
};

const loadConversations = async (userId) => {
  try {
    // Charger les conversations où l'utilisateur est participant
    const conversations = await Conversation.find({ participants: userId })
      .populate({
        path: "participants", // Inclure les infos des participants
        select: "name avatar", // Limiter les champs retournés
      })
      .populate({
        path: "lastMessage", // Inclure le dernier message
        select: "text sender createdAt", // Limiter les champs du message
        populate: {
          path: "sender", // Inclure les infos du sender du dernier message
          select: "name avatar",
        },
      })
      .sort({ updatedAt: -1 }); // Trier par la dernière mise à jour (conversations récentes en premier)

    return conversations;
  } catch (error) {
    console.error("Erreur lors du chargement des conversations :", error);
    return null;
  }
};
const markMessagesAsRead = async (conversationId, userId) => {
  try {
    // Mettre à jour tous les messages de la conversation pour les marquer comme "vus"
    await Message.updateMany(
      { conversationId, status: "non vu", receiver: userId }, // Sélectionner les messages non vus
      { $set: { status: "vu" } } // Changer leur statut à "vu"
    );
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du statut des messages :",
      error
    );
    throw new Error("Impossible de mettre à jour le statut des messages.");
  }
};

module.exports = {
  loadConversations,
  sendMessage,
  createConversation,
  getMessages,
  markMessagesAsRead,
};
