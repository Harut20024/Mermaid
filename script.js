const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
let Score = document.querySelector("#Scorediv")
let scoreCount = 10
let scale = 700
this._imgScore = new Image();
this._imgScore.src = "score.png";

this._img1 = new Image();
this._img1.src = "image1.png";

this._button = document.querySelector("#myButton")

_button.addEventListener("click", function () {
    createGame();
    render();
});

class Obj1 {
    constructor(x, y) {
        this._x = x;
        this._y = y;
        this._width = 100;
        this._height = 100;
        this._color = "orange"

        this._img = new Image();
        this._img.src = "obj-1.png";
    }
    render() {
        if (this._color !== null) context.drawImage(this._img, this._x, this._y, this._width, this._height);
    }
}

class Obj2 {
    constructor(x, y) {
        this._x = x;
        this._y = y;
        this._width = 100;
        this._height = 100;
        this._color = "blue"

        this._img = new Image();
        this._img.src = "obj-2.png";
    }
    render() {
        if (this._color !== null) context.drawImage(this._img, this._x, this._y, this._width, this._height);
    }
}
class Obj3 {
    constructor(x, y) {
        this._x = x;
        this._y = y;
        this._width = 100;
        this._height = 100;
        this._color = "red"

        this._img = new Image();
        this._img.src = "obj-3.png";
    }
    render() {
        if (this._color !== null) context.drawImage(this._img, this._x, this._y, this._width, this._height);
    }
}
class Obj4 {
    constructor(x, y) {
        this._x = x;
        this._y = y;
        this._width = 100;
        this._height = 100;
        this._color = "yellow"

        this._img = new Image();
        this._img.src = "obj-4.png";
    }
    render() {
        if (this._color !== null) context.drawImage(this._img, this._x, this._y, this._width, this._height);
    }
}
class Obj5 {
    constructor(x, y) {
        this._x = x;
        this._y = y;
        this._width = 100;
        this._height = 100;
        this._color = "green"

        this._img = new Image();
        this._img.src = "obj-5.png";
    }
    render() {
        if (this._color !== null) context.drawImage(this._img, this._x, this._y, this._width, this._height);
    }
}
class Obj6 {
    constructor(x, y) {
        this._x = x;
        this._y = y;
        this._width = 100;
        this._height = 100;
        this._color = "pink"

        this._img = new Image();
        this._img.src = "obj-6.png";
    }
    render() {
        if (this._color !== null) context.drawImage(this._img, this._x, this._y, this._width, this._height);
    }
}





let data = {
    objects: []
};
const objectCoords = [];
const numRows = 8;
const numCols = 6;
const rectSize = 126;


createGame()

function update() {
    Score.textContent = scoreCount
    // data.objects = data.objects.filter(obj => obj._color !== null);
    removeTreeObjhorizon()
    removeTreeObjVertical()

}


function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(_imgScore, -140, -100, 1000, 300);
    data.objects.forEach(obj => {
        if (obj._y === 280) console.log(obj._color)
        obj.render();
    })
    context.drawImage(_img1, 120, 1210, 500, 300);
    drawRoundedRectR(10, 150, 700, 80, 50);
    drawRoundedRectB(10, 150, scale, 80, 50);
}

function loop() {
    setInterval(() => {
        update();
        render();
    }, 500);
}

loop();

let selectedCandy = null;

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const clickedRow = Math.floor((mouseY - 280) / rectSize);
    const clickedCol = Math.floor(mouseX / rectSize);

    onCandyClick(clickedRow, clickedCol);
});

function onCandyClick(row, col) {
    // Check if the clicked cell has valid coordinates
    if (row === undefined || col === undefined) {
        return; // Ignore the click
    }

    if (selectedCandy === null) {
        selectedCandy = { row, col };
    } else {
        const selectedObjIndex = (selectedCandy.row * numCols) + selectedCandy.col;
        const targetObjIndex = (row * numCols) + col;

        // Check if the target cell has valid coordinates
        if (
            data.objects[selectedObjIndex] === undefined ||
            data.objects[selectedObjIndex]._x === undefined ||
            data.objects[selectedObjIndex]._y === undefined ||
            data.objects[targetObjIndex] === undefined ||
            data.objects[targetObjIndex]._x === undefined ||
            data.objects[targetObjIndex]._y === undefined
        ) {
            selectedCandy = null; // Clear the selection
            return; // Ignore the click
        }

        const rowDiff = Math.abs(row - selectedCandy.row);
        const colDiff = Math.abs(col - selectedCandy.col);

        if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
            const selectedObj = data.objects[selectedObjIndex];
            const targetObj = data.objects[targetObjIndex];

            // Swap objects
            if (scoreCount > 0) swapObjects(selectedObj, targetObj);
            // Clear selection
            selectedCandy = null;
            // Update the canvas
            render();
        } else if (selectedCandy.row === row && selectedCandy.col === col) {
            // Clicking the same object again clears the selection
            selectedCandy = null;
        } else {
            // Clicking on a non-adjacent object updates the selection
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


function removeTreeObjhorizon() {
    scale -= 5
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols - 2; col++) {
            const index1 = row * numCols + col;
            const index2 = index1 + 1;
            const index3 = index1 + 2;

            const obj1 = data.objects[index1];
            const obj2 = data.objects[index2];
            const obj3 = data.objects[index3];

            const areSameClass = obj1.constructor === obj2.constructor && obj1.constructor === obj3.constructor;

            if (areSameClass && !shouldExclude(index1) && !shouldExclude(index2) && !shouldExclude(index3)) {
                obj1._color = null;
                obj2._color = null;
                obj3._color = null;

            }
        }
    }
}

function removeTreeObjVertical() {
    for (let col = 0; col < numCols; col++) {
        for (let row = 0; row < numRows - 2; row++) {
            const index1 = row * numCols + col;
            const index2 = index1 + numCols;
            const index3 = index2 + numCols;

            const obj1 = data.objects[index1];
            const obj2 = data.objects[index2];
            const obj3 = data.objects[index3];

            const areSameClass = obj1.constructor === obj2.constructor && obj1.constructor === obj3.constructor;

            if (areSameClass && !shouldExclude(index1) && !shouldExclude(index2) && !shouldExclude(index3)) {
                obj1._color = null;
                obj2._color = null;
                obj3._color = null;
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
                objectCoords.push({ color: null, x: 3000, y: 3000 });
            } else {
                objectCoords.push({ x, y });
            }
        }
    }

    for (const { x, y } of objectCoords) {
        const ObjectClass = getRandomObjectClass();
        const newObj = new ObjectClass(x, y);
        data.objects.push(newObj);
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





