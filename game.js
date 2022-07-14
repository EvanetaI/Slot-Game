const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

let buttonNotClicked;
let buttonClicked;
let symbolsGroup;
let randomGroup;
let allSymbols = [];
let gridOfColumns = [];
let initialX = 20;
let initialY = 20;
let interval;
let frames = [];
let images = [];

function preload() {
  this.load.image("slotFrame", "assets/SlotFrame.png");
  this.load.image("spinButtonActive", "assets/SpinButton_Active.png");
  this.load.image("spinButton", "assets/SpinButton_Normal.png");

  for (let i = 1; i < 9; i++) {
    allSymbols.push("symbol" + i);
    this.load.image("symbol" + i, `assets/Symbol_${i}.png`);
  }

  this.load.image("symbols", "assets/symbolsAnimation.png");
}

function create() {
  symbolsGroup = this.add.group();
  randomGroup = this.add.group();

  this.add.image(385, 300, "slotFrame").setScale(0.5);

  buttonNotClicked = this.add
    .sprite(700, 550, "spinButton")
    .setScale(0.5)
    .setInteractive();

  buttonClicked = this.add
    .sprite(700, 550, "spinButtonActive")
    .setScale(0.5)
    .setInteractive();
  buttonClicked.visible = false;

  createArrGrid(5);

  buttonNotClicked.on("pointerdown", () => startSpin(this));
}

function update() { }

function buttonDisabled() {
  buttonClicked.visible = true;
}

function buttonActive() {
  buttonClicked.visible = false;
  buttonNotClicked.visible = true;
}

async function startSpin(context) {
  buttonDisabled();
  destroySprite();
  prepareAnimation(5, context);
  let result = await spinAnimation();
  clearSpinAnimations();
  createArrGrid(5);

  interval = setTimeout(() => {
    clearTimeout(interval);
    checkForWinningLine();
    buttonActive();
  }, 1000);
}

function destroySprite() {
  symbolsGroup.clear(true, true);
}

function checkForWinningLine() {
  let resultArray = [];
  let totalMatches = 1;
  for (let i = 1; i < symbolsGroup.children.entries.length; i += 3) {
    resultArray.push(symbolsGroup.children.entries[i].texture.key);
  }

  let counter = 1;
  for (let i = 0; i < resultArray.length; i++) {
    if (resultArray[i] === resultArray[i + 1]) {
      counter++;
    } else {
      if (counter > totalMatches) {
        totalMatches = counter;
      }
      counter = 1;
    }
  }

  if (totalMatches >= 3) {
    alert(`You win! You have ${totalMatches} matches!`);
  }
}

function createArrGrid(rotation) {
  destroySprite();
  createColumns(rotation);
  gridOfColumns.forEach((array) => {
    for (let i = 0; i < array.length; i++) {
      symbolsGroup
        .create(90 + initialX, 150 + initialY, array[i])
        .setScale(0.4);
      initialY += 125;
    }
    initialX += 135;
    initialY = 20;
  });

  gridOfColumns = [];
  initialX = 20;
}

function prepareAnimation(numberOfRotations, context) {
  let step = 15;
  for (let i = 1; i <= numberOfRotations; i++) {
    if (i == 1) {
      images[i] = context.add
        .tileSprite(110, 300, 300, 940, "symbols")
        .setDepth(1)
        .setScale(0.4);
    } else {
      images[i] = context.add
        .tileSprite(i * 110 + step, 300, 300, 940, "symbols")
        .setDepth(1)
        .setScale(0.4);
      step += 30;
    }
  }
}

function clearSpinAnimations() {
  images.forEach((image) => {
    image.destroy(true);
  });
}

async function spinAnimation() {
  let timeToRun = 2000,
    stepInterval = 10,
    elapsedMilliseconds = 0;
  return await new Promise((resolve) => {
    let interval = setInterval(async function () {
      for (let i = 1; i < images.length; ++i) {
        images[i].tilePositionY += 100;
      }
      elapsedMilliseconds += stepInterval;
      if (elapsedMilliseconds >= timeToRun) {
        resolve("Success");
        clearInterval(interval);
      }
    }, stepInterval);
  });
}

function createColumns(columnsCount) {
  while (columnsCount > 0) {
    let randomSymbolArr = [];
    let counter = 0;

    while (counter < 3) {
      let currentSymbol =
        allSymbols[Math.floor(Math.random() * allSymbols.length)];
      randomSymbolArr.push(currentSymbol);
      counter++;
    }
    gridOfColumns.push(randomSymbolArr);
    columnsCount--;
  }
}
