import * as THREE from "three";

class Light {

  static createAmbientLight(color = 0xffffff, intensity = 0.5) {
    const light = new THREE.AmbientLight(color, intensity);
    return light;
  }

  static createDirectionalLight(x = 0, y = 2, z = 2, color = 0xffffff, intensity = 1) {
    
    const light = new THREE.DirectionalLight(color, intensity);    
    light.position.set(x, y, z);
    light.castShadow = true;

    return light;
  }

  static createDirectionalLightHelper(light, size = 3) {
    const helper = new THREE.DirectionalLightHelper(light, size);
    helper.visible = false;
    return helper;
  }


}

export { Light };
