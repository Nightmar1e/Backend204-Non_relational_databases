const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const scoreElement = document.querySelector('.score');
const timeElement = document.querySelector('.time');
const startButton = document.querySelector('.start-button');
const gameDuration = 20; // in seconds
const moleShowTime = 1000; // in milliseconds
let score = 0;
let time = gameDuration;
let moleInterval;
let gameTimer;
let isGameActive = false;

function startGame() {
  if (isGameActive) return;
  
  isGameActive = true;
  resetGame();
  startButton.disabled = true;
  moleInterval = setInterval(popMole, moleShowTime);
  gameTimer = setInterval(updateTime, 1000);
}

function resetGame() {
  score = 0;
  time = gameDuration;
  scoreElement.textContent = score;
  timeElement.textContent = time;
  moles.forEach((mole) => (mole.style.display = 'none'));
}

function popMole() {
  const randomIndex = Math.floor(Math.random() * holes.length);
  const randomHole = holes[randomIndex];
  const mole = randomHole.querySelector('.mole');

  if (mole.style.display === 'none') {
    mole.style.display = 'block';

    setTimeout(() => {
      mole.style.display = 'none';
    }, moleShowTime);
  }
}

function updateTime() {
  time--;
  timeElement.textContent = time;

  if (time === 0) {
    endGame();
  }
}

function endGame() {
  clearInterval(moleInterval);
  clearInterval(gameTimer);
  isGameActive = false;
  startButton.disabled = false;
}
function endGame() {
  clearInterval(moleInterval);
  clearInterval(gameTimer);
  isGameActive = false;
  startButton.disabled = false;
  alert("Great Job! You saved us from " + score + " moles.");
}

holes.forEach((hole) => {
  hole.addEventListener('click', () => {
    const mole = hole.querySelector('.mole');

    if (mole.style.display !== 'none') {
      score++;
      scoreElement.textContent = score;
      mole.style.display = 'none';
    }
  });
});

startButton.addEventListener('click', startGame);
