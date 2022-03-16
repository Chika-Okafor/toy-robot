const allCells = document.querySelectorAll("td");
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
        placeRobot(selectedRow, selectedColumn);
        //setFacingDirection(selectedDirection);
    }
   /** const changeBg = document.querySelector("#row-1 #col-1");
    changeBg.classList.remove("empty-cell");
    changeBg.classList.add("robot");
    console.log(changeBg);**/
});


const placeRobot = (row, column) => {
    const rowID = `#row-${Number(row)}`;
    const cellID = `#cell-${(5 * (Number(row) - 1)) + Number(column)}`;
    let robotPosition = document.querySelector("td .robot");
    
    if (robotPosition === null) {
        const newRobot = document.querySelector(`${rowID} ${cellID}`);
        console.log(row, column);
        console.log(robotPosition);
        console.log(newRobot);
        newRobot.classList.replace("empty-cell", "robot");
        robotPosition = newRobot;
        //newRobot.classList.add("fa-solid fa-robot");
    } else if (robotPosition !== null) {
        newRobot = document.querySelector(`${rowID} ${cellID}`);
        console.log(row, column);
        console.log(robotPosition);
        console.log(newRobot);

        if (robotPosition !== newRobot) {
            robotPosition.classList.replace("robot", "empty-cell");
            newRobot.classList.replace("empty-cell", "robot");
            robotPosition = newRobot;
            //newRobot.classList.add("fa-solid fa-robot");
        }
    }
    
    

    
};



const setFacingDirection = (facing) => {
    if (facing === "NORTH") {
        robotCell.classList.add("fa-solid fa-arrow-up")
    } else if (facing === "EAST") {
        robotCell.classList.add("fa-solid fa-arrow-right")
    } else if (facing === "SOUTH") {
        robotCell.classList.add("fa-solid fa-arrow-down")
    } else {
        robotCell.classList.add("fa-solid fa-arrow-left")
    };
};