import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';

export default class Resources extends THREE.EventDispatcher {
	constructor(sources) {
		super();

        // Options
        this.sources = sources;
        
        // Setup
        this.items = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
	}

    setLoaders() {
        this.loadingManager = new THREE.LoadingManager();
        this.loaders = {};
        this.loaders.gltfLoader = new GLTFLoader(this.loadingManager);
        this.loaders.textureLoader = new THREE.TextureLoader(this.loadingManager);
        this.loaders.exrLoader = new EXRLoader(this.loadingManager);
    }

    startLoading() {
        // Load each source
        for (const source of this.sources) {
            switch (source.type) {
                case 'texture':
                    this.loaders.textureLoader.load(
                        source.path,
                        (file) => {
                            this.sourceLoaded(source, file);
                        }
                    );
                    break;
                case 'gltfModel':
                    this.loaders.gltfLoader.load(
                        source.path,
                        (file) => {
                            this.sourceLoaded(source, file);
                        }
                    );
                    break;
                case 'exrTexture':
                    this.loaders.exrLoader.load(
                        source.path,
                        (file) => {
                            this.sourceLoaded(source, file);
                        }
                    );
                    break;
            }
        }
    }

    sourceLoaded(source, file) {
        this.items[source.name] = file;

        this.loaded++;

        if (this.loaded === this.toLoad)
        {
            this.dispatchEvent({type: 'loaded'});
        }
    }
}
