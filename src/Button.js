export default class Button {
  constructor(score, options, element, data) {
    this.SCORE = score;
    this.OPTIONS = options;
    this.element = element;
    this.amount = data.amount;
    this.name = data.name;

    this.label(this.name, this.amount)
  }

  label(name, amount) {
    this.name = name;
    this.amount = amount;

    this.element.innerHTML = `${this.amount} ${this.name}s`;
  }

  choose() {
    const A = this.OPTIONS.A
    const B = this.OPTIONS.B

    const chosenOption = this.name === A.name ? A : B;
    const otherOption = this.name === A.name ? B : A;

    const chosenWeight = chosenOption.weight * chosenOption.amount;
    const otherWeight = otherOption.weight * otherOption.amount;

    const result = chosenWeight > otherWeight ? 'Heavier' : 'Lighter';

    this.SCORE.value += chosenWeight > otherWeight ? 1 : -this.SCORE.value;

    console.log(`${this.name} is ${result} than ${otherOption.name}`);
  }
}
