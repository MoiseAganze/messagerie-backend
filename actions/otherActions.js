const Conversation = require("../models/Conversation");
const User = require("../models/User");

const get_user_datas = async (id, current_userid) => {
  try {
    const user = await User.findOne({ _id: id })
      .select("-password -__v -authTokens")
      .lean();
    if (!user) {
      return { success: false, message: "utilisateur inexistant" };
    }
    const current_user = await User.findOne({ _id: current_userid });
    if (!current_user) {
      return { success: false, message: "erreur auth" };
    }

    const is_user_friend =
      user?.friends.some(
        (friend) => friend.userId.toString() === current_user._id.toString()
      ) ?? false;

    // Trouver la conversation commune
    const conversation = await Conversation.findOne({
      participants: {
        $all: [id, current_userid],
        $size: 2,
      },
    })
      .select("_id")
      .lean();

    return {
      success: true,
      data: {
        ...user,
        id_conv: conversation?._id || null, // Ajout de l'ID de conversation
      },
      is_user_friend,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = { get_user_datas };
