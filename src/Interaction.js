import Button from "./button";
import { generateOption } from "../data/animals";

export default class Interaction{
    constructor(SCORE, OPTIONS) {
        this.SCORE = SCORE;
        this.OPTIONS = OPTIONS;

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

        document.querySelector('#optionA').addEventListener('click', () => {
            this.optionAButton.choose()
            this.updateScore()
            this.resetButtons()
        })
        
        document.querySelector('#optionB').addEventListener('click', () => {
            this.optionBButton.choose()
            this.updateScore()
            this.resetButtons()
        })
    }

    resetButtons() {
        this.OPTIONS.A = generateOption()
        this.OPTIONS.B = generateOption()
        this.optionAButton.label(this.OPTIONS.A.name, this.OPTIONS.A.amount)
        this.optionBButton.label(this.OPTIONS.B.name, this.OPTIONS.B.amount)
    }

    updateScore() {
        document.querySelector('#score').innerHTML = `Score: ${this.SCORE.value}`
        if(this.SCORE.value > this.SCORE.best) {
        this.SCORE.best = this.SCORE.value
          document.querySelector('#best').innerHTML = `Best: ${this.SCORE.best}`
        }
      }
}
