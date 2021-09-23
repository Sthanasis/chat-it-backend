const app = require("express")();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const compression = require("compression");
const bodyParser = require("body-parser");
const io = require("./sockets");
const userRouter = require("./api/userRoutes");
const adminRouter = require("./api/adminRoutes");

app.use(cors());
app.use(compression());
app.use(bodyParser.json());

app.use("/api", adminRouter);
app.use("/api/users", userRouter);

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {});

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("uncaught Exception! SHUTTING DOWN NOW");
  process.exit(1);
});

mongoose
  .connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(
    `>Running on http://localhost:${port} with environment ${process.env.NODE_ENV}`
  );
});
