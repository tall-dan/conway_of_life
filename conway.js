function Game(rows, columns, initialCells){

  function emptyGame(rows, columns){ 
    game = new Array(columns);
    for (var i = 0; i < columns; i++) {
      game[i] = new Array(rows);
      for (var j =0; j < rows; j++){
        cell = $("<div class='cell'></div>");
        game[i][j] = cell;
      }
    }
    return game;
  }

  function populateCells(livingCells){
    for (var i = 0;  i < livingCells.length; i++){
      currentState[livingCells[i][0]][livingCells[i][1]].addClass("alive");
    }
  }

  function advanceGeneration(currentState){
    var nextState = emptyGame(rows, columns);
    for (var i = 0; i < columns; i++){
      for (var j = 0; j < rows; j++){
        var currentCell = currentState[i][j];
        if (currentCell.hasClass("alive") && !cellShouldDie(i, j)){
          nextState[i][j].addClass("alive", 40);
        }
        else if (!currentCell.hasClass("alive") && cellProcreateCheck(i, j)){
          nextState[i][j].addClass("alive", 40);
        }
      }
    }
    return nextState;
  }

  function cellShouldDie(x, y){
    neighborCount = livingNeighborCount(x, y);
    return (neighborCount > 3 || neighborCount < 2);
  }

  function livingNeighborCount(x, y){
    var count = 0;
    for (var i = x - 1; i <= x + 1; i++){
      for (var j = y - 1; j <= y + 1; j++){
        if (!(x == i && j == y) && livingNeighborAt(i, j)){
          count++;
        }
      }
    }
    return count;
  }

  function livingNeighborAt(x, y){
    if (x < 0 || y < 0) return false;
    if (x >= columns || y >= rows) return false;
    return currentState[x][y].hasClass("alive");
  }
  function cellProcreateCheck(x, y){
    return livingNeighborCount(x, y) == 3;
  }

  function removeOldGeneration(){
    $(".cell").remove();
  }
  function drawNewGeneration(){
    var cellSize = 100.0 / columns;
    for (var i = 0; i < columns; i++){
      for (var j = 0; j < rows; j++){
        cell = currentState[i][j];
        cell.css("left", i * 20);
        cell.css("bottom", j * 20);
        $('.gameSpace').append(cell);
      }
    }
  }
  currentState = emptyGame(rows, columns);
  populateCells(initialCells, currentState);
  this.drawGeneration = function(){
    removeOldGeneration();
    currentState = advanceGeneration(currentState);
    drawNewGeneration();
    window.roundsDrawn++;
    reportTiming(new Date().getTime());
  }

  function reportTiming(endTime){
   elapsed = endTime - window.time;
   avg = elapsed / roundsDrawn;
   $('#avg_iteration').html(avg);
  }
}

var initialCells = function (){
  return [
    [1,4],
    [2,4],
    [1,5],
    [2,5],
    [11,3],
    [11,4],
    [11,5],
    [12,6],
    [12,2],
    [13,1],
    [14,1],
    [13,7],
    [14,7],
    [15,4],
    [16,6],
    [16,2],
    [17,3],
    [17,4],
    [17,5],
    [18,4],
    [21,6],
    [21,7],
    [21,8],
    [22,6],
    [22,7],
    [22,8],
    [23,9],
    [23,5],
    [25,4],
    [25,5],
    [25,9],
    [25,10],
    [35,7],
    [35,8],
    [36,7],
    [36,8]
  ]
}

function button(game){
  var test = $('<button>Start</button>');
  test.click(function () { 
    //hack. Better way to do this?
    if ($(this).text() == 'Start'){
      window.timer = setInterval(game.drawGeneration,10);
      $(this).text('Pause');
      window.time = new Date().getTime();
      window.roundsDrawn = 0;
    }
    else{
      clearInterval(window.timer);
      $(this).text('Start');
      giveCellsListener();
    }
 });
  $(".gameSpace").append(test);
}

$(document).ready(function(){
  // get game size from user?
  var columns = 40;
  var rows = 11;
  var game = new Game(rows, columns, initialCells());
  button(game);
  giveCellsListener();
  game.drawGeneration();
});

function giveCellsListener(){
  $('.cell').click(function(){
    console.log('clickedCell');
    $(this).toggleClass('alive');
  });
}
