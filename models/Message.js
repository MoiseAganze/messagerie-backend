const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: { type: String },
  attachments: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["envoyé", "vu", "non vu"], // Définir les statuts possibles
    default: "non vu", // Le statut par défaut est "non vu"
  },
});
module.exports = mongoose.model("Message", MessageSchema);
