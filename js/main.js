
/******DECLARED VARIABLES FOR DOM MANIPULATION*******/
//VARIABLES FOR SELECT ELEMENTS
const placedObject = document.getElementById("object"); //HOLDS THE VALUE OF SELECTED ITEM TO BE PLACED ON BOARD (ROBOT OR WALL)
const rowInput = document.getElementById("row"); //HOLDS THE DOM NODES OF THE SELECTED ROW
const columnInput = document.getElementById("column"); //HOLDS THE DOM NODES OF THE SELECTED COLUMN
const facingInput = document.getElementById("facing"); //HOLDS THE VALUE OF THE SELECTED FACING DIRECTION OF THE ROBOT
const submit = document.getElementById("submit"); //HOLDS
const rotateLeftBtn = document.getElementById("rotate-left-btn");
const rotateRightBtn = document.getElementById("rotate-right-btn");
const moveBtn = document.getElementById("move-btn");
const reportBtn = document.getElementById("report-btn");

let robotPosition = document.querySelector("td .robot");
let message = document.getElementById("message");


//IN-GAME VARIABLES
let selectedRow = rowInput.value;
let selectedColumn = columnInput.value;

let rowID = "";
let cellID = "";
let newRobot = "";


const xBoundary = [1, 2, 3, 4, 5];
const yBoundary = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

const yEastBoundary = [5, 10, 15, 20, 25];
const yWestBoundary = [1, 6, 11, 16, 21];
const yNorthBoundary = [21, 22, 23, 24, 25];
const ySouthBoundary = [1, 2, 3, 4, 5];


/********** FACTORY FUNCTION FOR OBJECTS (ROBOT AND WALL) **********/
//DEFINES THE ROBOT AND WALL OBJECTS
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


/************ GAME MECHANICS *********/
//DISABLES FACING DIRECTION WHEN A WALL IS BEING PLACED ON THE BOARD
placedObject.onchange = function () {
    facing.setAttribute("disabled", "disabled");
    if (this.value === Robot.type) {
      facing.removeAttribute("disabled");
    };
};


/*********** GAME FUNCTIONS ***********/

//GETS PROPERTY VALUES FOR ROBOT AND WALL OBJECTS
const setItemValues = (itemObject) => {
    itemObject.row = rowInput.value;
    itemObject.column = columnInput.value;
    itemObject.facing = facingInput.value;
};

//SETS CELL COORDINATES FOR PLACING OBJECTS ON THE BOARD
const setIDs = (row, column) => {
    rowID = "#row-" + row;
    cellID = `#cell-${(5 * (Number(row) - 1)) + Number(column)}`;
};

//CHANGES THE ARROW ICON TO SHOW ROBOT'S FACING DIRECTION AT ANY INSTANT
const setFacingDirection = (facing) => {
    let icons = "";
    if (facing === "North") {
        icons += "<i class='fa-solid fa-arrow-up' id='direction'></i>";
    } else if (facing === "East") {
        icons += "<i class='fa-solid fa-arrow-right' id='direction'></i>";
    } else if (facing === "South") {
        icons += "<i class='fa-solid fa-arrow-down' id='direction'></i>";
    } else {
        icons += "<i class='fa-solid fa-arrow-left' id='direction'></i>";
    };
    return icons;
};

//CREATES A NEW ROBOT IN AN EMPTY CELL
const createNewRobot = (facing) => {
    newRobot = document.querySelector(cellID);
    newRobot.classList.replace("empty-cell", "robot");
    newRobot.innerHTML = `<i class='fa-solid fa-robot fa-xl'></i>${setFacingDirection(facing)}`;
    robotPosition = newRobot;
};

//MOVES EXISTING ROBOT TO AN EMPTY CELL
const moveToNewCell = (facing) => {
    newRobot = document.querySelector(cellID);
    if (robotPosition !== newRobot) {
        robotPosition.innerHTML = "";
        robotPosition.classList.replace("robot", "empty-cell");
    };
    newRobot.classList.replace("empty-cell", "robot");
    newRobot.innerHTML = `<i class='fa-solid fa-robot fa-xl'></i>${setFacingDirection(facing)}`;
    robotPosition = newRobot;
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

    const newWall = document.querySelector(cellID);
    console.log(newWall);

    if (newWall.getAttribute("class") === "empty-cell") {
        newWall.classList.replace("empty-cell", "wall");
    } else if (newWall.getAttribute("class") === "robot") {
        message.innerText = `Row ${row}, column ${column} is not empty!`;
    };
};


//RESETS SELECT ELEMENTS VALUES
const resetElementValues = () => {
    placedObject.value = "Select Object";
    rowInput.value = "Select Row";
    columnInput.value = "Select Column";
    facingInput.value = "Choose Direction";
};

//ROTATES ROBOT 90 DEGREES TO A GIVEN DIRECTION
const rotateRobot = (rotation) => {
    const direction = document.getElementById("direction");

    if (direction !== null) {
        if (rotation === "Left") {
            if (Robot.facing === "North") {
                Robot.facing = "West";
                direction.classList.replace("fa-arrow-up", "fa-arrow-left");
            } else if (Robot.facing === "East") {
                Robot.facing = "North";
                direction.classList.replace("fa-arrow-right", "fa-arrow-up");
            } else if (Robot.facing === "South") {
                Robot.facing = "East";
                direction.classList.replace("fa-arrow-down", "fa-arrow-right");
            } else {
                Robot.facing = "South";
                direction.classList.replace("fa-arrow-left", "fa-arrow-down");
            };
        } else if (rotation === "Right") {
            if (Robot.facing === "North") {
                Robot.facing = "East";
                direction.classList.replace("fa-arrow-up", "fa-arrow-right");
            } else if (Robot.facing === "East") {
                Robot.facing = "South";
                direction.classList.replace("fa-arrow-right", "fa-arrow-down");
            } else if (Robot.facing === "South") {
                Robot.facing = "West";
                direction.classList.replace("fa-arrow-down", "fa-arrow-left");
            } else {
                Robot.facing = "North";
                direction.classList.replace("fa-arrow-left", "fa-arrow-up");
            };
        };
    };
};

//MOVES THE ROBOT ONE STEP TOWARDS ITS FACING DIRECTION
const moveRobot = (row, column) => {
    rowID = "#row-" + row;
    cellID = "#cell-" + column;

    if (robotPosition !== null) {
        if (newRobot === null) {
            newRobot = document.querySelector(cellID);
        };
        moveToNewCell(Robot.facing);
    };
    
};

//CALCULATES COORDINATES FOR MOVING THE ROBOT ONE STEP TOWARDS ITS FACING DIRECTION
const handleMovement = () => {

    let xCurrentPosition = Number(robotPosition.parentElement.getAttribute("id")[4]);
    let yCurrentPosition = Number(robotPosition.getAttribute("id").slice(5));
    let xNewPosition = 0;
    let yNewPosition = 0;

    if (xCurrentPosition && yCurrentPosition !== null) {
        if (Robot.facing === "North") {
            xNewPosition = xCurrentPosition + 1;
            yNewPosition = yCurrentPosition + 5;
            if ((xBoundary.includes(xNewPosition)) && (yBoundary.includes(yNewPosition))) {
                moveRobot(xNewPosition, yNewPosition);
            } else if (!yNorthBoundary.includes(yNewPosition)) {
                xNewPosition = 1;
                yNewPosition = yCurrentPosition - 20;
                moveRobot(xNewPosition, yNewPosition);
            };
        } else if (Robot.facing === "East") {
            xNewPosition = xCurrentPosition;
            yNewPosition = yCurrentPosition + 1;
            if (yBoundary.includes(yNewPosition)) {
                if (yEastBoundary.includes(yCurrentPosition)) {
                    yNewPosition = yCurrentPosition - 4;
                };
            } else {
                yNewPosition = yCurrentPosition - 4;
            };
            moveRobot(xNewPosition, yNewPosition);
        } else if (Robot.facing === "South") {
            xNewPosition = xCurrentPosition - 1;
            yNewPosition = yCurrentPosition - 5;
            if ((xBoundary.includes(xNewPosition)) && (yBoundary.includes(yNewPosition))) {
                moveRobot(xNewPosition, yNewPosition);
            } else if (!xBoundary.includes(xNewPosition)) {
                xNewPosition = 5;
                yNewPosition = yCurrentPosition + 20;
                moveRobot(xNewPosition, yNewPosition);
            };
        } else {
            xNewPosition = xCurrentPosition;
            yNewPosition = yCurrentPosition - 1;
            if (yBoundary.includes(yNewPosition)) {
                if (yWestBoundary.includes(yCurrentPosition)) {
                    yNewPosition = yCurrentPosition + 4;
                };
            } else {
                yNewPosition = yCurrentPosition + 4;
            };
            moveRobot(xNewPosition, yNewPosition);
        };
    };
}


//FIRES WHEN THE PLACE OBJECT BUTTON IS CLICKED. PLACES A ROBOT OR WALL ON THE BOARD
submit.addEventListener("click", function (e) {
    e.preventDefault();
    
    if (placedObject.value === Robot.type) {
        setItemValues(Robot);
        placeRobot(Robot.row, Robot.column, Robot.facing);
    } else if (placedObject.value === Wall.type) {
        setItemValues(Wall);
        placeWall(Wall.row, Wall.column)
    };

    resetElementValues();
});

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

//FIRES WHEN THE MOVE BUTTON IS CLICKED. MOVES THE ROBOT ONE STEP TOWARDS ITS FACING DIRECTION
moveBtn.addEventListener("click", function (e) {
    e.preventDefault();

    handleMovement();
});

//FIRES WHEN THE REPORT BUTTON IS CLICKED. OUTPUTS ROBOT COORDINATES AND FACING DIRECTION
reportBtn.addEventListener("click", function (e) {
    e.preventDefault();
    
    let xCurrentPosition = robotPosition.parentElement.getAttribute("id")[4];
    let yCurrentPosition = robotPosition.getAttribute("id").slice(5);

    const columNumber = (Number(yCurrentPosition) - ((Number(xCurrentPosition) - 1) * 5));

    message.innerText = `REPORTING: Robot is positioned at ${xCurrentPosition}, ${columNumber} ${Robot.facing}`;
});