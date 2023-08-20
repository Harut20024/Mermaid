const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

const canvas1 = document.querySelector("#canvas1");
const context1 = canvas1.getContext("2d");

const Score = document.querySelector("#Scorediv");
let scoreCount = 50;
let scale = 0;

let bublePosY = 40, bubleSpeed = 3, bublePosX = 0

const Coin = document.querySelector("#Coindiv");
let coin = 10;

const Time = document.querySelector("#Timediv");
let Timeout = 60;

setInterval(() => {
    if (Timeout > 0) Timeout--
}, 1000);

const images = [];

for (let i = 19; i < 39; i++) {
    const img = new Image();
    img.src = `photos/scale/detalner-${i}.png`;
    images.push(img);
}


const bublefoto = new Image();
bublefoto.src = "photos/bubble.png";

const timeImg = new Image();
timeImg.src = "photos/time.png";

const coinImg = new Image();
coinImg.src = "photos/coin.png";

const _imgScore = new Image();
_imgScore.src = "photos/score.png";

const _img1 = new Image();
_img1.src = "photos/image1.png";

const backImg = new Image();
backImg.src = "photos/fone.jpg";

const cubeImg = new Image();
cubeImg.src = "photos/back.png";



class GameObj {
    constructor(x, y, width, height, imgSrc, color, ice = false, iceImgSrc = "photos/ice.png") {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._color = color;
        this._allowed = true
        this._img = new Image();
        this._img.src = imgSrc;
        this.ice = ice;
        this._img.onload = () => this.render(context);
        this.ice = ice;
        this.iceImg = new Image();
        this.iceImg.src = iceImgSrc;
        this._img.onload = () => this.render(context);
    }

    render(context) {
        if (this._color !== undefined) {
            context.drawImage(this._img, this._x + 10, this._y + 7, this._width, this._height);
            if (this.ice) {
                context.drawImage(this.iceImg, this._x + 10, this._y + 7, this._width, this._height);
            }
        }
    }
}

class Obj1 extends GameObj {
    constructor(x, y, ice) {
        super(x, y, 100, 100, "photos/obj-1.png", "orange", ice, "photos/ice.png");
    }
}


class Obj2 extends GameObj {
    constructor(x, y, ice) {
        super(x, y, 100, 100, "photos/obj-2.png", "blue", ice, "photos/ice.png");
    }
}

class Obj3 extends GameObj {
    constructor(x, y, ice) {
        super(x, y, 100, 100, "photos/obj-3.png", "red", ice, "photos/ice.png");
    }
}

class Obj4 extends GameObj {
    constructor(x, y, ice) {
        super(x, y, 100, 100, "photos/obj-4.png", "yellow", ice, "photos/ice.png");
    }
}

class Obj5 extends GameObj {
    constructor(x, y, ice) {
        super(x, y, 100, 100, "photos/obj-5.png", "green", ice, "photos/ice.png");
    }
}

class Obj6 extends GameObj {
    constructor(x, y, ice) {
        super(x, y, 100, 100, "photos/obj-6.png", "pink", ice, "photos/ice.png");
    }
}

const data = {
    objects: []
};

const numRows = 8;
const numCols = 6;
const rectSize = 120;

createGame();


function update() {
    scoreAndCoin()
    if (removeFiveObj()) { }
    else if (removeFourObj()) { }
    else removeTreeObj();

    bublePosY += bubleSpeed;
    if (bublePosY >= 500) {
        bublePosY = 40;
        bublePosX += 4
        if (bublePosX === 8) bublePosX = 0
    }
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context1.drawImage(backImg, 0, 0, canvas1.width, canvas1.height);

    context.drawImage(bublefoto, bublePosX, bublePosY, 600, 600);

    createIce()

    scaleCount(scale)

    context.drawImage(_imgScore, -140, -100, 1000, 300);

    const validObjects = data.objects.filter(obj => obj && obj._color !== undefined);

    validObjects.forEach(obj => {
        obj.render(context);
    })

    context.drawImage(_img1, 120, 1180, 500, 300);

    context.drawImage(coinImg, 400, 30, 220, 60);

    context.drawImage(timeImg, 100, 30, 220, 60);



}


function loop() {
    setInterval(() => {
        refreshBoard();
    }, 400);

    setInterval(() => {
        checkAndAddNewRow()
        update();
        render();
    }, 100);
}

loop();

let selectedCandy = undefined;

canvas.addEventListener("click", event => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const clickedRow = Math.floor((mouseY - 280) / rectSize);
    const clickedCol = Math.floor(mouseX / rectSize);

    if (clickedRow < numRows && clickedCol < numCols) {
        const wrapAudio = document.createElement("audio");
        wrapAudio.src = "sounds/Weapp.ogg";
        if (deleteMode && coin >= 2) {
            const clickedIndex = clickedRow * numCols + clickedCol;
            const clickedObj = data.objects[clickedIndex];

            if (clickedObj) {
                wrapAudio.playbackRate = 1.4;
                wrapAudio.currentTime = 0;
                wrapAudio.play();
                clickedObj._color = undefined;
                clickedObj._allowed = false;
                deleteMode = false
                coin -= 2
                render();
            }
        }
        else if (deleteBomb && coin >= 4) {
            const bombAudio = document.createElement("audio");
            bombAudio.src = "sounds/Bomb.ogg";

            const clickedIndex = clickedRow * numCols + clickedCol;
            const clickedObj1 = data.objects[clickedIndex - 1];
            const clickedObj2 = data.objects[clickedIndex];
            const clickedObj3 = data.objects[clickedIndex + 1];
            const clickedObj4 = data.objects[clickedIndex + 6];
            const clickedObj5 = data.objects[clickedIndex - 6];
            if (clickedObj2) {
                scale += 2;
                bombAudio.playbackRate = 1.4;
                bombAudio.currentTime = 0;
                bombAudio.play();
                clickedObj2._color = undefined;
                clickedObj2._allowed = false;
                clickedObj1._color = undefined;
                clickedObj1._allowed = false;
                clickedObj3._color = undefined;
                clickedObj3._allowed = false;
                clickedObj4._color = undefined;
                clickedObj4._allowed = false;
                clickedObj5._color = undefined;
                clickedObj5._allowed = false;
                deleteBomb = false
                coin -= 4
                render();
            }
        } else {
            if (
                (clickedRow === 0 && clickedCol === 0) ||
                (clickedRow === 0 && clickedCol === 5) ||
                (clickedRow === 3 && clickedCol === 2) ||
                (clickedRow === 3 && clickedCol === 3) ||
                (clickedRow === 4 && clickedCol === 2) ||
                (clickedRow === 4 && clickedCol === 3) ||
                (clickedRow === 7 && clickedCol === 0) ||
                (clickedRow === 7 && clickedCol === 5)
            ) {
                //dont do anythink
            } else {

                onCandyClick(clickedRow, clickedCol);
            }
        }
    }
});

function onCandyClick(row, col) {
    if (row === undefined || col === undefined) {
        return;
    }
    // console.log(row, col)
    if (selectedCandy === undefined) {
        selectedCandy = { row, col };
    } else {
        const selectedObjIndex = selectedCandy.row * numCols + selectedCandy.col;
        const targetObjIndex = row * numCols + col;
        if (
            data.objects[selectedObjIndex] === undefined ||
            data.objects[selectedObjIndex]._x === undefined ||
            data.objects[selectedObjIndex]._y === undefined ||
            data.objects[targetObjIndex] === undefined ||
            data.objects[targetObjIndex]._x === undefined ||
            data.objects[targetObjIndex]._y === undefined ||
            data.objects[targetObjIndex].ice === true ||
            data.objects[selectedObjIndex].ice === true
        ) {
            selectedCandy = undefined;
            return;
        }

        const rowDiff = Math.abs(row - selectedCandy.row);
        const colDiff = Math.abs(col - selectedCandy.col);

        if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
            const selectedObj = data.objects[selectedObjIndex];
            const targetObj = data.objects[targetObjIndex];

            if (selectedObj.constructor === targetObj.constructor) {
                selectedCandy = undefined
            }
            else if (scoreCount > 0) swapObjects(selectedObj, targetObj);

            selectedCandy = undefined;

            render();

        } else if (selectedCandy.row === row && selectedCandy.col === col) {
            selectedCandy = undefined;
        } else {
            selectedCandy = { row, col };
        }
    }
}







//////////functions

function swapObjects(obj1, obj2) {
    this.swapaudio = document.createElement("audio");
    this.swapaudio.src = "sounds/move.m4a";
    this.swapaudio.playbackRate = 1.4;
    // Swap x and y coordinates
    this.swapaudio.currentTime = 0;
    this.swapaudio.play();
    const tempX = obj1._x;
    const tempY = obj1._y;
    obj1._x = obj2._x;
    obj1._y = obj2._y;
    obj2._x = tempX;
    obj2._y = tempY;

    // Swap positions in the data.objects array
    const index1 = data.objects.indexOf(obj1);
    const index2 = data.objects.indexOf(obj2);
    [data.objects[index1], data.objects[index2]] = [data.objects[index2], data.objects[index1]];
    scoreCount--

}


function getRandomObjectClass() {
    const objectClasses = [Obj1, Obj2, Obj3, Obj4, Obj5, Obj6];
    const randomIndex = Math.floor(Math.random() * objectClasses.length);
    return objectClasses[randomIndex];
}

function removeFiveObj() {
    this.swapaudio = document.createElement("audio");
    this.swapaudio.src = "sounds/five.m4a";
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols - 4; col++) {

            const index1 = row * numCols + col;
            const index2 = index1 + 1;
            const index3 = index1 + 2;
            const index4 = index1 + 3;
            const index5 = index1 + 4;

            const obj1 = data.objects[index1];
            const obj2 = data.objects[index2];
            const obj3 = data.objects[index3];
            const obj4 = data.objects[index4];
            const obj5 = data.objects[index5];

            if ((obj1 && obj2 && obj3 && obj4 && obj5) && (obj1._allowed !== false && obj2._allowed !== false && obj3._allowed !== false && obj4._allowed !== false && obj5._allowed !== false)) {
                const areSameClass = obj1.constructor === obj2.constructor && obj1.constructor === obj3.constructor && obj1.constructor === obj4.constructor && obj1.constructor === obj5.constructor;

                if (areSameClass && !shouldExclude(index1) && !shouldExclude(index2) && !shouldExclude(index3) && !shouldExclude(index4) && !shouldExclude(index5)) {
                    this.swapaudio.playbackRate = 1.4;
                    this.swapaudio.currentTime = 0;
                    this.swapaudio.play();
                    scale += 3;
                    if (obj1.ice === true) {
                        obj1.ice = false
                        console.log("aloxs")
                    }
                    else {
                        obj1._color = undefined;
                        obj1._allowed = false;
                    }

                    if (obj2.ice === true) {
                        obj2.ice = false
                    }
                    else {
                        obj2._color = undefined;
                        obj2._allowed = false;
                    }

                    if (obj3.ice === true) {
                        obj3.ice = false
                    }
                    else {
                        obj3._color = undefined;
                        obj3._allowed = false;
                    }
                    if (obj4.ice === true) {
                        obj4.ice = false
                    }
                    else {
                        obj4._color = undefined;
                        obj4._allowed = false;
                    }
                    if (obj5.ice === true) {
                        obj5.ice = false
                    }
                    else {
                        obj5._color = undefined;
                        obj5._allowed = false;
                    }
                }
            }
        }
    }

    for (let col = 0; col < numCols; col++) {
        for (let row = 0; row < numRows - 4; row++) {

            const index1 = row * numCols + col;
            const index2 = index1 + numCols;
            const index3 = index2 + numCols;
            const index4 = index3 + numCols;
            const index5 = index4 + numCols;

            const obj1 = data.objects[index1];
            const obj2 = data.objects[index2];
            const obj3 = data.objects[index3];
            const obj4 = data.objects[index4];
            const obj5 = data.objects[index5];

            if ((obj1 && obj2 && obj3 && obj4 && obj5) && (obj1._allowed !== false && obj2._allowed !== false && obj3._allowed !== false && obj4._allowed !== false && obj5._allowed !== false)) {
                const areSameClass = obj1.constructor === obj2.constructor && obj1.constructor === obj3.constructor && obj1.constructor === obj4.constructor && obj1.constructor === obj5.constructor;

                if (areSameClass && !shouldExclude(index1) && !shouldExclude(index2) && !shouldExclude(index3) && !shouldExclude(index4) && !shouldExclude(index5)) {
                    this.swapaudio.playbackRate = 1.4;
                    this.swapaudio.currentTime = 0;
                    this.swapaudio.play();
                    scale += 3;
                    if (obj1.ice === true) {
                        obj1.ice = false
                        console.log("aloxs")
                    }
                    else {
                        obj1._color = undefined;
                        obj1._allowed = false;
                    }

                    if (obj2.ice === true) {
                        obj2.ice = false
                    }
                    else {
                        obj2._color = undefined;
                        obj2._allowed = false;
                    }

                    if (obj3.ice === true) {
                        obj3.ice = false
                    }
                    else {
                        obj3._color = undefined;
                        obj3._allowed = false;
                    }
                    if (obj4.ice === true) {
                        obj4.ice = false
                    }
                    else {
                        obj4._color = undefined;
                        obj4._allowed = false;
                    }
                    if (obj5.ice === true) {
                        obj5.ice = false
                    }
                    else {
                        obj5._color = undefined;
                        obj5._allowed = false;
                    }
                }
            }
        }
    }
}


function removeFourObj() {
    this.swapaudio = document.createElement("audio");
    this.swapaudio.src = "sounds/four.m4a";
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols - 3; col++) {
            const index1 = row * numCols + col;
            const index2 = index1 + 1;
            const index3 = index1 + 2;
            const index4 = index1 + 3;

            const obj1 = data.objects[index1];
            const obj2 = data.objects[index2];
            const obj3 = data.objects[index3];
            const obj4 = data.objects[index4];

            if ((obj1 && obj2 && obj3 && obj4) && (obj1._allowed !== false && obj2._allowed !== false && obj3._allowed !== false && obj4._allowed !== false)) {
                const areSameClass = obj1.constructor === obj2.constructor && obj1.constructor === obj3.constructor && obj1.constructor === obj4.constructor;

                if (areSameClass && !shouldExclude(index1) && !shouldExclude(index2) && !shouldExclude(index3) && !shouldExclude(index4)) {
                    this.swapaudio.playbackRate = 1.4;
                    this.swapaudio.currentTime = 0;
                    this.swapaudio.play();
                    scale += 2;
                    if (obj1.ice === true) {
                        obj1.ice = false
                        console.log("aloxs")
                    }
                    else {
                        obj1._color = undefined;
                        obj1._allowed = false;
                    }

                    if (obj2.ice === true) {
                        obj2.ice = false
                    }
                    else {
                        obj2._color = undefined;
                        obj2._allowed = false;
                    }

                    if (obj3.ice === true) {
                        obj3.ice = false
                    }
                    else {
                        obj3._color = undefined;
                        obj3._allowed = false;
                    }
                    if (obj4.ice === true) {
                        obj4.ice = false
                    }
                    else {
                        obj4._color = undefined;
                        obj4._allowed = false;
                    }
                }
            }
        }
    }

    for (let col = 0; col < numCols; col++) {
        for (let row = 0; row < numRows - 3; row++) {
            const index1 = row * numCols + col;
            const index2 = index1 + numCols;
            const index3 = index2 + numCols;
            const index4 = index3 + numCols;

            const obj1 = data.objects[index1];
            const obj2 = data.objects[index2];
            const obj3 = data.objects[index3];
            const obj4 = data.objects[index4];

            if ((obj1 && obj2 && obj3 && obj4) && (obj1._allowed !== false && obj2._allowed !== false && obj3._allowed !== false && obj4._allowed !== false)) {
                const areSameClass = obj1.constructor === obj2.constructor && obj1.constructor === obj3.constructor && obj1.constructor === obj4.constructor;

                if (areSameClass && !shouldExclude(index1) && !shouldExclude(index2) && !shouldExclude(index3) && !shouldExclude(index4)) {
                    this.swapaudio.playbackRate = 1.4;
                    this.swapaudio.currentTime = 0;
                    this.swapaudio.play();
                    scale += 2;
                    if (obj1.ice === true) {
                        obj1.ice = false
                        console.log("aloxs")
                    }
                    else {
                        obj1._color = undefined;
                        obj1._allowed = false;
                    }

                    if (obj2.ice === true) {
                        obj2.ice = false
                    }
                    else {
                        obj2._color = undefined;
                        obj2._allowed = false;
                    }

                    if (obj3.ice === true) {
                        obj3.ice = false
                    }
                    else {
                        obj3._color = undefined;
                        obj3._allowed = false;
                    }
                    if (obj4.ice === true) {
                        obj4.ice = false
                    }
                    else {
                        obj4._color = undefined;
                        obj4._allowed = false;
                    }

                }
            }
        }
    }
}

function removeTreeObj() {
    this.swapaudio = document.createElement("audio");
    this.swapaudio.src = "sounds/tree.m4a";
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols - 2; col++) {
            const index1 = row * numCols + col;
            const index2 = index1 + 1;
            const index3 = index1 + 2;

            const obj1 = data.objects[index1];
            const obj2 = data.objects[index2];
            const obj3 = data.objects[index3];
            if ((obj1 !== undefined && obj2 !== undefined && obj3 !== undefined) && (obj1._allowed !== false && obj2._allowed !== false && obj3._allowed !== false)) {
                const areSameClass = obj1.constructor === obj2.constructor && obj1.constructor === obj3.constructor;

                if (areSameClass && !shouldExclude(index1) && !shouldExclude(index2) && !shouldExclude(index3)) {
                    this.swapaudio.playbackRate = 1.4;
                    this.swapaudio.currentTime = 0;
                    this.swapaudio.play();
                    scale += 1
                    if (obj1.ice === true) {
                        obj1.ice = false
                        console.log("aloxs")
                    }
                    else {
                        obj1._color = undefined;
                        obj1._allowed = false;
                    }

                    if (obj2.ice === true) {
                        obj2.ice = false
                    }
                    else {
                        obj2._color = undefined;
                        obj2._allowed = false;
                    }

                    if (obj3.ice === true) {
                        obj3.ice = false
                    }
                    else {
                        obj3._color = undefined;
                        obj3._allowed = false;
                    }

                }
            }
        }
    }


    for (let col = 0; col < numCols; col++) {
        for (let row = 0; row < numRows - 2; row++) {
            const index1 = row * numCols + col;
            const index2 = index1 + numCols;
            const index3 = index2 + numCols;

            const obj1 = data.objects[index1];
            const obj2 = data.objects[index2];
            const obj3 = data.objects[index3];
            if ((obj1 !== undefined && obj2 !== undefined && obj3 !== undefined) && (obj1._allowed !== false && obj2._allowed !== false && obj3._allowed !== false)) {
                const areSameClass = obj1.constructor === obj2.constructor && obj1.constructor === obj3.constructor;

                if (areSameClass && !shouldExclude(index1) && !shouldExclude(index2) && !shouldExclude(index3)) {
                    this.swapaudio.playbackRate = 1.4;
                    this.swapaudio.currentTime = 0;
                    this.swapaudio.play();
                    scale += 1
                    if (obj1.ice === true) {
                        obj1.ice = false
                        console.log("aloxs")
                    }
                    else {
                        obj1._color = undefined;
                        obj1._allowed = false;
                    }

                    if (obj2.ice === true) {
                        obj2.ice = false
                    }
                    else {
                        obj2._color = undefined;
                        obj2._allowed = false;
                    }

                    if (obj3.ice === true) {
                        obj3.ice = false
                    }
                    else {
                        obj3._color = undefined;
                        obj3._allowed = false;
                    }

                }
            }
        }
    }
}



function shouldExclude(index) {
    const excludedIndices = [0, 5, 20, 21, 26, 27, 42, 47];
    // it check is there same index with is in excludedIndices and it will return true if index and one of excludedIndices values are same
    return excludedIndices.includes(index);
}

function createGame() {
    data.objects = [];
    const objectCoords = [];

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const x = col * rectSize;
            const y = row * rectSize + 280;

            let shouldExclude = false;
            let iceVal = false;

            // Check if the current coordinates match any exclusion coordinates
            if (
                (x === 0 && y === 280) ||
                (x === 600 && y === 280) ||
                (x === 240 && y === 640) ||
                (x === 360 && y === 640) ||
                (x === 240 && y === 760) ||
                (x === 360 && y === 760) ||
                (x === 0 && y === 1120) ||
                (x === 600 && y === 1120)
            ) {
                shouldExclude = true;
            }

            // Set ice property for specific coordinates
            if (
                (x === 120 && y === 520) ||
                (x === 240 && y === 520) ||
                (x === 360 && y === 520) ||
                (x === 480 && y === 520) ||

                (x === 120 && y === 640) ||
                (x === 120 && y === 760) ||
                (x === 120 && y === 880) ||

                (x === 480 && y === 640) ||
                (x === 480 && y === 760) ||
                (x === 480 && y === 880) ||

                (x === 240 && y === 880) ||
                (x === 360 && y === 880)
            ) {
                iceVal = true; // Set ice property to true for these coordinates
            }

            if (shouldExclude) {
                objectCoords.push({ color: undefined });
            } else {
                objectCoords.push({ x, y, ice: iceVal });
            }
        }
    }

    let prevObj = undefined;
    for (const { x, y, ice } of objectCoords) {
        const ObjectClass = getRandomObjectClass();
        const newObj = new ObjectClass(x, y, ice);
        if (prevObj && newObj._color === undefined) {
            data.objects.push(prevObj);
        } else {
            data.objects.push(newObj);
            prevObj = newObj;
        }
    }
}





function createIce() {
    let cubSize = 120
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const x = col * cubSize;
            const y = row * cubSize + 280;

            let shouldExclude = false;

            // Check if the current coordinates match any exclusion coordinates
            if (
                (x === 0 && y === 280) ||
                (x === 600 && y === 280) ||
                (x === 240 && y === 640) ||
                (x === 360 && y === 640) ||
                (x === 240 && y === 760) ||
                (x === 360 && y === 760) ||
                (x === 0 && y === 1120) ||
                (x === 600 && y === 1120)
            ) {
                shouldExclude = true;
            }

            if (shouldExclude) {

            } else {
                context.drawImage(cubeImg, x, y, 130, 120);

            }
        }
    }

}

function refreshBoard() {
    for (let row = numRows - 1; row > 0; row--) {
        for (let col = 0; col < numCols; col++) {
            const currentIndex = row * numCols + col;
            const currentObj = data.objects[currentIndex];

            const currentCoords = `${col}-${row}`;
            const excludedCoords = ['0-1', '5-1', '2-3', '3-3', '2-4', '3-4', '2-5', '3-5'];

            if (!currentObj || currentObj._color === undefined) {
                const previousIndex = (row - 1) * numCols + col;
                const previousObj = data.objects[previousIndex];

                if (previousObj && previousObj._color !== undefined && !excludedCoords.includes(currentCoords) && previousObj.ice === false) {
                    // Swap properties and position
                    data.objects[currentIndex] = previousObj;
                    previousObj._y = currentObj._y;
                    data.objects[previousIndex] = currentObj;
                    currentObj._y = previousObj._y - rectSize;
                }
            }
        }
    }
}

function scaleCount(i) {
    context.drawImage(images[i], 40, 150, 700, 75);

}


function addNewRow() {
    const firstRow = data.objects.slice(0, numCols);
    const obj6 = data.objects[6];
    const obj11 = data.objects[11];
    const obj32 = data.objects[32];
    const obj33 = data.objects[33];
    const obj37 = data.objects[37];
    const obj38 = data.objects[38];
    const obj39 = data.objects[39];
    const obj40 = data.objects[40];

    for (let col = 1; col < numCols - 1; col++) {
        const x = col * rectSize;
        const y = 280;

        if (!firstRow[col] || firstRow[col]._color === undefined) {
            const ObjectClass = getRandomObjectClass();
            const newObj = new ObjectClass(x, y);
            data.objects[col] = newObj;
        }
    }   
    if (!obj6 || obj6._color === undefined) {
        const ObjectClass = getRandomObjectClass();
        const newObj = new ObjectClass(0, 400);
        data.objects[6] = newObj;
    }

    if (!obj11 || obj11._color === undefined) {
        const ObjectClass = getRandomObjectClass();
        const newObj = new ObjectClass(600, 400);
        data.objects[11] = newObj;
    }
    if (!obj32 || obj32._color === undefined) {
        const ObjectClass = getRandomObjectClass();
        const newObj = new ObjectClass(240, 880);
        data.objects[32] = newObj;
    }

    if (!obj33 || obj33._color === undefined) {
        const ObjectClass = getRandomObjectClass();
        const newObj = new ObjectClass(360, 880);
        data.objects[33] = newObj;
    }
    if (!obj37 || obj37._color === undefined) {
        const ObjectClass = getRandomObjectClass();
        const newObj = new ObjectClass(120, 1000);
        data.objects[37] = newObj;
    }

    if (!obj38 || obj38._color === undefined) {
        const ObjectClass = getRandomObjectClass();
        const newObj = new ObjectClass(240, 1000);
        data.objects[38] = newObj;
    }

    if (!obj39 || obj39._color === undefined) {
        const ObjectClass = getRandomObjectClass();
        const newObj = new ObjectClass(360, 1000);
        data.objects[39] = newObj;
    }

    if (!obj40 || obj40._color === undefined) {
        const ObjectClass = getRandomObjectClass();
        const newObj = new ObjectClass(480, 1000);
        data.objects[40] = newObj;
    }
}



function checkAndAddNewRow() {
    const firstRow = data.objects.slice(0, numCols);
    const obj6 = data.objects[6];
    const obj11 = data.objects[11];
    const obj32 = data.objects[32];
    const obj33 = data.objects[33];
    const obj37 = data.objects[37];
    const obj38 = data.objects[38];
    const obj39 = data.objects[39];
    const obj40 = data.objects[40];

    const isEmpty = firstRow.some(obj => !obj || obj._color === undefined) ||
        !obj6 || obj6._color === undefined ||
        !obj11 || obj11._color === undefined ||
        !obj32 || obj32._color === undefined ||
        !obj33 || obj33._color === undefined ||
        !obj37 || obj37._color === undefined ||
        !obj38 || obj38._color === undefined ||
        !obj39 || obj39._color === undefined ||
        !obj40 || obj40._color === undefined 
    if (isEmpty) {
        setTimeout(() => {
            addNewRow();
            refreshBoard();
            render();
        }, 1000);
    }
}




let hasWon = false;

function scoreAndCoin() {
    const WinAudio = document.createElement("audio");
    WinAudio.src = "sounds/win.ogg";
    const LooseAudio = document.createElement("audio");
    LooseAudio.src = "sounds/fail.ogg";
    if (!hasWon && scale >= images.length - 1) {
        WinAudio.play();
        hasWon = true;
        alert("You win!");
        setInterval(() => {
            location.reload();
        }, 2000);

    }
    if (!hasWon && Timeout <= 0) {
        LooseAudio.play();
        hasWon = true;
        alert("You Loose!");
        setInterval(() => {
            location.reload();
        }, 2000);
    }
    Score.textContent = scoreCount;
    Time.textContent = Timeout
    Coin.textContent = "10 / " + coin
    if (Timeout <= 10 && Timeout > 0) {
        timeout.play();
    }
}

let timeout = document.createElement("audio");
timeout.src = "sounds/time.ogg";



const myButton = document.querySelector("#myButton");
const myButtonDel = document.querySelector("#myButtonDel");
const myButtonBomb = document.querySelector("#myButtonBomb");

let deleteMode = false;
myButtonDel.addEventListener('click', () => {
    deleteMode = !deleteMode;
});

let deleteBomb = false;
myButtonBomb.addEventListener('click', () => {
    deleteBomb = !deleteBomb;
});


myButton.addEventListener('click', () => {
    if (coin >= 1) {
        myButton.classList.add('clicked');

        const swapaudio = document.createElement("audio");
        swapaudio.src = "sounds/change.m4a";
        swapaudio.playbackRate = 1.4;
        swapaudio.currentTime = 0;
        swapaudio.play();

        setTimeout(() => {
            myButton.classList.remove('clicked');
            createGame();
            render();
            coin--;
        }, 1000);
    }
});







