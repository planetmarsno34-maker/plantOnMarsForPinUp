let rawLines;
let agents = [];
let staticPositions = [];
let poemText;

class TextAgent {
  constructor(char, pos) {
    this.char = char;
    this.staticPos = pos.copy();
    this.pos = pos.copy(); // for noise
  }

  update() {
    let noiseInput = this.staticPos.x * 0.005 + frameCount * 0.03;

    // vertical
    let displacementY = map(noise(noiseInput), 0, 1, -2, 2);

    // horizontal
    let displacementX = map(noise(noiseInput + 50), 0, 1, -2, 2);

    this.pos.x = this.staticPos.x + displacementX;
    this.pos.y = this.staticPos.y + displacementY;
  }

  display() {
    fill(130, 250, 100, 255);
    text(this.char, this.pos.x, this.pos.y);
  }
}

function generateStaggeredWavePositions(n) {
  const numRows = height / 10;
  const charWidth = width / 40;
  const horizontalSpacing = charWidth;

  // how many chars in a row
  const totalSlotsX = floor(width / horizontalSpacing);
  // the nums of chars i need
  const totalRequiredSlots = totalSlotsX * numRows;

  // for the sake of repeating the poems
  const numTargets = totalRequiredSlots;

  const startY = 0; // the height of wave
  const rowSpacing = 10; // the distance of each wave
  const peakHeight = 12;
  const waveCycleWidth = 45;

  // declare an empty array for all the pos
  let wave = [];

  for (let i = 0; i < numTargets; i++) {
    let rowIdx = floor(i / totalSlotsX); // gridY
    let colIdx = i % totalSlotsX; // gridX

    //make it repeatable
    rowIdx = rowIdx % numRows;

    let xPos = map(colIdx, 0, totalSlotsX, 0, width);

    // declare baseY;adjust it later
    let baseY = startY + rowIdx * rowSpacing;

    // offset each row of wave
    let wavePhaseShift;
    let patternIndex = rowIdx % 3;
    if (patternIndex === 1) {
      wavePhaseShift = waveCycleWidth / 3;
    } else if (patternIndex === 2) {
      wavePhaseShift = (waveCycleWidth * 2) / 3;
    } else {
      wavePhaseShift = 0;
    }

    //caculating xPos in a cycle
    let cycleInput = (xPos + wavePhaseShift) % waveCycleWidth;
    let t = cycleInput / waveCycleWidth; // normalize to 0-1
    let yInCycle;

    if (t < 0.5) {
      yInCycle = map(t, 0, 0.5, 0, -peakHeight);
    } else {
      yInCycle = map(t, 0.5, 1, -peakHeight, 0);
    }

    let yPos = baseY + yInCycle;

    wave.push(createVector(xPos, yPos));
  }

  return wave;
}

function preload() {
  rawLines = loadStrings("landing.txt");
}

function setup() {
  //   createCanvas(300, 400);
  let landingCanvas = createCanvas(windowWidth, windowHeight);
  landingCanvas.parent(landing_canvas);

  noStroke();
  colorMode(HSB, 360, 100, 100, 255);
  textAlign(CENTER, CENTER);
  textFont("Georgia");
  textSize(8);
  fill(255);

  // make the poem into string
  poemText = rawLines.join("\n");
  // turn into chars
  let chars = poemText.split("");
  let numChars = chars.length;

  // call out every (x,y)
  staticPositions = generateStaggeredWavePositions(numChars);

  for (let i = 0; i < staticPositions.length; i++) {
    let charIndex = i % numChars;
    let loopingChar = chars[charIndex];
    let agent = new TextAgent(loopingChar, staticPositions[i]);
    agents.push(agent);
  }
}

function draw() {
  background(240, 90, 15, 255);
  noStroke();
  for (let agent of agents) {
    agent.update();
    agent.display();
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // new text position
  let newPositions = generateStaggeredWavePositions();

  agents = [];
  let chars = poemText.split("");

  for (let i = 0; i < newPositions.length; i++) {
    let charIndex = i % chars.length;
    let loopingChar = chars[charIndex];
    let agent = new TextAgent(loopingChar, newPositions[i]);
    agents.push(agent);
  }
}
