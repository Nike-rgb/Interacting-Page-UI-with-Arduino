const express = require("express");
const path = require("path");
const http = require("http");

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(3000, () => {
  console.log("Server listening to port " + PORT);
});
app.set("views", path.resolve(__dirname, "resources/views"));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

const Brightness = require("brightness");
const sendBrightness = (socket) => {
  Brightness.get().then((value) => {
    socket.emit("getBrightness", value);
  });
};
const setBrightness = (value, socket) => {
  Brightness.set(value).then(() => {
    sendBrightness(socket);
  });
};

const { Server } = require("socket.io");
const io = new Server(server);
io.on("connection", (socket) => {
  setInterval(() => sendBrightness(socket), 500);
});
