import './style.css'
import Interaction from './src/Interaction'
import Renderer from './src/Renderer'
import { generateOption } from './data/animals'
import * as THREE from 'three'
import GLBLoader from './src/GLBLoader'

const loader = GLBLoader.getInstance('./Animals.glb');

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
  if (SCORE.gameOver || LOOP.countdown <= 0 && !interaction.isGameOver) {
    if (LOOP.countdown <= 0) {
      SCORE.message = 'You ran out of time!'
    }
    interaction.showGameOver();
  }

  const deltaTime = clock.getDelta();
  // interaction.updateCountdown(deltaTime * 1000);
  renderer.render(deltaTime);

  // Check if platforms are ready and spawn models
  if (interaction.waitingForPlatforms) {
    if (renderer.leftPlatform.isFloorReady() && renderer.rightPlatform.isFloorReady()) {
      interaction.spawnModels(OPTIONS.A, OPTIONS.B);
      interaction.waitingForPlatforms = false; // Reset the flag
    }
  } else {
    interaction.updateCountdown(deltaTime * 1000);
  }

  requestAnimationFrame(gameLoop);
}

document.querySelector('#restart').addEventListener('click', () => {
  interaction.restartGame()
  clock.start();
  requestAnimationFrame(gameLoop);
})

document.addEventListener('glbLoaded', () => {
  console.log('GLB loaded event triggered');
  document.querySelector('#loading').style.display = 'none';
  document.querySelector('#startButton').style.display = 'inline-block';
});

document.querySelector('#start').addEventListener('click', () => {
  interaction.startGame()
  clock.start();
  requestAnimationFrame(gameLoop);
  interaction.spawnModels(OPTIONS.A, OPTIONS.B)
})

document.addEventListener('DOMContentLoaded', () => {
  const deltaTime = clock.getDelta();
  renderer.render(deltaTime);
});
