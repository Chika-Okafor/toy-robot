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
const xBoundary = getBoundary(1, numberOfRows); //GENERATES A RANGE OF NUMBERS FROM 1 TO THE TOTAL NUMBER OF ROWS ON THE BOARD
const yBoundary = getBoundary(1, numberOfCells); // GENERATES A RANGE OF NUMBERS FROM 1 TO TOTAL NUMBER OF CELLS IN ALL THE ROWS

const yEastBoundary = getFacingBoundary(numberOfColumns, numberOfCells, numberOfColumns); //GENERATES A LIST OF NUMBERS ON THE EAST-SIDE BOUNDARY OF THE BOARD
const yWestBoundary = getFacingBoundary(1, ((numberOfCells - numberOfColumns) + 1), 5); //GENERATES A LIST OF NUMBERS ON THE WEST-SIDE BOUNDARY OF THE BOARD
const yNorthBoundary = yBoundary.slice((numberOfCells - numberOfColumns), numberOfCells); //GENERATES A LIST OF NUMBERS ON THE NORTH-SIDE BOUNDARY OF THE BOARD
const ySouthBoundary = yBoundary.slice(0, numberOfColumns); //GENERATES A LIST OF NUMBERS ON THE SOUTH-SIDE BOUNDARY OF THE BOARD


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
    facingInput.setAttribute("disabled", "disabled"); //DISABLE FACING DIRECTION SELECT ELEMENT
    if (this.value === Robot.type) { //IF PLACED OBJECT IS A ROBOT:
        facingInput.removeAttribute("disabled"); //ENABLE FACING DIRECTION SELECT ELEMENT
    };
};


/*********** GAME FUNCTIONS ***********/

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
    if (facing === "North") { //IF ROBOT OBJECT FACES NORTH:
        icons += "<i class='fa-solid fa-arrow-up' id='direction'></i>"; //SET ARROW ICON TO FACE NORTH
    } else if (facing === "East") { //ELSE IF ROBOT OBJECT FACES EAST:
        icons += "<i class='fa-solid fa-arrow-right' id='direction'></i>"; //SET ARROW ICON TO FACE EAST
    } else if (facing === "South") { //ELSE IF ROBOT OBJECT FACES SOUTH:
        icons += "<i class='fa-solid fa-arrow-down' id='direction'></i>"; //SET ARROW ICON TO FACE SOUTH
    } else { //ELSE IF ROBOT OBJECT FACES WEST:
        icons += "<i class='fa-solid fa-arrow-left' id='direction'></i>"; //SET ARROW ICON TO FACE WEST
    };
    return icons;
};

//CREATES A NEW ROBOT IN AN EMPTY CELL
const createNewRobot = (facing) => {
    newRobot = document.querySelector(cellID); //SET THE PROPECTIVE CELL WHERE THE ROBOT IS TO BE PLACED

    if (newRobot.getAttribute("class") === "empty-cell") { //IF THE PROSPECTIVE CELL IS EMPTY:
        newRobot.classList.replace("empty-cell", "robot"); //ADD A ROBOT TO THE PROSPECTIVE CELL
        newRobot.innerHTML = `<i class='fa-solid fa-robot fa-xl'></i>${setFacingDirection(facing)}`; //SET THE FACING DIRECTION OF THE ROBOT
        robotPosition = newRobot; //SET THE PROSPECTIVE CELL POSITION AS THE ROBOT'S CURRENT POSITION
        message.innerHTML = `Android001 at your service!`; //OUTPUT THIS MESSAGE FOR THE USER IN THE TERMINAL
    } else if (newRobot.getAttribute("class") === "wall") { //ELSE IF THERE IS A WALL POSITIONED IN THE CELL:
        message.innerHTML = "Are you seriously trying to place me on a wall?!"; //OUTPUT THIS MESSAGE FOR THE USER IN THE TERMINAL
    };
};

//MOVES EXISTING ROBOT TO AN EMPTY CELL
const moveToNewCell = (facing) => {
    
    newRobot = document.querySelector(cellID); //SET THE PROPECTIVE CELL WHERE ROBOT IS TO BE MOVED

    
    if (newRobot.getAttribute("class") === "empty-cell") { //IF THE PROSPECTIVE CELL IS EMPTY:
        
        if (robotPosition !== newRobot) { //AND IF THE ROBOT'S CURRENT POSITION IS NOT THE SAME AS THE PROSPECTIVE CELL:
            //REMOVE THE ROBOT FROM IT'S CURRENT POSITION
            robotPosition.innerHTML = "";
            robotPosition.classList.replace("robot", "empty-cell");
        };
        newRobot.classList.replace("empty-cell", "robot"); //THEN PLACE THE ROBOT IN THE PROSPECTIVE CELL
        newRobot.innerHTML = `<i class='fa-solid fa-robot fa-xl'></i>${setFacingDirection(facing)}`; //SET THE FACING DIRECTION OF THE ROBOT
        robotPosition = newRobot; //SET THE PROSPECTIVE CELL POSITION AS THE ROBOT'S CURRENT POSITION
    } else if (newRobot.getAttribute("class") === "robot") { //ELSE IF THERE IS ALREADY A ROBOT IN THE PROSPECTIVE CELL:
        newRobot.innerHTML = `<i class='fa-solid fa-robot fa-xl'></i>${setFacingDirection(facing)}`; //UPDATE THE ROBOT'S FACING DIRECTION
        message.innerHTML = `Confirming new facing direction...<br />`; //OUTPUT THIS MESSAGE FOR THE USER IN THE TERMINAL
    } else if (newRobot.getAttribute("class") === "wall") { //ELSE IF THERE IS A WALL IN THE PROSPECTIVE CELL:
        message.innerHTML = "Ran into a wall. Just great! <br />"; ////OUTPUT THIS MESSAGE FOR THE USER IN THE TERMINAL
    };
    //OUTPUT THIS MESSAGE FOR THE USER IN THE TERMINAL
    message.innerHTML += `Android in position. Awaiting new orders!`;
};

//HANDLES PLACING OF ROBOT OBJECT ON THE BOARD
const placeRobot = (row, column, facing) => {
    setIDs(row, column); //SET THE SPECIFIC ROW AND CELL ID OF THE PROSPECTIVE CELL
    
    if (robotPosition === null) { //IF THERE IS NO ROBOT ON THE BOARD:
        createNewRobot(facing); //CREATE A NEW ROBOT
    } else { //ELSE:
        moveToNewCell(facing); //MOVE THE EXISTING ROBOT TO THE PROSPECTIVE CELL
    };
};

//HANDLES PLACING OF WALL OBJECTS ON THE BOARD
const placeWall = (row, column) => {
    setIDs(row, column); //SET THE SPECIFIC ROW AND CELL ID OF THE PROSPECTIVE CELL

    const newWall = document.querySelector(cellID); //SET THE PROPECTIVE CELL WHERE THE WALL IS TO BE PLACED

    if (newWall.getAttribute("class") === "empty-cell") { //IF THE PROSPECTIVE CELL IS EMPTY:
        newWall.classList.replace("empty-cell", "wall"); //PLACE A WALL IN THE CELL
    } else if (newWall.getAttribute("class") === "robot") { //ELSE IF THE IS A ROBOT IN THE CELL:
        message.innerHTML = `Row ${row}, column ${column} is not empty!`; //OUTPUT THIS MESSAGE FOR THE USER IN THE TERMINAL
    };
    
    //ALSO, IF THERE IS A ROBOT ON THE BOARD:
    if (robotPosition !== null) {
        //OUTPUT THIS MESSAGE FOR THE USER IN THE TERMINAL
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
    message.innerHTML = ""; //EMPTY THE MESSAGE TERMINAL
    const direction = document.getElementById("direction"); //SET THE ROBOT'S FACING DIRECTION HTML PARTICULARS
    
    if (direction !== null) { //IF THE ROBOT HAS FACING DIRECTION INFORMATION IN THE HTML:
        if (rotation === "Left") { //AND IF THE TARGET DESTINATION IS LEFT:
            if (Robot.facing === "North") { //AND THE ROBOT IS FACING NORTH:
                Robot.facing = "West"; //SET THE ROBOT TO FACE WEST
                direction.classList.replace("fa-arrow-up", "fa-arrow-left"); //UPDATE ITS HTML PARTICULARS TO REFLECT THE CHANGE
            } else if (Robot.facing === "East") { //ELSE IF THE ROBOT IS FACING EAST
                Robot.facing = "North"; //SET THE ROBOT TO FACE NORTH
                direction.classList.replace("fa-arrow-right", "fa-arrow-up");
            } else if (Robot.facing === "South") { //ELSE IF THE ROBOT IS FACING SOUTH
                Robot.facing = "East"; //SET THE ROBOT TO FACE EAST
                direction.classList.replace("fa-arrow-down", "fa-arrow-right"); //UPDATE ITS HTML PARTICULARS TO REFLECT THE CHANGE
            } else { //ELSE IF THE ROBOT IS FACING
                Robot.facing = "South"; //SET THE ROBOT TO FACE SOUTH
                direction.classList.replace("fa-arrow-left", "fa-arrow-down"); //UPDATE ITS HTML PARTICULARS TO REFLECT THE CHANGE
            };
            message.innerHTML = `Affirmative! Turning left...`; //OUTPUT THIS MESSAGE FOR THE USER IN THE TERMINAL
        } else if (rotation === "Right") { //ELSE IF THE TARGET DESTINATION IS LEFT:
            
            if (Robot.facing === "North") { //ELSE IF THE ROBOT IS FACING NORTH
                Robot.facing = "East"; //SET THE ROBOT TO FACE EAST
                direction.classList.replace("fa-arrow-up", "fa-arrow-right"); //UPDATE ITS HTML PARTICULARS TO REFLECT THE CHANGE
            } else if (Robot.facing === "East") { //ELSE IF THE ROBOT IS FACING EAST
                Robot.facing = "South"; //SET THE ROBOT TO FACE SOUTH
                direction.classList.replace("fa-arrow-right", "fa-arrow-down"); //UPDATE ITS HTML PARTICULARS TO REFLECT THE CHANGE
            } else if (Robot.facing === "South") { //ELSE IF THE ROBOT IS FACINGSOUTH
                Robot.facing = "West"; //SET THE ROBOT TO FACE WEST
                direction.classList.replace("fa-arrow-down", "fa-arrow-left"); //UPDATE ITS HTML PARTICULARS TO REFLECT THE CHANGE
            } else { //ELSE IF THE ROBOT IS FACING WEST
                Robot.facing = "North"; //SET THE ROBOT TO FACE NORTH
                direction.classList.replace("fa-arrow-left", "fa-arrow-up"); //UPDATE ITS HTML PARTICULARS TO REFLECT THE CHANGE
            };
            message.innerHTML = `Affirmative! Turning right...`; //OUTPUT THIS MESSAGE FOR THE USER IN THE TERMINAL
        };
    };
};

//MOVES THE ROBOT ONE STEP TOWARDS ITS FACING DIRECTION
const moveRobot = (row, column) => {
    rowID = "#row-" + row; //SET ROW ID FOR THE PROSPECTIVE CELL
    cellID = "#cell-" + column; //SET COLUMNID FOR THE PREOSPECTIVE CELL
    message.innerHTML = `New coordinates confirmed!<br />`; //OUTPUT THIS MESSAGE FOR THE USER IN THE TERMINAL

    if (robotPosition !== null) { //IF THERE ARE NO ROBOTS ON THE BOARD:
        if (newRobot === null) { //AND IF A PROSPECTIVE CELL HAS NOT BEEN SET
            newRobot = document.querySelector(cellID); //SET THE PROSPECTIVE CELL WITH THE GIVEN ID
        };
        moveToNewCell(Robot.facing); //MOVE ROBOT TO THE PROSPECTIVE CELL
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
            //OUTPUT THIS MESSAGE FOR THE USER IN THE TERMINAL
            message.innerHTML = "Warning: Data incomplete! Provide valid data!!";
        };
    } else if (placedObject.value === Wall.type) {
        if ((placedObject.value !== defaultObject) && (rowInput.value !== defaultRow) && (columnInput.value !== defaultColumn)) {
            setItemValues(Wall);
            placeWall(Wall.row, Wall.column)
        } else {
        //OUTPUT THIS MESSAGE FOR THE USER IN THE TERMINAL
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
    //OUTPUT THIS MESSAGE FOR THE USER IN THE TERMINAL
    message.innerHTML = `ROUTINE REPORT: Android is positioned at ${xCurrentPosition}, ${columNumber} ${Robot.facing}`;
});