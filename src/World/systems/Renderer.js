import * as THREE from 'three';

class Renderer {
  static create() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    return renderer;
  }
}


export { Renderer };
