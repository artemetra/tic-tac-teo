const N = 3;

// can be anything but must be distinct
const X = 1;
const O = 2;
const E = 0;

let player = X;

let board = [
    [E, E, E],
    [E, E, E],
    [E, E, E],
];

function turnUpdate() {
    updateBoard();
    togglePlayer();
    updatePlayerDisplay();
    mate = checkMate(X, O) || checkMate(O, X);
    if (mate !== undefined) {
        document.getElementById("mateDisplay").innerText =
            playerToString(mate) + " har schackmatt!";
    } else {
        document.getElementById("mateDisplay").innerText = "";
    }
    winner = checkVictory(X) || checkVictory(O);
    if (winner !== undefined) {
        document.getElementById("playerDisplay").innerText =
            playerToString(winner) + " vinner!";

        for (var i = 0; i < 3; i++) {
            document.getElementsByClassName("Os")[i].draggable = false;
        }
        for (var i = 0; i < 3; i++) {
            document.getElementsByClassName("Xs")[i].draggable = false;
        }
    }
}

function reset(ev) {
    let Xs = document.getElementById("initPositionsX");
    let Os = document.getElementById("initPositionsO");
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            id = "td" + i + j;
            child = document.getElementById(id).firstChild;
            if (child) {
                if (child.id[0] === "X") {
                    Xs.appendChild(child);
                }
                if (child.id[0] === "O") {
                    Os.appendChild(child);
                }
            }
        }
    }
    board = [
        [E, E, E],
        [E, E, E],
        [E, E, E],
    ];

    for (var i = 0; i < 3; i++) {
        document.getElementsByClassName("Xs")[i].draggable = true;
    }
    for (var i = 0; i < 3; i++) {
        document.getElementsByClassName("Os")[i].draggable = false;
    }

    player = X;
    updatePlayerDisplay();
}

function updatePlayerDisplay() {
    document.getElementById("playerDisplay").innerText =
        "Spelare: " + playerToString(player);
}

function playerToString(player) {
    if (player === X) {
        return "X";
    }
    if (player === O) {
        return "O";
    }
}

function stringToPlayer(str) {
    if (str === "X") {
        return X;
    }
    if (str === "O") {
        return O;
    }
}
function togglePlayer() {
    if (player === X) {
        player = O;
        for (var i = 0; i < 3; i++) {
            document.getElementsByClassName("Xs")[i].draggable = false;
        }
        for (var i = 0; i < 3; i++) {
            document.getElementsByClassName("Os")[i].draggable = true;
        }
    } else if (player === O) {
        player = X;
        for (var i = 0; i < 3; i++) {
            document.getElementsByClassName("Xs")[i].draggable = true;
        }
        for (var i = 0; i < 3; i++) {
            document.getElementsByClassName("Os")[i].draggable = false;
        }
    }
}

function updateBoard() {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            id = "td" + i + j;
            child = document.getElementById(id).firstChild;
            if (child) {
                p = stringToPlayer(child.id[0]);
                board[i][j] = p;
            } else {
                board[i][j] = E;
            }
        }
    }
}

function count(arr, elem) {
    let c = 0;
    for (const i of arr) {
        if (i === elem) {
            c++;
        }
    }
    return c;
}

function checkMateInArr(arr, player1, player2) {
    return count(arr, player1) === 2 && count(arr, player2) === 0;
}

function checkMate(player1, player2) {
    let n = 0;

    // check every row:
    for (var i = 0; i < 3; i++) {
        if (checkMateInArr(board[i], player1, player2)) {
            n++;
        }
    }

    // check every column:
    for (var j = 0; j < 3; j++) {
        const col = [board[0][j], board[1][j], board[2][j]];
        if (checkMateInArr(col, player1, player2)) {
            n++;
        }
    }

    // check every diagonal:
    let diag1 = [board[0][0], board[1][1], board[2][2]];
    if (checkMateInArr(diag1, player1, player2)) {
        n++;
    }

    let diag2 = [board[0][2], board[1][1], board[2][0]];
    if (checkMateInArr(diag2, player1, player2)) {
        n++;
    }

    if (n === 2) {
        return player1;
    }
}

function checkVictory(player) {
    // check every row:
    for (var i = 0; i < 3; i++) {
        if (board[i].every((x) => x === player)) {
            return player;
        }
    }
    // check every column:
    for (var j = 0; j < 3; j++) {
        const col = [board[0][j], board[1][j], board[2][j]];
        if (col.every((x) => x === player)) {
            return player;
        }
    }
    // check every diagonal:
    let diag1 = [board[0][0], board[1][1], board[2][2]];
    if (diag1.every((x) => x === player)) {
        return player;
    }

    let diag2 = [board[0][2], board[1][1], board[2][0]];
    if (diag2.every((x) => x === player)) {
        return player;
    }
}

function getBoardIdxFromEv(ev) {
    id = ev.target.id;
    // "tdXX" -> Array [X, X]
    if (id.slice(0, 2) !== "td") {
        return undefined;
    }
    idx = id
        .slice(-2)
        .split("")
        .map((x) => Number(x));
    return idx;
}

function getTileState(idx) {
    if (idx === undefined) {
        return undefined;
    }
    return board[idx[0]][idx[1]];
}

function allowDrop(ev) {
    idx = getBoardIdxFromEv(ev);
    if (idx !== undefined && getTileState(idx) === E) {
        ev.preventDefault();
    }
}

function drag(ev) {
    id = ev.target.id;
    if (stringToPlayer(id[0]) === player) {
        ev.dataTransfer.setData("text", id);
    }
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));

    turnUpdate();
}
