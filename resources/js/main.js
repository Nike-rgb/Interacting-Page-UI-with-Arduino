import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.min.css";
import { io } from "socket.io-client";

const speakDiv = document.getElementById("speak");
const sentences = [
  "Hello,",
  "Turn the knob on the POT to change brightness of this device",
  "You can look at the circuit diagram on my Github",
];

let i = 0;
const speak = (sentence) => {
  speakDiv.innerText = sentence;
  if (i < sentences.length - 1) i++;
  else i = 0;
};
speak(sentences[i]);
setInterval(() => {
  speak(sentences[i]);
}, 3000);

const brightnessSlider = document.getElementById("brightness_range");
noUiSlider.create(brightnessSlider, {
  orientation: "vertical",
  start: [100],
  range: {
    min: [0],
    max: [100],
  },
});

const socket = io();
socket.on("getBrightness", (value) => {
  brightnessSlider.noUiSlider.set(100 - value * 100);
});
