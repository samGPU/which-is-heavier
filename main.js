import './style.css'
import Interaction from './src/Interaction'
import Renderer from './src/Renderer'
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
  countdown: 9,
  maxCountdown: 9,
}

const renderer = new Renderer()
const interaction = new Interaction(SCORE, OPTIONS, LOOP)

function gameLoop(timestamp) {
  if (SCORE.gameOver || LOOP.countdown <= 0) {
    console.log('Game Over');
    interaction.showGameOver();
    return;
  }

  if (!LOOP.lastTimestamp) LOOP.lastTimestamp = timestamp;
  const deltaTime = timestamp - LOOP.lastTimestamp;
  LOOP.lastTimestamp = timestamp;

  interaction.updateCountdown(deltaTime);

  renderer.render(deltaTime);

  requestAnimationFrame(gameLoop);
}

document.querySelector('#restart').addEventListener('click', () => {
  interaction.restartGame()
  requestAnimationFrame(gameLoop);
})

document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(gameLoop);
});
