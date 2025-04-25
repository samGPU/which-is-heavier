# Which Is Heavier?

### Play it! https://samgpu.itch.io/which-is-heavier

**Which Is Heavier?** is a web-based game created for the **Gamedev.js Jam 2025**. The theme of the jam is **"Balance"**, and this game challenges players to balance sets of animals against each other and determine which side is heavier. The game combines physics-based interactions, 3D rendering, and quick decision-making to create a fun and engaging experience.

## Gameplay

In **Which Is Heavier?**, players are presented with two sets of animals on platforms. Each set contains a random number of animals of a specific type. The goal is to choose the side with the **heavier total weight** before the timer runs out.

- Each animal has a predefined weight.
- The total weight of a set is calculated as `weight × number of animals`.
- If you choose correctly, you score a point, and new sets of animals are generated.
- If you choose incorrectly or run out of time, the game ends.

## Features

- **3D Graphics**: Built using [Three.js](https://threejs.org/) for rendering and physics-based interactions.
- **Physics Simulation**: Platforms tilt and react dynamically using [Cannon-es](https://github.com/pmndrs/cannon-es).
- **Sound Effects**: Audio feedback for correct and incorrect choices using [Howler.js](https://howlerjs.com/).
- **Randomized Gameplay**: Each round generates random sets of animals, ensuring replayability.
- **Responsive Design**: Works on both desktop and mobile browsers.

## Installation

To run the game locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/samgpu/which-is-heavier.git
    cd which-is-heavier
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

4. Open the game in your browser at `http://localhost:5173`

## How to Play

1. Click the Start button to begin the game.
2. Observe the two sets of animals on the platforms.
3. Click the button corresponding to the side you think is heavier.
4. Keep playing to beat your high score!

## Technologies Used

* Three.js: For 3D rendering and scene management.
* Cannon-es: For physics simulation of platforms and animal models.
* Howler.js: For sound effects.
* Vite: For fast development and build tooling.
* Google Fonts: For custom typography.

## Credits

* Author: samgpu
* 3D Models: Models from Google Poly sourced from https://poly.pizza/
* Sound Effects: From Kenney Assets https://kenney.nl/
