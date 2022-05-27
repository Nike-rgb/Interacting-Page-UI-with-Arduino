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

module.exports = { sendBrightness, setBrightness };
