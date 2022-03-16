const allCells = document.querySelectorAll("td");
let robotPosition = document.querySelector("td .robot");
const wallCell = document.querySelectorAll("td .wall");
const emptyCells = document.querySelector("td .empty-cell");
const placedItem = document.getElementById("place-item");
const rowInput = document.getElementById("row");
const columnInput = document.getElementById("column");
const facingInput = document.getElementById("facing");
const submit = document.getElementById("submit");




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
    const selectedDirection = facingInput.value;
    
    if (placedItem.value === "ROBOT") {
        placeRobot(selectedRow, selectedColumn, selectedDirection);
        
    }
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
            robotPosition = newRobot;
        };
    }
};






const setFacingDirection = (facing) => {
    let robotIcon = "";
    if (facing === "NORTH") {
        robotIcon += "<i class='fa-solid fa-arrow-up'></i>";
        console.log(robotIcon);
    } else if (facing === "EAST") {
        robotIcon += "<i class='fa-solid fa-arrow-right'></i>";
        console.log(robotIcon);
    } else if (facing === "SOUTH") {
        robotIcon += "<i class='fa-solid fa-arrow-down'></i>";
        console.log(robotIcon);
    } else {
        robotIcon += "<i class='fa-solid fa-arrow-left'></i>";
        console.log(robotIcon);
    };
    return robotIcon;
};