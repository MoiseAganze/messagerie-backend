const dotenv = require("dotenv");
dotenv.config();

const corsOptions = {
  origin: process.env.frontend,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

module.exports = corsOptions;
