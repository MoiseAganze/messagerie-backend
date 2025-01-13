const { sendMessage } = require("../actions/conversationsActions");

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
    socket.on("user-connected", (userId) => {
      if (!users.some((user) => user.userId === userId)) {
        users.push({ userId, socketId: socket.id });
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
      }
      if (receiver) {
        console.log("receiver: " + receiver.socketId);
        message._doc.isSender = false;
        io.to(receiver.socketId).emit("receive-message", message);
      } else {
        console.error(`Destinataire ${receiverId} introuvable`);
      }
    });

    // Lorsque l'utilisateur se déconnecte
    socket.on("disconnect", () => {
      console.log("Un utilisateur s'est déconnecté :", socket.id);
      users = users.filter((user) => user.socketId !== socket.id);
    });
  });
  return io; // Facultatif, au cas où vous voudriez utiliser l'instance ailleurs
};
