var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cors = require("cors");

// set mongodb server url
var dbUrl = "mongodb://localhost:27017/project";

// connect to mongodb server
mongoose.connect(
  dbUrl,
  { useNewUrlParser: true },
  err => {
    if (err) console.log(err);
    else console.log("mongodb connected");
  }
);

// create a new mongoose model
var List = mongoose.model("List", { text: String });

// setup express middleware
var app = express();

// create an http server
var http = require("http").Server(app);

// create socketio connection
var io = require("socket.io")(http);

// listen on new client connections
io.on("connection", () => {
  console.log("a user is connected");
});

// cors to call from outside urls
app.use(cors());

// enable body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// get all list route
app.get("/list", (req, res) => {
  List.find({}, (err, list) => {
    res.send(list);
  });
});

// post a new list route
app.post("/list", (req, res) => {
  List.create({ text: req.body.text }, function(err, text) {
    if (err) res.sendStatus(500);
    io.emit("created", text);
    res.sendStatus(200);
  });
});

// delete from list route
app.delete("/list/:id", (req, res) => {
  List.deleteOne({ _id: req.params.id }, function(err) {
    if (err) res.sendStatus(500);
    io.emit("removed", req.params.id);
    res.sendStatus(200);
  });
});

// listen for the http server on the port 2000
var server = http.listen(2000, () => {
  console.log("server is running on port", server.address().port);
});
