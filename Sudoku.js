// Predefined Sudoku boards of varying difficulty: each contains a starting board and the solved board.
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3---",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];

// Global variables for game state management.
var timer; 
var timeLeft;
var selectedNum;
var selectedTile;
var deselect;

// Sets up the game when the window loads, adding necessary event listeners.
window.onload = function() {
    id("start-btn").addEventListener("click", startGame);
    // Adds click event listeners to all the number buttons.
    for(let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].addEventListener("click", function() {
            if (!deselect) {
                if(this.classList.contains("selected")) {
                    this.classList.remove("selected");
                    selectedNum = null;
                } else {
                    for (let i = 0; i < 9; i++){
                        id("number-container").children[i].classList.remove("selected");
                    }

                    this.classList.add("selected");
                    selectedNum = this;
                    updateMove();
                }
            }
        });
    }
}

// Converts time in seconds to a mm:ss format.
function timeConversion(time) {
    let minutes = Math.floor(time / 60);
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    let seconds = time % 60;
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
}

// Manages the countdown timer for the game.
function startTimer() {
    // Sets the initial time based on the difficulty level selected.
    if(id("time-1").checked) {
        timeLeft = 180;
    } else if (id("time-2").checked) {
        timeLeft = 300;
    } else {
        timeLeft = 600;
    }

    id("timer").textContent = timeConversion(timeLeft);

    timer = setInterval(function() {
        timeLeft--;
        // Ends the game when the timer runs out.
        if (timeLeft === 0) {
            endGame();
        }
        id("timer").textContent = timeConversion(timeLeft);
    }, 1000)
}

// Starts a new game, setting up the board and starting the timer.
function startGame() {
    id("board").textContent = "";
    let board;
    // Chooses the correct difficulty level based on user selection.
    if(id("diff-1").checked){
        board = easy[0];
    } else if (id("diff-2").checked){
        board = medium[0]
    }
    else if (id("diff-3").checked){
        board = hard[0]
    }

    deselect = false;
    generateBoard(board);
    startTimer();

    // Sets the theme based on user preference.
    if (id("theme-1").checked){
        qs("body").classList.remove("Inverse");
    } else {
        qs("body").classList.add("Inverse");
    }

    id("number-container").classList.remove("hidden");
}

// Updates the game state when a move is made.
function updateMove() {
    if (selectedTile && selectedNum){
        selectedTile.textContent = selectedNum.textContent;

        // Checks if the move is correct.
        if(checkCorrect(selectedTile)){
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");

            selectedNum = null;
            selectedTile = null;

            // Checks if the game is completed.
            if (checkDone()) {
                endGame();
            }

        } else {
            // Temporarily disables selection after an incorrect move.
            deselect = true;
            selectedTile.classList.add("incorrect");

            setTimeout(function() {
                deselect = false;
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");

                selectedTile.textContent = "";
                selectedTile = null;
                selectedNum = null;

            }, 1000)
        }
    }
}

// Generates the Sudoku board tiles dynamically.
function generateBoard(board) {
    clearPrevious();

    let idCount = 0;

    for (let i = 0; i < 81; i++) {
        let tile = document.createElement("p");
        // Fills the tile with a number if the board string has a number at that position.
        if (board.charAt(i) != '-') {
            tile.textContent = board.charAt(i);
        } else {
            // Adds click event listener to empty tiles for number placement.
            tile.addEventListener("click", function(){
                if(!deselect){
                    if(tile.classList.contains("selected")) {
                        tile.classList.remove("selected");
                        selectedTile = null;
                    } else {
                        for (let i = 0; i < 81; i++){
                            qsa(".tile")[i].classList.remove("selected");
                        }

                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }
                }
            });
        }

        tile.id = idCount;
        idCount++;

        tile.classList.add("tile");
        // Adds visual borders to certain tiles for better grid separation.
        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
            tile.classList.add("bottomBorder");
        }
        if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
            tile.classList.add("rightBorder");
        }
        id("board").appendChild(tile);
    }
}

// Checks if all tiles are filled, indicating the game might be complete.
function checkDone() {
    let tiles = qsa(".tile");
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].textContent === "") {
            return false;
        }
    }
    return true;
}

// Checks if the placed number matches the correct number from the solution.
function checkCorrect(tile) {
    let solution;
    if( id("diff-1").checked) {
        solution = easy[1];
    } else if (id("diff-2").checked) {
        solution = medium[1];
    } else {
        solution = hard[1]
    }

    if(solution.charAt(tile.id) === tile.textContent) {
        return true;
    } else {
        return false
    }

}

// Clears the previous game's data, removing all tiles and resetting the timer.
function clearPrevious(){
    let tiles = qsa(".tile");

    for (let i = 0; i < tiles.length; i++){
        tiles[i].remove();
    }

    if (timer) {
        clearTimeout(timer);
    }

    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected");
    }

    selectedTile = null;
    selectedNum = null;

}

// Handles the end of the game, displaying appropriate messages based on the result.
function endGame() {
    deselect = true; 
    clearTimeout(timer);
    if (timeLeft === 0) {
        id("board").textContent = "You Lost!";
    } else {
        id("board").textContent = "You Won!";
    }
}

// Shortcuts for common DOM queries.
function qs(selector){
    return document.querySelector(selector);
}

function qsa(selector){
    return document.querySelectorAll(selector);
}

function id(id){
    return document.getElementById(id);
}
