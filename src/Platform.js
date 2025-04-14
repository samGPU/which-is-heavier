import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export default class Platform {
    constructor(scene, position = { x: 0, y: 0, z: 0 }) {
        this.scene = scene;

        this.platform = new THREE.Group();
        this.platform.position.set(position.x, position.y, position.z);
        this.scene.add(this.platform);

        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);

        this.defaultMaterial = new CANNON.Material('default')
        this.defaultContactMaterial = new CANNON.ContactMaterial(
            this.defaultMaterial,
            this.defaultMaterial,
            {
                friction: 0.1,
                restitution: 0.4
            }
        )
        this.world.addContactMaterial(this.defaultContactMaterial)

        this.addSphere();
        this.addFloor();
    }

    addSphere() {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: 0xc1c1c1 });
        this.sphere = new THREE.Mesh(geometry, material);
        this.sphere.position.set(0, 5, 0);
        this.sphere.castShadow = true;
        this.sphere.receiveShadow = true;
        this.platform.add(this.sphere);

        const sphereShape = new CANNON.Sphere(0.5);
        this.sphereBody = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(0, 5, 0),
            shape: sphereShape,
            material: this.defaultMaterial
        });
        this.world.addBody(this.sphereBody);
    }

    addFloor() {
        const geometry = new THREE.BoxGeometry(4, 0.1, 3);
        const material = new THREE.MeshStandardMaterial({ color: 0xFFDAB9 });
        this.floor = new THREE.Mesh(geometry, material);
        this.floor.position.set(0, -0.05, 0);
        this.floor.receiveShadow = true;
        this.platform.add(this.floor);

        const floorShape = new CANNON.Plane();
        this.floorBody = new CANNON.Body({
            mass: 0,
            shape: floorShape,
            material: this.defaultMaterial
        });
        this.floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
        this.world.addBody(this.floorBody);
    }

    update(deltaTime) {
        const clampedDeltaTime = Math.min(deltaTime, 1 / 30);
        this.world.step(1 / 60, clampedDeltaTime, 3);

        this.sphere.position.copy(this.sphereBody.position)

    }
}
