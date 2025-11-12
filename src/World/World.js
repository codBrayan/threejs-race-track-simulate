import * as THREE from "three";
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GuiControls } from './systems/GuiControls.js';

import { Camera } from './components/Camera.js';
import { Scene } from './components/Scene.js';

import { Floor } from './components/Floor.js';
import { Light } from './components/Light.js';

import { Renderer } from './systems/Renderer.js';
import { Resizer } from './systems/Resizer.js';



class World {
  constructor(container) {
    // instance properties (avoid module-scoped mutable state)
    this.camera = Camera.create();
    this.renderer = Renderer.create();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.listenToKeyEvents(window);
    // this.controls.enableDamping = true; // suaviza o movimento

    container.append(this.renderer.domElement);
    this.resizer = new Resizer(container, this.camera, this.renderer);

    this.scene = Scene.create();

    const mainGroup = new THREE.Group();
    this.scene.add(mainGroup);

    // Floor
    mainGroup.add(Floor.createBoxFloor(7, 7, 0.4));

    // Ambient light
    const ambientLight = Light.createAmbientLight(0xffffff, 0.5);
    mainGroup.add(ambientLight);

    // Directional light + helper
    const directionalLight = Light.createDirectionalLight(0, 5, 0, 0xff0000, 0.5);
    // create helper via Light helper factory if available
    let dlHelper = null;
    if (typeof Light.createDirectionalLightHelper === 'function') {
      dlHelper = Light.createDirectionalLightHelper(directionalLight, 1);
      // Some GUI code expects helper.lightPlane / helper.cone properties — provide safe defaults
      if (!dlHelper.lightPlane) dlHelper.lightPlane = { visible: false };
      if (!dlHelper.cone) dlHelper.cone = { visible: false };
    }

    if (dlHelper) {
      mainGroup.add(directionalLight, dlHelper);
    } else {
      mainGroup.add(directionalLight);
    }

    // Load HDR background
    new RGBELoader()
      .setPath('./src/World/assets/textures/backgrounds/')
      .load('HDR_029_Sky_Cloudy_Ref.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        this.scene.background = texture;
        this.scene.environment = texture;
      });

    // GUI
    const guiControls = new GuiControls();
    guiControls.addSceneFolder(this.scene);
    guiControls.addCameraFolder(this.camera, this.controls);
    guiControls.addLightFolder(ambientLight);
    guiControls.addLightFolder(directionalLight, dlHelper);
  }

  render() {
    this.renderer.setAnimationLoop(() => {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    });
  }
}

export { World };
