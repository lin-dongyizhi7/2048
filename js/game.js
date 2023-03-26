var board = new Array();
var added = new Array();
var score = 0;
var top = 240;
$(document).ready(function (e) {
    // console.log("ready");
    newGame();
});

function newGame() {
    // console.log("new game");
    //初始化棋盘格
    init();
    //随机两个数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    score = 0;
    document.getElementById("score").innerHTML = score;
    $("#gameOver").css('display', 'none');
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css("top", getPosTop(i, j));
            gridCell.css("left", getPosLeft(i, j));
        }
    }

    //初始化格子数组
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
        }
    }

    //初始化判定合并的数组
    for (var i = 0; i < 4; i++) {
        added[i] = new Array();
        for (var j = 0; j < 4; j++) {
            added[i][j] = 0;
        }
    }

    updateBoardView();
}

//更新数组对应的格子内容
function updateBoardView() {
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            //console.log($(`#grid-cell-${i}-${j}`));
            var theNumberCell = $('#number-cell-' + i + '-' + j);
            theNumberCell.css('width', '100px');
            theNumberCell.css('height', '100px');
            theNumberCell.css('top', getPosTop(i, j));
            theNumberCell.css('left', getPosLeft(i, j));
            //NumberCell覆盖
            if (board[i][j] !== 0) {
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));//返回背景色
                theNumberCell.css('color', getNumberColor(board[i][j]));//返回前景色
                theNumberCell.text(board[i][j]);
            }
        }
    }
}

//生成随机的格子
function generateOneNumber() {
    if (noSpace(board))
        return false;

    var randX = parseInt(Math.floor(Math.random() * 4));
    var randY = parseInt(Math.floor(Math.random() * 4));
    while (true) {
        if (board[randX][randY] == 0)
            break;
        randX = parseInt(Math.floor(Math.random() * 4));
        randY = parseInt(Math.floor(Math.random() * 4));
    }

    var randNumber = Math.random() < 0.5 ? 2 : 4;

    board[randX][randY] = randNumber;
    showNumberWithAnimation(randX, randY, randNumber);
    return true;
}

//事件响应循环
$(document).keydown(function (event) {
    switch (event.keyCode) {
        case 37://left
            if (moveLeft()) {
                getScore();
                generateOneNumber();
                setTimeout("isGameOver()", 400);
            }
            break;
        case 38://up
            if (moveUp()) {
                getScore();
                generateOneNumber();
                setTimeout("isGameOver()", 400);
            }
            break;
        case 39://right
            if (moveRight()) {
                getScore();
                generateOneNumber();
                setTimeout("isGameOver()", 400);
            }
            break;
        case 40://down
            if (moveDown()) {
                getScore();
                generateOneNumber();
                setTimeout("isGameOver()", 400);
            }
            break;

    }
});

function isGameOver() {
    if (noSpace(board) && noMove(board))
        gameOver();
}

function gameOver() {
    $("#gameOver").css('display', 'block');
}

//将判断能否合并的数组值置为0
function isAddedArray() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            added[i][j] = 0;
        }
    }
}

function moveLeft() {
    //判断格子是否能够向左移动
    if (!canMoveLeft(board))
        return false;

    isAddedArray();

    for (var i = 0; i < 4; i++)
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                //(i,j)左侧的元素
                for (var k = 0; k < j; k++) {
                    //落脚位置的是否为空 && 中间没有障碍物
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //落脚位置的数字和本来的数字相等 && 中间没有障碍物
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        if (added[i][k] != 0) {
                            board[i][k + 1] = board[i][j];
                            board[i][j] = 0;
                        }
                        else {
                            board[i][k] += board[i][j];
                            board[i][j] = 0;
                            added[i][k] = 1;
                            score += board[i][k];
                        }
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveRight() {
    //判断格子是否能够向右移动
    if (!canMoveRight(board))
        return false;

    isAddedArray();

    for (var i = 0; i < 4; i++)
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                //(i,j)右侧的元素
                for (var k = 3; k > j; k--) {
                    //落脚位置的是否为空 && 中间没有障碍物
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //落脚位置的数字和本来的数字相等 && 中间没有障碍物
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        if (added[i][k] != 0) {
                            board[i][k - 1] = board[i][j];
                            board[i][j] = 0;
                        }
                        else {
                            board[i][k] += board[i][j];
                            board[i][j] = 0;
                            added[i][k] = 1;
                            score += board[i][k];
                        }
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveUp() {
    //判断格子是否能够向上移动
    if (!canMoveUp(board))
        return false;

    isAddedArray();
    
    for (var j = 0; j < 4; j++)
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                //(i,j)上面的元素
                for (var k = 0; k < i; k++) {
                    //落脚位置的是否为空 && 中间没有障碍物
                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //落脚位置的数字和本来的数字相等 && 中间没有障碍物
                    else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        if (added[k][j] != 0) {
                            board[k + 1][j] = board[i][j];
                            board[i][j] = 0;
                        }
                        else {
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            added[k][j] = 1;
                            score += board[k][j];
                        }
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}

function moveDown() {
    //判断格子是否能够向下移动
    if (!canMoveDown(board))
        return false;

    isAddedArray();
    
    for (var j = 0; j < 4; j++)
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                //(i,j)上面的元素
                for (var k = 3; k > i; k--) {
                    //落脚位置的是否为空 && 中间没有障碍物
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //落脚位置的数字和本来的数字相等 && 中间没有障碍物
                    else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        if (added[k][j] != 0) {
                            board[k - 1][j] = board[i][j];
                            board[i][j] = 0;
                        }
                        else {
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            added[k][j] = 1;
                            score += board[k][j];
                        }
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}