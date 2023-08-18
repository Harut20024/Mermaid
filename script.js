const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
const Score = document.querySelector("#Scorediv");
let scoreCount = 50;
let scale = 30;
let bublePosY = -700, bubleSpeed = 3, bublePosX = 0

const bublefoto = new Image();
bublefoto.src = "photos/bubble.png";

const _imgScore = new Image();
_imgScore.src = "photos/score.png";

const _img1 = new Image();
_img1.src = "photos/image1.png";

const _button = document.querySelector("#myButton");

class GameObj {
    constructor(x, y, width, height, imgSrc, color) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._color = color;
        this._allowed = true
        this._img = new Image();
        this._img.src = imgSrc;
        this._img.onload = () => this.render(context);
    }

    render(context) {
        if (this._color !== undefined) context.drawImage(this._img, this._x, this._y, this._width, this._height);
    }
}

class Obj1 extends GameObj {
    constructor(x, y) {
        super(x, y, 100, 100, "photos/obj-1.png", "orange");
    }
}

class Obj2 extends GameObj {
    constructor(x, y) {
        super(x, y, 100, 100, "photos/obj-2.png", "blue");
    }
}

class Obj3 extends GameObj {
    constructor(x, y) {
        super(x, y, 100, 100, "photos/obj-3.png", "red");
    }
}

class Obj4 extends GameObj {
    constructor(x, y) {
        super(x, y, 100, 100, "photos/obj-4.png", "yellow");
    }
}

class Obj5 extends GameObj {
    constructor(x, y) {
        super(x, y, 100, 100, "photos/obj-5.png", "green");
    }
}

class Obj6 extends GameObj {
    constructor(x, y) {
        super(x, y, 100, 100, "photos/obj-6.png", "pink");
    }
}

const data = {
    objects: []
};

const numRows = 8;
const numCols = 6;
const rectSize = 126;

createGame();


function update() {
    score()
    if (removeFiveObj()) { }
    else if (removeFourObj()) { }
    else removeTreeObj();

    bublePosY += bubleSpeed;
    console.log(bublePosY)
    if (bublePosY >= -490) {
        bublePosY = -700;
        bublePosX += 100
        if (bublePosX === 400) bublePosX = 0
    }
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bublefoto, bublePosX, bublePosY, canvas.width, canvas.height - 140);

    context.drawImage(_imgScore, -140, -100, 1000, 300);

    const validObjects = data.objects.filter(obj => obj && obj._color !== undefined);

    validObjects.forEach(obj => obj.render(context));

    context.drawImage(_img1, 120, 1210, 500, 300);

    drawRoundedRectR(10, 180, 700, 40, 20);
    drawRoundedRectB(10, 180, scale, 40, 20);

}


function loop() {
    setInterval(() => {
        refreshBoard();
    }, 600); 

    setInterval(() => {
        update();
        render();
    }, 60); 
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

        }
        else onCandyClick(clickedRow, clickedCol);
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
            data.objects[targetObjIndex]._y === undefined
        ) {
            selectedCandy = undefined;
            return;
        }

        const rowDiff = Math.abs(row - selectedCandy.row);
        const colDiff = Math.abs(col - selectedCandy.col);

        if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
            const selectedObj = data.objects[selectedObjIndex];
            const targetObj = data.objects[targetObjIndex];

            console.log("selected" + selectedObjIndex + "     " + "target" + targetObjIndex)

            console.log("selected  " + selectedObj._color + "     " + "target  " + targetObj._color)


            if (scoreCount > 0) swapObjects(selectedObj, targetObj);
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
    // Swap x and y coordinates
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
                    scale += 150;
                    obj1._color = undefined;
                    obj2._color = undefined;
                    obj3._color = undefined;
                    obj4._color = undefined;
                    obj5._color = undefined;
                    obj1._allowed = false;
                    obj2._allowed = false;
                    obj3._allowed = false;
                    obj4._allowed = false;
                    obj5._allowed = false;
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
                    scale += 150;
                    obj1._color = undefined;
                    obj2._color = undefined;
                    obj3._color = undefined;
                    obj4._color = undefined;
                    obj5._color = undefined;
                    obj1._allowed = false;
                    obj2._allowed = false;
                    obj3._allowed = false;
                    obj4._allowed = false;
                    obj5._allowed = false;
                }
            }
        }
    }
}


function removeFourObj() {
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
                    scale += 100;
                    obj1._color = undefined;
                    obj2._color = undefined;
                    obj3._color = undefined;
                    obj4._color = undefined;
                    obj1._allowed = false;
                    obj2._allowed = false;
                    obj3._allowed = false;
                    obj4._allowed = false;
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
                    scale += 100;
                    obj1._color = undefined;
                    obj2._color = undefined;
                    obj3._color = undefined;
                    obj4._color = undefined;
                    obj1._allowed = false;
                    obj2._allowed = false;
                    obj3._allowed = false;
                    obj4._allowed = false;
                }
            }
        }
    }
}

function removeTreeObj() {

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
                    scale += 50
                    obj1._color = undefined;
                    obj2._color = undefined;
                    obj3._color = undefined;
                    obj1._allowed = false;
                    obj2._allowed = false;
                    obj3._allowed = false;

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
                    scale += 50
                    obj1._color = undefined;
                    obj2._color = undefined;
                    obj3._color = undefined;
                    obj1._allowed = false;
                    obj2._allowed = false;
                    obj3._allowed = false;
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

            // Check if the current coordinates match any exclusion coordinates
            if (
                (x === 0 && y === 280) ||
                (x === 630 && y === 280) ||
                (x === 252 && y === 658) ||
                (x === 378 && y === 658) ||
                (x === 252 && y === 784) ||
                (x === 378 && y === 784) ||
                (x === 0 && y === 1162) ||
                (x === 630 && y === 1162)
            ) {
                shouldExclude = true;
            }

            if (shouldExclude) {
                objectCoords.push({ color: undefined });
            } else {
                objectCoords.push({ x, y });
            }
        }
    }

    let prevObj = null; // Store the previous object
    for (const { x, y } of objectCoords) {
        const ObjectClass = getRandomObjectClass();
        const newObj = new ObjectClass(x, y);
        if (prevObj && newObj._color === undefined) {
            // Replace undefined color objects with the previous object
            data.objects.push(prevObj);
        } else {
            data.objects.push(newObj);
            prevObj = newObj; // Update the previous object
        }
    }
}





function drawRoundedRectR(x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.arcTo(x + width, y, x + width, y + radius, radius);
    context.lineTo(x + width, y + height - radius);
    context.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    context.lineTo(x + radius, y + height);
    context.arcTo(x, y + height, x, y + height - radius, radius);
    context.lineTo(x, y + radius);
    context.arcTo(x, y, x + radius, y, radius);
    context.closePath();
    context.fillStyle = "red";
    context.fill();
}
function drawRoundedRectB(x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.arcTo(x + width, y, x + width, y + radius, radius);
    context.lineTo(x + width, y + height - radius);
    context.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    context.lineTo(x + radius, y + height);
    context.arcTo(x, y + height, x, y + height - radius, radius);
    context.lineTo(x, y + radius);
    context.arcTo(x, y, x + radius, y, radius);
    context.closePath();
    context.fillStyle = "blue";
    context.fill();
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

                if (previousObj && previousObj._color !== undefined && !excludedCoords.includes(currentCoords)) {
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


function addNewRow() {
    const newRow = [];
    for (let col = 0; col < numCols; col++) {
        const x = col * rectSize;
        const y = 280;

        const ObjectClass = getRandomObjectClass();
        const newObj = new ObjectClass(x, y);
        newRow.push(newObj);
    }

    data.objects = newRow.concat(data.objects.slice(0, -numCols));
}
function checkAndAddNewRow() {
    const isEmpty = data.objects.slice(0, numCols).some(obj => !obj || obj._color === undefined);

    if (isEmpty) {
        setTimeout(() => {
            addNewRow();
            refreshBoard();
            render();
        }, 2000);
    }
}

let hasWon = false;

function score() {
    if (!hasWon && scale >= 700) {
        hasWon = true;
        alert("You win!");
        location.reload();
    }
    Score.textContent = scoreCount;
}



_button.addEventListener("click", function () {
    createGame();
    render();
});





