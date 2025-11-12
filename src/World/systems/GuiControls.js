import { GUI } from 'dat.gui';
import * as THREE from 'three';

class GuiControls {
    constructor(datGui) {
        this.datGui = new GUI();
    }

    addSceneFolder(scene) {
        const sceneFolder = this.datGui.addFolder("Scene");

        const sceneObjectsFolder = sceneFolder.addFolder("Scene Objects");

        scene.traverse((object) => {
            if (object === scene || object.parent.constructor.name.endsWith("LightHelper")) return;

            if (!(object.parent instanceof THREE.Group)) {
                sceneObjectsFolder.add(object, "visible").name(object.type + " (" + object.id + ")");
            }
        });
        sceneObjectsFolder.open();
        sceneFolder.open();

        return sceneFolder;
    }

    addCameraFolder(camera, orbitControls) {        
        const initialCameraProperties = { 
            position : camera.position.clone(),
            fov : camera.fov,
            aspect : camera.aspect,
            near : camera.near,
            far : camera.far
        };

        const cameraFolder = this.datGui.addFolder("Camera");
        cameraFolder.add(camera.position, "x", -10, 10);
        cameraFolder.add(camera.position, "y", -10, 10);
        cameraFolder.add(camera.position, "z", -10, 10);
        cameraFolder.add(camera, "fov", 0, 180, 0.01).onChange(() => {
            camera.updateProjectionMatrix();
        });
        cameraFolder.add(camera, "aspect", 0.00001, 10).onChange(() => {
            camera.updateProjectionMatrix();
        });
        cameraFolder.add(camera, "near", 0.01, 20).onChange(() => {
            camera.updateProjectionMatrix();
        });
        cameraFolder.add(camera, "far", 0.01, 100).onChange(() => {
            camera.updateProjectionMatrix();
        });

        let datGui = this.datGui;
        const controls = {
            resetCamera: function () {
                camera.position.copy(initialCameraProperties.position);
                camera.fov = initialCameraProperties.fov;
                camera.aspect = initialCameraProperties.aspect;                
                camera.lookAt(0, 0, 0);                
                orbitControls.reset();
                datGui.updateDisplay();
            },
        };

        cameraFolder.add(controls, 'resetCamera').name('Resetar Camera');
                
        cameraFolder.open();

        return cameraFolder;
    }

    addLightFolder(light, helper = null) {
        const initialLightPosition = light.position.clone();
        let lightLabel = "Lights";

        const lightFolder = (this.datGui.__folders[lightLabel] === undefined) ? this.datGui.addFolder(lightLabel) : this.datGui.__folders[lightLabel];

        const innerFolder = this.#getLightInnerFolder(light, lightFolder);

        // Common light properties
        innerFolder.add(light, "visible");
        innerFolder.add(light, "intensity", 0, 1, 0.1);

        const colorSettings = {
            color: light.color.getHex(),
        };

        innerFolder.
            addColor(colorSettings, "color")
            .onChange((value) => {
                light.color.set(value);
            });

        if (!(light instanceof THREE.AmbientLight)) {
            innerFolder.add(light.position, "x", -10, 10);
            innerFolder.add(light.position, "y", -10, 10);
            innerFolder.add(light.position, "z", -10, 10);
            const controls = {
                resetLight: function () {
                    light.position.copy(initialLightPosition);
                }
            };

            innerFolder.add(controls, 'resetLight').name('Resetar Luz');
        }

        // Specific light properties
        if (light instanceof THREE.DirectionalLight || light instanceof THREE.SpotLight) {
            innerFolder.add(light, "castShadow");
        }

        // Helper properties
        this.#createLightHelperFolder(helper, innerFolder);

        lightFolder.open();
        innerFolder.open();

        return lightFolder;
    }

    #getLightInnerFolder(light, lightFolder) {
        if (light instanceof THREE.AmbientLight) {
            return lightFolder.addFolder("Ambient Light");

        } else if (light instanceof THREE.DirectionalLight) {
            return lightFolder.addFolder("Directional Light");

        } else if (light instanceof THREE.PointLight) {
            return lightFolder.addFolder("Point Light");

        } else if (light instanceof THREE.SpotLight) {
            return lightFolder.addFolder("Spot Light");
        }
    }

    #createLightHelperFolder(helper, innerFolder) {
        if (helper) {
            const helperFolder = innerFolder.addFolder(helper.constructor.name);
            helperFolder.add(helper, 'visible');

            if (helper.light instanceof THREE.DirectionalLight) {
                helperFolder.add(helper.lightPlane, 'visible').name('lightPlane');

            } else if (helper.light instanceof THREE.SpotLight) {
                helperFolder.add(helper.cone, 'visible').name('cone');

            }

            helperFolder.open();
        }
    }
}



export { GuiControls };
