
//DECLARED VARIABLES FOR DOM MANIPULATION
const allCells = document.querySelectorAll("td");
let robotPosition = document.querySelector("td .robot");
const emptyCells = document.querySelector("td .empty-cell");
const placedObject = document.getElementById("object");
const rowInput = document.getElementById("row");
const columnInput = document.getElementById("column");
const facingInput = document.getElementById("facing");
const submit = document.getElementById("submit");
const rotateLeftBtn = document.getElementById("rotate-left-btn");
const rotateRightBtn = document.getElementById("rotate-right-btn");
const moveBtn = document.getElementById("move-btn");
const reportBtn = document.getElementById("report-btn");
let message = document.getElementById("message");


//IN-GAME VARIABLES
let selectedRow = rowInput.value;
let selectedColumn = columnInput.value;

let rowID = "";
let cellID = "";
let newRobot = "";


//ITEM OBJECT FACTORY FUNCTION DEFINITION
const CreateItem = function (type, row, column, facing) {
    const item = {
        type: type,
        row: row,
        column: column,
        facing: facing
    };
    return item;
};

//CREATES ROBOT AND WALL OBJECTS
const Robot = CreateItem("Robot");
const Wall = CreateItem("Wall");


//ENABLES OR DISABLES ELEMENT FOR SELECTING FACING DIRECTION WHEN A ROBOT IS BEING PLACED ON THE BOARD
placedObject.onchange = function () {
    facing.setAttribute("disabled", "disabled");
    if (this.value === Robot.type) {
      facing.removeAttribute("disabled");
    };
};

//RESETS SELECT ELEMENT VALUES
const resetElementValues = () => {
    placedObject.value = "Select Object";
    rowInput.value = "Select Row";
    columnInput.value = "Select Column";
    facingInput.value = "Choose Direction";
}

//FIRES WHEN THE PLACE ITEM BUTTON IS CLICKED
submit.addEventListener("click", function (e) {
    e.preventDefault();


    const setItemValues = (itemObject) => {
        itemObject.row = rowInput.value;
        itemObject.column = columnInput.value;
        itemObject.facing = facingInput.value;
    }
    
    if (placedObject.value === Robot.type) {
        setItemValues(Robot);
        placeRobot(Robot.row, Robot.column, Robot.facing);
        
    } else if (placedObject.value === Wall.type) {
        setItemValues(Wall);
        placeWall(Wall.row, Wall.column)
    };
    
    console.log(Robot);
    console.log(Wall);

    resetElementValues();
});


//SETS CELL LOCATION FOR PLACING OBJECTS
const setIDs = (row, column) => {
    rowID = "#row-" + row;
    cellID = `#cell-${(5 * (Number(row) - 1)) + Number(column)}`;
}

const setFacingDirection = (facing) => {
    let icons = "";
    if (facing === "North") {
        icons += "<i class='fa-solid fa-arrow-up' id='direction'></i>";
        console.log(icons);
    } else if (facing === "East") {
        icons += "<i class='fa-solid fa-arrow-right' id='direction'></i>";
        console.log(icons);
    } else if (facing === "South") {
        icons += "<i class='fa-solid fa-arrow-down' id='direction'></i>";
        console.log(icons);
    } else {
        icons += "<i class='fa-solid fa-arrow-left' id='direction'></i>";
        console.log(icons);
    };
    return icons;
};

//CREATES A NEW ROBOT IN AN EMPTY CELL
const createNewRobot = (facing) => {
    newRobot = document.querySelector(`${rowID} ${cellID}`);
    newRobot.classList.replace("empty-cell", "robot");
    newRobot.innerHTML = `<i class='fa-solid fa-robot fa-xl'></i>${setFacingDirection(facing)}`;
    robotPosition = newRobot;
}

//MOVES EXISTING ROBOT TO AN EMPTY CELL
const moveToNewCell = (facing) => {
    newRobot = document.querySelector(`${rowID} ${cellID}`);
    if (robotPosition !== newRobot) {
        robotPosition.classList.replace("robot", "empty-cell");
        robotPosition.innerHTML = "";
        newRobot.classList.replace("empty-cell", "robot");
        newRobot.innerHTML = `<i class='fa-solid fa-robot fa-xl'></i>${setFacingDirection(facing)}`;
        robotPosition = newRobot;
    };
};

//HANDLES PLACING OF ROBOT OBJECT ON THE BOARD
const placeRobot = (row, column, facing) => {
    setIDs(row, column);

    if (robotPosition === null) {
        createNewRobot(facing);
    } else {
        moveToNewCell(facing);
    };
};

//HANDLES PLACING OF WALL OBJECTS ON THE BOARD
const placeWall = (row, column) => {
    setIDs(row, column);

    const newWall = document.querySelector(`${rowID} ${cellID}`);
    console.log(newWall);

    if (newWall.getAttribute("class") === "empty-cell") {
        newWall.classList.replace("empty-cell", "wall");
    } else if (newWall.getAttribute("class") === "robot") {
        message.innerText = `Row ${row}, column ${column} is not empty!`;
    };

    resetElementValues();
};

//ROTATES ROBOT 90 DEGREES TO A GIVEN DIRECTION
const rotateRobot = (rotation) => {
    const direction = document.getElementById("direction");

    if (direction !== null) {
        if (rotation === "Left") {
            if (Robot.facing === "North") {
                console.log(Robot.facing);
                Robot.facing = "West";
                direction.classList.replace("fa-arrow-up", "fa-arrow-left");
                console.log(Robot.facing);
            } else if (Robot.facing === "East") {
                console.log(Robot.facing);
                Robot.facing = "North";
                direction.classList.replace("fa-arrow-right", "fa-arrow-up");
                console.log(Robot.facing);
            } else if (Robot.facing === "South") {
                console.log(Robot.facing);
                Robot.facing = "East";
                direction.classList.replace("fa-arrow-down", "fa-arrow-right");
                console.log(Robot.facing);
            } else {
                console.log(Robot.facing);
                Robot.facing = "South";
                direction.classList.replace("fa-arrow-left", "fa-arrow-down");
                console.log(Robot.facing);
            };
        } else if (rotation === "Right") {
            if (Robot.facing === "North") {
                console.log(Robot.facing);
                Robot.facing = "East";
                direction.classList.replace("fa-arrow-up", "fa-arrow-right");
                console.log(Robot.facing);
            } else if (Robot.facing === "East") {
                console.log(Robot.facing);
                Robot.facing = "South";
                direction.classList.replace("fa-arrow-right", "fa-arrow-down");
                console.log(Robot.facing);
            } else if (Robot.facing === "South") {
                console.log(Robot.facing);
                Robot.facing = "West";
                direction.classList.replace("fa-arrow-down", "fa-arrow-left");
                console.log(Robot.facing);
            } else {
                console.log(Robot.facing);
                Robot.facing = "North";
                direction.classList.replace("fa-arrow-left", "fa-arrow-up");
                console.log(Robot.facing);
            };
        };
    };
};

//FIRES WHEN THE LEFT BUTTON IS CLICKED. ROTATES ROBOT 90 DEGREES TO THE LEFT
rotateLeftBtn.addEventListener("click", function (e) {
    e.preventDefault();
    
    const rotation = "Left";
    rotateRobot(rotation);
});

//FIRES WHEN THE RIGHT BUTTON IS CLICKED. ROTATES ROBOT 90 DEGREES TO THE RIGHT
rotateRightBtn.addEventListener("click", function (e) {
    e.preventDefault();
    
    const rotation = "Right";
    rotateRobot(rotation);
});

/*const moveRobot = (row, column, facing) => {
    const rowID = "#row-" + row;
    console.log(row);
    console.log(rowID);
    const cellID = "#cell-" + column;
    console.log(column);
    console.log(cellID);
    console.log(robotPosition);

    let newRobot = document.querySelector(`${rowID} ${cellID}`);
    console.log(newRobot);

    if (newRobot.getAttribute("class") === "empty-cell") {

        robotPosition.classList.replace("robot", "empty-cell");
        robotPosition.innerHTML = "";
        console.log(robotPosition);
        newRobot.classList.replace("empty-cell", "robot");
        newRobot.innerHTML = `<i class='fa-solid fa-robot fa-xl'></i>${setFacingDirection(facing)}`;
        console.log(newRobot);
    };

    
};*/


const moveRobot = (row, column, facing) => {
    rowID = "#row-" + row;
    cellID = "#cell-" + column;

    if (robotPosition === null) {
        newRobot = document.querySelector(`${rowID} ${cellID}`);
        newRobot.classList.replace("empty-cell", "robot");
        newRobot.innerHTML = `<i class='fa-solid fa-robot fa-xl'></i>${setFacingDirection(facing)}`;
        console.log(Robot.facing);
        robotPosition = newRobot;
        console.log(robotPosition);
    } else if (robotPosition !== null) {
        moveToNewCell(Robot.facing)
    };
};

/*const checkBoardBoundaries = (boardBoundary, xCoordinate, yCoordinate, facing) => {
    if (boardBoundary.includes(Number(xCoordinate)) && boardBoundary.includes(Number(yCoordinate))) {
        moveRobot(xCoordinate, yCoordinate, Robot.facing);
    };
};*/


moveBtn.addEventListener("click", function (e) {
    e.preventDefault();
    let robot
    
    let xCoordinate = robotPosition.parentElement.getAttribute("id")[4];
    console.log(xCoordinate);
    let yCoordinate = robotPosition.getAttribute("id").slice(5);
    console.log(yCoordinate);
    console.log(Robot.facing);
    const xBoundary = [1, 2, 3, 4, 5];
    let yBoundary = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

    if (xCoordinate && yCoordinate !== null) {
        if (Robot.facing === "North") {
            xCoordinate = `${Number(xCoordinate) + 1}`;
            yCoordinate = `${Number(yCoordinate) + 5}`;
            if (xBoundary.includes(Number(xCoordinate)) && yBoundary.includes(Number(yCoordinate))) {
                moveRobot(xCoordinate, yCoordinate, Robot.facing);
            };
        } else if (Robot.facing === "East") {
            yCoordinate = `${Number(yCoordinate) + 1}`;
            yBoundary = [2, 3, 4, 5, 7, 8, 9, 10, 12, 13, 14, 15, 17, 18, 19, 20, 22, 23, 24, 25];
            if (xBoundary.includes(Number(xCoordinate)) && yBoundary.includes(Number(yCoordinate))) {
                moveRobot(xCoordinate, yCoordinate, Robot.facing);
            };
        } else if (Robot.facing === "South") {
            xCoordinate = `${Number(xCoordinate) - 1}`;
            yCoordinate = `${Number(yCoordinate) - 5}`;
            if (xBoundary.includes(Number(xCoordinate)) && yBoundary.slice().includes(Number(yCoordinate))) {
                moveRobot(xCoordinate, yCoordinate, Robot.facing);
            };
        } else {
            yCoordinate = `${Number(yCoordinate) - 1}`;
            yBoundary = [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24];
            if (xBoundary.includes(Number(xCoordinate)) && yBoundary.includes(Number(yCoordinate))) {
                moveRobot(xCoordinate, yCoordinate, Robot.facing);
            };
        };
    };
});


reportBtn.addEventListener("click", function (e) {
    e.preventDefault();
    
    let xCoordinate = robotPosition.parentElement.getAttribute("id")[4];
    console.log(xCoordinate);
    let yCoordinate = robotPosition.getAttribute("id").slice(5);
    console.log(yCoordinate);
    console.log(Robot.facing);

    const columNumber = (Number(yCoordinate) - ((Number(xCoordinate) - 1) * 5));

    message.innerText = `ROBOT IS POSITIONED AT ${xCoordinate}, ${columNumber} ${Robot.facing}`;
});


