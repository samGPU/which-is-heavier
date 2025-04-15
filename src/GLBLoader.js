import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class GLBLoader {
    constructor(url) {
        this.url = url;
        this.loader = new GLTFLoader();
        this.meshes = new Map();
        this.isLoaded = false;

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
