import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import GLBLoader from './GLBLoader'

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
        this.world.defaultContactMaterial = this.defaultContactMaterial

        this.glbLoader = GLBLoader.getInstance('./Animals.glb');

        this.spheres = [];
        this.models = [];
        this.addFloor();
    }

    addModels(count, name) {
        console.log('Adding models:', name, count);
        const originalModel = this.glbLoader.getMesh(name);
        if (!originalModel) {
            console.error(`Model ${name} not found`);
            return;
        }

        for (let i = 0; i < count; i++) {
            // Clone the model to create a unique instance
            const model = originalModel.clone();
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material = child.material.clone(); // Ensure unique material instances
                }
            });
    
            console.log(`Model ${i + 1}:`, model);
    
            model.position.set(Math.random(), 5 + i * 2, Math.random()); // Offset each model vertically
            model.castShadow = true;
            model.receiveShadow = true;
            this.platform.add(model);
    
            const modelShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
            const modelBody = new CANNON.Body({
                mass: 1,
                position: new CANNON.Vec3(model.position.x, model.position.y, model.position.z),
                shape: modelShape
            });
            this.world.addBody(modelBody);
    
            this.models.push({ mesh: model, body: modelBody });
        }
    }

    addSpheres(count, radius) {
        for (let i = 0; i < count; i++) {
            const geometry = new THREE.SphereGeometry(radius, 32, 32);
            const material = new THREE.MeshStandardMaterial({ color: 0xa1a1c1 });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(Math.random(), 5 + i * 2, Math.random()); // Offset each sphere vertically
            sphere.castShadow = true;
            sphere.receiveShadow = true;
            this.platform.add(sphere);
    
            const sphereShape = new CANNON.Sphere(radius);
            const sphereBody = new CANNON.Body({
                mass: 1,
                position: new CANNON.Vec3(sphere.position.x, sphere.position.y, sphere.position.z),
                shape: sphereShape
            });
            this.world.addBody(sphereBody);
    
            // Store the sphere and its body in the spheres array
            this.spheres.push({ mesh: sphere, body: sphereBody });
        }
    }

    addFloor() {
        const geometry = new THREE.BoxGeometry(4, 0.1, 3);
        const material = new THREE.MeshStandardMaterial({ color: 0xFFDAB9 });
        this.floor = new THREE.Mesh(geometry, material);
        this.floor.position.set(0, -0.05, 0);
        this.floor.receiveShadow = true;
        this.platform.add(this.floor);
    
        // Use a CANNON.Box shape with half-extents matching the geometry size
        const floorShape = new CANNON.Box(new CANNON.Vec3(2, 0.05, 1.5)); // Half of 4x0.1x3
        this.floorBody = new CANNON.Body({
            mass: 0,
            shape: floorShape
        });
        this.floorBody.position.set(0, -0.05, 0); // Match the visual floor's position
        this.world.addBody(this.floorBody);
    }

    update(deltaTime) {
        const clampedDeltaTime = Math.min(deltaTime, 1 / 30);
        this.world.step(1 / 60, clampedDeltaTime, 3);

        // this.spheres.forEach(({ mesh, body }) => {
        //     mesh.position.copy(body.position);
        //     mesh.quaternion.copy(body.quaternion);
        // });

        this.models.forEach(({ mesh, body }) => {
            mesh.position.copy(body.position);
            mesh.quaternion.copy(body.quaternion);
        });
    }
}
