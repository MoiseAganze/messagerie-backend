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

let http;
const ip_addr = process.env.backend_ip;
if (process.env.en_ligne) {
  const options = {
    key: fs.readFileSync(`./ssl/${ip_addr}.key`),
    cert: fs.readFileSync(`./ssl/${ip_addr}.crt`),
  };
  http = require("https").createServer(options, app);
} else {
  http = require("http").createServer(app);
}

require("./socket/io")(http);

const port = process.env.PORT || 10000;
const hote_ip = process.env.hote_ip || "0.0.0.0";

http.listen(port, hote_ip, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
