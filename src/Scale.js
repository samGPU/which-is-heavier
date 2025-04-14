import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export default class Scale {
    constructor(scene, position = { x: 0, y: -5, z: 0 }) {
        this.scene = scene;

        this.scale = new THREE.Group();
        this.scale.position.set(position.x, position.y, position.z);
        this.scene.add(this.scale);

        this.physicsWorld = new CANNON.World();
        this.physicsWorld.gravity.set(0, -3.82, 0); // Gravity pointing downwards

        this.createInvisibleBox();
        this.spheres = [];
        this.spawnSpheres(10); // Spawn 10 spheres
    }

    createInvisibleBox() {
        // Create a physics material with high restitution for bounciness
        const boxMaterial = new CANNON.Material('boxMaterial');
        const boxContactMaterial = new CANNON.ContactMaterial(boxMaterial, boxMaterial, {
            restitution: 0.9, // High restitution for bounciness
            friction: 0.8,    // Low friction for sliding
        });
        this.physicsWorld.addContactMaterial(boxContactMaterial);
    
        const planes = [
            { normal: new CANNON.Vec3(0, 1, 0), offset: -5 }, // Bottom
            { normal: new CANNON.Vec3(0, -1, 0), offset: 5 }, // Top
            { normal: new CANNON.Vec3(1, 0, 0), offset: -1.5 }, // Left
            { normal: new CANNON.Vec3(-1, 0, 0), offset: 1.5 }, // Right
            { normal: new CANNON.Vec3(0, 0, 1), offset: -1.5 }, // Front
            { normal: new CANNON.Vec3(0, 0, -1), offset: 1.5 }, // Back
        ];
    
        planes.forEach(({ normal, offset }) => {
            const planeShape = new CANNON.Plane();
            const planeBody = new CANNON.Body({ mass: 0, material: boxMaterial });
            planeBody.addShape(planeShape);
    
            const up = new CANNON.Vec3(0, 1, 0);
            planeBody.quaternion.setFromVectors(up, normal);
    
            planeBody.position.set(
                normal.x * offset,
                normal.y * offset + 5,
                normal.z * offset
            );
    
            this.physicsWorld.addBody(planeBody);
        });
    
        this.boxBody = new CANNON.Body({ mass: 0 });
    }

    spawnSpheres(count) {
        const sphereMaterial = new CANNON.Material('sphereMaterial');
        const sphereContactMaterial = new CANNON.ContactMaterial(sphereMaterial, sphereMaterial, {
            restitution: 0.9, // High restitution for bounciness
            friction: 0.8,    // Low friction for sliding
        });
        this.physicsWorld.addContactMaterial(sphereContactMaterial);
    
        for (let i = 0; i < count; i++) {
            const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
            const sphereMeshMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
            const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMeshMaterial);
    
            const x = (Math.random() - 0.5) * 4;
            const y = Math.random() * 9 + 0.5;
            const z = (Math.random() - 0.5) * 4;
            sphereMesh.position.set(x, y, z);
            this.scale.add(sphereMesh);
    
            const sphereShape = new CANNON.Sphere(0.1);
            const sphereBody = new CANNON.Body({
                mass: 1,
                shape: sphereShape,
                material: sphereMaterial,
            });
            sphereBody.position.set(x, y, z);
            this.physicsWorld.addBody(sphereBody);
    
            this.spheres.push({ mesh: sphereMesh, body: sphereBody });
        }
    }

    update(deltaTime) {
        // Clamp deltaTime to a maximum value (e.g., 1/30 seconds)
        const clampedDeltaTime = Math.min(deltaTime, 1 / 30);
    
        // Step the physics world
        this.physicsWorld.step(1 / 60, clampedDeltaTime, 3);
    
        // Sync the Three.js meshes with the Cannon.js bodies
        this.spheres.forEach(({ mesh, body }) => {
            mesh.position.copy(body.position);
            mesh.quaternion.copy(body.quaternion);
        });
    }
}
