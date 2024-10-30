require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRouter = require('./routes/auth-routes')
const errHandler = require('./middlewares/error')
const notFound = require('./middlewares/notFound')
const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use('/auth',authRouter)

app.use(errHandler)
app.use('*',notFound)
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
