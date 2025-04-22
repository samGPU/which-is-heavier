import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import GLBLoader from './GLBLoader'

export default class Platform {
    constructor(scene, position = { x: 0, y: 0, z: 0 }) {
        this.scene = scene;

        this.defaultLocation = new THREE.Vector3(0, -0.05, 0);
        this.desiredLocation = this.defaultLocation.clone();
        this.defaultRotation = new THREE.Vector3(0, 0, 0);
        this.desiredRotation = this.defaultRotation.clone();
        this.lerpSpeed = 0.1; // Adjust speed of movement
        this.moveAmount = 0.8;

        this.platform = new THREE.Group();
        this.platform.position.copy(position);
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
        
        this.models = [];
        this.addFloor();
    }

    tip() {
        this.setDesiredRotation(
            this.defaultRotation.x + (Math.PI / 2), 
            this.defaultRotation.y, 
            this.defaultRotation.z
        );
    }

    moveUp() {
        this.tip();
        this.setDesiredLocation(
            this.defaultLocation.x, 
            this.defaultLocation.y + this.moveAmount, 
            this.defaultLocation.z
        );
    }

    moveDown() {
        this.tip();
        this.setDesiredLocation(
            this.defaultLocation.x, 
            this.defaultLocation.y - this.moveAmount, 
            this.defaultLocation.z
        );
    }

    setDesiredLocation(x, y, z) {
        console.log('Setting desired location:', x, y, z);
        this.desiredLocation.set(x, y, z);
    }

    setDesiredRotation(x, y, z) {
        console.log('Setting desired rotation:', x, y, z);
        this.desiredRotation.set(x, y, z);
    }

    isFloorReady() {
        const positionReady = this.floor.position.distanceTo(this.defaultLocation) < 0.01;
        const rotationReady = Math.abs(this.floor.rotation.x - this.defaultRotation.x) < 0.01 &&
                              Math.abs(this.floor.rotation.y - this.defaultRotation.y) < 0.01 &&
                              Math.abs(this.floor.rotation.z - this.defaultRotation.z) < 0.01;
        return positionReady && rotationReady;
    }

    addModels(count, name) {
        console.log('Adding models:', name, count);
        const originalModel = this.glbLoader.getMesh(name);
        if (!originalModel) {
            console.error(`Model ${name} not found`);
            return;
        }

        for (let i = 0; i < count; i++) {
            const model = originalModel.clone();
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material = child.material.clone();
                }
            });
    
            model.castShadow = true;
            model.receiveShadow = true;
            this.platform.add(model);

            const boundingBox = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            boundingBox.getSize(size);

            model.position.set(
                (Math.random() - 0.5) * 4,
                0.5,
                (Math.random() - 0.5) * 3
            );
    
            const modelShape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
            const modelBody = new CANNON.Body({
                mass: 1,
                position: new CANNON.Vec3(model.position.x, model.position.y, model.position.z),
                shape: modelShape
            });
            this.world.addBody(modelBody);
    
            this.models.push({ mesh: model, body: modelBody });
        }
    }

    addFloor() {
        const geometry = new THREE.BoxGeometry(4, 0.1, 3);
        const material = new THREE.MeshStandardMaterial({ color: 0xFFDAB9 });
        this.floor = new THREE.Mesh(geometry, material);
        this.floor.position.set(0, -0.05, 0);
        this.floor.receiveShadow = true;
        this.platform.add(this.floor);
    
        const floorShape = new CANNON.Box(new CANNON.Vec3(2, 0.05, 1.5));
        this.floorBody = new CANNON.Body({
            mass: 0,
            shape: floorShape
        });
        this.floorBody.position.set(0, -0.05, 0);
        this.world.addBody(this.floorBody);
    }

    update(deltaTime) {
        const clampedDeltaTime = Math.min(deltaTime, 1 / 30);
        this.world.step(1 / 60, clampedDeltaTime, 3);

        // Lerp floor position
        this.floor.position.lerp(this.desiredLocation, this.lerpSpeed);
        // Check if the floor has reached the desired location
        if (this.floor.position.distanceTo(this.desiredLocation) < 0.01) {
            if (!this.desiredLocation.equals(this.defaultLocation)) {
                this.desiredLocation.copy(this.defaultLocation); // Reset to default
            }
        }

        // Lerp floor rotation
        this.floor.rotation.x += (this.desiredRotation.x - this.floor.rotation.x) * this.lerpSpeed;
        this.floor.rotation.y += (this.desiredRotation.y - this.floor.rotation.y) * this.lerpSpeed;
        this.floor.rotation.z += (this.desiredRotation.z - this.floor.rotation.z) * this.lerpSpeed;
        // Check if the floor has reached the desired rotation
        if (Math.abs(this.floor.rotation.x - this.desiredRotation.x) < 0.01) {
            if (!this.desiredRotation.equals(this.defaultRotation)) {
                this.desiredRotation.copy(this.defaultRotation); // Reset to default
            }
        }

        // Sync floorBody with floor
        this.floorBody.position.copy(this.floor.position);
        this.floorBody.quaternion.copy(this.floor.quaternion);

        // Sync models with physics bodies and remove models below -10 on the y-axis
        this.models = this.models.filter(({ mesh, body }) => {
            if (body.position.y < -10) {
                this.platform.remove(mesh);
                this.world.removeBody(body);
                return false;
            }
            mesh.position.copy(body.position);
            mesh.quaternion.copy(body.quaternion);
            return true;
        });
    }
}
