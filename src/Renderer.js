import * as THREE from 'three';
import Platform from './Platform';

export default class Renderer {
    constructor() {
        this.canvas = document.querySelector('#webgl');

        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 1000);
        this.camera.position.z = 5;
        this.camera.position.y = 2;

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x6495ED, 1);

        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        // this.addTestCube();
        this.addLights();
        // this.addFloor();
        this.addPlatforms();
    }

    addPlatforms() {
        this.leftPlatform = new Platform(this.scene, { x: -3, y: 0, z: 0 });
        this.rightPlatform = new Platform(this.scene, { x: 3, y: 0, z: 0 });
    }

    addFloor() {
        const floorGeometry = new THREE.PlaneGeometry(10, 10);
        const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        this.scene.add(floor);
    }

    addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        ambientLight.position.set(0, 5, 0);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }

    addTestCube() {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
    }

    onWindowResize() {
        this.sizes.width = window.innerWidth;
        this.sizes.height = window.innerHeight;
        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.sizes.width, this.sizes.height);
    }

    render(deltaTime) {
        this.leftPlatform.update(deltaTime);
        this.rightPlatform.update(deltaTime);
        this.renderer.render(this.scene, this.camera);
    }

}
