const allCells = document.querySelectorAll("td");
let robotPosition = document.querySelector("td .robot");
const wallCell = document.querySelectorAll("td .wall");
const emptyCells = document.querySelector("td .empty-cell");
const placedItem = document.getElementById("place-item");
const rowInput = document.getElementById("row");
const columnInput = document.getElementById("column");
const facingInput = document.getElementById("facing");
const submit = document.getElementById("submit");
const rotateLeftBtn = document.getElementById("rotate-left-btn");
const rotateRightBtn = document.getElementById("rotate-right-btn");
const moveBtn = document.getElementById("move-btn");


let selectedRow = rowInput.value;
let selectedColumn = columnInput.value;
let robotFacingDirection = "";

//ENABLES SELECT ELEMENT FOR FACING DIRECTION WHEN PLACING A ROBOT ON THE BOARD
placedItem.onchange = function () {
    facing.setAttribute("disabled", "disabled");
    if (this.value === "ROBOT") {
      facing.removeAttribute("disabled");
    };
};

submit.addEventListener("click", function (e) {
    e.preventDefault();
    selectedRow = rowInput.value;
    selectedColumn = columnInput.value;
    robotFacingDirection = facingInput.value;
    
    if (placedItem.value === "ROBOT") {
        placeRobot(selectedRow, selectedColumn, robotFacingDirection);
        
    } else if (placedItem.value === "WALL") {
        placeWall(selectedRow, selectedColumn)
    };
});


const placeRobot = (row, column, facing) => {
    const rowID = "#row-" + row;
    const cellID = `#cell-${(5 * (Number(row) - 1)) + Number(column)}`;

    if (robotPosition === null) {
        let newRobot = document.querySelector(`${rowID} ${cellID}`);
        console.log(row, column);
        console.log(robotPosition);
        console.log(newRobot);
        newRobot.classList.replace("empty-cell", "robot");
        newRobot.innerHTML = `<i class='fa-solid fa-robot fa-xl'></i>${setFacingDirection(facing)}`;
        console.log(robotFacingDirection);
        robotPosition = newRobot;
        console.log(robotPosition);
    } else if (robotPosition !== null) {
        newRobot = document.querySelector(`${rowID} ${cellID}`);
        console.log(row, column);
        console.log(robotPosition);
        console.log(newRobot);

        if (robotPosition !== newRobot) {
            robotPosition.classList.replace("robot", "empty-cell");
            robotPosition.innerHTML = "";
            newRobot.classList.replace("empty-cell", "robot");
            newRobot.innerHTML = `<i class='fa-solid fa-robot fa-xl'></i>${setFacingDirection(facing)}`;
            console.log(robotFacingDirection);
            robotPosition = newRobot;
            console.log(robotPosition);
        };
    };
};


const placeWall = (row, column) => {
    const rowID = `#row-${Number(row)}`;
    const cellID = `#cell-${(5 * (Number(row) - 1)) + Number(column)}`;

    const checkPoint = document.querySelector(`${rowID} ${cellID}`);
    const wallClassName = checkPoint.getAttribute("class");
    console.log(checkPoint);

    if (checkPoint.getAttribute("class") === "empty-cell") {
        checkPoint.classList.replace("empty-cell", "wall");
        console.log(checkPoint);
    } else if (checkPoint.getAttribute("class") === "robot") {
        message = `there is a robot currently on row ${row}, column ${column}`;
    }
};


rotateLeftBtn.addEventListener("click", function (e) {
    e.preventDefault();
    
    const direction = document.getElementById("direction");

    if (direction !== null) {
        if (robotFacingDirection === "NORTH") {
            console.log(robotFacingDirection);
            robotFacingDirection = "WEST";
            direction.classList.replace("fa-arrow-up", "fa-arrow-left");
            console.log(robotFacingDirection);
        } else if (robotFacingDirection === "EAST") {
            console.log(robotFacingDirection);
            robotFacingDirection = "NORTH";
            direction.classList.replace("fa-arrow-right", "fa-arrow-up");
            console.log(robotFacingDirection);
        } else if (robotFacingDirection === "SOUTH") {
            console.log(robotFacingDirection);
            robotFacingDirection = "EAST";
            direction.classList.replace("fa-arrow-down", "fa-arrow-right");
            console.log(robotFacingDirection);
        } else {
            console.log(robotFacingDirection);
            robotFacingDirection = "SOUTH";
            direction.classList.replace("fa-arrow-left", "fa-arrow-down");
            console.log(robotFacingDirection);
        };
    };
    
    
});

rotateRightBtn.addEventListener("click", function (e) {
    e.preventDefault();
    
    const direction = document.getElementById("direction");

    if (direction !== null) {
        if (robotFacingDirection === "NORTH") {
            console.log(robotFacingDirection);
            robotFacingDirection = "EAST";
            direction.classList.replace("fa-arrow-up", "fa-arrow-right");
            console.log(robotFacingDirection);
        } else if (robotFacingDirection === "EAST") {
            console.log(robotFacingDirection);
            robotFacingDirection = "SOUTH";
            direction.classList.replace("fa-arrow-right", "fa-arrow-down");
            console.log(robotFacingDirection);
        } else if (robotFacingDirection === "SOUTH") {
            console.log(robotFacingDirection);
            robotFacingDirection = "WEST";
            direction.classList.replace("fa-arrow-down", "fa-arrow-left");
            console.log(robotFacingDirection);
        } else {
            console.log(robotFacingDirection);
            robotFacingDirection = "NORTH";
            direction.classList.replace("fa-arrow-left", "fa-arrow-up");
            console.log(robotFacingDirection);
        };
    };
    
    
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
    const rowID = "#row-" + row;
    const cellID = "#cell-" + column;

    if (robotPosition === null) {
        let newRobot = document.querySelector(`${rowID} ${cellID}`);
        console.log(row, column);
        console.log(robotPosition);
        console.log(newRobot);
        newRobot.classList.replace("empty-cell", "robot");
        newRobot.innerHTML = `<i class='fa-solid fa-robot fa-xl'></i>${setFacingDirection(facing)}`;
        console.log(robotFacingDirection);
        robotPosition = newRobot;
        console.log(robotPosition);
    } else if (robotPosition !== null) {
        newRobot = document.querySelector(`${rowID} ${cellID}`);
        console.log(row, column);
        console.log(robotPosition);
        console.log(newRobot);

        if (robotPosition !== newRobot) {
            robotPosition.classList.replace("robot", "empty-cell");
            robotPosition.innerHTML = "";
            newRobot.classList.replace("empty-cell", "robot");
            newRobot.innerHTML = `<i class='fa-solid fa-robot fa-xl'></i>${setFacingDirection(facing)}`;
            console.log(robotFacingDirection);
            robotPosition = newRobot;
            console.log(robotPosition);
        };
    };
};


const checkBoardBoundaries = (boardBoundary, xCoordinate, yCoordinate, robotFacingDirection) => {
    if (boardBoundary.includes(Number(xCoordinate)) && boardBoundary.includes(Number(yCoordinate))) {
        moveRobot(xCoordinate, yCoordinate, robotFacingDirection);
    };
};


moveBtn.addEventListener("click", function (e) {
    e.preventDefault();
    
    let xCoordinate = robotPosition.parentElement.getAttribute("id")[4];
    console.log(xCoordinate);
    let yCoordinate = robotPosition.getAttribute("id").slice(5);
    console.log(yCoordinate);
    console.log(robotFacingDirection);
    const xBoundary = [1, 2, 3, 4, 5];
    let yBoundary = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

    if (xCoordinate && yCoordinate !== null) {
        if (robotFacingDirection === "NORTH") {
            xCoordinate = `${Number(xCoordinate) + 1}`;
            yCoordinate = `${Number(yCoordinate) + 5}`;
            if (xBoundary.includes(Number(xCoordinate)) && yBoundary.includes(Number(yCoordinate))) {
                moveRobot(xCoordinate, yCoordinate, robotFacingDirection);
            };
        } else if (robotFacingDirection === "EAST") {
            yCoordinate = `${Number(yCoordinate) + 1}`;
            yBoundary = [2, 3, 4, 5, 7, 8, 9, 10, 12, 13, 14, 15, 17, 18, 19, 20, 22, 23, 24, 25];
            if (xBoundary.includes(Number(xCoordinate)) && yBoundary.includes(Number(yCoordinate))) {
                moveRobot(xCoordinate, yCoordinate, robotFacingDirection);
            };
        } else if (robotFacingDirection === "SOUTH") {
            xCoordinate = `${Number(xCoordinate) - 1}`;
            yCoordinate = `${Number(yCoordinate) - 5}`;
            if (xBoundary.includes(Number(xCoordinate)) && yBoundary.slice().includes(Number(yCoordinate))) {
                moveRobot(xCoordinate, yCoordinate, robotFacingDirection);
            };
        } else {
            yCoordinate = `${Number(yCoordinate) - 1}`;
            yBoundary = [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24];
            if (xBoundary.includes(Number(xCoordinate)) && yBoundary.includes(Number(yCoordinate))) {
                moveRobot(xCoordinate, yCoordinate, robotFacingDirection);
            };
        };
    };
});




const setFacingDirection = facing => {
    let robotIcon = "";
    if (facing === "NORTH") {
        robotIcon += "<i class='fa-solid fa-arrow-up' id='direction'></i>";
        console.log(robotIcon);
    } else if (facing === "EAST") {
        robotIcon += "<i class='fa-solid fa-arrow-right' id='direction'></i>";
        console.log(robotIcon);
    } else if (facing === "SOUTH") {
        robotIcon += "<i class='fa-solid fa-arrow-down' id='direction'></i>";
        console.log(robotIcon);
    } else {
        robotIcon += "<i class='fa-solid fa-arrow-left' id='direction'></i>";
        console.log(robotIcon);
    };
    return robotIcon;
};