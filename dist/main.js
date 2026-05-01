import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
let scene, camera, renderer, controls, mixer, clock;
function init() {
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    const container = document.getElementById('canvas-container');
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    container.appendChild(renderer.domElement);
    // Handling Context Loss
    renderer.domElement.addEventListener('webglcontextlost', (event) => {
        event.preventDefault();
        console.warn('WebGL context lost.');
    }, false);
    renderer.domElement.addEventListener('webglcontextrestored', () => {
        window.location.reload();
    }, false);
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(30, 25, 38);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.target.set(7, 0, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const sunLight = new THREE.DirectionalLight(0xffffff, 3);
    sunLight.position.set(10, 20, 10);
    scene.add(sunLight);
    const loader = new GLTFLoader();
    loader.load('./3d.glb', (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshPhysicalMaterial({
                    color: 0xffffff,
                    metalness: 1,
                    roughness: 0.02,
                    reflectivity: 1,
                    clearcoat: 1,
                    clearcoatRoughness: 0
                });
            }
        });
        model.scale.set(1.8, 1.8, 1.8);
        model.position.set(7, 0, 0);
        scene.add(model);
        if (gltf.animations.length) {
            mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
        }
        animate();
    });
}
function animate() {
    requestAnimationFrame(animate);
    if (mixer)
        mixer.update(clock.getDelta());
    controls.update();
    renderer.render(scene, camera);
}
window.addEventListener('resize', () => {
    const container = document.getElementById('canvas-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});
init();
