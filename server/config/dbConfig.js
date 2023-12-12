const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://vishnutha03:1234@cluster0.bzighwq.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("Mongo DB Connection Successfull");
});

connection.on("error", (err) => {
  console.log("Mongo DB Connection Failed", err);
});
