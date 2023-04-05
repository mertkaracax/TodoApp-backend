const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");

const app = express();

app.use(bodyParser.json()); //for application/json request parsing

app.use((req, res, next) => {
  // CORS policy hatası almamak için. Cors policy hatası front ve back farklı portta olunca alınıyor.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRoutes);
app.use("/task", taskRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    "mongodb+srv://mertkaracax:m1e9r9t9@cluster0.09yxn8r.mongodb.net/?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(8080);
    // console.log(result);
  })
  .catch((err) => console.log(err));
