gsap.registerPlugin(ScrollTrigger)

// Constants
////////////

const COLORS = {
    background: "white",
    light: "#ffffff",
    sky: "#aaaaff",
    ground: "#88ff88"
}

const PI = Math.PI

// Scene
/////////

let size = { width: 0, height: 0 }

const scene = new THREE.Scene()
scene.background = new THREE.Color(COLORS.background)
scene.fog = new THREE.Fog(COLORS.background, 15, 20)

// Renderer
///////////

const renderer = new THREE.WebGLRenderer({
    antialias: true
})

renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 5;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const container = document.getElementById('canvas-container')
container.appendChild(renderer.domElement)

// Camera
/////////

const camera = new THREE.PerspectiveCamera(40, size.width / size.height, 0.1, 100);
camera.position.set(0, 1, 2);
let cameraTarget = new THREE.Vector3(0, 1, 0)

scene.add(camera)

// Lights
/////////

const directionalLight = new THREE.DirectionalLight(COLORS.light, 2)
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 10;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(2, 5, 3);

scene.add(directionalLight)

const hemisphereLight = new THREE.HemisphereLight(COLORS.sky, COLORS.ground, 0.5)
scene.add(hemisphereLight)

// Floor
////////

const plane = new THREE.PlaneGeometry(100, 100)
const floorMaterial = new THREE.MeshStandardMaterial({ color: COLORS.ground })
const floor = new THREE.Mesh(plane, floorMaterial)
floor.receiveShadow = true
floor.rotateX(-PI * 0.5)
scene.add(floor)

// Resize handling
//////////////////

const resizeHandler = () => {
    size.width = container.clientWidth
    size.height = container.clientHeight

    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()

    renderer.setSize(size.width, size.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

window.addEventListener('resize', resizeHandler)
resizeHandler()

// Tick
///////

const tick = () => {
    camera.lookAt(cameraTarget)
    renderer.render(scene, camera)
    window.requestAnimationFrame(() => tick())
}

tick()