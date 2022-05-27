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
  app.set("mode", "main");
  res.render("index");
});

app.get("/game", (req, res) => {
  app.set("mode", "game");
  res.render("game");
});

const { sendBrightness, setBrightness } = require("./libs/brightnessControl");
const { Server } = require("socket.io");
const io = new Server(server);
io.on("connection", (socket) => {
  app.set("clientSocket", socket);
  setInterval(() => sendBrightness(socket), 500);
});

const five = require("johnny-five");
const board = new five.Board();
board.on("ready", () => {
  const sensor = new five.Sensor({
    pin: "A0",
    freq: 250,
    threshold: 1,
  });
  sensor.on("change", () => {
    const mode = app.get("mode");
    const socket = app.get("clientSocket");
    if (!socket) return;
    let value = sensor.fscaleTo(0, 1);
    if (mode === "main") setBrightness(value, socket);
    else socket.emit("sensorChange", value);
    console.log(sensor.value);
    console.log(mode);
  });
});
