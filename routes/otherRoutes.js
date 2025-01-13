const express = require("express");
const datas = require("../datas/test_conversations");
const {
  loadConversations,
  getMessages,
  markMessagesAsRead,
  sendMessage,
} = require("../actions/conversationsActions");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyToken");
const {
  sendInvit,
  loadFriendsRequests,
  acceptInvit,
  loadFriends,
  rejectInvit,
} = require("../actions/friendActions");
const router = express.Router();

router.get("/conversations", verifyToken, async (req, res) => {
  const userdatas = req.userdatas;
  const result = await loadConversations(userdatas._id);
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400).json({ error: "erreur serveur" });
  }
});
router.get("/messages/:id", verifyToken, async (req, res) => {
  const userdatas = req.userdatas;
  const conversationId = req.params.id;
  await markMessagesAsRead(conversationId, userdatas._id);
  const messages = await getMessages(conversationId, userdatas._id);
  if (!messages) {
    return res.status(400).json([]);
  }

  return res.status(200).json(messages);
});
router.post("/send-invitation/:id", verifyToken, async (req, res) => {
  const userdatas = req.userdatas;
  const receiverId = req.params.id;
  const send_friendreq = await sendInvit(userdatas._id, receiverId);
  if (send_friendreq.success) {
    res.status(200).json(send_friendreq);
  } else {
    res.status(400).json(send_friendreq);
  }
});
router.get("/friends", verifyToken, async (req, res) => {
  const userdatas = req.userdatas;
  const result = await loadFriends(userdatas._id);
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400).json({ error: "erreur serveur" });
  }
});
router.get("/friends-requests", verifyToken, async (req, res) => {
  const userdatas = req.userdatas;
  const result = await loadFriendsRequests(userdatas._id);
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400).json({ error: "erreur serveur" });
  }
});
router.post("/accept-invit/:id", verifyToken, async (req, res) => {
  const userdatas = req.userdatas;
  const senderId = req.params.id;
  const request = await acceptInvit(userdatas._id, senderId);
  if (request.success) {
    res.status(200).json(request);
  } else {
    res.status(400).json(request);
  }
});
router.post("/reject-invit/:id", verifyToken, async (req, res) => {
  const userdatas = req.userdatas;
  const senderId = req.params.id;
  const request = await rejectInvit(userdatas._id, senderId);
  if (request.success) {
    res.status(200).json(request);
  } else {
    res.status(400).json(request);
  }
});
module.exports = router;
