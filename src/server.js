require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { readdirSync } = require("fs");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

readdirSync("./src/routes").map((path) => app.use("/", require(`./routes/${path}`)));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
