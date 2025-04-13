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

export const randomAnimal = () => {
    const randomIndex = Math.floor(Math.random() * ANIMALS.length);
    return ANIMALS[randomIndex];
}
