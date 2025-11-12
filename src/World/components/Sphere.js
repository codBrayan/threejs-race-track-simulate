import * as THREE from "three";

class Sphere {

  static create() {
    // create a geometry
    const geometry = new THREE.SphereGeometry(0.7, 30, 30);

    // create a default (white) Basic material
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 50,
    });

    // create a Mesh containing the geometry and material
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;

    return mesh;
  }
}


export { Sphere };
