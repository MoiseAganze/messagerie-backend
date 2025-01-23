const { sendMessage } = require("../actions/conversationsActions");
const User = require("../models/User");

// Connexion WebSocket avec Socket.IO
let users = []; // Liste des utilisateurs connectés
module.exports = function (http) {
  const io = require("socket.io")(http, {
    cors: {
      origin: process.env.frontend || "http://localhost:5173", // Remplacez par l'URL de votre frontend
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true, // Si vous utilisez des cookies ou des sessions
    },
    transports: ["websocket"],
  });

  io.on("connection", (socket) => {
    console.log("Un utilisateur est connecté :", socket.id);
    // Enregistrer l'utilisateur dès qu'il se connecte
    socket.on("user-connected", async (userId) => {
      console.log("user id: ", userId);

      if (!users.some((user) => user.userId === userId)) {
        users.push({ userId, socketId: socket.id });
        const usr = await User.findByIdAndUpdate(userId, { status: "online" });
        await usr.save();
        console.log(
          `Utilisateur ${userId} ajouté avec socket ID : ${socket.id}`
        );
      } else {
        console.log(`Utilisateur ${userId} est déjà connecté.`);
      }
    });

    // Recevoir un message et le transmettre au destinataire
    socket.on("send-message", async (data) => {
      const { senderId, text, conversationId, receiverId } = data;

      console.log("Receiver ID reçu :", receiverId);
      console.log("datas:", { senderId, text, conversationId, receiverId });

      if (!receiverId) {
        console.error("Receiver ID est manquant");
        return;
      }

      const message = await sendMessage(
        senderId,
        receiverId,
        conversationId,
        text
      );

      const sender = users.find((user) => user.userId === senderId);
      const receiver = users.find((user) => user.userId === receiverId);

      if (sender) {
        console.log("sender: " + sender.socketId);
        message._doc.isSender = true;
        io.to(sender.socketId).emit("receive-message", message);
        io.to(sender.socketId).emit("refresh-conv", message);
      }
      if (receiver) {
        console.log("receiver: " + receiver.socketId);
        message._doc.isSender = false;
        io.to(receiver.socketId).emit("receive-message", message);
        io.to(receiver.socketId).emit("refresh-conv", message);
      } else {
        console.error(`Destinataire ${receiverId} introuvable`);
      }
    });

    // Lorsque l'utilisateur se déconnecte
    socket.on("disconnect", async () => {
      try {
        const userIndex = users.findIndex(
          (user) => user.socketId === socket.id
        );
        if (userIndex !== -1) {
          const disconnectedUser = users[userIndex];
          users.splice(userIndex, 1);
          const usr = await User.findByIdAndUpdate(disconnectedUser.userId, {
            status: "offline",
          });
          await usr.save();
          console.log(`Utilisateur ${disconnectedUser.userId} déconnecté.`);
        }
      } catch (error) {
        console.error("Erreur lors de la déconnexion :", error);
      }
    });
  });
  return io; // Facultatif, au cas où vous voudriez utiliser l'instance ailleurs
};
