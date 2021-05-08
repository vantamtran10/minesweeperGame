let X = 10;
let Y = 10;
let win = false;
let lose = false;
let firstClicked = false;
let NBOMB = 10;
let cellsRevealed = 0;
let cellsToReveal = (X*Y) - 10;
let MINE = '*';
let myGrid = initGrid(X, Y);

function initGrid(X, Y) {
    let grid = [];
    for (let i = 0; i < X; i++) {
        let row = new Array(Y);
        for (let j = 0; j < Y; j++) {
            row[j] = { val: 0 };
        }
        grid.push(row);
    }
    return grid;
}
function cellClicked(row, col) {

    let cell = $(".cell[d-row = "+row+"][d-col = "+col+"]");
    if (cell.hasClass('flagged')) return;
    if (firstClicked) {
        cell.off();
        cell.click(function(event) {
            cellClickedHelper(row, col);
        });
    } else {
        firstClicked = true;
        setBomb(row, col);
        // console.log('set mines complete');
    }
    cellClickedHelper(row, col);
}
function cellClickedHelper(row, col) {
    if (lose == true || win == true) return;
    if (!$(".cell[d-row = "+row+"][d-col = "+col+"]").hasClass('revealed')) {
        openCell(row, col);
    }
}
function openCell(row, col) {
    if ($(".cell[d-row = "+row+"][d-col = "+col+"]").hasClass('revealed')) return;
    openCellHelper(row, col);

    if (lose == true || win == true || myGrid[row][col].val != 0) return;
    let neighbors = getBombAround(row, col);
    for (let i = 0; i < neighbors.length; i++) {
        openCell(neighbors[i].row, neighbors[i].col);
        if (lose == true || win == true) return;
    }
}
function openCellHelper(row, col) {
    let currentCell = $(".cell[d-row = "+row+"][d-col = "+col+"]");
    let cell = myGrid[row][col];
    if (currentCell.hasClass('revealed')) return;
    currentCell.text(cell.val);

    currentCell.addClass('revealed cell-' + (cell.val == MINE ? 'bomb' : cell.val));
    currentCell.removeClass('outset');

    cellsRevealed++;
    //console.log('cellsReveal :' + cellsRevealed);
    if (cell.val == MINE) {
        displayBomb();
        lose = true;
        $("#main_lose").show();
        // alert('You loss');
    } else if (cellsRevealed == cellsToReveal) {
        win = true;
        // alert('You win');
        $("#main_win").show();
    }
}

function setBomb(currentRow, currentCol) {
    let countBomb = 0;
    while (countBomb != NBOMB) {
        let row = Math.floor(Math.random() * X);
        let col = Math.floor(Math.random() * Y);
        if ((row == currentRow && col == currentCol) || (myGrid[currentRow][currentCol] && myGrid[currentRow][currentCol].val == MINE)) continue;
        myGrid[row][col] = {val: MINE};
        //console.log("bomb x =" + row + " y= " + col +"");
        countBomb++;
    }
    for (let i = 0; i < X; i++) {
        for (let j = 0; j < Y; j++) {
            myGrid[i][j].val = adjacentBomb(i, j);
        }
    }
}
function getBombAround(row, col) {
    let arr = [];
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (0 <= r && r < X && 0 <= c && c < Y && !(r == row && c == col)) {
                arr.push({row: r, col: c});
            }
        }
    }
    return arr;
}
function adjacentBomb(row, col) {
    if (myGrid[row][col] && myGrid[row][col].val == MINE) return MINE;
    let count = 0;
    let checkAround = getBombAround(row, col);
    for (var i = 0; i < checkAround.length; i++) {
        var r = checkAround[i].row;
        var c = checkAround[i].col;
        if (myGrid[r][c] && myGrid[r][c].val == MINE) count++;
    }
    return count;
}
function displayBomb() {
    if (lose) return;
    lose = true;
    $(".cell").removeClass("flagged");
    for (let r = 0; r < X; r++) {
        for (let c = 0; c < Y; c++) {
            if (myGrid[r][c].val == MINE) {
                openCell(r, c);
            }
        }
    }
}
function initDisplay() {
    let table = $(document.createElement('table'));
    table.addClass('no-highlight');
    table.attr('cellspacing', 0);

    $.each(myGrid, function(row, cols) {
        let content = "<tr>"
        $.each(cols, function(col) {
            content +="<td class='cell outset' d-row="+row+" d-col="+col+" onclick='cellClicked("+row+","+col+")'></td>";
        });
        table.append(content);
    });
    $('#main_grid').prepend(table);
    $("#main_lose").hide();
    $("#main_win").hide();

    $('.cell').bind('contextmenu', function(event) {
        event.preventDefault();
        displayFlag($(this).attr("d-row"), $(this).attr("d-col"));
    });
}
function reset(){
    window.location.reload();
}
function displayFlag(row, col){
    let currentCell = $(".cell[d-row = "+row+"][d-col = "+col+"]");
    if (currentCell.hasClass('revealed')) return;
    if (!currentCell.hasClass('flagged')) {
        currentCell.addClass('flagged');
    } else {
        currentCell.removeClass('flagged');
    }
}
function initM() {
    initDisplay();
}
