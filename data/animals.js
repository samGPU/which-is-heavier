export const ANIMALS = [
    { name: 'Cat', weight: 4 },
    { name: 'Dog', weight: 10 },
    { name: 'Elephant', weight: 5000 },
    { name: 'Horse', weight: 400 },
    { name: 'Lion', weight: 190 },
    { name: 'Tiger', weight: 220 },
    { name: 'Giraffe', weight: 800 },
    { name: 'Kangaroo', weight: 85 },
    { name: 'Penguin', weight: 30 },
    { name: 'Rabbit', weight: 2 },
    { name: 'Bear', weight: 300 },
    { name: 'Wolf', weight: 50 },
    { name: 'Zebra', weight: 350 },
    { name: 'Cheetah', weight: 72 },
    { name: 'Panda', weight: 100 },
    { name: 'Fox', weight: 6 },
    { name: 'Deer', weight: 70 },
    { name: 'Goat', weight: 60 },
    { name: 'Sheep', weight: 75 },
    { name: 'Cow', weight: 700 },
    { name: 'Pig', weight: 120 }
]

let previousAnimal = null;
export const randomAnimal = () => {
    let animal;
    do {
        const randomIndex = Math.floor(Math.random() * ANIMALS.length);
        animal = ANIMALS[randomIndex];
    } while (animal === previousAnimal);
    previousAnimal = animal;
    return animal;
}

export const generateOption = () => {
    const option = randomAnimal()
    option.amount = Math.floor(Math.random() * 50) + 1
    return option
}
