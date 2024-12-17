const gameboardDiv = document.querySelector('.gameboard');
const turnSpan = document.querySelector('.turn');
const leaderboardDiv = document.querySelector('.leaderboard');
const fieldNode = document.querySelectorAll('.field');
const dialog = document.querySelector('dialog');
const newRoundBtn = dialog.querySelector('button');

const Gameboard = (function () {
  const gameboard = {
    row0: ['', '', ''],
    row1: ['', '', ''],
    row2: ['', '', ''],
  };

  const playerX = { mark: 'X', points: 0 };
  const playerO = { mark: 'O', points: 0 };

  let turn = 0;

  // the argument received by this function is the data-row
  // and the data-col of the field clicked.
  const addMark = function (row, col) {
    if (gameboard[row][col] !== '') {
      return;
    } else if (turn === 9) {
      return;
    } else if (turn % 2 === 0) {
      updateGameboard(row, col, gameboard, playerX);
    } else {
      updateGameboard(row, col, gameboard, playerO);
    }
  };

  function updateGameboard(row, col, gameboard, player) {
    gameboard[row][col] = player.mark;
    turn++;
    renderMark(row, col, gameboard);
    checkGameboard(player);
  }

  const clearGameboard = function (result, player) {
    turn = 0;
    // prevents add points in case of tie
    if (player) {
      player.points++;
    }
    updatePoints(playerX.points, playerO.points);
    for (let row in gameboard) {
      gameboard[row].fill('');
    }
    dialog.showModal();
    dialog.querySelector('p').textContent = result;
    fieldNode.forEach((field) => (field.style.cursor = 'pointer'));
  };

  function updatePoints(xPoints, oPoints) {
    const playerXSpan = leaderboardDiv.querySelector('.player_X');
    const playerOSpan = leaderboardDiv.querySelector('.player_O');

    playerXSpan.textContent = xPoints;
    playerOSpan.textContent = oPoints;
  }

  function checkGameboard(player) {
    const mark = player.mark;
    const row0 = gameboard.row0;
    const row1 = gameboard.row1;
    const row2 = gameboard.row2;
    let result = `Player ${mark} win`;

    let rowWin;
    let colWin;

    for (let row in gameboard) {
      if (gameboard[row].every((field) => field === mark)) {
        rowWin = true;
      }
    }

    for (let i = 0; i < row0.length; i++) {
      if (row0[i] === mark && row1[i] === mark && row2[i] === mark) {
        colWin = true;
      }
    }

    if (
      rowWin ||
      colWin ||
      // diagonal win
      (row0[0] === mark && row1[1] === mark && row2[2] === mark) ||
      (row0[2] === mark && row1[1] === mark && row2[0] === mark)
    ) {
      Gameboard.clearGameboard(result, player);
    } else if (turn < 9) {
      if (player.mark === 'X') {
        turnSpan.textContent = 'O';
      } else {
        turnSpan.textContent = 'X';
      }
      return;
    } else {
      result = 'Tie';
      Gameboard.clearGameboard(result, null);
    }
  }

  return { addMark, clearGameboard };
})();

function renderMark(row, col, gameboard) {
  const fieldArr = Array.from(fieldNode);
  // get the index of field that represents the position (data-row & data-col)
  // that the mark was added in the gameboard obj
  const index = fieldArr.findIndex(
    (field) =>
      field.getAttribute('data-row') === row &&
      field.getAttribute('data-col') === col
  );

  fieldNode[index].style.cursor = 'not-allowed';

  const img = document.createElement('img');

  if (gameboard[row][col] === 'X') {
    img.src = 'assets/img/cross.png';
    fieldNode[index].appendChild(img);
  } else if (gameboard[row][col] === 'O') {
    img.src = 'assets/img/circle.png';
    fieldNode[index].appendChild(img);
  }
}

gameboardDiv.addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('field')) {
    const dataRow = target.getAttribute('data-row');
    const dataCol = target.getAttribute('data-col');
    Gameboard.addMark(dataRow, dataCol);
  }
});

newRoundBtn.addEventListener('click', () => {
  dialog.close();
  turnSpan.textContent = 'X';
  fieldNode.forEach((field) => {
    if (field.firstChild) {
      field.removeChild(field.firstChild);
    }
  });
});
