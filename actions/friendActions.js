const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");
const { createConversation } = require("./conversationsActions");

async function addFriend(userid, senderid) {
  try {
    // Rechercher l'utilisateur cible
    const user = await User.findOne({ _id: userid });
    if (!user) {
      return { success: false, message: "Utilisateur introuvable." };
    }

    // Rechercher le sender
    const sender = await User.findOne({ _id: senderid });
    if (!sender) {
      return { success: false, message: "Sender introuvable." };
    }

    // Vérifier si le sender est déjà un ami de l'utilisateur
    const isAlreadyFriendUser = user.friends.some(
      (friend) => friend.userId.toString() === senderid
    );

    if (isAlreadyFriendUser) {
      return { success: false, message: "Cet utilisateur est déjà un ami." };
    }

    // Vérifier si l'utilisateur est déjà un ami du sender
    const isAlreadyFriendSender = sender.friends.some(
      (friend) => friend.userId.toString() === userid
    );

    if (isAlreadyFriendSender) {
      return {
        success: false,
        message: "L'utilisateur est déjà dans la liste d'amis du sender.",
      };
    }

    // Ajouter le sender à la liste des amis de l'utilisateur
    user.friends.push({ userId: senderid });

    // Ajouter l'utilisateur à la liste des amis du sender
    sender.friends.push({ userId: userid });

    // Enregistrer les modifications
    await user.save();
    await sender.save();

    return { success: true, message: "Amitié ajoutée avec succès." };
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'ami :", error);
    return { success: false, message: "Une erreur s'est produite." };
  }
}

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
async function loadFriends(userid) {
  try {
    // Rechercher l'utilisateur et peupler la liste des amis
    const user = await User.findById(userid).populate({
      path: "friends.userId", // Chemin vers les amis
      select: "name email avatar", // Champs à inclure
    });

    if (!user) {
      return null; // Retourner null si l'utilisateur n'existe pas
    }

    // Extraire les amis peuplés
    const friends = user.friends.map((friend) => ({
      id: friend.userId._id,
      name: friend.userId.name,
      email: friend.userId.email,
      avatar: friend.userId.avatar,
      addedAt: friend.addedAt,
    }));

    return friends;
  } catch (error) {
    console.error("Erreur lors du chargement des amis :", error);
    return null; // Retourner null en cas d'erreur
  }
}
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
    const add_friend = await addFriend(userid, senderid);
    if (!add_friend) {
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
