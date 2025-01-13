const corsOptions = {
  origin: process.env.frontend || "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

module.exports = corsOptions;
