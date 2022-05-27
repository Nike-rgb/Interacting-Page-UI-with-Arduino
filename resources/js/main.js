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

//UI to display brightness change
const sun = document.getElementById("sun");
const moon = document.getElementById("moon");
const brightnessSlider = document.getElementById("brightness_range");
const nightBackground = document.querySelector(".night-container");
noUiSlider.create(brightnessSlider, {
  orientation: "vertical",
  start: [100],
  range: {
    min: [0],
    max: [100],
  },
});

function setBrightness(value) {
  brightnessSlider.noUiSlider.set(100 - value * 100);
  sun.style.opacity = value;
  sun.style.transform = `translateY(${(1 - value) * 100}px)`;
  moon.style.opacity = 1 - value;
  moon.style.transform = `translateY(${value * 100}px)`;
  nightBackground.style.opacity = 1 - value;
}

//client socket
const socket = io();
socket.on("getBrightness", (value) => {
  setBrightness(value);
});
