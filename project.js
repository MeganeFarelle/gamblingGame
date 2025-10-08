const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOLS_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter a deposit amount: ");
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("Invalid deposit amount. Please enter a positive number.");
    } else {
      return numberDepositAmount;
    }
  }
};

const getNumberOfLines = () => {
  while (true) {
    const linesInput = prompt(`Enter the number of lines to bet on (1-${ROWS}): `);
    const numberOfLines = parseInt(linesInput, 10);

    if (
      isNaN(numberOfLines) ||
      numberOfLines < 1 ||
      numberOfLines > ROWS
    ) {
      console.log(`Invalid number of lines. Please enter a whole number between 1 and ${ROWS}.`);
    } else {
      return numberOfLines;
    }
  }
};

const getBet = (balance, lines) => {
  while (true) {
    const betInput = prompt(`Enter the bet per line (Balance: $${balance}, Lines: ${lines}, Max/line: $${Math.floor(balance / lines)}): `);
    const numberBet = parseFloat(betInput);

    if (isNaN(numberBet) || numberBet <= 0) {
      console.log("Invalid bet. Please enter a positive number.");
    } else if (numberBet * lines > balance) {
      console.log(`Insufficient balance. Your total bet ($${numberBet * lines}) exceeds your balance ($${balance}).`);
    } else {
      return numberBet;
    }
  }
};

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }

  return reels;
};

const transpose = (reels) => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i !== row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;
  for (let r = 0; r < lines; r++) {
    const symbols = rows[r];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol !== symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOLS_VALUES[symbols[0]];
    }
  }
  return winnings;
};

const game = () => {
  let balance = deposit();

  while (true) {
    console.log(`\nCurrent balance: $${balance}`);
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);

    balance -= bet * numberOfLines;

    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);

    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;

    console.log(`You won: $${winnings}`);
    console.log(`New balance: $${balance}`);

    if (balance <= 0) {
      console.log("You ran out of money. Game over.");
      break;
    }

    const playAgain = prompt("Do you want to play again? (y/n): ").trim().toLowerCase();
    if (playAgain !== "y") break;
  }
};

game();
