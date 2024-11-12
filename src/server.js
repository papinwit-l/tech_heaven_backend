require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cartRouter = require("./routes/cart-routes");
const categoryRoute = require("./routes/category-route");
const bookingRouter = require("./routes/booking-route");
const authRouter = require("./routes/auth-routes");
const wishListRouter = require("./routes/wishlist-route");
const errHandler = require("./middlewares/error");
const notFound = require("./middlewares/notFound");
const app = express();

const http = require("http");
const { Server } = require("socket.io");

const { readdirSync } = require("fs");

//implement socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
  transports: ["websocket", "polling"],
});

//import middleware
const socketRoute = require("./routes/socket-route");
const stripeRouter = require("./routes/stripe-route");
const userRouter = require("./routes/user-route");
const chatRouter = require("./routes/chat-route");
const dashboardRouter = require("./routes/dashboard-route")

io.on("connection", socketRoute(io));

app.use(morgan("dev"));
app.use(cors());
// limit file  20 mb !!!
app.use(express.json({ limit: "20mb" }));
app.use("/payment", stripeRouter);
app.use("/auth", authRouter);
app.use("/booking", bookingRouter);
app.use("/cart", cartRouter);
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/category", categoryRoute);
app.use("/wishlist", wishListRouter);
app.use("/dashboard", dashboardRouter)
readdirSync("./src/routes").map((path) =>
  app.use("/", require(`./routes/${path}`))
);

app.use(errHandler);
app.use("*", notFound);

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
