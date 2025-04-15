import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class GLBLoader {
    constructor(url) {
        this.url = url;
        this.loader = new GLTFLoader();
        this.meshes = new Map();
        this.isLoaded = false;

        // Start preloading the GLB file as soon as the class is instantiated
        this.loadGLB();
    }

    loadGLB() {
        this.loader.load(
            this.url,
            (gltf) => {
                gltf.scene.traverse((child) => {
                    if (child.isMesh && child.parent === gltf.scene) {
                        this.meshes.set(child.name, child);
                    }
                });
                this.isLoaded = true;
                console.log('GLB loaded successfully:', this.meshes);
                // log out an array of objects, each object should be contain the mesh name and a key 'weight' with a random value between 1 and 100
                const meshesArray = Array.from(this.meshes.keys()).map(name => ({
                    name,
                    weight: Math.floor(Math.random() * 100) + 1
                }
                ));
                console.log('Meshes array:', meshesArray);
            },
            (xhr) => {
                console.log(`GLB loading: ${(xhr.loaded / xhr.total) * 100}%`);
            },
            (error) => {
                console.error('Error loading GLB:', error);
            }
        );
    }

    getMesh(name) {
        if (!this.isLoaded) {
            console.warn('GLB is not fully loaded yet.');
            return null;
        }
        return this.meshes.get(name) || null;
    }
}
