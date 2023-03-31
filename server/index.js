const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

//db
mongoose
  .connect(process.env.DATABASE_CLOUD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch(() => console.log("some Error"));

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const linkRoutes = require("./routes/link");

//app middlewares
app.use(morgan("dev"));
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "5mb", type: "application/json" }));
// app.use(cors())
// app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from connect-content-api");
});
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", linkRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port : ${port}`));
