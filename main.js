import './style.css'
import Interaction from './src/Interaction'
import { generateOption } from './data/animals'

const SCORE = { 
  value: 0,
  best: 0,
  gameOver: false,
}

const OPTIONS = {
  A: generateOption(),
  B: generateOption()
}

const LOOP = {
  lastTimestamp: null,
  countdown: 10,
  maxCountdown: 10,
}

const interaction = new Interaction(SCORE, OPTIONS, LOOP)

// Game loop setup
let lastTimestamp = null;

function gameLoop(timestamp) {
  if (SCORE.gameOver ) {
    console.log('Game Over');
    interaction.showGameOver();
    return;
  }

  if (!lastTimestamp) lastTimestamp = timestamp;
  const deltaTime = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  interaction.updateCountdown(deltaTime);

  if (LOOP.countdown <= 0) {
    console.log('Time is up!');
    SCORE.gameOver = true;
  }

  requestAnimationFrame(gameLoop);
}

document.querySelector('#restart').addEventListener('click', () => {
  interaction.restartGame()
  requestAnimationFrame(gameLoop);
})

document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(gameLoop);
});
