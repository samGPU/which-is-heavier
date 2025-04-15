import './style.css'
import Interaction from './src/Interaction'
import Renderer from './src/Renderer'
import { generateOption } from './data/animals'
import * as THREE from 'three'

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
  countdown: 9,
  maxCountdown: 9,
}

const renderer = new Renderer()
const interaction = new Interaction(SCORE, OPTIONS, LOOP, renderer)
const clock = new THREE.Clock(false)

function gameLoop() {
  if (SCORE.gameOver || LOOP.countdown <= 0) {
    if (LOOP.countdown <= 0) {
      SCORE.message = 'You ran out of time!'
    }
    console.log('Game Over');
    interaction.showGameOver();
    clock.stop();
    return;
  }

  const deltaTime = clock.getDelta();
  interaction.updateCountdown(deltaTime * 1000);
  renderer.render(deltaTime);

  requestAnimationFrame(gameLoop);
}

document.querySelector('#restart').addEventListener('click', () => {
  interaction.restartGame()
  clock.start();
  requestAnimationFrame(gameLoop);
})

document.querySelector('#start').addEventListener('click', () => {
  interaction.startGame()
  clock.start();
  requestAnimationFrame(gameLoop);
  interaction.spawnSpheres(OPTIONS.A.amount, OPTIONS.B.amount)
})

document.addEventListener('DOMContentLoaded', () => {
  const deltaTime = clock.getDelta();
  renderer.render(deltaTime);
});
