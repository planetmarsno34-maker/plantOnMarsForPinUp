/*
Name: Plant on Mars
Author: Jing Chen
Date: 2026-01-07

Instructions:
- This is a interactive website.
- Users can interact through a "watering" button to 
  connect to arduino touch sensor to 
  alter the growth curves and expansion paths of the slime molds.

*/

let molds = [];
let num;
let numRatio = 0.03;
let d;
let currentSpeed;
let currentR;
let isReset = false;
let bgStep = 30;

// buffer
let graphic;
const RENDER_W = 400;
const RENDER_H = 400;

//dreamy background
let noiseScale = 0.1;
let timeOffset = 0;

let isButtonPressed = false;

//arduino setting
let port;
let reader;
let latestValue = 0;
let threshold = 2000;

async function connectSerial() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    reader = port.readable.getReader();
    readSerial();
  } catch (e) {
    console.log("Serial connection error:", e);
  }
}

async function readSerial() {
  let buffer = "";
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value);

    if (buffer.includes("\n")) {
      const lines = buffer.split("\n");
      buffer = lines.pop();
      const v = parseInt(lines[0].trim());

      if (!isNaN(v)) latestValue = v;
    }
  }
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  // let cnv = createCanvas(400, 600);
  cnv.parent("my_p5_canvas1");

  colorMode(HSB, 255);

  graphic = createGraphics(RENDER_W, RENDER_H);
  graphic.angleMode(DEGREES);
  graphic.colorMode(HSB, 255);

  //watering button
  // const htmlButton = document.getElementById("trigger-btn");
  // if (htmlButton) {
  //   htmlButton.addEventListener("mousedown", () => {
  //     isButtonPressed = true; //trigger
  //   });

  //   htmlButton.addEventListener("mouseup", () => {
  //     isButtonPressed = false; // stop
  //   });

  //   htmlButton.addEventListener("mouseleave", () => {
  //     isButtonPressed = false;
  //   });
  // }

  //connect to arduino
  const serialBtn = document.getElementById("trigger-btn");

  if (serialBtn) {
    serialBtn.addEventListener("click", async () => {
      await connectSerial();

      // connected
      serialBtn.classList.add("active");
      serialBtn.innerHTML = "CONNECTED";

      // prevent to connect repeatedly
      serialBtn.style.pointerEvents = "none";
    });
  }

  angleMode(DEGREES);
  d = pixelDensity();
  num = floor(RENDER_W * RENDER_H * numRatio);

  for (let i = 0; i < num; i++) {
    molds[i] = new Mold();
  }

  // initPlants(num);
}

function draw() {
  background(255, 0, 0);
  graphic.background(0, 3);
  drawDreamyGlow(graphic, 0.3, 2);

  graphic.loadPixels();

  let isWatering = latestValue > threshold;

  if (isWatering) {
    drawDreamyGlow(graphic, 3, 3, isWatering);
    currentSpeed = 0.8;
    currentR = 1.1;

    if (!isReset) {
      for (let i = 0; i < num; i++) {
        let choice = floor(random(3));
        if (choice === 0) {
          molds[i].x = random(RENDER_W);
        } else if (choice === 1) {
          molds[i].y = random(RENDER_H);
        } else if (choice === 2) {
          molds[i].y = height / 2;
        }
      }
      isReset = true;
    }
  } else {
    currentSpeed = 0.2;
    currentR = 0.5;
    isReset = false;
  }

  for (let i = 0; i < num; i++) {
    molds[i].speedFactor = currentSpeed;
    molds[i].r = currentR;
    molds[i].update(graphic);
    molds[i].display(graphic);
  }

  image(graphic, 0, 0, width, height);

  fill(255);
  rect(45, 35, 40, 20);
  fill(0);
  text(floor(frameRate()), 50, 50);
}

function drawDreamyGlow(targetGraphic, r1, r2, isPressed) {
  let minH = isPressed ? 80 : 150;
  let MaxH = isPressed ? 140 : 255;

  for (let x = bgStep / 2; x < RENDER_W; x += bgStep) {
    for (let y = 0; y < RENDER_H; y += bgStep) {
      let n = noise(x * noiseScale, y * noiseScale, timeOffset);

      let hue = map(n, 0, 1, minH, MaxH);
      let alpha = map(n, 0, 1, 2, 5);
      colorMode(HSB, 255);
      targetGraphic.fill(hue, 150, 255, alpha);

      let ellipseR = map(n, 0, 1, 20, 50);
      targetGraphic.noStroke();
      targetGraphic.ellipse(x, y, ellipseR * r1, ellipseR * r2);
    }
  }

  timeOffset += 0.05;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/*
Tutorial by Patt Vira 
(p5.js Coding Tutorial | Slime Molds (Physarum)).
https://youtu.be/VyXxSNcgDtg?si=LSoKrSjQNJos-HrP

I acknowledge that Gemini (https://gemini.google.com/) 
was used for debugging the code and discussing 
the implementation methods and operational logic throughout this project.

*/
