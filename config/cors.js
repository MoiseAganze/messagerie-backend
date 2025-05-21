const dotenv = require("dotenv");
dotenv.config();

const corsOptions = {
  origin: "*", //[process.env.FRONTEND_1, process.env.FRONTEND_2], // Tableau d'URLs
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

module.exports = corsOptions;
