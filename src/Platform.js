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
            const model = originalModel.clone();
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material = child.material.clone();
                }
            });
    
            model.position.set(Math.random(), 5 + i * 2, Math.random());
            model.castShadow = true;
            model.receiveShadow = true;
            this.platform.add(model);

            const boundingBox = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            boundingBox.getSize(size);
    
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

        this.models.forEach(({ mesh, body }) => {
            mesh.position.copy(body.position);
            mesh.quaternion.copy(body.quaternion);
        });
    }
}
