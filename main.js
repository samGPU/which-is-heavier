import './style.css'
import Button from './src/button'
import { randomAnimal } from './data/animals'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Which is Heavier!?</h1>
    <h3 id="score">0</h3>
    <div class="card">
      <button id="optionA" type="button"></button>
      <button id="optionB" type="button"></button>
    </div>
  </div>
`

const SCORE = { 
  value: 0,
  element: document.querySelector('#score'),
}

const updateScore = (score) => {
  SCORE.element.innerHTML = SCORE.value
}

const generateOption = () => {
  const option = randomAnimal()
  option.amount = Math.floor(Math.random() * 50) + 1

  return option
}

const OPTIONS = {
  A: generateOption(),
  B: generateOption()
}

const optionAButton = new Button(
  SCORE,
  OPTIONS, 
  document.querySelector('#optionA'), 
  OPTIONS.A
)

const optionBButton = new Button(
  SCORE,
  OPTIONS, 
  document.querySelector('#optionB'),
  OPTIONS.B
)

const resetButtons = () => {
  OPTIONS.A = generateOption()
  OPTIONS.B = generateOption()
  optionAButton.label(OPTIONS.A.name, OPTIONS.A.amount)
  optionBButton.label(OPTIONS.B.name, OPTIONS.B.amount)
}

document.querySelector('#optionA').addEventListener('click', () => {
  optionAButton.choose()
  console.log(SCORE)
  updateScore(SCORE.value)
  resetButtons()
})

document.querySelector('#optionB').addEventListener('click', () => {
  optionBButton.choose()
  updateScore(SCORE.value)
  resetButtons()
})
