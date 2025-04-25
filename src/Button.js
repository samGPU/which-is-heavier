export default class Button {
  constructor(score, options, element, data) {
    this.SCORE = score;
    this.OPTIONS = options;
    this.element = element;
    this.amount = data.amount;
    this.name = data.name;

    this.label(this.name, this.amount)
  }

  hide() {
    this.element.style.display = 'none';
  }

  show() {
    this.element.style.display = 'block';
  }

  label(name, amount) {
    this.show();
    this.name = name;
    this.amount = amount;

    this.element.innerHTML = `${this.amount} ${this.name}`;
  }

  choose() {
    const A = this.OPTIONS.A
    const B = this.OPTIONS.B

    const chosenOption = this.name === A.name ? A : B;
    const otherOption = this.name === A.name ? B : A;

    const chosenWeight = chosenOption.weight * chosenOption.amount;
    const otherWeight = otherOption.weight * otherOption.amount;

    const result = chosenWeight > otherWeight ? 'Heavier' : 'Lighter';

    // construct a message with the result e.g. 34 Elephants are heavier than 2 Lions
    const message = `${otherOption.amount} ${otherOption.name} are heavier than ${this.amount} ${this.name}`;
    this.SCORE.message = message;

    this.SCORE.gameOver = result === 'Lighter';
    if (!this.SCORE.gameOver) {
      this.SCORE.value += 1;
    }

    return this.SCORE.gameOver;
  }
}
