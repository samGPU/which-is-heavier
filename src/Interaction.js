import Button from "./Button";
import { generateOption } from "../data/animals";

export default class Interaction{
    constructor(SCORE, OPTIONS, LOOP, RENDERER) {
        this.SCORE = SCORE;
        this.OPTIONS = OPTIONS;
        this.LOOP = LOOP;
        this.RENDERER = RENDERER;

        this.optionAButton = new Button(
          SCORE,
          OPTIONS, 
          document.querySelector('#optionA'), 
          OPTIONS.A
        )
        this.optionBButton = new Button(
          SCORE,
          OPTIONS, 
          document.querySelector('#optionB'),
          OPTIONS.B
        )

        this.timerElement = document.querySelector('#timer')

        document.querySelector('#optionA').addEventListener('click', () => {
            const end = this.optionAButton.choose()
            this.updateScore()
            this.updateBest()
            if(!end) this.resetButtons()
        })
        
        document.querySelector('#optionB').addEventListener('click', () => {
            const end = this.optionBButton.choose()
            this.updateScore()
            this.updateBest()
            if(!end) this.resetButtons()
        })
    }

    spawnModels(optionA, optionB) {
        console.warn('Spawning models:', optionA, optionB);
        this.RENDERER.leftPlatform.addModels(optionA.amount, optionA.meshName);
        this.RENDERER.rightPlatform.addModels(optionB.amount, optionB.meshName);
    }

    resetButtons() {
        this.OPTIONS.A = generateOption()
        this.OPTIONS.B = generateOption()
        this.optionAButton.label(this.OPTIONS.A.name, this.OPTIONS.A.amount)
        this.optionBButton.label(this.OPTIONS.B.name, this.OPTIONS.B.amount)
        this.updateScore();
        this.updateBest();
        this.resetCountdown()

        this.spawnModels(this.OPTIONS.A, this.OPTIONS.B)
    }

    resetScore() {
        this.SCORE.value = 0;
        this.SCORE.gameOver = false;
    }

    updateScore() {
        document.querySelector('#score').innerHTML = `Score: ${this.SCORE.value}`
    }

    updateBest() {
        if(this.SCORE.value > this.SCORE.best) {
            this.SCORE.best = this.SCORE.value
            document.querySelector('#best').innerHTML = `Best: ${this.SCORE.best}`
        }
    }

    updateCountdown(deltaTime) {
        this.LOOP.countdown -= deltaTime / 1000;
    
        const percentage = this.LOOP.countdown / this.LOOP.maxCountdown;
        const red = Math.round((1 - percentage) * 255);
        const green = Math.round(percentage * 255);
    
        this.timerElement.style.width = `${percentage * 100}%`;
        this.timerElement.style.backgroundColor = `rgb(${red}, ${green}, 70)`;
    }

    resetCountdown() {
        this.LOOP.countdown = this.LOOP.maxCountdown + 1;
    }

    startGame() {
        document.querySelector('#start').style.display = 'none';
        document.querySelector('#game').style.display = 'block';
    }

    showGameOver() {
        // hide all non-game over elements
        document.querySelector('#game').style.display = 'none';
        document.querySelector('#end').style.display = 'block';
        if(this.SCORE.message) 
            document.querySelector('#message').innerHTML = this.SCORE.message
        document.querySelector('#finalScore').innerHTML = `Final Score: ${this.SCORE.value}`
        document.querySelector('#bestScore').innerHTML = `Best Score: ${this.SCORE.best}`
    }

    hideGameOver() {
        // show all non-game over elements
        document.querySelector('#game').style.display = 'block';
        document.querySelector('#end').style.display = 'none';
    }

    restartGame() {
        this.resetCountdown();
        this.resetScore();
        this.resetButtons();
        this.hideGameOver();
    }

}
