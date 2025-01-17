const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/cors");
const connectDB = require("./config/database");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

connectDB();

const app = express();
const authRoutes = require("./routes/authRoutes");
const otherRoutes = require("./routes/otherRoutes");

app.use(express.json());
app.use(express.static("public"));
app.use(cors(corsOptions));
app.use("/", authRoutes);
app.use("/", otherRoutes);

const http = require("http").createServer(app);

require("./socket/io")(http);

http.listen(process.env.PORT, process.env.hote_ip, () => {
  console.log(`Serveur démarré sur le port ${process.env.PORT}`);
});
