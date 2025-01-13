const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");
const { createConversation } = require("./conversationsActions");

const sendInvit = async (userid, receiverid) => {
  try {
    // Vérifie si le destinataire existe
    const receiverExist = await User.exists({ _id: receiverid });
    if (!receiverExist) {
      console.log("Le destinataire n'existe pas.");
      return { success: false, message: "Le destinataire n'existe pas." };
    }

    // Vérifie si une demande d'ami existe déjà
    const friendReqExist = await FriendRequest.findOne({
      receiver: receiverid,
      sender: userid,
      status: { $in: ["pending", "accepted"] },
    });

    if (friendReqExist) {
      console.log("Une demande d'ami existe déjà.");
      return { success: false, message: "Une demande d'ami existe déjà." };
    }

    // Crée et enregistre une nouvelle demande d'ami
    const sendFriendReq = new FriendRequest({
      sender: userid,
      receiver: receiverid,
    });
    await sendFriendReq.save();

    console.log("Demande d'ami envoyée avec succès.");
    return { success: true, data: sendFriendReq };
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande d'ami :", error);
    return { success: false, message: "Erreur serveur." };
  }
};

const loadFriendsRequests = async (userId) => {
  try {
    const friends_requests = await FriendRequest.find({
      receiver: userId,
      status: "pending",
    })
      .populate("sender", "name email avatar")
      .populate("receiver", "name email avatar");

    return friends_requests;
  } catch (error) {
    console.error("Erreur lors du chargement des conversations :", error);
    return null;
  }
};
const loadFriends = async (userId) => {
  try {
    const friends = await FriendRequest.find({
      receiver: userId,
      status: "accepted",
    })
      .populate("sender", "name email avatar")
      .populate("receiver", "name email avatar");

    return friends;
  } catch (error) {
    console.error("Erreur lors du chargement des conversations :", error);
    return null;
  }
};
const acceptInvit = async (userid, senderid) => {
  try {
    const friendReq = await FriendRequest.findOneAndUpdate(
      {
        receiver: userid,
        sender: senderid,
        status: "pending",
      },
      { status: "accepted" }
    );
    if (!friendReq) {
      return { success: false };
    }
    const conversation = await createConversation(userid, senderid);

    if (!conversation) {
      return { success: false };
    }
    const friendconv = await FriendRequest.findOneAndUpdate(
      {
        receiver: userid,
        sender: senderid,
        status: "accepted",
      },
      {
        conversation: conversation._id,
      }
    );
    if (!friendconv) {
      return { success: false };
    }
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};
const rejectInvit = async (userid, senderid) => {
  try {
    const friendReq = await FriendRequest.findOneAndUpdate(
      {
        receiver: userid,
        sender: senderid,
        status: "pending",
      },
      { status: "rejected" }
    );
    if (!friendReq) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    return { success: false };
  }
};
module.exports = {
  sendInvit,
  loadFriendsRequests,
  acceptInvit,
  loadFriends,
  rejectInvit,
};
