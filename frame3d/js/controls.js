import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class SceneController {

    constructor(containerId) {

        this.container = document.getElementById(containerId);

        this.scene = new THREE.Scene();
        this.scene.background =
new THREE.Color(0x2a2a2a);



        this.camera = new THREE.PerspectiveCamera(
            40,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );

        this.camera.position.set(1.0, 0.3, 10.5);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        this.renderer.setSize(
            this.container.clientWidth,
            this.container.clientHeight
        );

        this.renderer.setPixelRatio(     Math.min(window.devicePixelRatio, 1.5) );

        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace;

        this.renderer.toneMapping =
            THREE.ACESFilmicToneMapping;

        this.renderer.toneMappingExposure = 1.15;

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;

        this.container.appendChild(
            this.renderer.domElement
        );

        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );

        this.controls.enableDamping = true;
        this.controls.enablePan = false;
        this.controls.enableZoom = true;
        this.controls.enableRotate = true;

        this.controls.minDistance = 8;
        this.controls.maxDistance = 20;

        // Lights

        this.scene.add(
            new THREE.AmbientLight(
                0xffffff,
                0.35
            )
        );

        this.scene.add(
            new THREE.HemisphereLight(
                0xffffff,
                0x444444,
                1.2
            )
        );

        const keyLight =
            new THREE.DirectionalLight(
                0xffffff,
                2
            );

        keyLight.position.set(
            5,
            8,
            10
        );

        keyLight.castShadow = true;

        this.scene.add(keyLight);

        const rimLight =
            new THREE.DirectionalLight(
                0xffffff,
                1
            );

        rimLight.position.set(
            -5,
            3,
            -5
        );

        this.scene.add(rimLight);

        const fillLight =
            new THREE.DirectionalLight(
                0xffffff,
                0.5
            );

        fillLight.position.set(
            -8,
            -5,
            5
        );

        this.scene.add(fillLight);

        const spot =
            new THREE.SpotLight(
                0xffffff,
                2
            );

        spot.position.set(
            0,
            10,
            10
        );

        spot.angle = Math.PI / 6;
        spot.penumbra = 0.5;

        this.scene.add(spot);

        // Ground Shadow

        const shadowPlane =
            new THREE.Mesh(
                new THREE.CircleGeometry(
                    5,
                    64
                ),
                new THREE.MeshBasicMaterial({
                    color: 0x000000,
                    transparent: true,
                    opacity: 0.28
                })
            );

        shadowPlane.rotation.x =
            -Math.PI / 2;

        shadowPlane.position.y =
            -3.3;

        shadowPlane.position.z =
            -1;

        this.scene.add(shadowPlane);

        this.frameGroup =
            new THREE.Group();

        this.scene.add(
            this.frameGroup
        );

        this.frameMesh = null;
        this.matMesh = null;
        this.photoMesh = null;
        this.glassMesh = null;

        this.texture = null;

        this.frameColor = 0x222222;
        this.isPortrait = true;

        this.floatTime = 0;

        this.onFirstTextureLoad = null;

        this.buildFrame();

        window.addEventListener(
            'resize',
            this.onWindowResize.bind(this)
        );
    }

    disposeMesh(mesh) {

        if (!mesh) return;

        if (mesh.geometry)
            mesh.geometry.dispose();

        if (mesh.material)
            mesh.material.dispose();

        this.frameGroup.remove(mesh);
    }

    buildFrame() {

        this.disposeMesh(this.frameMesh);
        this.disposeMesh(this.matMesh);
        this.disposeMesh(this.photoMesh);
        this.disposeMesh(this.glassMesh);

        const frameW =
            this.isPortrait ? 3.6 : 5.2;

        const frameH =
            this.isPortrait ? 5.2 : 3.6;

        const matW =
            this.isPortrait ? 3.35 : 4.95;

        const matH =
            this.isPortrait ? 4.95 : 3.35;

        const photoW =
            this.isPortrait ? 2.75 : 4.35;

        const photoH =
            this.isPortrait ? 4.35 : 2.75;

        const isBrown =
            this.frameColor === 0x4a2f20;

        const frameMaterial =
            new THREE.MeshPhysicalMaterial({

                color: this.frameColor,

                roughness:
                    isBrown ? 0.55 : 0.20,

                metalness:
                    isBrown ? 0.05 : 0.35,

                clearcoat: 1,
                clearcoatRoughness: 0.1

            });

        this.frameMesh =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    frameW,
                    frameH,
                    0.32
                ),

                frameMaterial
            );

        this.frameMesh.castShadow = true;
        this.frameMesh.receiveShadow = true;

        this.frameGroup.add(
            this.frameMesh
        );

        this.matMesh =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    matW,
                    matH,
                    0.05
                ),

                new THREE.MeshStandardMaterial({
                    color: 0xf5f5f5,
                    roughness: 1
                })
            );

        this.matMesh.position.z = 0.17;

        this.frameGroup.add(
            this.matMesh
        );

        this.photoMesh =
            new THREE.Mesh(

                new THREE.PlaneGeometry(
                    photoW,
                    photoH
                ),

                new THREE.MeshPhysicalMaterial({

                    map: this.texture || null,

                    roughness: 0.02,

                    transmission: 0.15,

                    clearcoat: 1,

                    clearcoatRoughness: 0,

                    reflectivity: 1,

                    color: 0xffffff
                })
            );

        this.photoMesh.position.z =
            0.22;

        this.frameGroup.add(
            this.photoMesh
        );

        this.glassMesh =
            new THREE.Mesh(

                new THREE.PlaneGeometry(
                    photoW,
                    photoH
                ),

                new THREE.MeshPhysicalMaterial({

                    transparent: true,

                    opacity: 0.05,

                    transmission: 1,

                    roughness: 0,

                    clearcoat: 1

                })
            );

        this.glassMesh.position.z =
            0.28;

        this.frameGroup.add(
            this.glassMesh
        );
    }

    setFrameColor(hexColor) {

        this.frameColor = hexColor;

        this.buildFrame();
    }

    setOrientation(isPortrait) {

        this.isPortrait = isPortrait;

        this.buildFrame();
    }

    updateTexture(canvasElement) {

        if (!this.texture) {

            this.texture =
                new THREE.CanvasTexture(
                    canvasElement
                );

            this.texture.minFilter =
                THREE.LinearFilter;

            this.texture.magFilter =
                THREE.LinearFilter;

            this.texture.generateMipmaps =
                false;

            this.texture.colorSpace =
                THREE.SRGBColorSpace;

            if (this.photoMesh) {

                this.photoMesh.material.map =
                    this.texture;

                this.photoMesh.material.needsUpdate =
                    true;
            }

            if (
                typeof this.onFirstTextureLoad
                === 'function'
            ) {

                this.onFirstTextureLoad();

                this.onFirstTextureLoad =
                    null;
            }

        } else {

            this.texture.needsUpdate = true;
        }
    }

    onWindowResize() {

        this.camera.aspect =
            this.container.clientWidth /
            this.container.clientHeight;

        this.camera.updateProjectionMatrix();

        this.renderer.setSize(
            this.container.clientWidth,
            this.container.clientHeight
        );
    }

    animate() {

        requestAnimationFrame(
            this.animate.bind(this)
        );

        this.floatTime += 0.005;

        this.frameGroup.position.y =
            Math.sin(
                this.floatTime
            ) * 0.12;

        this.frameGroup.rotation.x =
            -0.08;

        this.frameGroup.rotation.y =
            0.45 +
            Math.sin(
                this.floatTime * 0.15
            ) * 0.03;

        if (this.photoMesh) {

            this.photoMesh.material.clearcoat =
                0.8 +
                Math.sin(
                    this.floatTime * 0.5
                ) * 0.15;
        }

        this.controls.update();

        this.renderer.render(
            this.scene,
            this.camera
        );
    }
}
