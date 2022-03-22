/************************** VARIABLES *********************/
//VARIABLES FOR SELECT ELEMENTS
const select = document.querySelectorAll("select"); //ALL HTML SELECT ELEMENTS FOR PLACING OBJECTS ON THE BOARD
const placedObject = document.getElementById("object"); //HTML SELECT ELEMENT FOR TYPE OF OBJECT
const rowInput = document.getElementById("row"); //HTML SELECT ELEMENT FOR ROW TO PLACE OBJECT
const columnInput = document.getElementById("column"); //HTML SELECT ELEMENT FOR COLUMN TO PLACE OBJECT
const facingInput = document.getElementById("facing"); //HTML SELECT ELEMENT FOR FACING DIRECTION OF ROBOT

//VARIABLES FOR HTML BUTTONS
const submit = document.getElementById("submit"); //HTML BUTTON FOR PLACING AN OBJECT
const rotateLeftBtn = document.getElementById("rotate-left-btn"); //HTML BUTTON FOR ROTATING ROBOT 90 DEGREES TO THE LEFT
const rotateRightBtn = document.getElementById("rotate-right-btn"); //HTML BUTTON FOR ROTATING ROBOT 90 DEGREES TO THE RIGHT
const moveBtn = document.getElementById("move-btn"); //HTML BUTTON TFOR MOVING ROBOT ONE CELL TOWARD FACING DIRECTION
const reportBtn = document.getElementById("report-btn"); //HTML BUTTON OUTPUTING ROBOT COORDINATES ON THE UI

//VARIABLES FOR CHANGEABLE HTML DATA
let robotPosition = document.querySelector("td .robot"); //CELL WHERE ROBOT IS CURRENTLY PLACED
let message = document.getElementById("message"); //MESSAGE TERMINAL FOR RENDERING FEEDBACK TO USER

//INITIALISING EMPTY VARIABLES FOR DOM MANIPULATION
let rowID = ""; //WILL HOLD THE HTML ID OF A GIVEN CELL
let cellID = ""; //WILL HOLD THE CELL ID OF A GIVEN CELL
let newRobot = ""; //WILL BE USED TO COMPARE CURRENT AND PROSPECTIVE ROBOT CELL POSITIONS

//DEFAULT VALUES FOR HTML SELECT VALUES
const defaultObject = "Select Object"; //DEFAULT VALUE FOR OBJECT
const defaultRow = "Select Row"; //DEFAULT VALUE FOR ROW
const defaultColumn = "Select Column"; //DEFAULT VALUE FOR COLUMN
const defaultFacing = "Choose Direction"; //DEFAULT VALUE FOR FACING DIRECTION


/******************************** SETTING GAME BOARD BOUNDARIES ***************************/

/*  TABULAR REPRESENTATION OF THE GAME BOARD AND ITS COORDINATES

THERE ARE FIVE ROWS WITH EACH HOLDING FIVE CELLS ADDING UP TO A TOTAL OF 25 CELLS WITH UNIQUE IDS.
ROBOT IS REQUIRED TO DISAPPEAR FROM ANY END OF THE CELL AND APPER ON IT'S OPPOSITE END, HENCE THE 
NEED FOR A STABLE MATH-BASED COORDINATE SYSTEM.
THIS WILL MAKE IT EASIER TO CHANGE THE BOARD SIZE WITH LESS EFFORT

        CELL ROWS       CELL IDS

        5               21 22 23 24 25
        4               16 17 18 19 20
        3               11 12 13 14 15
        2               6  7  8  9  10
        1               1  2  3  4  5

*/


//RETURNS A RANGE OF NUMBERS FROM THE START TO THE END VARIABLE
const getBoundary = (start, end) => {
    range = [...Array(end - start + 1).keys()].map(x => x + start);
    return range;
};

//RETURNS A RANGE OF NUMBERS FROM THE START VARIABLE, SKIPPING A STEP VALUE OF NUMBERS, AND ENDING WITH THE END NUMBER
const getFacingBoundary = (start, end, step) => {
    const arrayLength = Math.floor(((end - start) / step)) + 1;
    const range = [...Array(arrayLength).keys()].map(x => (x * step) + start);
    return range;
};

//BOARD SIZE SETTINGS
const numberOfRows = 5; //NUMBER OF ROWS ON THE BOARD
const numberOfColumns = 5; //NUMBER OF COLUMNS ON THE BOARD
const numberOfCells = numberOfRows * numberOfColumns; //CALCULATES TOTAL CELLS ON THE BOARD GIVEN NUMBER OF ROWS AND COLUMNS

//BOUNDARIES FOR ROWS AND COLUMNS
const xBoundary = getBoundary(1, numberOfRows);
const yBoundary = getBoundary(1, numberOfCells);

const yEastBoundary = getFacingBoundary(numberOfColumns, numberOfCells, numberOfColumns); //EASTERN BOUNDARY CELL IDS
const yWestBoundary = getFacingBoundary(1, ((numberOfCells - numberOfColumns) + 1), 5); //WESTERN BOUNDARY CELL IDS
const yNorthBoundary = yBoundary.slice((numberOfCells - numberOfColumns), numberOfCells); //NORTHERN BOUNDARY CELL IDS
const ySouthBoundary = yBoundary.slice(0, numberOfColumns); //SOUTHERN BOUNDARY CELL IDS


/********************* FACTORY FUNCTION FOR OBJECTS (ROBOT AND WALL) ***********************/
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


/********************************** GAME MECHANICS ********************************************/
//DISABLES FACING DIRECTION WHEN A WALL IS BEING PLACED ON THE BOARD
placedObject.onchange = function () {
    facingInput.setAttribute("disabled", "disabled");
    if (this.value === Robot.type) {
        facingInput.removeAttribute("disabled");
    };
};


/*********************************************** GAME FUNCTIONS *********************************/

//SETS PROPERTY VALUES FOR ROBOT AND WALL OBJECTS FROM HTML SELECT ELEMENT VALUES
const setItemValues = (itemObject) => {
    itemObject.row = rowInput.value;
    itemObject.column = columnInput.value;
    itemObject.facing = facingInput.value;
};

//CONCATENATES VALUES FOR ROW ID AND CELL ID TO TARGET A SPECIFIC CELL
const setIDs = (row, column) => {
    rowID = "#row-" + row;
    cellID = `#cell-${(5 * (Number(row) - 1)) + Number(column)}`;
};

//TOGGLES THE ARROW ICON TO SHOW ROBOT'S FACING DIRECTION AT ANY INSTANT
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

    if (newRobot.getAttribute("class") === "empty-cell") {
        newRobot.classList.replace("empty-cell", "robot");
        newRobot.innerHTML = `<i class='fa-solid fa-robot fa-xl'></i>${setFacingDirection(facing)}`;
        robotPosition = newRobot;
        message.innerHTML = `Android001 at your service!`;
    } else if (newRobot.getAttribute("class") === "wall") {
        message.innerHTML = "Are you seriously trying to place me on a wall?!";
    };
};

//MOVES EXISTING ROBOT TO AN EMPTY CELL
const moveToNewCell = (facing) => {
    newRobot = document.querySelector(cellID);

    if (newRobot.getAttribute("class") === "empty-cell") {
        if (robotPosition !== newRobot) {
            robotPosition.innerHTML = "";
            robotPosition.classList.replace("robot", "empty-cell");
        };
        newRobot.classList.replace("empty-cell", "robot");
        newRobot.innerHTML = `<i class='fa-solid fa-robot fa-xl'></i>${setFacingDirection(facing)}`;
        robotPosition = newRobot;
    } else if (newRobot.getAttribute("class") === "robot") {
        newRobot.innerHTML = `<i class='fa-solid fa-robot fa-xl'></i>${setFacingDirection(facing)}`;
        message.innerHTML = `Confirming new facing direction...<br />`;
    } else if (newRobot.getAttribute("class") === "wall") {
        message.innerHTML = "Ran into a wall. Just great! <br />";
    };
    message.innerHTML += `Android in position. Awaiting new orders!`;
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

    if (newWall.getAttribute("class") === "empty-cell") {
        newWall.classList.replace("empty-cell", "wall");
    } else if (newWall.getAttribute("class") === "robot") {
        message.innerHTML = `Row ${row}, column ${column} is not empty!`;
    };
    if (robotPosition !== null) {
        message.innerHTML = `Detecting a new wall at row ${row}, column ${column}!`;
    };
};


//RESETS SELECT ELEMENTS VALUES
const resetElementValues = () => {
    placedObject.value = defaultObject;
    rowInput.value = defaultRow;
    columnInput.value = defaultColumn;
    facingInput.value = defaultFacing;
};

//ROTATES ROBOT 90 DEGREES TO A GIVEN DIRECTION
const rotateRobot = (rotation) => {
    message.innerHTML = "";
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
            message.innerHTML = `Affirmative! Turning left...`;
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
            message.innerHTML = `Affirmative! Turning right...`;
        };
    };
};

//MOVES THE ROBOT ONE STEP TOWARDS ITS FACING DIRECTION
const moveRobot = (row, column) => {
    rowID = "#row-" + row;
    cellID = "#cell-" + column;
    message.innerHTML = `New coordinates confirmed!<br />`;

    if (robotPosition !== null) {
        if (newRobot === null) {
            newRobot = document.querySelector(cellID);
        };
        moveToNewCell(Robot.facing);
    };
};

//CALCULATES COORDINATES FOR MOVING THE ROBOT ONE STEP TOWARDS ITS FACING DIRECTION
const handleMovement = () => {
    message.innerHTML = "";
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


/*********** GAME BUTTONS ***********/
//FIRES WHEN THE PLACE OBJECT BUTTON IS CLICKED. PLACES A ROBOT OR WALL ON THE BOARD
submit.addEventListener("click", function (e) {
    e.preventDefault();
    message.innerHTML = "";
    if (placedObject.value === Robot.type) {
        if ((placedObject.value !== defaultObject) && (rowInput.value !== defaultRow) && (columnInput.value !== defaultColumn) && (facingInput.value != defaultFacing)) {
            setItemValues(Robot);
            placeRobot(Robot.row, Robot.column, Robot.facing);
        } else {
            message.innerHTML = "Warning: Data incomplete! Provide valid data!!";
        };
    } else if (placedObject.value === Wall.type) {
        if ((placedObject.value !== defaultObject) && (rowInput.value !== defaultRow) && (columnInput.value !== defaultColumn)) {
            setItemValues(Wall);
            placeWall(Wall.row, Wall.column)
        } else {
        message.innerHTML = "Oops! And the walls came Tumbling down!!!";
        };
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
    message.innerHTML = "";
    let xCurrentPosition = robotPosition.parentElement.getAttribute("id")[4];
    let yCurrentPosition = robotPosition.getAttribute("id").slice(5);
    const columNumber = (Number(yCurrentPosition) - ((Number(xCurrentPosition) - 1) * 5));
    message.innerHTML = `ROUTINE REPORT: Android is positioned at ${xCurrentPosition}, ${columNumber} ${Robot.facing}`;
});