require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const { readdirSync } = require("fs");

const app = express();

//implement socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

//import middleware
const socketRoute = require("./routes/socket-route");

//using socket
io.on("connection", socketRoute(io));

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

readdirSync("./src/routes").map((path) => app.use("/", require(`./routes/${path}`)));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
