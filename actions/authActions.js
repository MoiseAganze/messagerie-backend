const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { createConversation, sendMessage } = require("./conversationsActions");

const createUserWithWelcomeConversation = async (user) => {
  try {
    // 2. Récupérer le bot (assurez-vous qu'il existe déjà)
    const bot = await User.findOne({ name: "SiteBot" });
    if (!bot) throw new Error("Bot utilisateur introuvable.");

    // 3. Créer une conversation entre l'utilisateur et le bot
    const conversation = await createConversation(user._id, bot._id);

    // 4. Ajouter des messages de bienvenue
    const welcomeMessages = await sendMessage(
      bot._id,
      user._id,
      conversation._id,

      `Bonjour ${user.name}, bienvenue sur notre site ! 😊`
    );

    return user; // Retourner l'utilisateur créé
  } catch (error) {
    console.error(
      "Erreur lors de la création de l’utilisateur avec une conversation :",
      error
    );
    throw error;
  }
};

async function register(datas) {
  try {
    // Vérifie si le nom ou l'email existe déjà
    if (await User.exists({ name: datas.name })) {
      return { status: "name-exist" };
    }
    if (await User.exists({ email: datas.email })) {
      return { status: "email-exist" };
    }

    // Crée un nouvel utilisateur
    const user = await User.create(datas);
    if (!user) {
      console.error("Erreur lors de l'enregistrement :", error);
      return { status: "error" };
    }
    const token = await user.generateAuthTokenAndSaveUser();
    await createUserWithWelcomeConversation(user);
    return { status: "bon", user, token };
  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error);
    return { status: "error" };
  }
}

async function login(datas) {
  try {
    const user = await User.findOne({ email: datas.email });

    if (!user) {
      return { success: false, message: "email ou mot de passe incorrect" };
    }
    const verifPassword = await user.comparePassword(datas.password);

    if (!verifPassword) {
      return { success: false, message: "email ou mot de passe incorrect" };
    }
    const token = await user.generateAuthTokenAndSaveUser();

    return { success: true, user, token };
  } catch (error) {
    console.log(error);

    return { success: false, message: "erreur serveur" };
  }
}
module.exports = { register, login };
