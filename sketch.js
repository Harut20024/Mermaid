let bgImage,
  ice,
  mermaid,
  textImg,
  scoreBar,
  timeImg,
  coinImg,
  iceCandy,
  hummerImg,
  bombImg,
  retryImg,
  handlerImg;
let obj1, obj2, obj3, obj4, obj5, obj6;
let candyImages = [];
let candies = [];
let scales;
let firstPoint = true;
let showStar = false;
let startOfGame = true;
let stars;
let toolSelected = "";
let selectedCandy = null;
let activeTool = null;
let startX;
let addCandiesInterval;
let checkMatchInterval;
let time = 160;
let startY = 90;
let cellSize = 90;
let scoreCount = 50;
let coins = 10;
let matrixSize1 = 8;
let matrixSize2 = 7;
let coin = 0;
let currentStarIndex = 0;
let lastStarChangeTime = 0;
let toolOffsetX = 0;
let toolOffsetY = 0;
let timeSoundOff = true;
let matrixWidth = matrixSize1 * cellSize;
let gameState = "startScreen";
let star2Played = true;
let bombSound,
  winSound,
  looseSound,
  brokeIceSound,
  retrySound,
  moveSound,
  hummerSound,
  treeSound,
  fourSound,
  fiveSound,
  openGameSound,
  star2Sound,
  mainSound,
  timeSound;
function preload() {
  star2Sound = loadSound("./sounds/star2.mp3");
  mainSound = loadSound("./sounds/main.mp3");
  openGameSound = loadSound("./sounds/opening.mp3");
  treeSound = loadSound("./sounds/tree.m4a");
  fourSound = loadSound("./sounds/four.m4a");
  fiveSound = loadSound("./sounds/five.m4a");
  timeSound = loadSound("./sounds/time.ogg");
  hummerSound = loadSound("./sounds/Weapp.ogg");
  moveSound = loadSound("./sounds/move.m4a");
  winSound = loadSound("./sounds/fail.ogg");
  looseSound = loadSound("./sounds/win.ogg");
  bombSound = loadSound("./sounds/Bomb.ogg");
  retrySound = loadSound("./sounds/change.m4a");
  brokeIceSound = loadSound("./sounds/broke.mp3");
  hummerImg = loadImage("./images/delete.png");
  handlerImg = loadImage("./images/handler.png");
  retryImg = loadImage("./images/retry.png");
  bombImg = loadImage("./images/bomb.png");
  scales = loadImage("./images/scale/1.png");
  scoreBar = loadImage("./images/score.png");
  timeImg = loadImage("./images/time.png");
  coinImg = loadImage("./images/coin.png");
  bgImage = loadImage("./images/fone.png");
  mermaid = loadImage("./images/mermaid.png");
  textImg = loadImage("./images/text.png");
  ice = loadImage("./images/ice/back.png");
  iceCandy = loadImage("./images/ice/ice.png");
  obj1 = loadImage("./images/objects/obj-1.png");
  obj2 = loadImage("./images/objects/obj-2.png");
  obj3 = loadImage("./images/objects/obj-3.png");
  obj4 = loadImage("./images/objects/obj-4.png");
  obj5 = loadImage("./images/objects/obj-5.png");
  obj6 = loadImage("./images/objects/obj-6.png");
  candyImages = [obj1, obj2, obj3, obj4, obj5, obj6];
  scales = [];
  stars = [];
  for (let i = 1; i <= 20; i++) {
    scales.push(loadImage(`./images/scale/${i}.png`));
  }
  for (let i = 1; i <= 5; i++) {
    stars.push(loadImage(`./images/scale/star/${i}.png`));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight * 1.2);
  getAudioContext().suspend();
  startX = windowWidth - matrixWidth;
  getCandies();
  checkMatchInterval = setInterval(checkMatch, 300);
  setInterval(() => {
    if (time > 0) {
      time--;
    } else {
      console.log("You Loose!");
    }
  }, 900);
}

function draw() {
  if (gameState === "startScreen") {
    drawStartScreen();
  } else if (gameState === "running") {
    if (startOfGame) {
      openGameSound.play();
      startOfGame = false;
      startBackgroundMusic();
    }
    startAudioContext();
    runGame();
  }
}

function keyPressed() {
  if (keyCode === ENTER && gameState === "startScreen") {
    startAudioContext();
    gameState = "running";
  }
}

function mousePressed() {
  let clickedCandyIndex = candies.findIndex((candy) => {
    return (
      mouseX >= candy.x &&
      mouseX <= candy.x + 90 &&
      mouseY >= candy.y &&
      mouseY <= candy.y + 90
    );
  });
  if (gameState === "startScreen") {
    gameState = "running";
  }

  if (clickedCandyIndex !== -1) {
    let clickedCandy = candies[clickedCandyIndex];
    if (selectedCandy) {
      if (
        isAdjacent(selectedCandy, clickedCandy) &&
        scoreCount > 0 &&
        selectedCandy.type !== clickedCandy.type &&
        !selectedCandy.hasIce &&
        !clickedCandy.hasIce
      ) {
        swapCandies(selectedCandy, clickedCandy);
        selectedCandy.selected = false;
        selectedCandy = null;
        scoreCount--;
      } else {
        selectedCandy.selected = false;
        selectedCandy = false;
        selectedCandy.selected = false;
      }
    } else {
      selectedCandy = clickedCandy;
      selectedCandy.selected = true;
    }
  } else if (selectedCandy) {
    selectedCandy.selected = false;
    selectedCandy = null;
  }

  if (
    mouseX >= startX + 210 &&
    mouseX <= startX + 290 &&
    mouseY >= windowHeight - 80 &&
    mouseY <= windowHeight &&
    !activeTool &&
    coins >= 3
  ) {
    toolSelected = "bomb";
    activeTool = "bomb";
    toolOffsetX = -40;
    toolOffsetY = -40;
  } else if (
    mouseX >= startX + 275 &&
    mouseX <= startX + 355 &&
    mouseY >= windowHeight - 90 &&
    mouseY <= windowHeight - 10 &&
    !activeTool &&
    coins >= 1
  ) {
    activeTool = "retry";
    toolOffsetX = -40;
    toolOffsetY = -45;
    toolSelected = "retry";
    candies = [];
    getCandies();
    activeTool = null;
    coins--;
    retrySound.play();
  } else if (
    mouseX >= startX + 340 &&
    mouseX <= startX + 430 &&
    mouseY >= windowHeight - 80 &&
    mouseY <= windowHeight &&
    !activeTool &&
    coins >= 2
  ) {
    activeTool = "hammer";
    toolSelected = "hammer";
    toolOffsetX = -40;
    toolOffsetY = -40;
  } else if (activeTool) {
    if (activeTool === "bomb" || activeTool === "hammer") {
      applyToolEffect(mouseX, mouseY);
    }
    activeTool = null;
  } else if (toolSelected !== "") {
    applyToolEffect(mouseX, mouseY);
  }
}

////////////////////////////////////////////////
function runGame() {
  background(bgImage);
  image(textImg, 10, 10, 650, 280);
  image(mermaid, 0, windowHeight - 1030, 1200, 1110);
  drawIce();
  candies.forEach((candy) => {
    candy.display();
  });
  updateCandies();
  image(scoreBar, windowWidth - 830, -60, 800, 140);
  if (scales.length > 0 && coin < scales.length)
    image(scales[coin], windowWidth - 640, 50, 450, 40);
  else image(scales[scales.length - 1], windowWidth - 640, 50, 450, 40);

  image(coinImg, windowWidth - 380, 0, 155, 50);
  image(timeImg, windowWidth - 610, 0, 155, 50);
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text(`${scoreCount}`, windowWidth - 422, 27);
  text(`${time}`, windowWidth - 535, 27);
  text(`10/${coins}`, windowWidth - 285, 27);
  image(handlerImg, startX + 210, windowHeight - 90, 210, 140);
  if (coin > 9 && firstPoint) {
    if (star2Played) {
      star2Sound.play();
      star2Played = false;
    }
    showStar = true;
    firstPoint = false;
  }
  if (showStar || coin >= scales.length - 1) {
    let currentTimerForDisplay = millis();
    if (currentTimerForDisplay - lastStarChangeTime > 150) {
      currentStarIndex = (currentStarIndex + 1) % stars.length;
      lastStarChangeTime = currentTimerForDisplay;
    }
    if (coin >= scales.length - 1) {
      image(stars[currentStarIndex], windowWidth - 290, 0, 150, 150);
    } else {
      image(stars[currentStarIndex], windowWidth - 530, 0, 150, 150);
    }
    if (currentStarIndex === stars.length - 1) showStar = false;
  }
  if (activeTool) {
    let toolImg;
    if (activeTool === "hammer") toolImg = hummerImg;
    else if (activeTool === "bomb") toolImg = bombImg;
    else if (activeTool === "retry") toolImg = retryImg;

    if (toolImg) {
      if (activeTool === "hammer") {
        image(bombImg, startX + 210, windowHeight - 80, 80, 80);
        image(retryImg, startX + 275, windowHeight - 90, 80, 80);
      } else if (activeTool === "bomb") {
        image(retryImg, startX + 275, windowHeight - 90, 80, 80);
        image(hummerImg, startX + 340, windowHeight - 80, 80, 80);
      }
      image(toolImg, mouseX + toolOffsetX, mouseY + toolOffsetY, 80, 80);
    }
  } else {
    image(bombImg, startX + 210, windowHeight - 80, 80, 80);
    image(retryImg, startX + 275, windowHeight - 90, 80, 80);
    image(hummerImg, startX + 340, windowHeight - 80, 80, 80);
  }

  gamedynamic();
}

//////////////////////////////////////////////////////////////////////////////////
function drawStartScreen() {
  background(bgImage);
  fill(255, 255, 255, 120);
  rect(0, 0, windowWidth, windowHeight);
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Tap or Press Enter to Start", width / 2, height / 2);
}

function getCandies() {
  for (let i = 0; i < matrixSize1; i++) {
    for (let j = 0; j < matrixSize2; j++) {
      let x = startX + j * cellSize;
      let y = startY + i * cellSize;

      if (
        (i == 0 && j == 0) ||
        (i == 2 && j == 2) ||
        (i == 2 && j == 3) ||
        (i == 2 && j == 4) ||
        (i == 3 && j == 2) ||
        (i == 3 && j == 3) ||
        (i == 3 && j == 4) ||
        (i == 4 && j == 2) ||
        (i == 4 && j == 3) ||
        (i == 4 && j == 4) ||
        (i == 0 && j == matrixSize2 - 1) ||
        (i == matrixSize1 - 1 && j == matrixSize2 - 1) ||
        (i == matrixSize1 - 1 && j == 0)
      )
        continue;

      let randomIndex = Math.floor(Math.random() * candyImages.length);
      let hasIce =
        (i == 1 && j == 1) ||
        (i == 1 && j == 2) ||
        (i == 1 && j == 3) ||
        (i == 1 && j == 4) ||
        (i == 1 && j == 5) ||
        (i == 2 && j == 1) ||
        (i == 2 && j == 5) ||
        (i == 3 && j == 1) ||
        (i == 3 && j == 5) ||
        (i == 4 && j == 1) ||
        (i == 4 && j == 5) ||
        (i == 5 && j == 1) ||
        (i == 5 && j == 2) ||
        (i == 5 && j == 3) ||
        (i == 5 && j == 4) ||
        (i == 5 && j == 5);

      let candy = new Candy(x, y, candyImages[randomIndex], hasIce);
      restartIntervals();
      candies.push(candy);
    }
  }
}
function applyToolEffect(x, y) {
  let clickedCandyIndex = candies.findIndex((candy) => {
    return (
      x >= candy.x &&
      x <= candy.x + cellSize &&
      y >= candy.y &&
      y <= candy.y + cellSize
    );
  });

  if (clickedCandyIndex !== -1) {
    let clickedCandy = candies[clickedCandyIndex];
    if (toolSelected === "hammer") {
      coins -= 2;
      candies.splice(clickedCandyIndex, 1);
      restartIntervals();
      hummerSound.play();
    } else if (toolSelected === "bomb") {
      coins -= 3;
      restartIntervals();
      coin += 4;
      candies = candies.filter((candy) => {
        return (
          Math.abs(candy.x - clickedCandy.x) > cellSize ||
          Math.abs(candy.y - clickedCandy.y) > cellSize
        );
      });
      bombSound.play();
    }

    toolSelected = "";
  }
}

function restartIntervals() {
  clearInterval(addCandiesInterval);

  addCandiesInterval = setInterval(addNewCandiesIfEmpty, 750);
}

function isAdjacent(candy1, candy2) {
  const dx = Math.abs(candy1.x - candy2.x);
  const dy = Math.abs(candy1.y - candy2.y);
  return (dx === 90 && dy === 0) || (dx === 0 && dy === 90);
}

function drawIce() {
  for (let i = 0; i < matrixSize1; i++) {
    for (let j = 0; j < matrixSize2; j++) {
      let x = startX + j * cellSize;
      let y = startY + i * cellSize;

      if (
        (i == 0 && j == 0) ||
        (i == 2 && j == 2) ||
        (i == 2 && j == 3) ||
        (i == 2 && j == 4) ||
        (i == 3 && j == 2) ||
        (i == 3 && j == 3) ||
        (i == 3 && j == 4) ||
        (i == 4 && j == 2) ||
        (i == 4 && j == 3) ||
        (i == 4 && j == 4) ||
        (i == 0 && j == matrixSize2 - 1) ||
        (i == matrixSize1 - 1 && j == matrixSize2 - 1) ||
        (i == matrixSize1 - 1 && j == 0)
      )
        continue;

      image(ice, x, y, 90, 90);
    }
  }
}
function gamedynamic() {
  if (time < 11 && timeSoundOff) {
    timeSoundOff = false;
    timeSound.play();
  }
  if (coin > 21) {
    fill(255, 255, 255, 127);
    rect(0, 0, windowWidth, windowHeight);
    fill(0, 255, 0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("You Win!", windowWidth / 2, windowHeight / 2);
    noLoop();
    winSound.play();
    setTimeout(function () {
      window.location.reload();
    }, 4000);
  }
  if (time <= 0) {
    fill(255, 255, 255, 127);
    rect(0, 0, windowWidth, windowHeight);
    fill(255, 0, 0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("You Loose!", windowWidth / 2, windowHeight / 2);
    noLoop();
    looseSound.play();
    setTimeout(function () {
      window.location.reload();
    }, 4000);
  }
}
function checkMatch() {
  let toRemove = new Set();
  let matchFound = false;

  // Check horizontally
  for (let i = 0; i < matrixSize1; i++) {
    let matchLength = 1;
    for (let j = 1; j < matrixSize1; j++) {
      let prevCandy = getCandyAt(
        startX + (j - 1) * cellSize,
        startY + i * cellSize
      );
      let currentCandy = getCandyAt(
        startX + j * cellSize,
        startY + i * cellSize
      );

      if (currentCandy && prevCandy && currentCandy.type === prevCandy.type) {
        matchLength++;
      } else {
        if (matchLength >= 3) {
          for (let k = j - 1; k > j - 1 - matchLength; k--) {
            let candy = getCandyAt(
              startX + k * cellSize,
              startY + i * cellSize
            );
            if (candy.hasIce) {
              candy.hasIce = false;
              brokeIceSound.play();
            } else {
              toRemove.add(candy);
            }
          }
          coin += calculateBonus(matchLength);
          matchFound = true;
        }
        matchLength = 1;
      }

      if (j === matrixSize1 - 1 && matchLength >= 3) {
        for (let k = j; k > j - matchLength; k--) {
          let candy = getCandyAt(startX + k * cellSize, startY + i * cellSize);
          if (candy.hasIce) {
            candy.hasIce = false;
            brokeIceSound.play();
          } else {
            toRemove.add(candy);
          }
        }
        coin += calculateBonus(matchLength);
        matchFound = true;
      }
    }
  }

  // Check vertically
  for (let j = 0; j < matrixSize1; j++) {
    let matchLength = 1;
    for (let i = 1; i < matrixSize1; i++) {
      let prevCandy = getCandyAt(
        startX + j * cellSize,
        startY + (i - 1) * cellSize
      );
      let currentCandy = getCandyAt(
        startX + j * cellSize,
        startY + i * cellSize
      );

      if (currentCandy && prevCandy && currentCandy.type === prevCandy.type) {
        matchLength++;
      } else {
        if (matchLength >= 3) {
          for (let k = i - 1; k >= i - matchLength; k--) {
            let candy = getCandyAt(
              startX + j * cellSize,
              startY + k * cellSize
            );
            if (candy.hasIce) {
              candy.hasIce = false;
              brokeIceSound.play();
            } else {
              toRemove.add(candy);
            }
          }
          coin += calculateBonus(matchLength);
          matchFound = true;
        }
        matchLength = 1;
      }

      if (i === matrixSize1 - 1 && matchLength >= 3) {
        for (let k = i; k > i - matchLength; k--) {
          let candy = getCandyAt(startX + j * cellSize, startY + k * cellSize);
          if (candy.hasIce) {
            candy.hasIce = false;
            brokeIceSound.play();
          } else {
            toRemove.add(candy);
          }
        }
        coin += calculateBonus(matchLength);
        matchFound = true;
      }
    }
  }

  if (matchFound) {
    candies = candies.filter((candy) => !toRemove.has(candy));
    restartIntervals();
  }
}

function calculateBonus(matchLength) {
  if (matchLength === 5) {
    fiveSound.play();
    return 4;
  } else if (matchLength === 4) {
    fourSound.play();
    return 2;
  } else {
    treeSound.play();
    return 1;
  }
}

function getCandyAt(x, y) {
  return candies.find((candy) => candy.x === x && candy.y === y);
}

function swapCandies(candy1, candy2) {
  let temp = { x: candy1.x, y: candy1.y };
  setTimeout(() => {
    candy1.x = candy2.x;
    candy1.y = candy2.y;
    candy2.x = temp.x;
    candy2.y = temp.y;
    let index1 = candies.indexOf(candy1);
    let index2 = candies.indexOf(candy2);
    candies[index1] = candy2;
    candies[index2] = candy1;
    moveSound.play();
  }, 90);
}

function updateCandies() {
  candies.forEach((candy) => {
    if (
      !candy.hasIce &&
      !(candy.x === startX + cellSize * 2 && candy.y === startY * 2) &&
      !(candy.x === startX + cellSize * 3 && candy.y === startY * 2) &&
      !(candy.x === startX + cellSize * 4 && candy.y === startY * 2) &&
      !(candy.x === startX && candy.y === startY * 6) &&
      !(
        candy.x === startX + cellSize * (matrixSize1 - 1) &&
        candy.y === startY * 6
      )
    ) {
      moveCandyDownSmoothly(candy);
    }
  });
}

function moveCandyDownSmoothly() {
  let moved = false;
  for (let j = 0; j < matrixSize2; j++) {
    for (let i = matrixSize1 - 2; i >= 0; i--) {
      let candy = getCandyAt(startX + j * cellSize, startY + i * cellSize);
      if (!candy || shouldSkipCandy(candy)) continue;
      let targetY = i;
      while (targetY + 1 < matrixSize1) {
        let belowCandy = getCandyAt(
          startX + j * cellSize,
          startY + (targetY + 1) * cellSize
        );
        if (
          !belowCandy &&
          !shouldSkipCandyPosition(
            startX + j * cellSize,
            startY + (targetY + 1) * cellSize
          )
        ) {
          // clearTimeout(moveCandiesTimeout);

          // moveCandiesTimeout = setTimeout(() => {
          //   restartIntervals();
          // }, 500);
          targetY++;
        } else {
          break;
        }
      }
      if (targetY !== i) {
        candies.forEach((c) => {
          if (c === candy) {
            c.y = startY + targetY * cellSize;
            moved = true;
          }
        });
      }
    }
  }
  if (moved) {
    addNewCandiesIfEmpty();
  }
}

function shouldSkipCandy(candy) {
  return candy.hasIce || specificPositionCheck(candy.x, candy.y);
}

function shouldSkipCandyPosition(x, y) {
  return (
    (x === startX + cellSize * 2 && y === startY * 3) ||
    (x === startX + cellSize * 3 && y === startY * 3) ||
    (x === startX + cellSize * 4 && y === startY * 3) ||
    (x === startX && y === startY * 8) ||
    (x === startX + cellSize * (matrixSize2 - 1) && y === startY * 8)
  );
}

function specificPositionCheck(x, y) {
  return false;
}

function getCandyAt(x, y) {
  return candies.find((candy) => candy.x === x && candy.y === y);
}

function addNewCandiesIfEmpty() {
  for (let j = 0; j < matrixSize2; j++) {
    if (!getCandyAt(startX + j * cellSize, startY)) {
      let randomIndex = Math.floor(Math.random() * candyImages.length);
      let newCandy = new Candy(
        startX + j * cellSize,
        startY,
        candyImages[randomIndex],
        false
      );
      candies.push(newCandy);
    }
  }
}

function isCandyBelow(candy) {
  let belowCandy = candies.find(
    (el) => el.x === candy.x && el.y === candy.y + cellSize
  );
  return belowCandy === undefined;
}

function addNewCandiesIfEmpty() {
  restartIntervals();
  const startOfY = startY;
  const startOfX = startX + cellSize;
  const endX = startX + cellSize * 5;

  const cellsToCheck = Math.floor((endX - startOfX) / cellSize);

  for (let i = 0; i <= cellsToCheck; i++) {
    const x = startOfX + i * cellSize;
    const y = startOfY;

    if (!getCandyAt(x, y)) {
      restartIntervals();
      const randomIndex = Math.floor(Math.random() * candyImages.length);
      const newCandy = new Candy(x, y, candyImages[randomIndex], false);
      candies.push(newCandy);
    }
  }

  const additionalPositions = [
    { x: startX, y: startY * 2 },
    { x: startX + cellSize, y: startY * 3 },
    { x: startX + cellSize * 5, y: startY * 3 },
    { x: startX + cellSize, y: startY * 4 },
    { x: startX + cellSize * 5, y: startY * 4 },
    { x: startX + cellSize, y: startY * 5 },
    { x: startX + cellSize * 5, y: startY * 5 },
    { x: startX + cellSize * 6, y: startY * 2 },
  ];
  for (let x = startX + cellSize; x <= startX + cellSize * 5; x += cellSize) {
    additionalPositions.push({ x: x, y: startY * 6 });
    restartIntervals();
  }
  for (let x = startX + cellSize; x <= startX + cellSize * 5; x += cellSize) {
    additionalPositions.push({ x: x, y: startY * 7 });
    restartIntervals();
  }

  additionalPositions.forEach((pos) => {
    if (!getCandyAt(pos.x, pos.y)) {
      restartIntervals();
      const randomIndex = Math.floor(Math.random() * candyImages.length);
      const newCandy = new Candy(pos.x, pos.y, candyImages[randomIndex], false);
      candies.push(newCandy);
    }
  });
}

function startAudioContext() {
  if (getAudioContext().state !== "running") {
    getAudioContext()
      .resume()
      .then(() => {
        console.log("Audio Context resumed!");
        audioContextStarted = true;
      })
      .catch((e) => {
        console.error("Error resuming audio context", e);
      });
  }
}
function startBackgroundMusic() {
  if (getAudioContext().state !== "running") {
    getAudioContext()
      .resume()
      .then(() => {
        console.log("Audio Context started!");
      });
  }

  mainSound.play(1, 1, 0.2);

  mainSound.onended(startBackgroundMusic);
}
