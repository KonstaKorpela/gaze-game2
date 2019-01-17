import {
  Target
} from '../src/target.mjs';

const cursorCanvas = document.getElementById('cursorCanvas');
const cursorCtx = cursorCanvas.getContext('2d');
const canvas = document.getElementById("webglCanvas");
const ctx = canvas.getContext("2d");
const target = new Target();

let score = 0;
let gameStarted = false;
let gameOver = false;

let gameOverNotification = document.querySelector('.game-over-notification');
let scoreid = document.getElementById('score');
let playerscore = document.getElementById('playerscore');
let calibrate = document.getElementById('calibrate');
let openModal = document.getElementById('openModal');
let modal = document.getElementById('modal');
let close = document.querySelector('.close');

let currentVelocity = document.getElementById('currentVelocity');
let addVelocity = document.querySelector('.addVelocity');
let removeVelocity = document.querySelector('.removeVelocity');
let lastVelocity = target.v;


let updateTargetTimer;
let changeDirectionTimer;
let updateVelocityTimer;
let reduceTargetSizeTimer;


let canvasGazeX;
let canvasGazeY;


//Gets called when DOM content has loaded
function main() {
  currentVelocity.innerHTML = target.v;
  //Initialiaze canvas
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'darkblue';
  ctx.fill();
  ctx.closePath();

  //Draw the target circle
  target.drawTarget(ctx, canvas);
}

function startGame() {
  gameStarted = true;
  updateTargetTimer = setInterval(() => {

    if(target.gameOver){
      stopGame();
    }

    if (target.v != 0) {
      target.updateTarget(ctx, canvas, lastVelocity, canvasGazeX, canvasGazeY);
      score = Math.floor(score + (1 * target.v));
    }
  }, 30);

  if (gameStarted && !gameOver) {
    changeDirectionTimer = setInterval(() => {
      // target.v = 0;
      target.changeDirection(lastVelocity);
      console.info('Direction changed');
    }, 3000);

    if(target.r > 60){
      reduceTargetSizeTimer = setInterval(() => {
        target.r -= 0.5;
        if(target.v < 15) {
          target.v += 0.2;
        }
      }, 1000)
    }
  }


  // checkIfInTargetTimer = setInterval(() => {
  //   if (!isInTarget(canvasGazeX, canvasGazeY, target.x, target.y, target.r) && gameStarted && !gameOver) {
  //     stopGame();
  //   }
  // }, 50);
}

function stopGame() {
  gameOver = true;
  playerscore.innerHTML = score;
  if (score < 1000) {
    calibrate.innerHTML = 'PLACEHOLDER';
  } else if (score < 1500) {
    calibrate.innerHTML = 'PLACEHOLDER';
  } else if (score > 2000) {
    calibrate.innerHTML = 'PLACEHOLDER';
  }

  gameOverNotification.style.display = 'flex';
  clearInterval(updateTargetTimer);
  clearInterval(updateVelocityTimer);
  clearInterval(reduceTargetSizeTimer);
  clearInterval(changeDirectionTimer);
  score = 0;
}

function restartGame() {
  gameOver = false;
  gameStarted = false;
  target.resetTarget();
  currentVelocity.innerHTML = target.v;
  lastVelocity = target.v
  target.drawTarget(ctx, canvas);
  gameOverNotification.style.display = 'none';
}

gameOverNotification.addEventListener('click', () => {
  restartGame();
  console.log('Reset');
});

openModal.addEventListener('click', () => {
  modal.style.display = 'block';
});

close.addEventListener('click', () => {
  modal.style.display = 'none';
})

window.addEventListener('click', (e) => {
  if (e.target == modal) {
    modal.style.display = 'none';
  }
})

cursorCanvas.onmousemove = (e) => {
  window.postMessage({
    title: 'gaze',
    x: Math.floor(e.clientX - cursorCanvas.getBoundingClientRect().x),
    y: Math.floor(e.clientY - cursorCanvas.getBoundingClientRect().y)
  }, '*');
};

function messageEvent(e) {
  const data = e.data;
  if (typeof data !== 'object' || data == null) {
    return;
  }

  if (data.title !== 'gaze') {
    return;
  }

  canvasGazeX = data.x;
  canvasGazeY = data.y;

  //Clear canvas
  cursorCtx.beginPath();
  cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
  cursorCtx.closePath();

  //Draw a circle that follows cursor
  cursorCtx.beginPath();
  cursorCtx.arc(canvasGazeX, canvasGazeY, 20, 0, 2 * Math.PI);
  cursorCtx.fillStyle = 'rgba(255, 30, 0, 0.3)';
  cursorCtx.fill();
  cursorCtx.closePath();

  if (isInTarget(canvasGazeX, canvasGazeY, target.x, target.y, target.r) && !gameStarted && !gameOver) {
    startGame();
  }

  if (!isInTarget(canvasGazeX, canvasGazeY, target.x, target.y, target.r) && gameStarted && !gameOver) {
    stopGame();
  }

}

function isInTarget(x, y, cx, cy, r) {
  let dx = x - cx,
    dy = y - cy,
    dist = Math.sqrt(dx * dx + dy * dy);
  return dist < r;
}

addVelocity.addEventListener('click', () => {
  target.v++;
  currentVelocity.innerHTML = target.v;
  lastVelocity = target.v;
});

removeVelocity.addEventListener('click', () => {
  target.v--;
  currentVelocity.innerHTML = target.v;
  lastVelocity = target.v;
});

window.addEventListener('message', messageEvent, false);

document.addEventListener('DOMContentLoaded', main);

//Onko laajennus, onko kirjautunut, onko laite kiinni, kysy kirjautumisessa saatu tokeni, lähetä tokeni veikolle jotenkin
