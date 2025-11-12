import * as THREE from 'three';

class Cube {
  static create() {
    // create a geometry
    const geometry = new THREE.BoxGeometry(1, 1, 5);

    // create a default (white) Basic material
    const material = new THREE.MeshPhongMaterial();

    // create a Mesh containing the geometry and material
    const mesh = new THREE.Mesh(geometry, material);    
    mesh.castShadow = true;
    
    return mesh;
  }
}


export { Cube };
