const mongoose = require("mongoose");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/Messagerie";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    const bot_exist = await User.exists({ name: "SiteBot" });
    if (!bot_exist) {
      const botUser = new User({
        name: "SiteBot",
        email: "bot@site.com",
        password: "Wynnrckr@2008",
        avatar: "user.png",
        status: "online",
      });
      const token = await botUser.generateAuthTokenAndSaveUser();
    }
    console.log("base de donnee connected");
  } catch (error) {
    console.error(`Erreur de connexion : ${error.message}`);
    process.exit(1); // Arrête le processus en cas d'erreur
  }
};

module.exports = connectDB;
