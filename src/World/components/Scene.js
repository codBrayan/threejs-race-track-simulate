import * as THREE from 'three';

class Scene {
  static create() {
    const scene = new THREE.Scene();

    return scene;
  }

  static setBackgroundColor(scene, color = 'lightgray') {    
    scene.background = new THREE.Color(color);

    return scene;
  }

  static setBackgroundTexture(scene, url) {        
    let texture = new THREE.TextureLoader().load(url);
    texture.colorSpace = THREE.SRGBColorSpace;
    scene.background = texture;

    return scene;
  }

  static addGridHelper(scene, size = 10, divisions = 10) {    
    let helper = new THREE.GridHelper(size, divisions);
    scene.add(helper);

    return { scene, helper };
  }

  static addFogLinear(scene, color = 0xFFFFFF, near = 1.0, far = 1000.0) {
    scene.fog = new THREE.Fog(color, near, far);

    return scene;
  }

  static addFogExp2(scene, color = 0xFFFFFF, density = 0.00025) {
    scene.fog = new THREE.FogExp2(color, density);

    return scene;
  }

  static addAxesHelper(scene, size = 8) {
    let helper = new THREE.AxesHelper(size);        
    scene.add(helper);

    return { scene, helper };
  }

  static addCameraHelper(scene, camera) {
    let helper = new THREE.CameraHelper(camera);        
    scene.add(helper);

    return { scene, helper };
  }
}


export { Scene };
