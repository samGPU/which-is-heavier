import './style.css'
import Interaction from './src/Interaction'
import { generateOption } from './data/animals'

const SCORE = { 
  value: 0,
  best: 0
}

const OPTIONS = {
  A: generateOption(),
  B: generateOption()
}

const interaction = new Interaction(SCORE, OPTIONS)
