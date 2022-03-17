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
    const selectedRow = rowInput.value;
    const selectedColumn = columnInput.value;
    robotFacingDirection = facingInput.value;
    
    if (placedItem.value === "ROBOT") {
        placeRobot(selectedRow, selectedColumn, robotFacingDirection);
        
    } else if (placedItem.value === "WALL") {
        placeWall(selectedRow, selectedColumn)
    };
});


const placeRobot = (row, column, facing) => {
    const rowID = `#row-${Number(row)}`;
    const cellID = `#cell-${(5 * (Number(row) - 1)) + Number(column)}`;

    if (robotPosition === null) {
        const newRobot = document.querySelector(`${rowID} ${cellID}`);
        console.log(row, column);
        console.log(robotPosition);
        console.log(newRobot);
        newRobot.classList.replace("empty-cell", "robot");
        newRobot.innerHTML = `<i class='fa-solid fa-robot fa-xl'></i>${setFacingDirection(facing)}`;
        console.log(robotFacingDirection);
        robotPosition = newRobot;
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
        };
    }
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